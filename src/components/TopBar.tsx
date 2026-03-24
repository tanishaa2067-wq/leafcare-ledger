import { Leaf } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  lang: Language;
  onToggleLang: () => void;
}

export default function TopBar({ lang, onToggleLang }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2.5">
        <Leaf className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-elder-xl font-extrabold text-foreground leading-none">
            LeafLedger
          </h1>
          <p className="text-sm text-muted-foreground font-semibold">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleLang}
        className="font-bold text-sm px-4"
      >
        {lang === "en" ? "தமிழ்" : "English"}
      </Button>
    </header>
  );
}
