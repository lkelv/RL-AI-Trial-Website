import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../../types";
import { homePathForRole, useAuth } from "../../context/AuthContext";

interface RequireAuthProps {
  role?: Role;
  children: ReactNode;
}

/** Route guard: bounce to /login when logged out, or to the user's own
 *  home when they try to open a portal that isn't theirs. */
export function RequireAuth({ role, children }: RequireAuthProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  return <>{children}</>;
}
