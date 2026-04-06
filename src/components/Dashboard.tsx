import { Briefcase, Home, BarChart3, Settings, ChevronRight } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import DashboardSummary from "@/components/DashboardSummary";

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
    hoverBorder: "hover:border-business/40",
    gradient: "from-business/8 via-business/3 to-transparent",
    glowColor: "hover:shadow-[0_8px_30px_-8px_hsl(var(--business)/0.2)]",
  },
  {
    id: "personal",
    icon: Home,
    titleKey: "personalSpending" as const,
    subtitleKey: "managePersonal" as const,
    tamilKey: "personalSpendingTa" as const,
    colorClass: "bg-personal-light text-personal",
    borderColor: "border-personal/20",
    hoverBorder: "hover:border-personal/40",
    gradient: "from-personal/8 via-personal/3 to-transparent",
    glowColor: "hover:shadow-[0_8px_30px_-8px_hsl(var(--personal)/0.2)]",
  },
  {
    id: "records",
    icon: BarChart3,
    titleKey: "records" as const,
    subtitleKey: "viewRecords" as const,
    tamilKey: "recordsTa" as const,
    colorClass: "bg-records-light text-records",
    borderColor: "border-records/20",
    hoverBorder: "hover:border-records/40",
    gradient: "from-records/8 via-records/3 to-transparent",
    glowColor: "hover:shadow-[0_8px_30px_-8px_hsl(var(--records)/0.2)]",
  },
  {
    id: "settings",
    icon: Settings,
    titleKey: "settingsLabel" as const,
    subtitleKey: "manageSettings" as const,
    tamilKey: "settingsTa" as const,
    colorClass: "bg-settings-light text-settings",
    borderColor: "border-settings/20",
    hoverBorder: "hover:border-settings/40",
    gradient: "from-settings/8 via-settings/3 to-transparent",
    glowColor: "hover:shadow-[0_8px_30px_-8px_hsl(var(--settings)/0.2)]",
  },
];

export default function Dashboard({ lang, onNavigate }: DashboardProps) {
  return (
    <div className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-5xl mx-auto">
      <DashboardSummary lang={lang} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group relative flex flex-col items-center justify-center gap-2.5 sm:gap-5 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[1.5rem] border-2 ${card.borderColor} ${card.hoverBorder} bg-card shadow-card transition-all duration-300 ease-out ${card.glowColor} hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.97] animate-fade-in overflow-hidden`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className={`relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center ${card.colorClass} transition-all duration-300 group-hover:scale-110`}>
              <card.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" strokeWidth={1.6} />
            </div>
            <div className="relative text-center space-y-0.5 sm:space-y-1.5">
              <p className="font-black text-[13px] leading-tight sm:text-base md:text-lg text-foreground tracking-tight">{t(card.titleKey, lang)}</p>
              <p className="text-[10px] sm:text-sm md:text-base text-muted-foreground font-bold hidden sm:block">({t(card.tamilKey, lang)})</p>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center justify-center gap-1 font-semibold">
                {t(card.subtitleKey, lang)}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
