import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import homebookLogo from "@/assets/homebook-logo.png";

const USERS_KEY = "homebook_users";
const SESSION_KEY = "homebook_session";

function getUsers(): Record<string, { email: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

interface Props {
  onAuth: () => void;
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const { toast } = useToast();

  const validate = (): string | null => {
    if (mode === "signup") {
      if (!username.trim() || !email.trim() || !password || !confirmPassword) {
        return "Please enter all details (அனைத்து விவரங்களையும் உள்ளிடவும்)";
      }
      if (password !== confirmPassword) {
        return "Passwords do not match (கடவுச்சொற்கள் பொருந்தவில்லை)";
      }
      if (password.length < 4) {
        return "Password must be at least 4 characters";
      }
    } else {
      if (!username.trim() || !password) {
        return "Please enter all details (அனைத்து விவரங்களையும் உள்ளிடவும்)";
      }
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validate();
    if (error) {
      toast({ title: "⚠️ " + error, variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();

      if (mode === "signup") {
        if (users[username.trim()]) {
          toast({ title: "⚠️ Username already exists", variant: "destructive" });
          setLoading(false);
          return;
        }
        users[username.trim()] = { email: email.trim(), password };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(SESSION_KEY, username.trim());
        toast({ title: "✅ Account created successfully! (கணக்கு உருவாக்கப்பட்டது)" });
        onAuth();
      } else {
        const user = users[username.trim()];
        if (!user || user.password !== password) {
          toast({ title: "⚠️ Invalid credentials (தவறான சான்றுகள்)", variant: "destructive" });
          setLoading(false);
          return;
        }
        if (remember) {
          localStorage.setItem(SESSION_KEY, username.trim());
        } else {
          sessionStorage.setItem(SESSION_KEY, username.trim());
        }
        toast({ title: "✅ Welcome back! (மீண்டும் வரவேற்கிறோம்)" });
        onAuth();
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center shadow-card mb-4 overflow-hidden">
            <img src={homebookLogo} alt="HomeBook" width={52} height={52} className="object-contain" />
          </div>
          <h1 className="text-elder-2xl font-black text-foreground">HomeBook</h1>
          <p className="text-muted-foreground font-semibold mt-1">
            {mode === "login" ? "Welcome back (மீண்டும் வரவேற்கிறோம்)" : "Create your account (கணக்கை உருவாக்கவும்)"}
          </p>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-8 border border-border/50 space-y-5">
          <div>
            <label className="text-sm font-bold text-muted-foreground mb-2 block">Username (பயனர் பெயர்)</label>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              className="h-12 rounded-2xl text-elder font-semibold"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Email (மின்னஞ்சல்)</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email"
                className="h-12 rounded-2xl text-elder font-semibold"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-bold text-muted-foreground mb-2 block">Password (கடவுச்சொல்)</label>
            <div className="relative">
              <Input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 rounded-2xl text-elder font-semibold pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-sm font-bold text-muted-foreground mb-2 block">Confirm Password (கடவுச்சொல் உறுதிப்படுத்தவும்)</label>
              <Input
                type={showPw ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="h-12 rounded-2xl text-elder font-semibold"
              />
            </div>
          )}

          {mode === "login" && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="w-5 h-5 rounded accent-primary"
              />
              <span className="text-sm font-semibold text-muted-foreground">Remember me (என்னை நினைவில் கொள்)</span>
            </label>
          )}

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-2xl font-black text-elder h-14"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "login" ? "Login (உள்நுழைய)" : "Sign Up (பதிவு செய்ய)"}
          </Button>

          <p className="text-center text-sm font-semibold text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setPassword(""); setConfirmPassword(""); }}
              className="text-primary font-bold hover:underline"
            >
              {mode === "login" ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
