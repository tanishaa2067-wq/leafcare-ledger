import { Language, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import homebookLogo from "@/assets/homebook-logo.png";

interface TopBarProps {
  lang: Language;
  onToggleLang: () => void;
  onLogout: () => void;
}

export default function TopBar({ lang, onToggleLang, onLogout }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-10 lg:px-16 border-b border-border/50 backdrop-blur-sm bg-card/60 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shadow-card overflow-hidden shrink-0">
          <img src={homebookLogo} alt="HomeBook" className="w-7 h-7 sm:w-10 sm:h-10 object-contain" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-elder-2xl font-black text-foreground leading-none tracking-tight truncate">
            HomeBook
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5 sm:mt-1 truncate">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="default"
          onClick={onToggleLang}
          className="font-bold text-sm sm:text-elder px-3 sm:px-6 rounded-xl sm:rounded-2xl border-2 hover:bg-primary/5 transition-colors duration-200 h-9 sm:h-11"
        >
          {lang === "en" ? "தமிழ்" : "EN"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="rounded-xl sm:rounded-2xl h-9 w-9 sm:h-12 sm:w-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </header>
  );
}
