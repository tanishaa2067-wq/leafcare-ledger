import { Briefcase, Home, BarChart3, Settings } from "lucide-react";
import { Language, t } from "@/lib/i18n";

interface DashboardProps {
  lang: Language;
  onNavigate: (view: string) => void;
}

const cards = [
  {
    id: "business",
    icon: Briefcase,
    titleKey: "businessAccount" as const,
    subtitleKey: "manageBusiness" as const,
    colorClass: "bg-business-light text-business",
    borderColor: "border-business/20",
  },
  {
    id: "personal",
    icon: Home,
    titleKey: "personalSpending" as const,
    subtitleKey: "managePersonal" as const,
    colorClass: "bg-personal-light text-personal",
    borderColor: "border-personal/20",
  },
  {
    id: "records",
    icon: BarChart3,
    titleKey: "records" as const,
    subtitleKey: "viewRecords" as const,
    colorClass: "bg-records-light text-records",
    borderColor: "border-records/20",
  },
  {
    id: "settings",
    icon: Settings,
    titleKey: "settingsLabel" as const,
    subtitleKey: "manageSettings" as const,
    colorClass: "bg-settings-light text-settings",
    borderColor: "border-settings/20",
  },
];

export default function Dashboard({ lang, onNavigate }: DashboardProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-5 max-w-lg mx-auto">
      {cards.map((card, i) => (
        <button
          key={card.id}
          onClick={() => onNavigate(card.id)}
          className={`group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border ${card.borderColor} bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.03] active:scale-[0.98] animate-fade-in`}
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.colorClass}`}>
            <card.icon className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-elder text-foreground">{t(card.titleKey, lang)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t(card.subtitleKey, lang)}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
