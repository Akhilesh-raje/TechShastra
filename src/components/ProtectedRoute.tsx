import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole, isUserBlocked, type AdminRole } from "@/lib/adminStore";
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<AdminRole | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    const userId = session.user.id;

    // Check blocklist
    const blocked = await isUserBlocked(userId);
    if (blocked) {
      setIsBlocked(true);
      setLoading(false);
      return;
    }

    // Check role
    if (requireAdmin) {
      const role = await getUserRole(userId);
      setUserRole(role);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isBlocked) {
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