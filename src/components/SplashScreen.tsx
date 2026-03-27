import { useEffect, useState } from "react";
import homebookLogo from "@/assets/homebook-logo.png";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => { setShow(false); onDone(); }, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-all duration-500 px-6 ${fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
    >
      <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8 animate-fade-in">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <img src={homebookLogo} alt="HomeBook" className="w-10 h-10 sm:w-14 sm:h-14 object-contain brightness-0 invert" />
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-primary-foreground tracking-tight">
          HomeBook
        </h1>
      </div>
      <p className="text-base sm:text-elder-xl text-primary-foreground/80 font-bold animate-fade-in" style={{ animationDelay: "0.2s" }}>
        வீட்டு நிதி மேலாளர்
      </p>
      <p className="text-xs sm:text-sm text-primary-foreground/50 font-semibold animate-fade-in mt-2 sm:mt-3" style={{ animationDelay: "0.4s" }}>
        Home Finance Manager
      </p>
      <div className="flex gap-2 mt-8 sm:mt-10 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary-foreground/40 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
