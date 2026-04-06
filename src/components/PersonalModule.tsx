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
    <div className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-9 w-9 sm:h-11 sm:w-11 hover:bg-personal-light shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-base sm:text-xl font-black text-foreground flex-1 truncate">{t("personalSpending", lang)}</h2>
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

      {/* Entries */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-card overflow-hidden mb-4 sm:mb-6 border border-border/50">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/30">
          <h3 className="text-sm sm:text-base font-extrabold text-foreground">{t("purpose", lang)} & {t("amount", lang)}</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("serialNo", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("purpose", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("quantity", lang)}</th>
                <th className="p-4 text-left font-bold text-sm text-muted-foreground">{t("amount", lang)}</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id} className="border-b last:border-0 transition-colors hover:bg-muted/10">
                  <td className="p-4 text-sm text-muted-foreground font-bold">{i + 1}</td>
                  <td className="p-4">
                    <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-10 text-sm rounded-lg" placeholder="Bakery, Tea..." />
                  </td>
                  <td className="p-4">
                    <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-10 text-sm w-24 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-10 text-sm w-28 rounded-lg" />
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteEntry(e.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
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
            <div key={e.id} className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive rounded-lg hover:bg-destructive/10" onClick={() => deleteEntry(e.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <Input value={e.purpose} onChange={(ev) => updateEntry(e.id, "purpose", ev.target.value)} className="h-10 text-sm rounded-lg" placeholder="Bakery, Tea..." />
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground mb-1 block">{t("quantity", lang)}</label>
                  <Input value={e.quantity} onChange={(ev) => updateEntry(e.id, "quantity", ev.target.value)} className="h-10 text-sm rounded-lg" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground mb-1 block">{t("amount", lang)}</label>
                  <Input type="number" value={e.amount || ""} onChange={(ev) => updateEntry(e.id, "amount", Number(ev.target.value))} className="h-10 text-sm rounded-lg" />
                </div>
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-xs">
              {t("emptyState", lang)}
            </div>
          )}
        </div>

        <div className="p-3.5 sm:p-5 border-t bg-muted/10">
          <Button variant="outline" size="default" onClick={addEntry} className="gap-2 text-xs sm:text-sm font-bold text-personal border-personal/30 rounded-xl px-4 sm:px-6 h-10 sm:h-11 hover:bg-personal-light transition-colors w-full sm:w-auto">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> {t("addEntry", lang)}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-card mb-4 sm:mb-6 border border-border/50 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-muted/20">
          <h3 className="text-sm sm:text-base font-extrabold text-foreground">📋 {t("totalSpentToday", lang)}</h3>
        </div>
        <div className="p-5 sm:p-6 flex flex-col items-center text-center gap-1.5 sm:gap-2">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-destructive/10 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-destructive" />
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("totalSpentToday", lang)}</p>
          <p className="text-lg sm:text-2xl font-black text-destructive tracking-tight">₹{total.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Insight */}
      {topCategory && (
        <div className="bg-gradient-to-r from-personal-light to-card rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-3 border border-personal/20 shadow-card overflow-hidden relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-personal/15 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-personal" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-personal/70 mb-0.5">{t("mostSpentOn", lang)}</p>
              <p className="text-sm sm:text-base font-black text-personal truncate">{topCategory[0]} — ₹{topCategory[1].toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {total > 0 && (
        <div className="bg-personal/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-personal/10 text-center">
          <p className="text-xs sm:text-sm font-bold text-personal">
            {t("spentMessage", lang).replace("{amount}", total.toLocaleString("en-IN"))}
          </p>
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
