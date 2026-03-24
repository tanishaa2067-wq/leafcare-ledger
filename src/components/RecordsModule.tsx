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
    <div className="px-6 py-6 md:px-10 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-extrabold text-foreground flex-1">{t("records", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 rounded-xl text-elder">
              <CalendarIcon className="w-5 h-5" />
              {filterDate ? format(filterDate, "dd MMM yyyy") : t("selectDate", lang)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          variant={tab === "business" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("business")}
          className={cn("flex-1 gap-2 rounded-xl text-elder", tab === "business" && "bg-business text-primary-foreground hover:bg-business/90")}
        >
          <Briefcase className="w-5 h-5" /> {t("businessRecords", lang)}
        </Button>
        <Button
          variant={tab === "personal" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("personal")}
          className={cn("flex-1 gap-2 rounded-xl text-elder", tab === "personal" && "bg-personal text-primary-foreground hover:bg-personal/90")}
        >
          <Home className="w-5 h-5" /> {t("personalRecords", lang)}
        </Button>
      </div>

      {filterDate && (
        <Button variant="ghost" size="lg" className="mb-4 text-muted-foreground rounded-xl" onClick={() => setFilterDate(undefined)}>
          {t("clearFilter", lang)} ✕
        </Button>
      )}

      {filteredDates.length === 0 ? (
        <div className="text-center py-16 text-elder text-muted-foreground">{t("noRecords", lang)}</div>
      ) : (
        <div className="space-y-4">
          {filteredDates.map(dateKey => {
            const data = getDayDataByKey(dateKey);
            const displayDate = format(parse(dateKey, "yyyy-MM-dd", new Date()), "dd MMM yyyy");

            if (tab === "business") {
              const total = data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
              if (data.business.workers.length === 0 && data.business.income === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-2xl p-6 shadow-card">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-extrabold text-elder text-foreground">{displayDate}</p>
                    <span className="text-sm bg-business-light text-business px-3 py-1 rounded-full font-bold">
                      {t("income", lang)}: ₹{data.business.income}
                    </span>
                  </div>
                  {data.business.workers.map((w, i) => (
                    <div key={w.id} className="flex justify-between text-elder py-2 border-b last:border-0">
                      <span>{i + 1}. {w.name || "—"}</span>
                      <span className="font-bold text-business">{w.kgLeaves}kg × ₹{w.ratePerKg} = ₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</span>
                    </div>
                  ))}
                  <p className="text-right mt-3 text-elder font-extrabold text-muted-foreground">{t("totalPaid", lang)}: ₹{total.toFixed(0)}</p>
                </div>
              );
            } else {
              const total = data.personal.reduce((s, e) => s + e.amount, 0);
              if (data.personal.length === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-2xl p-6 shadow-card">
                  <p className="font-extrabold text-elder text-foreground mb-3">{displayDate}</p>
                  {data.personal.map((e, i) => (
                    <div key={e.id} className="flex justify-between text-elder py-2 border-b last:border-0">
                      <span>{i + 1}. {e.purpose || "—"} {e.quantity && `(${e.quantity})`}</span>
                      <span className="font-bold text-personal">₹{e.amount}</span>
                    </div>
                  ))}
                  <p className="text-right mt-3 text-elder font-extrabold text-muted-foreground">{t("totalSpentToday", lang)}: ₹{total.toFixed(0)}</p>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
