import { useState } from "react";
import { BookOpen, BarChart3, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const screens = [
  {
    icon: BookOpen,
    title: "Track your daily expenses easily",
    subtitle: "உங்கள் தினசரி செலவுகளை எளிதாக கண்காணிக்கவும்",
    color: "text-business",
    bg: "bg-business-light",
  },
  {
    icon: BarChart3,
    title: "Manage both business & personal records",
    subtitle: "வணிகமும் தனிப்பட்ட பதிவுகளையும் நிர்வகிக்கவும்",
    color: "text-records",
    bg: "bg-records-light",
  },
  {
    icon: Lightbulb,
    title: "Get smart insights instantly",
    subtitle: "உடனடி புத்திசாலி தகவல்கள் பெறுங்கள்",
    color: "text-accent",
    bg: "bg-personal-light",
  },
];

interface Props {
  onDone: () => void;
}

export default function OnboardingScreens({ onDone }: Props) {
  const [current, setCurrent] = useState(0);
  const isLast = current === screens.length - 1;
  const screen = screens[current];

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background px-6">
      <div key={current} className="flex flex-col items-center text-center animate-fade-in-up max-w-sm px-4">
        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${screen.bg} flex items-center justify-center mb-6 sm:mb-8`}>
          <screen.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${screen.color}`} strokeWidth={1.5} />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-foreground mb-2.5 leading-tight">
          {screen.title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
          {screen.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-2.5 mt-8 sm:mt-10">
        {screens.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 mt-8 sm:mt-10 w-full max-w-xs px-4">
        {!isLast && (
          <Button variant="ghost" size="default" onClick={onDone} className="flex-1 text-muted-foreground font-bold rounded-xl h-11 text-xs sm:text-sm">
            Skip
          </Button>
        )}
        <Button
          size="default"
          onClick={() => (isLast ? onDone() : setCurrent(c => c + 1))}
          className="flex-1 rounded-xl font-black text-xs sm:text-sm gap-1.5 h-11 active:scale-95 transition-transform"
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
