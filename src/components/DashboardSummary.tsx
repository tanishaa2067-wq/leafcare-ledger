import { Wallet, Briefcase, ShoppingBag } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import { getGlobalSummary } from "@/lib/storage";

interface Props {
  lang: Language;
}

const cards = [
  {
    key: "totalBalance" as const,
    icon: Wallet,
    colorClass: "text-primary",
    bgClass: "bg-primary/8",
    borderClass: "border-primary/15",
    getValue: (s: ReturnType<typeof getGlobalSummary>) => s.totalBalance,
  },
  {
    key: "totalPaidSummary" as const,
    icon: Briefcase,
    colorClass: "text-business",
    bgClass: "bg-business-light",
    borderClass: "border-business/15",
    getValue: (s: ReturnType<typeof getGlobalSummary>) => s.totalPaid,
  },
  {
    key: "totalSpentSummary" as const,
    icon: ShoppingBag,
    colorClass: "text-personal",
    bgClass: "bg-personal-light",
    borderClass: "border-personal/15",
    getValue: (s: ReturnType<typeof getGlobalSummary>) => s.totalSpent,
  },
];

export default function DashboardSummary({ lang }: Props) {
  const summary = getGlobalSummary();

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5 sm:mb-8 animate-fade-in">
      {cards.map((card, i) => {
        const value = card.getValue(summary);
        return (
          <div
            key={card.key}
            className={`relative flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border ${card.borderClass} bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${card.bgClass} flex items-center justify-center shrink-0`}>
              <card.icon className={`w-4 h-4 sm:w-6 sm:h-6 ${card.colorClass}`} strokeWidth={1.8} />
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-[10px] sm:text-xs font-bold text-muted-foreground truncate">{t(card.key, lang)}</p>
              <p className={`text-sm sm:text-xl font-black ${card.colorClass} tracking-tight leading-none mt-0.5`}>
                ₹{value.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
