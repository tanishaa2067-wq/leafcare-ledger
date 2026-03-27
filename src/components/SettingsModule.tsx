import { ArrowLeft, Sun, Moon } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Props {
  lang: Language;
  theme: "light" | "dark";
  onBack: () => void;
  onToggleTheme: () => void;
}

export default function SettingsModule({ lang, theme, onBack, onToggleTheme }: Props) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl sm:rounded-2xl h-10 w-10 sm:h-12 sm:w-12 hover:bg-settings-light shrink-0">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
        <h2 className="text-lg sm:text-elder-2xl font-black text-foreground">{t("settingsLabel", lang)}</h2>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl shadow-card p-6 sm:p-10 border border-border/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-settings-light flex items-center justify-center shrink-0">
              {theme === "light" ? <Sun className="w-5 h-5 sm:w-7 sm:h-7 text-accent" /> : <Moon className="w-5 h-5 sm:w-7 sm:h-7 text-records" />}
            </div>
            <div className="min-w-0">
              <p className="font-black text-base sm:text-elder-lg text-foreground">{t("theme", lang)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5 sm:mt-1">{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={onToggleTheme} className="scale-110 sm:scale-125 shrink-0" />
        </div>
      </div>
    </div>
  );
}
