import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save, TrendingUp, Wallet, Star, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type WorkerEntry } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Props {
  lang: Language;
  onBack: () => void;
}

export default function BusinessModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [income, setIncome] = useState(0);
  const [workers, setWorkers] = useState<WorkerEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = useCallback(() => {
    const data = getDayData(date);
    setIncome(data.business.income);
    setWorkers(data.business.workers);
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const addWorker = () => {
    setWorkers(prev => [...prev, { id: generateId(), name: "", kgLeaves: 0, ratePerKg: 0 }]);
  };

  const updateWorker = (id: string, field: keyof WorkerEntry, value: string | number) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const deleteWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleSave = async () => {
    if (workers.length > 0) {
      const hasEmpty = workers.some(w => !w.name.trim() || w.kgLeaves <= 0 || w.ratePerKg <= 0);
      if (hasEmpty) {
        toast({ title: "⚠️ " + t("validationError", lang), variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const data = getDayData(date);
    data.business = { income, workers };
    saveDayData(date, data);
    setSaving(false);

    toast({ title: "✅ " + t("savedSuccess", lang) });
  };

  const totalPaid = workers.reduce((sum, w) => sum + w.kgLeaves * w.ratePerKg, 0);
  const remaining = income - totalPaid;
  const mostPaid = workers.length > 0
    ? workers.reduce((max, w) => (w.kgLeaves * w.ratePerKg > max.kgLeaves * max.ratePerKg ? w : max), workers[0])
    : null;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-9 w-9 sm:h-11 sm:w-11 hover:bg-business-light shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-base sm:text-xl font-black text-foreground flex-1 truncate">{t("businessAccount", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="gap-1.5 rounded-xl text-xs sm:text-sm border-2 px-2.5 sm:px-4 h-9 sm:h-11 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{format(date, "dd MMM yyyy")}</span>
              <span className="sm:hidden">{format(date, "dd MMM")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Factory Income */}
      <div className="bg-business-light rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-business/10">
        <label className="text-sm sm:text-base font-bold text-business mb-2 block">{t("factoryIncome", lang)}</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base sm:text-lg font-black text-business/60">₹</span>
          <Input
            type="number"
            placeholder={t("enterIncome", lang)}
            value={income || ""}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="text-base sm:text-lg font-bold border-business/20 h-11 sm:h-14 rounded-xl pl-9 bg-card"
          />
        </div>
      </div>

      {/* Workers */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-card overflow-hidden mb-4 sm:mb-6 border border-border/50">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30">
          <h3 className="text-sm sm:text-base font-extrabold text-foreground">{t("name", lang)} & {t("kgLeaves", lang)}</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("serialNo", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("name", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("kgLeaves", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("ratePerKg", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("amount", lang)}</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={w.id} className="border-b last:border-0 transition-colors hover:bg-muted/10">
                  <td className="p-4 text-sm text-muted-foreground font-bold">{i + 1}</td>
                  <td className="p-4">
                    <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-10 text-sm rounded-lg" placeholder="Worker name..." />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-10 text-sm w-24 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-10 text-sm w-24 rounded-lg" />
                  </td>
                  <td className="p-4 font-black text-base text-business">₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteWorker(w.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                    {t("emptyState", lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden divide-y divide-border/50">
          {workers.map((w, i) => (
            <div key={w.id} className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteWorker(w.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-10 text-sm rounded-lg" placeholder="Worker name..." />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground mb-1 block">{t("kgLeaves", lang)}</label>
                  <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-10 text-sm rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground mb-1 block">{t("ratePerKg", lang)}</label>
                  <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-10 text-sm rounded-lg" />
                </div>
              </div>
              <div className="text-right font-black text-sm text-business">
                = ₹{(w.kgLeaves * w.ratePerKg).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
          {workers.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-xs">
              {t("emptyState", lang)}
            </div>
          )}
        </div>

        <div className="p-3.5 sm:p-5 border-t bg-muted/10">
          <Button variant="outline" size="default" onClick={addWorker} className="gap-2 text-xs sm:text-sm font-bold text-business border-business/30 rounded-xl px-4 sm:px-6 h-10 sm:h-11 hover:bg-business-light transition-colors w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> {t("addWorker", lang)}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-card mb-4 sm:mb-6 border border-border/50 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/20">
          <h3 className="text-sm sm:text-base font-extrabold text-foreground">📋 {t("totalPaid", lang)} & {t("remainingBalance", lang)}</h3>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border/40">
          <div className="p-4 sm:p-6 flex flex-col items-center text-center gap-1.5 sm:gap-2">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-destructive/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 sm:w-6 sm:h-6 text-destructive" />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("totalPaid", lang)}</p>
            <p className="text-lg sm:text-2xl font-black text-destructive tracking-tight">₹{totalPaid.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-4 sm:p-6 flex flex-col items-center text-center gap-1.5 sm:gap-2">
            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${remaining >= 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
              <TrendingUp className={`w-4 h-4 sm:w-6 sm:h-6 ${remaining >= 0 ? "text-primary" : "text-destructive"}`} />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("remainingBalance", lang)}</p>
            <p className={`text-lg sm:text-2xl font-black tracking-tight ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>₹{remaining.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Insight */}
      {mostPaid && mostPaid.name && (
        <div className="bg-gradient-to-r from-business-light to-card rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 border border-business/20 shadow-card overflow-hidden relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-business/15 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-business" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-business/70 mb-0.5">{t("mostPaidWorker", lang)}</p>
              <p className="text-sm sm:text-base font-black text-business truncate">{mostPaid.name} — ₹{(mostPaid.kgLeaves * mostPaid.ratePerKg).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {workers.length > 0 && workers.every(w => w.name.trim()) && (
        <div className="bg-primary/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-primary/10 text-center">
          <p className="text-xs sm:text-sm font-bold text-primary">{t("efficientMessage", lang)}</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        size="lg"
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 sm:h-14 text-sm sm:text-base font-black rounded-xl sm:rounded-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-95 disabled:opacity-70"
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? "..." : t("save", lang)}
      </Button>
    </div>
  );
}
