import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { type AdminRole } from "@/lib/adminStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode | ((props: { userRole: AdminRole }) => React.ReactNode);
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    // Check sessionStorage for custom auth session
    const raw = sessionStorage.getItem("ts_admin_session");
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session.role === "super_admin" || session.role === "admin") {
          setUserRole(session.role as AdminRole);
        }
      } catch (_e) {
        // invalid session
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !userRole) {
    return <Navigate to="/auth" replace />;
  }

  // If children is a render function, pass userRole
  if (typeof children === "function" && userRole) {
    return <>{children({ userRole })}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;