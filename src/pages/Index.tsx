import { useState, useEffect, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import OnboardingScreens from "@/components/OnboardingScreens";
import AuthScreen, { getSession, clearSession } from "@/components/AuthScreen";
import TopBar from "@/components/TopBar";
import Dashboard from "@/components/Dashboard";
import BusinessModule from "@/components/BusinessModule";
import PersonalModule from "@/components/PersonalModule";
import RecordsModule from "@/components/RecordsModule";
import SettingsModule from "@/components/SettingsModule";
import { getSettings, saveSettings, type Settings } from "@/lib/storage";
import type { Language } from "@/lib/i18n";

const ONBOARDED_KEY = "homebook_onboarded";

export default function Index() {
  const [phase, setPhase] = useState<"splash" | "onboarding" | "auth" | "app">("splash");
  const [view, setView] = useState("dashboard");
  const [settings, setSettings] = useState<Settings>(getSettings);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    saveSettings(settings);
  }, [settings]);

  // After splash, determine next phase
  const handleSplashDone = useCallback(() => {
    const onboarded = localStorage.getItem(ONBOARDED_KEY);
    const session = getSession();
    if (!onboarded) {
      setPhase("onboarding");
    } else if (!session) {
      setPhase("auth");
    } else {
      setPhase("app");
    }
  }, []);

  const handleOnboardingDone = useCallback(() => {
    localStorage.setItem(ONBOARDED_KEY, "true");
    const session = getSession();
    setPhase(session ? "app" : "auth");
  }, []);

  const handleAuth = useCallback(() => {
    setPhase("app");
  }, []);

  const handleLogout = useCallback(() => {
    clearSession();
    setView("dashboard");
    setPhase("auth");
  }, []);

  const toggleLang = useCallback(() => {
    setSettings(s => ({ ...s, language: s.language === "en" ? "ta" : "en" }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }));
  }, []);

  if (phase === "splash") {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  if (phase === "onboarding") {
    return <OnboardingScreens onDone={handleOnboardingDone} />;
  }

  if (phase === "auth") {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen">
      <TopBar lang={settings.language} onToggleLang={toggleLang} onLogout={handleLogout} />
      <div key={view} className="animate-fade-in-up">
        {view === "dashboard" && <Dashboard lang={settings.language} onNavigate={setView} />}
        {view === "business" && <BusinessModule lang={settings.language} onBack={() => setView("dashboard")} />}
        {view === "personal" && <PersonalModule lang={settings.language} onBack={() => setView("dashboard")} />}
        {view === "records" && <RecordsModule lang={settings.language} onBack={() => setView("dashboard")} />}
        {view === "settings" && <SettingsModule lang={settings.language} theme={settings.theme} onBack={() => setView("dashboard")} onToggleTheme={toggleTheme} />}
      </div>
    </div>
  );
}
