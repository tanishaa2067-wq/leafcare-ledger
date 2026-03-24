import { useState } from "react";
import { ArrowLeft, CalendarIcon, Briefcase, Home } from "lucide-react";
import { format, parse } from "date-fns";
import { Language, t } from "@/lib/i18n";
import { getAllDates, getDayDataByKey } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Props {
  lang: Language;
  onBack: () => void;
}

export default function RecordsModule({ lang, onBack }: Props) {
  const [tab, setTab] = useState<"business" | "personal">("business");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const allDates = getAllDates();
  const filteredDates = filterDate
    ? allDates.filter(d => d === format(filterDate, "yyyy-MM-dd"))
    : allDates;

  return (
    <div className="p-5 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-elder-xl font-bold text-foreground flex-1">{t("records", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {filterDate ? format(filterDate, "dd MMM yyyy") : t("selectDate", lang)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={tab === "business" ? "default" : "outline"}
          onClick={() => setTab("business")}
          className={cn("flex-1 gap-2", tab === "business" && "bg-business text-primary-foreground hover:bg-business/90")}
        >
          <Briefcase className="w-4 h-4" /> {t("businessRecords", lang)}
        </Button>
        <Button
          variant={tab === "personal" ? "default" : "outline"}
          onClick={() => setTab("personal")}
          className={cn("flex-1 gap-2", tab === "personal" && "bg-personal text-primary-foreground hover:bg-personal/90")}
        >
          <Home className="w-4 h-4" /> {t("personalRecords", lang)}
        </Button>
      </div>

      {filterDate && (
        <Button variant="ghost" size="sm" className="mb-3 text-muted-foreground" onClick={() => setFilterDate(undefined)}>
          Clear filter ✕
        </Button>
      )}

      {filteredDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t("noRecords", lang)}</div>
      ) : (
        <div className="space-y-3">
          {filteredDates.map(dateKey => {
            const data = getDayDataByKey(dateKey);
            const displayDate = format(parse(dateKey, "yyyy-MM-dd", new Date()), "dd MMM yyyy");

            if (tab === "business") {
              const total = data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
              if (data.business.workers.length === 0 && data.business.income === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-xl p-4 shadow-card">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-sm text-foreground">{displayDate}</p>
                    <span className="text-xs bg-business-light text-business px-2 py-0.5 rounded-full font-semibold">
                      {t("income", lang)}: ₹{data.business.income}
                    </span>
                  </div>
                  {data.business.workers.map((w, i) => (
                    <div key={w.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                      <span>{i + 1}. {w.name || "—"}</span>
                      <span className="font-semibold text-business">{w.kgLeaves}kg × ₹{w.ratePerKg} = ₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</span>
                    </div>
                  ))}
                  <p className="text-right mt-2 text-xs font-bold text-muted-foreground">{t("totalPaid", lang)}: ₹{total.toFixed(0)}</p>
                </div>
              );
            } else {
              const total = data.personal.reduce((s, e) => s + e.amount, 0);
              if (data.personal.length === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-xl p-4 shadow-card">
                  <p className="font-bold text-sm text-foreground mb-2">{displayDate}</p>
                  {data.personal.map((e, i) => (
                    <div key={e.id} className="flex justify-between text-sm py-1 border-b last:border-0">
                      <span>{i + 1}. {e.purpose || "—"} {e.quantity && `(${e.quantity})`}</span>
                      <span className="font-semibold text-personal">₹{e.amount}</span>
                    </div>
                  ))}
                  <p className="text-right mt-2 text-xs font-bold text-muted-foreground">{t("totalSpentToday", lang)}: ₹{total.toFixed(0)}</p>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
