import { useState, useEffect, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import TopBar from "@/components/TopBar";
import Dashboard from "@/components/Dashboard";
import BusinessModule from "@/components/BusinessModule";
import PersonalModule from "@/components/PersonalModule";
import RecordsModule from "@/components/RecordsModule";
import SettingsModule from "@/components/SettingsModule";
import { getSettings, saveSettings, type Settings } from "@/lib/storage";
import type { Language } from "@/lib/i18n";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState("dashboard");
  const [settings, setSettings] = useState<Settings>(getSettings);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    saveSettings(settings);
  }, [settings]);

  const toggleLang = useCallback(() => {
    setSettings(s => ({ ...s, language: s.language === "en" ? "ta" : "en" }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(s => ({ ...s, theme: s.theme === "light" ? "dark" : "light" }));
  }, []);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen">
      <TopBar lang={settings.language} onToggleLang={toggleLang} />
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
