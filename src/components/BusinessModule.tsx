import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save, TrendingUp, Wallet, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type WorkerEntry } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Props {
  lang: Language;
  onBack: () => void;
}

export default function BusinessModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [income, setIncome] = useState(0);
  const [workers, setWorkers] = useState<WorkerEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleSave = () => {
    const hasEmptyWorker = workers.some(w => !w.name.trim());
    if (workers.length > 0 && hasEmptyWorker) return;
    const data = getDayData(date);
    data.business = { income, workers };
    saveDayData(date, data);
    setShowConfirm(true);
  };

  const totalPaid = workers.reduce((sum, w) => sum + w.kgLeaves * w.ratePerKg, 0);
  const remaining = income - totalPaid;
  const mostPaid = workers.length > 0
    ? workers.reduce((max, w) => (w.kgLeaves * w.ratePerKg > max.kgLeaves * max.ratePerKg ? w : max), workers[0])
    : null;

  return (
    <div className="px-6 py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 hover:bg-business-light">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-black text-foreground flex-1">{t("businessAccount", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 rounded-2xl text-elder border-2 px-5">
              <CalendarIcon className="w-5 h-5" />
              {format(date, "dd MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Factory Income */}
      <div className="bg-business-light rounded-3xl p-8 mb-8 border border-business/10">
        <label className="text-elder-lg font-bold text-business mb-3 block">{t("factoryIncome", lang)}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-elder-xl font-black text-business/60">₹</span>
          <Input
            type="number"
            placeholder={t("enterIncome", lang)}
            value={income || ""}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="text-elder-xl font-bold border-business/20 h-16 rounded-2xl pl-10 bg-card"
          />
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-8 border border-border/50">
        <div className="px-8 py-5 border-b bg-muted/30">
          <h3 className="text-elder-lg font-extrabold text-foreground">{t("name", lang)} & {t("kgLeaves", lang)}</h3>
        </div>
        <div className="overflow-x-auto">
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
                    Click "Add Worker" to get started
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t bg-muted/10">
          <Button variant="outline" size="lg" onClick={addWorker} className="gap-3 text-elder font-bold text-business border-business/30 rounded-2xl px-8 h-13 hover:bg-business-light transition-colors">
            <Plus className="w-6 h-6" /> {t("addWorker", lang)}
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="w-6 h-6 text-business" />
            <p className="text-sm text-muted-foreground font-bold">{t("totalPaid", lang)}</p>
          </div>
          <p className="text-3xl md:text-4xl font-black text-business">₹{totalPaid.toFixed(0)}</p>
        </div>
        <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <p className="text-sm text-muted-foreground font-bold">{t("remainingBalance", lang)}</p>
          </div>
          <p className={`text-3xl md:text-4xl font-black ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>₹{remaining.toFixed(0)}</p>
        </div>
      </div>

      {/* Insight */}
      {mostPaid && mostPaid.name && (
        <div className="bg-business-light rounded-3xl p-6 text-center text-elder-lg font-bold text-business mb-8 border border-business/10">
          🏆 {t("mostPaidWorker", lang)}: <span className="font-black">{mostPaid.name}</span> (₹{(mostPaid.kgLeaves * mostPaid.ratePerKg).toFixed(0)})
        </div>
      )}

      {/* Save Button */}
      <Button
        size="lg"
        onClick={handleSave}
        className="w-full h-16 text-elder-xl font-black rounded-3xl gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-card hover:shadow-card-hover transition-all duration-300"
      >
        <Save className="w-7 h-7" />
        {t("save", lang)}
      </Button>

      {/* Save Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-3xl p-8 max-w-md">
          <DialogHeader className="items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-business-light flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-business" />
            </div>
            <DialogTitle className="text-elder-xl font-black">{t("saveConfirmTitle", lang)}</DialogTitle>
            <DialogDescription className="text-elder text-muted-foreground">
              {t("saveConfirmMessage", lang)}
            </DialogDescription>
          </DialogHeader>
          <Button
            size="lg"
            onClick={() => setShowConfirm(false)}
            className="w-full h-14 text-elder-lg font-bold rounded-2xl mt-4 bg-primary text-primary-foreground"
          >
            {t("ok", lang)}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
