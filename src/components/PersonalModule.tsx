import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, CalendarIcon, Plus, Trash2, Save, ShoppingBag, BarChart3, Loader2 } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
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

  const handleSave = async () => {
    if (entries.length > 0) {
      const hasEmpty = entries.some(e => !e.purpose.trim() || e.amount <= 0);
      if (hasEmpty) {
        toast({ title: "⚠️ " + t("validationError", lang), variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    await new Promise(r => setTimeout(r, 500));

    const data = getDayData(date);
    data.personal = entries;
    saveDayData(date, data);
    setSaving(false);

    toast({ title: "✅ " + t("savedSuccess", lang) });
  };

  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = entries.reduce<Record<string, number>>((acc, e) => {
    if (e.purpose) acc[e.purpose] = (acc[e.purpose] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 hover:bg-personal-light shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <h2 className="text-lg sm:text-elder-2xl font-black text-foreground flex-1 truncate">{t("personalSpending", lang)}</h2>
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

      {/* Entries */}
      <div className="bg-card rounded-2xl sm:rounded-3xl shadow-card overflow-hidden mb-6 sm:mb-8 border border-border/50">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b bg-muted/30">
          <h3 className="text-base sm:text-elder-lg font-extrabold text-foreground">{t("purpose", lang)} & {t("amount", lang)}</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
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
                    {t("emptyState", lang)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="sm:hidden divide-y divide-border/50">
          {entries.map((e, i) => (
            <div key={e.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteEntry(e.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-11 text-base rounded-xl" placeholder="Bakery, Tea..." />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">{t("quantity", lang)}</label>
                  <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-11 text-base rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">{t("amount", lang)}</label>
                  <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-11 text-base rounded-xl" />
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              {t("emptyState", lang)}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t bg-muted/10">
          <Button variant="outline" size="lg" onClick={addEntry} className="gap-2 sm:gap-3 text-sm sm:text-elder font-bold text-personal border-personal/30 rounded-xl sm:rounded-2xl px-5 sm:px-8 h-11 sm:h-13 hover:bg-personal-light transition-colors w-full sm:w-auto">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" /> {t("addEntry", lang)}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl sm:rounded-3xl shadow-card mb-6 sm:mb-8 border-2 border-border/60 overflow-hidden">
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b bg-muted/20">
          <h3 className="text-base sm:text-elder-lg font-extrabold text-foreground">📋 {t("totalSpentToday", lang)}</h3>
        </div>
        <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center text-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 sm:w-7 sm:h-7 text-destructive" />
          </div>
          <p className="text-xs sm:text-elder font-bold text-muted-foreground">{t("totalSpentToday", lang)}</p>
          <p className="text-2xl sm:text-4xl md:text-5xl font-black text-destructive tracking-tight">₹{total.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Insight */}
      {topCategory && (
        <div className="bg-gradient-to-r from-personal-light via-personal-light to-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-4 border-2 border-personal/20 shadow-card overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-personal/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-personal/15 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-personal" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-personal/70 mb-0.5 sm:mb-1">{t("mostSpentOn", lang)}</p>
              <p className="text-base sm:text-elder-xl font-black text-personal truncate">{topCategory[0]} <span className="text-sm sm:text-elder-lg">— ₹{topCategory[1].toLocaleString("en-IN")}</span></p>
            </div>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="bg-personal/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 border border-personal/10 text-center">
          <p className="text-sm sm:text-elder font-bold text-personal">
            {t("spentMessage", lang).replace("{amount}", total.toLocaleString("en-IN"))}
          </p>
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
