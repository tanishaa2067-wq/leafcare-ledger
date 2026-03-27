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
    <header className="flex items-center justify-between px-6 py-6 md:px-10 lg:px-16 border-b border-border/50 backdrop-blur-sm bg-card/60">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-card overflow-hidden">
          <img src={homebookLogo} alt="HomeBook" width={40} height={40} className="object-contain" />
        </div>
        <div>
          <h1 className="text-elder-2xl font-black text-foreground leading-none tracking-tight">
            HomeBook
          </h1>
          <p className="text-sm text-muted-foreground font-semibold mt-1">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleLang}
          className="font-bold text-elder px-6 rounded-2xl border-2 hover:bg-primary/5 transition-colors duration-200"
        >
          {lang === "en" ? "தமிழ்" : "English"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="rounded-2xl h-12 w-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
