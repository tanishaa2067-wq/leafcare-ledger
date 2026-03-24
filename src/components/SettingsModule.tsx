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
    <div className="px-6 py-8 md:px-10 lg:px-16 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-2xl h-12 w-12 hover:bg-settings-light">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-elder-2xl font-black text-foreground">{t("settingsLabel", lang)}</h2>
      </div>

      <div className="bg-card rounded-3xl shadow-card p-10 border border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-settings-light flex items-center justify-center">
              {theme === "light" ? <Sun className="w-7 h-7 text-accent" /> : <Moon className="w-7 h-7 text-records" />}
            </div>
            <div>
              <p className="font-black text-elder-lg text-foreground">{t("theme", lang)}</p>
              <p className="text-sm text-muted-foreground font-semibold mt-1">{theme === "light" ? t("lightMode", lang) : t("darkMode", lang)}</p>
            </div>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={onToggleTheme} className="scale-125" />
        </div>
      </div>
    </div>
  );
}
