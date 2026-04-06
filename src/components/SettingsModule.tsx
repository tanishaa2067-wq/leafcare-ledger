import { ArrowLeft, Sun, Moon, Info } from "lucide-react";
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
    <div className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2.5 mb-6 sm:mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl h-9 w-9 sm:h-11 sm:w-11 hover:bg-settings-light shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-base sm:text-xl font-black text-foreground">{t("settingsLabel", lang)}</h2>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Theme Toggle */}
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 border border-border/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-settings-light flex items-center justify-center shrink-0">
                {theme === "light" ? <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-accent" /> : <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-records" />}
              </div>
              <div className="min-w-0">
                <p className="font-black text-sm sm:text-base text-foreground">{t("theme", lang)}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5">{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={onToggleTheme} className="shrink-0" />
          </div>
        </div>

        {/* App Info */}
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-card p-4 sm:p-6 border border-border/50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm sm:text-base text-foreground">HomeBook</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5">v1.0 — Home Finance Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
