import { useEffect, useState } from "react";
import homebookLogo from "@/assets/homebook-logo.png";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1400);
    const t2 = setTimeout(() => { setShow(false); onDone(); }, 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-all duration-500 px-6 ${fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 animate-fade-in">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm overflow-hidden">
          <img src={homebookLogo} alt="HomeBook" className="w-8 h-8 sm:w-11 sm:h-11 object-contain brightness-0 invert" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-primary-foreground tracking-tight">
          HomeBook
        </h1>
      </div>
      <p className="text-sm sm:text-lg text-primary-foreground/80 font-bold animate-fade-in" style={{ animationDelay: "0.2s" }}>
        வீட்டு நிதி மேலாளர்
      </p>
      <p className="text-[10px] sm:text-xs text-primary-foreground/50 font-semibold animate-fade-in mt-1.5" style={{ animationDelay: "0.4s" }}>
        Home Finance Manager
      </p>
      <div className="flex gap-1.5 mt-6 sm:mt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-foreground/40 animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
