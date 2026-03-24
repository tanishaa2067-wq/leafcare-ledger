import { Leaf } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  lang: Language;
  onToggleLang: () => void;
}

export default function TopBar({ lang, onToggleLang }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-10 lg:px-16 border-b border-border/50 backdrop-blur-sm bg-card/60">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-card">
          <Leaf className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-elder-2xl font-black text-foreground leading-none tracking-tight">
            LeafLedger
          </h1>
          <p className="text-sm text-muted-foreground font-semibold mt-1">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={onToggleLang}
        className="font-bold text-elder px-6 rounded-2xl border-2 hover:bg-primary/5 transition-colors duration-200"
      >
        {lang === "en" ? "தமிழ்" : "English"}
      </Button>
    </header>
  );
}
