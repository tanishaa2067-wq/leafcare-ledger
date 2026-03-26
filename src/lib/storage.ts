import { format } from "date-fns";

export interface WorkerEntry {
  id: string;
  name: string;
  kgLeaves: number;
  ratePerKg: number;
}

export interface BusinessData {
  income: number;
  workers: WorkerEntry[];
}

export interface PersonalEntry {
  id: string;
  purpose: string;
  quantity: string;
  amount: number;
}

export interface DayData {
  business: BusinessData;
  personal: PersonalEntry[];
}

const STORAGE_KEY = "homebook_data";
const SETTINGS_KEY = "homebook_settings";

// Migration: move old leafledger data to new key
function migrateOldData() {
  const oldData = localStorage.getItem("leafledger_data");
  const oldSettings = localStorage.getItem("leafledger_settings");
  if (oldData && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, oldData);
  }
  if (oldSettings && !localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, oldSettings);
  }
}
migrateOldData();

function getAll(): Record<string, DayData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, DayData>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getDayData(date: Date): DayData {
  const all = getAll();
  const key = getDateKey(date);
  return all[key] || { business: { income: 0, workers: [] }, personal: [] };
}

export function saveDayData(date: Date, data: DayData) {
  const all = getAll();
  all[getDateKey(date)] = data;
  saveAll(all);
}

export function getAllDates(): string[] {
  return Object.keys(getAll()).sort().reverse();
}

export function getDayDataByKey(key: string): DayData {
  const all = getAll();
  return all[key] || { business: { income: 0, workers: [] }, personal: [] };
}

export function getGlobalSummary() {
  const all = getAll();
  let totalIncome = 0;
  let totalPaid = 0;
  let totalSpent = 0;
  for (const data of Object.values(all)) {
    totalIncome += data.business.income;
    totalPaid += data.business.workers.reduce((s, w) => s + w.kgLeaves * w.ratePerKg, 0);
    totalSpent += data.personal.reduce((s, e) => s + e.amount, 0);
  }
  return { totalIncome, totalPaid, totalSpent, totalBalance: totalIncome - totalPaid - totalSpent };
}

export interface Settings {
  theme: "light" | "dark";
  language: "en" | "ta";
}

export function getSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { theme: "light", language: "en" };
  } catch {
    return { theme: "light", language: "en" };
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
