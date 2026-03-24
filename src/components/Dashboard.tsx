import { Briefcase, Home, BarChart3, Settings, ChevronRight } from "lucide-react";
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
    tamilKey: "businessAccountTa" as const,
    colorClass: "bg-business-light text-business",
    borderColor: "border-business/20",
    hoverBorder: "hover:border-business/50",
    accentGradient: "from-business/5 to-transparent",
  },
  {
    id: "personal",
    icon: Home,
    titleKey: "personalSpending" as const,
    subtitleKey: "managePersonal" as const,
    tamilKey: "personalSpendingTa" as const,
    colorClass: "bg-personal-light text-personal",
    borderColor: "border-personal/20",
    hoverBorder: "hover:border-personal/50",
    accentGradient: "from-personal/5 to-transparent",
  },
  {
    id: "records",
    icon: BarChart3,
    titleKey: "records" as const,
    subtitleKey: "viewRecords" as const,
    tamilKey: "recordsTa" as const,
    colorClass: "bg-records-light text-records",
    borderColor: "border-records/20",
    hoverBorder: "hover:border-records/50",
    accentGradient: "from-records/5 to-transparent",
  },
  {
    id: "settings",
    icon: Settings,
    titleKey: "settingsLabel" as const,
    subtitleKey: "manageSettings" as const,
    tamilKey: "settingsTa" as const,
    colorClass: "bg-settings-light text-settings",
    borderColor: "border-settings/20",
    hoverBorder: "hover:border-settings/50",
    accentGradient: "from-settings/5 to-transparent",
  },
];

export default function Dashboard({ lang, onNavigate }: DashboardProps) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group relative flex flex-col items-center justify-center gap-5 p-10 md:p-12 rounded-3xl border-2 ${card.borderColor} ${card.hoverBorder} bg-card shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.98] animate-fade-in overflow-hidden`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Subtle gradient accent */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.accentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center ${card.colorClass} transition-transform duration-300 group-hover:scale-110`}>
              <card.icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.8} />
            </div>
            <div className="relative text-center space-y-1.5">
              <p className="font-extrabold text-elder-xl md:text-elder-2xl text-foreground">{t(card.titleKey, lang)}</p>
              <p className="text-sm md:text-base text-muted-foreground font-semibold">({t(card.tamilKey, lang)})</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
                {t(card.subtitleKey, lang)}
                <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
