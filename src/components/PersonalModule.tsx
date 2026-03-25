import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save, ShoppingBag, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getDayData, saveDayData, generateId, type PersonalEntry } from "@/lib/storage";
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

export default function PersonalModule({ lang, onBack }: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<PersonalEntry[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (entries.length > 0 && hasEmpty) return;
    const data = getDayData(date);
    data.personal = entries;
    saveDayData(date, data);
    setShowConfirm(true);
  };

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = entries.reduce<Record<string, number>>((acc, e) => {
    if (e.purpose) acc[e.purpose] = (acc[e.purpose] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="px-6 py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 hover:bg-personal-light">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-black text-foreground flex-1">{t("personalSpending", lang)}</h2>
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

      {/* Entries Table */}
      <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-8 border border-border/50">
        <div className="px-8 py-5 border-b bg-muted/30">
          <h3 className="text-elder-lg font-extrabold text-foreground">{t("purpose", lang)} & {t("amount", lang)}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("serialNo", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("purpose", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("quantity", lang)}</th>
                <th className="p-5 text-left font-bold text-elder text-muted-foreground">{t("amount", lang)}</th>
                <th className="p-5 w-14"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0 transition-colors hover:bg-muted/10">
                  <td className="p-5 text-elder text-muted-foreground font-bold">{i + 1}</td>
                  <td className="p-5">
                    <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-12 text-elder rounded-xl" placeholder="Bakery, Tea..." />
                  </td>
                  <td className="p-5">
                    <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-12 text-elder w-24 rounded-xl" />
                  </td>
                  <td className="p-5">
                    <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-12 text-elder w-32 rounded-xl" />
                  </td>
                  <td className="p-5">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive rounded-xl hover:bg-destructive/10" onClick={() => deleteEntry(e.id)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-muted-foreground text-elder">
                    Click "Add Entry" to get started
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t bg-muted/10">
          <Button variant="outline" size="lg" onClick={addEntry} className="gap-3 text-elder font-bold text-personal border-personal/30 rounded-2xl px-8 h-13 hover:bg-personal-light transition-colors">
            <Plus className="w-6 h-6" /> {t("addEntry", lang)}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-card via-card to-muted/30 rounded-3xl shadow-card mb-8 border-2 border-border/60 overflow-hidden">
        <div className="px-8 py-5 border-b bg-muted/20">
          <h3 className="text-elder-lg font-extrabold text-foreground">📋 {t("totalSpentToday", lang)}</h3>
        </div>
        <div className="p-8 md:p-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-destructive" />
          </div>
          <p className="text-elder font-bold text-muted-foreground">{t("totalSpentToday", lang)}</p>
          <p className="text-4xl md:text-5xl font-black text-destructive tracking-tight">₹{total.toFixed(0)}</p>
        </div>
      </div>

      {/* Insight */}
      {topCategory && (
        <div className="bg-personal-light rounded-3xl p-6 text-center text-elder-lg font-bold text-personal mb-8 border border-personal/10">
          📊 {t("mostSpentOn", lang)}: <span className="font-black">{topCategory[0]}</span> (₹{topCategory[1].toFixed(0)})
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
            <div className="w-20 h-20 rounded-full bg-personal-light flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-personal" />
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
