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
    subtitleTaKey: "manageBusinessTa" as const,
    tamilKey: "businessAccountTa" as const,
    colorClass: "bg-business-light text-business",
    borderColor: "border-business/20",
    hoverBorder: "hover:border-business/40",
  },
  {
    id: "personal",
    icon: Home,
    titleKey: "personalSpending" as const,
    subtitleKey: "managePersonal" as const,
    subtitleTaKey: "managePersonalTa" as const,
    tamilKey: "personalSpendingTa" as const,
    colorClass: "bg-personal-light text-personal",
    borderColor: "border-personal/20",
    hoverBorder: "hover:border-personal/40",
  },
  {
    id: "records",
    icon: BarChart3,
    titleKey: "records" as const,
    subtitleKey: "viewRecords" as const,
    subtitleTaKey: "viewRecordsTa" as const,
    tamilKey: "recordsTa" as const,
    colorClass: "bg-records-light text-records",
    borderColor: "border-records/20",
    hoverBorder: "hover:border-records/40",
  },
  {
    id: "settings",
    icon: Settings,
    titleKey: "settingsLabel" as const,
    subtitleKey: "manageSettings" as const,
    subtitleTaKey: "manageSettingsTa" as const,
    tamilKey: "settingsTa" as const,
    colorClass: "bg-settings-light text-settings",
    borderColor: "border-settings/20",
    hoverBorder: "hover:border-settings/40",
  },
];

export default function Dashboard({ lang, onNavigate }: DashboardProps) {
  return (
    <div className="px-6 py-8 md:px-10 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group flex flex-col items-center justify-center gap-4 p-8 md:p-10 rounded-2xl border-2 ${card.borderColor} ${card.hoverBorder} bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:scale-[1.03] active:scale-[0.98] animate-fade-in`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${card.colorClass}`}>
              <card.icon className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-extrabold text-elder-xl text-foreground">{t(card.titleKey, lang)}</p>
              <p className="text-sm text-muted-foreground font-semibold">({t(card.tamilKey, lang)})</p>
              <p className="text-xs text-muted-foreground mt-1">{t(card.subtitleKey, lang)}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
