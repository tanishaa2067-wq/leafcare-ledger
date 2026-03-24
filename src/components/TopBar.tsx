import { Leaf } from "lucide-react";
import { Language, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  lang: Language;
  onToggleLang: () => void;
}

export default function TopBar({ lang, onToggleLang }: TopBarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <Leaf className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-elder-2xl font-extrabold text-foreground leading-none">
            LeafLedger
          </h1>
          <p className="text-sm text-muted-foreground font-semibold mt-0.5">
            {t("subtitle", lang)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="lg"
        onClick={onToggleLang}
        className="font-bold text-elder px-6 rounded-xl"
      >
        {lang === "en" ? "தமிழ்" : "English"}
      </Button>
    </header>
  );
}
