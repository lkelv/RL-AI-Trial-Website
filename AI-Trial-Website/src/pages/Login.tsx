import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Account, Role } from "../types";
import { ACCOUNTS } from "../data";
import { homePathForRole, useAuth } from "../context/AuthContext";
import { Logo } from "../components/ui/Logo";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import {
  IconArrowRight,
  IconParent,
  IconSparkles,
  IconStudent,
} from "../components/ui/Icons";

const QUICK_ROLES: Role[] = ["student", "parent"];

const ROLE_COPY: Record<string, string> = {
  student: "Student portal",
  parent: "Parent portal",
  teacher: "Teacher workspace",
  admin: "Admin console",
};

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginWithCredentials } = useAuth();

  const requestedRole = (params.get("role") as Role | null) ?? "student";
  const presetAccount = useMemo(
    () => ACCOUNTS.find((a) => a.role === requestedRole),
    [requestedRole],
  );

  const [username, setUsername] = useState(presetAccount?.username ?? "");
  const [password, setPassword] = useState(presetAccount ? "demo" : "");
  const [error, setError] = useState("");

  const quickAccounts = QUICK_ROLES.map((r) => ACCOUNTS.find((a) => a.role === r)).filter(
    Boolean,
  ) as Account[];

  function enter(account: Account) {
    login(account);
    navigate(homePathForRole(account.role));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = loginWithCredentials(username, password);
    if (!user) {
      setError("Those credentials don't match a demo account. Try the quick logins above.");
      return;
    }
    navigate(homePathForRole(user.role));
  }

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-line/60 bg-base/40 p-10 lg:flex">
        <Link to="/" className="relative z-10 transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl leading-tight text-ink">
            Sign in to the{" "}
            <span className="text-mint">{ROLE_COPY[requestedRole] ?? "RL portal"}</span>
          </h2>
          <p className="mt-4 text-ink-dim">
            One login for everything RL — practice, marking, classrooms and live
            progress.
          </p>
        </div>

        <p className="relative z-10 text-xs text-ink-faint">
          © 2026 RL Black Magic · Demonstration build
        </p>
      </div>

      {/* form panel */}
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="rl-reveal" style={{ animationDelay: "40ms" }}>
            <h1 className="font-display text-3xl text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-dim">
              Pick an account to jump straight into learning with RL
            </p>
          </div>

          {/* quick logins */}
          <div className="mt-6 space-y-3">
            {quickAccounts.map((acc, i) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => enter(acc)}
                className="rl-reveal group flex w-full items-center gap-3 rounded-xl border border-line/70 bg-raised/40 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-mint/50 hover:bg-raised/70"
                style={{ animationDelay: `${120 + i * 80}ms` }}
              >
                <Avatar name={acc.displayName} color={acc.avatarColor} size={42} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{acc.displayName}</span>
                    <span className="text-ink-faint">
                      {acc.role === "student" ? (
                        <IconStudent size={15} />
                      ) : (
                        <IconParent size={15} />
                      )}
                    </span>
                  </span>
                  <span className="block truncate text-xs text-ink-dim">{acc.tagline}</span>
                </span>
                <IconArrowRight
                  size={18}
                  className="text-ink-faint transition-all group-hover:translate-x-1 group-hover:text-mint"
                />
              </button>
            ))}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-line" />
            or sign in manually
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* manual form */}
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-dim" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                className="w-full rounded-xl border border-line bg-base/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60"
                placeholder="aisha"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-dim" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoComplete="current-password"
                className="w-full rounded-xl border border-line bg-base/60 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60"
                placeholder="demo"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              <IconSparkles size={17} /> Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
