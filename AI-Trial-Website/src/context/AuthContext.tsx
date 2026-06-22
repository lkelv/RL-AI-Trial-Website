import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Account, Role, SessionUser } from "../types";
import { ACCOUNTS } from "../data";

const STORAGE_KEY = "rl-demo-session";

interface AuthContextValue {
  user: SessionUser | null;
  login: (account: Account) => SessionUser;
  loginWithCredentials: (username: string, password: string) => SessionUser | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const HOME_BY_ROLE: Record<Role, string> = {
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
  admin: "/admin",
};

export const homePathForRole = (role: Role): string => HOME_BY_ROLE[role];

function readStored(): SessionUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function toSession(account: Account): SessionUser {
  return {
    id: account.id,
    username: account.username,
    role: account.role,
    displayName: account.displayName,
    avatarColor: account.avatarColor,
    tagline: account.tagline,
    enrolledClassIds: account.enrolledClassIds,
    childStudentName: account.childStudentName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(readStored);

  const login = useCallback((account: Account): SessionUser => {
    const session = toSession(account);
    setUser(session);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      /* storage unavailable — session stays in memory only */
    }
    return session;
  }, []);

  const loginWithCredentials = useCallback(
    (username: string, password: string): SessionUser | null => {
      const match = ACCOUNTS.find(
        (a) =>
          a.username.toLowerCase() === username.trim().toLowerCase() &&
          a.password === password,
      );
      return match ? login(match) : null;
    },
    [login],
  );

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
