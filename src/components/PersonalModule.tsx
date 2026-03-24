import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type PersonalEntry } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Props {
  lang: Language;
  onBack: () => void;
}

export default function PersonalModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<PersonalEntry[]>([]);

  const load = useCallback(() => {
    const data = getDayData(date);
    setEntries(data.personal);
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback((e: PersonalEntry[]) => {
    const data = getDayData(date);
    data.personal = e;
    saveDayData(date, data);
  }, [date]);

  const addEntry = () => {
    const updated = [...entries, { id: generateId(), purpose: "", quantity: "", amount: 0 }];
    setEntries(updated);
    save(updated);
  };

  const updateEntry = (id: string, field: keyof PersonalEntry, value: string | number) => {
    const updated = entries.map(e => e.id === id ? { ...e, [field]: value } : e);
    setEntries(updated);
    save(updated);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    save(updated);
  };

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = entries.reduce<Record<string, number>>((acc, e) => {
    if (e.purpose) acc[e.purpose] = (acc[e.purpose] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="p-5 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-elder-xl font-bold text-foreground flex-1">{t("personalSpending", lang)}</h2>
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

      <div className="bg-card rounded-xl shadow-card overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-semibold">{t("serialNo", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("purpose", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("quantity", lang)}</th>
                <th className="p-3 text-left font-semibold">{t("amount", lang)}</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3">
                    <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-8 text-sm" placeholder="Bakery, Tea..." />
                  </td>
                  <td className="p-3">
                    <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-8 text-sm w-16" />
                  </td>
                  <td className="p-3">
                    <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-8 text-sm w-24" />
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteEntry(e.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" onClick={addEntry} className="gap-1.5 text-personal border-personal/30">
            <Plus className="w-4 h-4" /> {t("addEntry", lang)}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl p-4 shadow-card mb-3">
        <p className="text-xs text-muted-foreground font-semibold">{t("totalSpentToday", lang)}</p>
        <p className="text-elder-lg font-extrabold text-personal">₹{total.toFixed(0)}</p>
      </div>

      {topCategory && (
        <div className="bg-personal-light rounded-xl p-3 text-center text-sm font-semibold text-personal">
          {t("mostSpentOn", lang)}: {topCategory[0]} (₹{topCategory[1].toFixed(0)})
        </div>
      )}
    </div>
  );
}
