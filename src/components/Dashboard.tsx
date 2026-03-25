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
    glowColor: "hover:shadow-[0_8px_40px_-8px_hsl(var(--business)/0.25)]",
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
    glowColor: "hover:shadow-[0_8px_40px_-8px_hsl(var(--personal)/0.25)]",
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
    glowColor: "hover:shadow-[0_8px_40px_-8px_hsl(var(--records)/0.25)]",
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
    glowColor: "hover:shadow-[0_8px_40px_-8px_hsl(var(--settings)/0.25)]",
  },
];

export default function Dashboard({ lang, onNavigate }: DashboardProps) {
  return (
    <div className="px-6 py-10 md:px-10 lg:px-16 max-w-5xl mx-auto">
      <DashboardSummary lang={lang} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group relative flex flex-col items-center justify-center gap-6 p-12 md:p-14 rounded-[1.75rem] border-2 ${card.borderColor} ${card.hoverBorder} bg-card shadow-[0_6px_28px_-6px_hsl(var(--foreground)/0.1)] transition-all duration-400 ease-out ${card.glowColor} hover:scale-[1.04] hover:-translate-y-2 active:scale-[0.97] animate-fade-in overflow-hidden`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Always-visible subtle gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-400`} />

            {/* Secondary radial glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.04),transparent_70%)]" />

            <div className={`relative w-24 h-24 md:w-28 md:h-28 rounded-[1.25rem] flex items-center justify-center ${card.colorClass} transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg`}>
              <card.icon className="w-12 h-12 md:w-14 md:h-14" strokeWidth={1.6} />
            </div>
            <div className="relative text-center space-y-2">
              <p className="font-black text-elder-xl md:text-elder-2xl text-foreground tracking-tight">{t(card.titleKey, lang)}</p>
              <p className="text-base md:text-lg text-muted-foreground font-bold">({t(card.tamilKey, lang)})</p>
              <p className="text-sm md:text-base text-muted-foreground mt-3 flex items-center justify-center gap-1.5 font-semibold">
                {t(card.subtitleKey, lang)}
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400" />
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
