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
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 hover:bg-business-light shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <h2 className="text-lg sm:text-elder-2xl font-black text-foreground flex-1 truncate">{t("businessAccount", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl text-sm sm:text-elder border-2 px-3 sm:px-5 h-10 sm:h-12 shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
      <div className="bg-business-light rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 sm:mb-8 border border-business/10">
        <label className="text-base sm:text-elder-lg font-bold text-business mb-2 sm:mb-3 block">{t("factoryIncome", lang)}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-elder-xl font-black text-business/60">₹</span>
          <Input
            type="number"
            placeholder={t("enterIncome", lang)}
            value={income || ""}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="text-lg sm:text-elder-xl font-bold border-business/20 h-12 sm:h-16 rounded-xl sm:rounded-2xl pl-10 bg-card"
          />
        </div>
      </div>

      {/* Workers - Card Layout on Mobile, Table on Desktop */}
      <div className="bg-card rounded-2xl sm:rounded-3xl shadow-card overflow-hidden mb-6 sm:mb-8 border border-border/50">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b bg-muted/30">
          <h3 className="text-base sm:text-elder-lg font-extrabold text-foreground">{t("name", lang)} & {t("kgLeaves", lang)}</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("serialNo", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("name", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("kgLeaves", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("ratePerKg", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("amount", lang)}</th>
                <th className="p-5 w-14"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={w.id} className="border-b last:border-0 transition-colors hover:bg-muted/10">
                  <td className="p-5 text-elder text-muted-foreground font-bold">{i + 1}</td>
                  <td className="p-5">
                    <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-12 text-elder rounded-xl" placeholder="Worker name..." />
                  </td>
                  <td className="p-5">
                    <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-12 text-elder w-28 rounded-xl" />
                  </td>
                  <td className="p-5">
                    <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-12 text-elder w-28 rounded-xl" />
                  </td>
                  <td className="p-5 font-black text-elder-lg text-business">₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</td>
                  <td className="p-5">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive rounded-xl hover:bg-destructive/10" onClick={() => deleteWorker(w.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-muted-foreground text-elder">
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
            <div key={w.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteWorker(w.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-11 text-base rounded-xl" placeholder="Worker name..." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">{t("kgLeaves", lang)}</label>
                  <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-11 text-base rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">{t("ratePerKg", lang)}</label>
                  <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-11 text-base rounded-xl" />
                </div>
              </div>
              <div className="text-right font-black text-base text-business">
                = ₹{(w.kgLeaves * w.ratePerKg).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
          {workers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {t("emptyState", lang)}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t bg-muted/10">
          <Button variant="outline" size="lg" onClick={addWorker} className="gap-2 sm:gap-3 text-sm sm:text-elder font-bold text-business border-business/30 rounded-xl sm:rounded-2xl px-5 sm:px-8 h-11 sm:h-13 hover:bg-business-light transition-colors w-full sm:w-auto">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" /> {t("addWorker", lang)}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl sm:rounded-3xl shadow-card mb-6 sm:mb-8 border-2 border-border/60 overflow-hidden">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b bg-muted/20">
          <h3 className="text-base sm:text-elder-lg font-extrabold text-foreground">📋 {t("totalPaid", lang)} & {t("remainingBalance", lang)}</h3>
        </div>
        <div className="grid grid-cols-2 divide-x divide-border/40">
          <div className="p-5 sm:p-8 md:p-10 flex flex-col items-center text-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-destructive/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 sm:w-7 sm:h-7 text-destructive" />
            </div>
            <p className="text-xs sm:text-elder font-bold text-muted-foreground">{t("totalPaid", lang)}</p>
            <p className="text-2xl sm:text-4xl md:text-5xl font-black text-destructive tracking-tight">₹{totalPaid.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-5 sm:p-8 md:p-10 flex flex-col items-center text-center gap-2 sm:gap-3">
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${remaining >= 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
              <TrendingUp className={`w-5 h-5 sm:w-7 sm:h-7 ${remaining >= 0 ? "text-primary" : "text-destructive"}`} />
            </div>
            <p className="text-xs sm:text-elder font-bold text-muted-foreground">{t("remainingBalance", lang)}</p>
            <p className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>₹{remaining.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Insight */}
      {mostPaid && mostPaid.name && (
        <div className="bg-gradient-to-r from-business-light via-business-light to-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 border-2 border-business/20 shadow-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-business/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-business/15 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 sm:w-7 sm:h-7 text-business" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-business/70 mb-0.5 sm:mb-1">{t("mostPaidWorker", lang)}</p>
              <p className="text-base sm:text-elder-xl font-black text-business truncate">{mostPaid.name} <span className="text-sm sm:text-elder-lg">— ₹{(mostPaid.kgLeaves * mostPaid.ratePerKg).toLocaleString("en-IN")}</span></p>
            </div>
          </div>
        </div>
      )}

      {workers.length > 0 && workers.every(w => w.name.trim()) && (
        <div className="bg-primary/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-primary/10 text-center">
          <p className="text-sm sm:text-elder font-bold text-primary">{t("efficientMessage", lang)}</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        size="lg"
        onClick={handleSave}
        disabled={saving}
        className="w-full h-14 sm:h-16 text-base sm:text-elder-xl font-black rounded-2xl sm:rounded-3xl gap-2 sm:gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-95 disabled:opacity-70"
      >
        {saving ? <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin" /> : <Save className="w-6 h-6 sm:w-7 sm:h-7" />}
        {saving ? "..." : t("save", lang)}
      </Button>
    </div>
  );
}
