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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 animate-fade-in">
      {cards.map((card, i) => {
        const value = card.getValue(summary);
        return (
          <div
            key={card.key}
            className={`relative flex items-center gap-5 p-7 rounded-[1.25rem] border-2 ${card.borderClass} bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bgClass} flex items-center justify-center shrink-0`}>
              <card.icon className={`w-7 h-7 ${card.colorClass}`} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-muted-foreground truncate">{t(card.key, lang)}</p>
              <p className={`text-elder-2xl font-black ${card.colorClass} tracking-tight leading-none mt-1`}>
                ₹{value.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
