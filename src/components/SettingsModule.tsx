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
    <div className="p-5 max-w-lg mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-elder-xl font-bold text-foreground">{t("settingsLabel", lang)}</h2>
      </div>

      <div className="bg-card rounded-xl shadow-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "light" ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-records" />}
            <div>
              <p className="font-bold text-foreground">{t("theme", lang)}</p>
              <p className="text-xs text-muted-foreground">{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}
