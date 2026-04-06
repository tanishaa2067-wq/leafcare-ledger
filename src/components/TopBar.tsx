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
    <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 lg:px-16 border-b border-border/50 backdrop-blur-sm bg-card/60 gap-2">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shadow-card overflow-hidden shrink-0">
          <img src={homebookLogo} alt="HomeBook" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black text-foreground leading-none tracking-tight truncate">
            HomeBook
          </h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold mt-0.5 truncate">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLang}
          className="font-bold text-xs sm:text-sm px-2.5 sm:px-4 rounded-lg sm:rounded-xl border-2 hover:bg-primary/5 transition-colors h-8 sm:h-9"
        >
          {lang === "en" ? "தமிழ்" : "EN"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
