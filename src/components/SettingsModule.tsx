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
    <div className="px-6 py-6 md:px-10 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-extrabold text-foreground">{t("settingsLabel", lang)}</h2>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {theme === "light" ? <Sun className="w-7 h-7 text-accent" /> : <Moon className="w-7 h-7 text-records" />}
            <div>
              <p className="font-extrabold text-elder-lg text-foreground">{t("theme", lang)}</p>
              <p className="text-sm text-muted-foreground font-semibold">{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={onToggleTheme} />
        </div>
      </div>
    </div>
  );
}
