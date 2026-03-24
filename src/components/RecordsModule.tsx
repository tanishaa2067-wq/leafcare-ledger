import { useState } from "react";
import { ArrowLeft, CalendarIcon, Briefcase, Home, X } from "lucide-react";
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
    <div className="px-6 py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 hover:bg-records-light">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-black text-foreground flex-1">{t("records", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 rounded-2xl text-elder border-2 px-5">
              <CalendarIcon className="w-5 h-5" />
              {filterDate ? format(filterDate, "dd MMM yyyy") : t("selectDate", lang)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-8">
        <Button
          variant={tab === "business" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("business")}
          className={cn("flex-1 gap-3 rounded-2xl text-elder h-14 font-bold border-2 transition-all", tab === "business" && "bg-business text-primary-foreground hover:bg-business/90 border-business shadow-card")}
        >
          <Briefcase className="w-6 h-6" /> {t("businessRecords", lang)}
        </Button>
        <Button
          variant={tab === "personal" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("personal")}
          className={cn("flex-1 gap-3 rounded-2xl text-elder h-14 font-bold border-2 transition-all", tab === "personal" && "bg-personal text-primary-foreground hover:bg-personal/90 border-personal shadow-card")}
        >
          <Home className="w-6 h-6" /> {t("personalRecords", lang)}
        </Button>
      </div>

      {/* Active Date Filter Badge */}
      {filterDate && (
        <Button variant="secondary" size="lg" className="mb-6 text-muted-foreground rounded-2xl gap-2 font-bold" onClick={() => setFilterDate(undefined)}>
          {format(filterDate, "dd MMM yyyy")}
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Records */}
      {filteredDates.length === 0 ? (
        <div className="text-center py-20 text-elder-lg text-muted-foreground bg-card rounded-3xl shadow-card">
          {t("noRecords", lang)}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDates.map(dateKey => {
            const data = getDayDataByKey(dateKey);
            const displayDate = format(parse(dateKey, "yyyy-MM-dd", new Date()), "dd MMM yyyy");

            if (tab === "business") {
              const total = data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
              if (data.business.workers.length === 0 && data.business.income === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-3xl p-8 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <div className="flex justify-between items-center mb-5">
                    <p className="font-black text-elder-lg text-foreground">{displayDate}</p>
                    <span className="text-sm bg-business-light text-business px-4 py-2 rounded-2xl font-bold">
                      {t("income", lang)}: ₹{data.business.income}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {data.business.workers.map((w, i) => (
                      <div key={w.id} className="flex justify-between text-elder py-3 px-4 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="font-semibold">{i + 1}. {w.name || "—"}</span>
                        <span className="font-bold text-business">{w.kgLeaves}kg × ₹{w.ratePerKg} = <span className="font-black">₹{(w.kgLeaves * w.ratePerKg).toFixed(0)}</span></span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t">
                    <p className="text-right text-elder-lg font-black text-business">{t("totalPaid", lang)}: ₹{total.toFixed(0)}</p>
                  </div>
                </div>
              );
            } else {
              const total = data.personal.reduce((s, e) => s + e.amount, 0);
              if (data.personal.length === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-3xl p-8 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <p className="font-black text-elder-lg text-foreground mb-5">{displayDate}</p>
                  <div className="space-y-1">
                    {data.personal.map((e, i) => (
                      <div key={e.id} className="flex justify-between text-elder py-3 px-4 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="font-semibold">{i + 1}. {e.purpose || "—"} {e.quantity && <span className="text-muted-foreground">({e.quantity})</span>}</span>
                        <span className="font-black text-personal">₹{e.amount}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t">
                    <p className="text-right text-elder-lg font-black text-personal">{t("totalSpentToday", lang)}: ₹{total.toFixed(0)}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
