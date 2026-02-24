// localStorage wrapper for MindMesh data

export interface UserProfile {
  name: string;
  primaryGoal: 'MOOD' | 'MEDICATION' | 'FITNESS' | 'STRESS';
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  sentimentScore: number;
  emotionLabel: string;
  riskFlag: boolean;
  createdAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequencyPerDay: number;
  reminderTime: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenDate: string;
  taken: boolean;
}

export interface FitnessLog {
  id: string;
  logDate: string;
  activityCompleted: boolean;
  steps: number;
  minutesExercised: number;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
}

const KEYS = {
  PROFILE: 'mindmesh_profile',
  JOURNALS: 'mindmesh_journals',
  MEDICATIONS: 'mindmesh_medications',
  MED_LOGS: 'mindmesh_med_logs',
  FITNESS: 'mindmesh_fitness',
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Profile
export const getProfile = (): UserProfile | null => get(KEYS.PROFILE, null);
export const setProfile = (p: UserProfile) => set(KEYS.PROFILE, p);

// Journal
export const getJournals = (): JournalEntry[] => get(KEYS.JOURNALS, []);
export const addJournal = (entry: JournalEntry) => {
  const entries = getJournals();
  entries.unshift(entry);
  set(KEYS.JOURNALS, entries);
};

// Medications
export const getMedications = (): Medication[] => get(KEYS.MEDICATIONS, []);
export const addMedication = (med: Medication) => {
  const meds = getMedications();
  meds.push(med);
  set(KEYS.MEDICATIONS, meds);
};
export const removeMedication = (id: string) => {
  set(KEYS.MEDICATIONS, getMedications().filter(m => m.id !== id));
  set(KEYS.MED_LOGS, getMedLogs().filter(l => l.medicationId !== id));
};

// Medication Logs
export const getMedLogs = (): MedicationLog[] => get(KEYS.MED_LOGS, []);
export const addMedLog = (log: MedicationLog) => {
  const logs = getMedLogs();
  logs.push(log);
  set(KEYS.MED_LOGS, logs);
};

// Fitness
export const getFitnessLogs = (): FitnessLog[] => get(KEYS.FITNESS, []);
export const addFitnessLog = (log: FitnessLog) => {
  const logs = getFitnessLogs();
  logs.push(log);
  set(KEYS.FITNESS, logs);
};

export const generateId = () => Math.random().toString(36).substring(2, 10);
