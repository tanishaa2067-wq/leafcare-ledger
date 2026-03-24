import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save } from "lucide-react";
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

  const handleSave = () => {
    // Validate: if there are workers, each must have a name
    const hasEmptyWorker = workers.some(w => !w.name.trim());
    if (workers.length > 0 && hasEmptyWorker) {
      toast({ title: t("validationError", lang), variant: "destructive" });
      return;
    }
    const data = getDayData(date);
    data.business = { income, workers };
    saveDayData(date, data);
    toast({ title: t("savedSuccess", lang) });
  };

  const totalPaid = workers.reduce((sum, w) => sum + w.kgLeaves * w.ratePerKg, 0);
  const remaining = income - totalPaid;
  const mostPaid = workers.length > 0
    ? workers.reduce((max, w) => (w.kgLeaves * w.ratePerKg > max.kgLeaves * max.ratePerKg ? w : max), workers[0])
    : null;

  return (
    <div className="px-6 py-6 md:px-10 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-extrabold text-foreground flex-1">{t("businessAccount", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 rounded-xl text-elder">
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
      <div className="bg-business-light rounded-2xl p-6 mb-6">
        <label className="text-elder font-bold text-business mb-2 block">{t("factoryIncome", lang)}</label>
        <Input
          type="number"
          placeholder={t("enterIncome", lang)}
          value={income || ""}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="text-elder-xl font-bold border-business/30 h-14 rounded-xl"
        />
      </div>

      {/* Workers Table */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-bold text-elder">{t("serialNo", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("name", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("kgLeaves", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("ratePerKg", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("amount", lang)}</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, i) => (
                <tr key={w.id} className="border-b last:border-0">
                  <td className="p-4 text-elder text-muted-foreground font-semibold">{i + 1}</td>
                  <td className="p-4">
                    <Input value={w.name} onChange={(e) => updateWorker(w.id, "name", e.target.value)} className="h-11 text-elder rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={w.kgLeaves || ""} onChange={(e) => updateWorker(w.id, "kgLeaves", Number(e.target.value))} className="h-11 text-elder w-24 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={w.ratePerKg || ""} onChange={(e) => updateWorker(w.id, "ratePerKg", Number(e.target.value))} className="h-11 text-elder w-24 rounded-lg" />
                  </td>
                  <td className="p-4 font-extrabold text-elder-lg text-business">₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive rounded-lg" onClick={() => deleteWorker(w.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" size="lg" onClick={addWorker} className="gap-2 text-elder text-business border-business/30 rounded-xl">
            <Plus className="w-5 h-5" /> {t("addWorker", lang)}
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground font-bold mb-1">{t("totalPaid", lang)}</p>
          <p className="text-elder-2xl font-extrabold text-business">₹{totalPaid.toFixed(0)}</p>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <p className="text-sm text-muted-foreground font-bold mb-1">{t("remainingBalance", lang)}</p>
          <p className={`text-elder-2xl font-extrabold ${remaining >= 0 ? "text-primary" : "text-destructive"}`}>₹{remaining.toFixed(0)}</p>
        </div>
      </div>

      {/* Insight */}
      {mostPaid && mostPaid.name && (
        <div className="bg-business-light rounded-2xl p-4 text-center text-elder font-bold text-business mb-6">
          {t("mostPaidWorker", lang)}: {mostPaid.name} (₹{(mostPaid.kgLeaves * mostPaid.ratePerKg).toFixed(0)})
        </div>
      )}

      {/* Save Button */}
      <Button
        size="lg"
        onClick={handleSave}
        className="w-full h-14 text-elder-xl font-extrabold rounded-2xl gap-3 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Save className="w-6 h-6" />
        {t("save", lang)}
      </Button>
    </div>
  );
}
