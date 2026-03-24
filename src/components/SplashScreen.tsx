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
      <div className="flex items-center gap-3 mb-4 animate-fade-in">
        <Leaf className="w-14 h-14 text-primary-foreground" />
        <h1 className="text-elder-2xl font-extrabold text-primary-foreground tracking-tight">
          LeafLedger
        </h1>
      </div>
      <p className="text-primary-foreground/80 text-elder font-semibold animate-fade-in" style={{ animationDelay: "0.2s" }}>
        தேயிலை தோட்ட நிதி மேலாளர்
      </p>
    </div>
  );
}
