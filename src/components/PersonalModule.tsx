import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type PersonalEntry } from "@/lib/storage";
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

export default function PersonalModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<PersonalEntry[]>([]);
  const { toast } = useToast();

  const load = useCallback(() => {
    const data = getDayData(date);
    setEntries(data.personal);
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const addEntry = () => {
    setEntries(prev => [...prev, { id: generateId(), purpose: "", quantity: "", amount: 0 }]);
  };

  const updateEntry = (id: string, field: keyof PersonalEntry, value: string | number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleSave = () => {
    const hasEmpty = entries.some(e => !e.purpose.trim());
    if (entries.length > 0 && hasEmpty) {
      toast({ title: t("validationError", lang), variant: "destructive" });
      return;
    }
    const data = getDayData(date);
    data.personal = entries;
    saveDayData(date, data);
    toast({ title: t("savedSuccess", lang) });
  };

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = entries.reduce<Record<string, number>>((acc, e) => {
    if (e.purpose) acc[e.purpose] = (acc[e.purpose] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="px-6 py-6 md:px-10 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-extrabold text-foreground flex-1">{t("personalSpending", lang)}</h2>
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

      {/* Entries Table */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-4 text-left font-bold text-elder">{t("serialNo", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("purpose", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("quantity", lang)}</th>
                <th className="p-4 text-left font-bold text-elder">{t("amount", lang)}</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="p-4 text-elder text-muted-foreground font-semibold">{i + 1}</td>
                  <td className="p-4">
                    <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-11 text-elder rounded-lg" placeholder="Bakery, Tea..." />
                  </td>
                  <td className="p-4">
                    <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-11 text-elder w-20 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-11 text-elder w-28 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive rounded-lg" onClick={() => deleteEntry(e.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <Button variant="outline" size="lg" onClick={addEntry} className="gap-2 text-elder text-personal border-personal/30 rounded-xl">
            <Plus className="w-5 h-5" /> {t("addEntry", lang)}
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
        <p className="text-sm text-muted-foreground font-bold mb-1">{t("totalSpentToday", lang)}</p>
        <p className="text-elder-2xl font-extrabold text-personal">₹{total.toFixed(0)}</p>
      </div>

      {/* Insight */}
      {topCategory && (
        <div className="bg-personal-light rounded-2xl p-4 text-center text-elder font-bold text-personal mb-6">
          {t("mostSpentOn", lang)}: {topCategory[0]} (₹{topCategory[1].toFixed(0)})
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
