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
      <div key={current} className="flex flex-col items-center text-center animate-fade-in-up max-w-md px-4">
        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-[2rem] ${screen.bg} flex items-center justify-center mb-8 sm:mb-10`}>
          <screen.icon className={`w-12 h-12 sm:w-16 sm:h-16 ${screen.color}`} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl sm:text-elder-2xl font-black text-foreground mb-3 sm:mb-4 leading-tight">
          {screen.title}
        </h2>
        <p className="text-sm sm:text-elder text-muted-foreground font-semibold">
          {screen.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-10 sm:mt-12">
        {screens.map((_, i) => (
          <div
            key={i}
            className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
              i === current ? "w-7 sm:w-8 bg-primary" : "w-2.5 sm:w-3 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 sm:gap-4 mt-10 sm:mt-12 w-full max-w-sm px-4">
        {!isLast && (
          <Button variant="ghost" size="lg" onClick={onDone} className="flex-1 text-muted-foreground font-bold rounded-xl sm:rounded-2xl h-12 text-sm sm:text-base">
            Skip
          </Button>
        )}
        <Button
          size="lg"
          onClick={() => (isLast ? onDone() : setCurrent(c => c + 1))}
          className="flex-1 rounded-xl sm:rounded-2xl font-black text-sm sm:text-elder gap-2 h-12"
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </div>
  );
}
