import { useState } from "react";
import { ArrowLeft, CalendarIcon, Briefcase, Home, X } from "lucide-react";
import { format, parse, isToday, isYesterday } from "date-fns";
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

function formatDateLabel(dateKey: string): string {
  const d = parse(dateKey, "yyyy-MM-dd", new Date());
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "dd MMM yyyy");
}

export default function RecordsModule({ lang, onBack }: Props) {
  const [tab, setTab] = useState<"business" | "personal">("business");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

  const allDates = getAllDates();
  const filteredDates = filterDate
    ? allDates.filter(d => d === format(filterDate, "yyyy-MM-dd"))
    : allDates;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-9 w-9 sm:h-11 sm:w-11 hover:bg-records-light shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-base sm:text-xl font-black text-foreground flex-1 truncate">{t("records", lang)}</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="default" className="gap-1.5 rounded-xl text-xs sm:text-sm border-2 px-2.5 sm:px-4 h-9 sm:h-11 shrink-0">
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
      <div className="flex gap-2.5 sm:gap-3 mb-5 sm:mb-7">
        <Button
          variant={tab === "business" ? "default" : "outline"}
          size="default"
          onClick={() => setTab("business")}
          className={cn("flex-1 gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-10 sm:h-12 font-bold border-2 transition-all", tab === "business" && "bg-business text-primary-foreground hover:bg-business/90 border-business shadow-card")}
        >
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" /> {t("businessRecords", lang)}
        </Button>
        <Button
          variant={tab === "personal" ? "default" : "outline"}
          size="default"
          onClick={() => setTab("personal")}
          className={cn("flex-1 gap-1.5 sm:gap-2 rounded-xl text-xs sm:text-sm h-10 sm:h-12 font-bold border-2 transition-all", tab === "personal" && "bg-personal text-primary-foreground hover:bg-personal/90 border-personal shadow-card")}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" /> {t("personalRecords", lang)}
        </Button>
      </div>

      {/* Active Date Filter Badge */}
      {filterDate && (
        <Button variant="secondary" size="sm" className="mb-4 text-muted-foreground rounded-lg gap-1.5 font-bold text-xs" onClick={() => setFilterDate(undefined)}>
          {format(filterDate, "dd MMM yyyy")}
          <X className="w-3.5 h-3.5" />
        </Button>
      )}

      {/* Records */}
      {filteredDates.length === 0 ? (
        <div className="text-center py-12 sm:py-16 text-xs sm:text-sm text-muted-foreground bg-card rounded-xl sm:rounded-2xl shadow-card">
          {t("noRecordsYet", lang)}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredDates.map(dateKey => {
            const data = getDayDataByKey(dateKey);
            const label = formatDateLabel(dateKey);

            if (tab === "business") {
              const total = data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
              if (data.business.workers.length === 0 && data.business.income === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 mb-3 sm:mb-4">
                    <p className="font-black text-sm sm:text-base text-foreground">{label}</p>
                    <span className="text-[10px] sm:text-xs bg-business-light text-business px-2.5 py-1 rounded-lg font-bold self-start sm:self-auto">
                      {t("income", lang)}: ₹{data.business.income.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {data.business.workers.map((w, i) => (
                      <div key={w.id} className="flex justify-between text-xs sm:text-sm py-2 px-2.5 rounded-lg hover:bg-muted/30 transition-colors gap-2">
                        <span className="font-semibold truncate">{i + 1}. {w.name || "—"}</span>
                        <span className="font-bold text-business whitespace-nowrap">{w.kgLeaves}kg × ₹{w.ratePerKg} = <span className="font-black">₹{(w.kgLeaves * w.ratePerKg).toLocaleString("en-IN")}</span></span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-business/15 flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("totalPaid", lang)}</span>
                    <p className="text-sm sm:text-base font-black text-business">₹{total.toLocaleString("en-IN")}</p>
                  </div>
                  {data.business.income > 0 && (
                    <div className="mt-1.5 flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("remainingBalance", lang)}</span>
                      <p className={`text-sm sm:text-base font-black ${data.business.income - total >= 0 ? "text-primary" : "text-destructive"}`}>₹{(data.business.income - total).toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>
              );
            } else {
              const total = data.personal.reduce((s, e) => s + e.amount, 0);
              if (data.personal.length === 0) return null;
              return (
                <div key={dateKey} className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card border border-border/50 transition-all hover:shadow-card-hover">
                  <p className="font-black text-sm sm:text-base text-foreground mb-3 sm:mb-4">{label}</p>
                  <div className="space-y-0.5">
                    {data.personal.map((e, i) => (
                      <div key={e.id} className="flex justify-between text-xs sm:text-sm py-2 px-2.5 rounded-lg hover:bg-muted/30 transition-colors gap-2">
                        <span className="font-semibold truncate">{i + 1}. {e.purpose || "—"} {e.quantity && <span className="text-muted-foreground">({e.quantity})</span>}</span>
                        <span className="font-black text-personal whitespace-nowrap">₹{e.amount.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-personal/15 flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{t("totalSpentToday", lang)}</span>
                    <p className="text-sm sm:text-base font-black text-personal">₹{total.toLocaleString("en-IN")}</p>
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
