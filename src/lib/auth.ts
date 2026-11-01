export type UserRole = "patient" | "doctor" | "admin" | "nurse";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  diet?: string;
  goals?: string[];
  language?: string;
}

export const MOCK_USERS: Record<string, { user: UserProfile; password: string; redirect: string }> = {
  "patient@aethriz.com": {
    user: {
      id: "usr-pat-01",
      name: "Priyadarshini Mishra",
      email: "patient@aethriz.com",
      phone: "+91 98765 43210",
      role: "patient",
      diet: "Vegetarian",
      goals: ["Blood sugar", "Heart health"],
      language: "English",
    },
    password: "patient123",
    redirect: "/dashboard",
  },
  "doctor@aethriz.com": {
    user: {
      id: "doc-arv-01",
      name: "Dr. Arvind Swaminathan, MD",
      email: "doctor@aethriz.com",
      phone: "+91 98111 22334",
      role: "doctor",
      specialty: "Interventional Cardiology & Preventive AI",
      language: "English",
    },
    password: "doctor123",
    redirect: "/doctor-portal",
  },
  "admin@aethriz.com": {
    user: {
      id: "adm-aeth-01",
      name: "AETHRIZ Clinical Operations",
      email: "admin@aethriz.com",
      phone: "+91 99000 11223",
      role: "admin",
      language: "English",
    },
    password: "admin123",
    redirect: "/admin",
  },
  "nurse@aethriz.com": {
    user: {
      id: "nur-ana-01",
      name: "Ananya Das, RN",
      email: "nurse@aethriz.com",
      phone: "+91 97654 32109",
      role: "nurse",
      specialty: "Triage & Vitals Monitoring",
      language: "English",
    },
    password: "nurse123",
    redirect: "/nurse-queue",
  },
};

export function getSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("aethriz_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveSession(user: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem("aethriz_session", JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("aethriz_session");
}
