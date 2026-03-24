import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(onDone, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary transition-opacity duration-400 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <Leaf className="w-16 h-16 text-primary-foreground" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight">
          LeafLedger
        </h1>
      </div>
      <p className="text-primary-foreground/80 text-elder-lg font-semibold animate-fade-in" style={{ animationDelay: "0.2s" }}>
        தேயிலை தோட்ட நிதி மேலாளர்
      </p>
      <p className="text-primary-foreground/60 text-sm font-semibold animate-fade-in mt-2" style={{ animationDelay: "0.4s" }}>
        Tea Plantation Finance Manager
      </p>
    </div>
  );
}
