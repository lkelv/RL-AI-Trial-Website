import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Avatar } from "../ui/Avatar";
import { Logo } from "../ui/Logo";

interface AppShellProps {
  children: ReactNode;
  back?: { to: string; label: string };
  /** fill mode: main fills the viewport and never scrolls (child manages its
   *  own overflow). Used by the parent dashboard. */
  fill?: boolean;
}

export function AppShell({ children, back, fill = false }: AppShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="relative flex h-[100dvh] flex-col">
      <header className="z-20 flex items-center gap-3 border-b border-line/70 bg-base/65 px-4 py-3 backdrop-blur-xl sm:px-6">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        {back && (
          <Link
            to={back.to}
            className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised/50 px-3 py-1.5 text-sm text-ink-dim transition-colors hover:border-mint/50 hover:text-ink sm:ml-3"
          >
            <span aria-hidden>←</span>
            <span className="hidden sm:inline">{back.label}</span>
          </Link>
        )}

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <>
              <div className="hidden text-right leading-tight sm:block">
                <div className="text-sm font-semibold text-ink">{user.displayName}</div>
                <div className="text-xs capitalize text-ink-faint">{user.role}</div>
              </div>
              <Avatar name={user.displayName} color={user.avatarColor} size={38} />
              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-line bg-raised/50 px-3 py-1.5 text-sm text-ink-dim transition-colors hover:border-amber/50 hover:text-amber"
              >
                Log&nbsp;out
              </button>
            </>
          )}
        </div>
      </header>

      <main
        className={
          fill
            ? "relative min-h-0 flex-1 overflow-hidden"
            : "relative flex-1 overflow-y-auto"
        }
      >
        {children}
      </main>
    </div>
  );
}
