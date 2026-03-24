import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type WorkerEntry } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Props {
  lang: Language;
  onBack: () => void;
}

export default function BusinessModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [income, setIncome] = useState(0);
  const [workers, setWorkers] = useState<WorkerEntry[]>([]);

  const load = useCallback(() => {
    const data = getDayData(date);
    setIncome(data.business.income);
    setWorkers(data.business.workers);
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback((inc: number, w: WorkerEntry[]) => {
    const data = getDayData(date);
    data.business = { income: inc, workers: w };
    saveDayData(date, data);
  }, [date]);

  const updateIncome = (val: number) => {
    setIncome(val);
    save(val, workers);
  };

  const addWorker = () => {
    const updated = [...workers, { id: generateId(), name: "", kgLeaves: 0, ratePerKg: 0 }];
    setWorkers(updated);
    save(income, updated);
  };

  const updateWorker = (id: string, field: keyof WorkerEntry, value: string | number) => {
    const updated = workers.map(w => w.id === id ? { ...w, [field]: value } : w);
    setWorkers(updated);
    save(income, updated);
  };

  const deleteWorker = (id: string) => {
    const updated = workers.filter(w => w.id !== id);
    setWorkers(updated);
    save(income, updated);
  };

  const totalPaid = workers.reduce((sum, w) => sum + w.kgLeaves * w.ratePerKg, 0);
  const remaining = income - totalPaid;
  const mostPaid = workers.length > 0
    ? workers.reduce((max, w) => (w.kgLeaves * w.ratePerKg > max.kgLeaves * max.ratePerKg ? w : max), workers[0])
    : null;

  return (
    <div className="p-5 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-elder-xl font-bold text-foreground flex-1">{t("businessAccount", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {format(date, "dd MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-business-light rounded-xl p-4 mb-4">
        <label className="text-sm font-semibold text-business mb-1 block">{t("factoryIncome", lang)}</label>
        <Input
          type="number"
          placeholder={t("enterIncome", lang)}
          value={income || ""}
          onChange={(e) => updateIncome(Number(e.target.value))}
          className="text-elder font-bold border-business/30"
        />
      </div>

      <div className="bg-card rounded-xl shadow-card overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-semibold">{t("serialNo", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("name", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("kgLeaves", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("ratePerKg", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("amount", lang)}</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={w.id} className="border-b last:border-0">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3">
                    <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-8 text-sm" />
                  </td>
                  <td className="p-3">
                    <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-8 text-sm w-20" />
                  </td>
                  <td className="p-3">
                    <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-8 text-sm w-20" />
                  </td>
                  <td className="p-3 font-bold text-business">₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteWorker(w.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" onClick={addWorker} className="gap-1.5 text-business border-business/30">
            <Plus className="w-4 h-4" /> {t("addWorker", lang)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground font-semibold">{t("totalPaid", lang)}</p>
          <p className="text-elder-lg font-extrabold text-business">₹{totalPaid.toFixed(0)}</p>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card">
          <p className="text-xs text-muted-foreground font-semibold">{t("remainingBalance", lang)}</p>
          <p className={`text-elder-lg font-extrabold ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>₹{remaining.toFixed(0)}</p>
        </div>
      </div>

      {mostPaid && mostPaid.name && (
        <div className="bg-business-light rounded-xl p-3 text-center text-sm font-semibold text-business">
          {t("mostPaidWorker", lang)}: {mostPaid.name} (₹{(mostPaid.kgLeaves * mostPaid.ratePerKg).toFixed(0)})
        </div>
      )}
    </div>
  );
}
