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
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 hover:bg-records-light shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <h2 className="text-lg sm:text-elder-2xl font-black text-foreground flex-1 truncate">{t("records", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl text-sm sm:text-elder border-2 px-3 sm:px-5 h-10 sm:h-12 shrink-0">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{filterDate ? format(filterDate, "dd MMM yyyy") : t("selectDate", lang)}</span>
              <span className="sm:hidden">{filterDate ? format(filterDate, "dd MMM") : "Filter"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={filterDate} onSelect={setFilterDate} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button
          variant={tab === "business" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("business")}
          className={cn("flex-1 gap-2 sm:gap-3 rounded-xl sm:rounded-2xl text-sm sm:text-elder h-12 sm:h-14 font-bold border-2 transition-all", tab === "business" && "bg-business text-primary-foreground hover:bg-business/90 border-business shadow-card")}
        >
          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" /> {t("businessRecords", lang)}
        </Button>
        <Button
          variant={tab === "personal" ? "default" : "outline"}
          size="lg"
          onClick={() => setTab("personal")}
          className={cn("flex-1 gap-2 sm:gap-3 rounded-xl sm:rounded-2xl text-sm sm:text-elder h-12 sm:h-14 font-bold border-2 transition-all", tab === "personal" && "bg-personal text-primary-foreground hover:bg-personal/90 border-personal shadow-card")}
        >
          <Home className="w-5 h-5 sm:w-6 sm:h-6" /> {t("personalRecords", lang)}
        </Button>
      </div>

      {/* Active Date Filter Badge */}
      {filterDate && (
        <Button variant="secondary" size="default" className="mb-4 sm:mb-6 text-muted-foreground rounded-xl sm:rounded-2xl gap-2 font-bold text-sm" onClick={() => setFilterDate(undefined)}>
          {format(filterDate, "dd MMM yyyy")}
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Records */}
      {filteredDates.length === 0 ? (
        <div className="text-center py-16 sm:py-20 text-sm sm:text-elder-lg text-muted-foreground bg-card rounded-2xl sm:rounded-3xl shadow-card">
          {t("noRecordsYet", lang)}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {filteredDates.map(dateKey => {
            const data = getDayDataByKey(dateKey);
            const displayDate = format(parse(dateKey, "yyyy-MM-dd", new Date()), "dd MMM yyyy");

            if (tab === "business") {
              const total = data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
              if (data.business.workers.length === 0 && data.business.income === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-5">
                    <p className="font-black text-base sm:text-elder-lg text-foreground">{displayDate}</p>
                    <span className="text-xs sm:text-sm bg-business-light text-business px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-bold self-start sm:self-auto">
                      {t("income", lang)}: ₹{data.business.income.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {data.business.workers.map((w, i) => (
                      <div key={w.id} className="flex justify-between text-sm sm:text-elder py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-muted/30 transition-colors gap-2">
                        <span className="font-semibold truncate">{i + 1}. {w.name || "—"}</span>
                        <span className="font-bold text-business whitespace-nowrap">{w.kgLeaves}kg × ₹{w.ratePerKg} = <span className="font-black">₹{(w.kgLeaves * w.ratePerKg).toLocaleString("en-IN")}</span></span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t-2 border-business/15 flex justify-between items-center">
                    <span className="text-sm sm:text-elder font-bold text-muted-foreground">{t("totalPaid", lang)}</span>
                    <p className="text-lg sm:text-elder-xl font-black text-business">₹{total.toLocaleString("en-IN")}</p>
                  </div>
                  {data.business.income > 0 && (
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm sm:text-elder font-bold text-muted-foreground">{t("remainingBalance", lang)}</span>
                      <p className={`text-lg sm:text-elder-xl font-black ${data.business.income - total >= 0 ? "text-primary" : "text-destructive"}`}>₹{(data.business.income - total).toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>
              );
            } else {
              const total = data.personal.reduce((s, e) => s + e.amount, 0);
              if (data.personal.length === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <p className="font-black text-base sm:text-elder-lg text-foreground mb-4 sm:mb-5">{displayDate}</p>
                  <div className="space-y-1">
                    {data.personal.map((e, i) => (
                      <div key={e.id} className="flex justify-between text-sm sm:text-elder py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-muted/30 transition-colors gap-2">
                        <span className="font-semibold truncate">{i + 1}. {e.purpose || "—"} {e.quantity && <span className="text-muted-foreground">({e.quantity})</span>}</span>
                        <span className="font-black text-personal whitespace-nowrap">₹{e.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t-2 border-personal/15 flex justify-between items-center">
                    <span className="text-sm sm:text-elder font-bold text-muted-foreground">{t("totalSpentToday", lang)}</span>
                    <p className="text-lg sm:text-elder-xl font-black text-personal">₹{total.toLocaleString("en-IN")}</p>
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
