import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole, isUserBlocked } from "@/lib/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Lock, AlertTriangle } from "lucide-react";

type AuthState = "login" | "checking" | "denied" | "blocked";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<AuthState>("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Force sign-out on every mount — admin must re-authenticate each visit
  useEffect(() => {
    const forceLogout = async () => {
      await supabase.auth.signOut();
    };
    forceLogout();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    if (!data.session) {
      toast({
        variant: "destructive",
        title: "No Session",
        description: "Could not establish session.",
      });
      setLoading(false);
      return;
    }

    // Check role and block status
    setAuthState("checking");
    const userId = data.session.user.id;

    // Check blocklist first
    const blocked = await isUserBlocked(userId);
    if (blocked) {
      setAuthState("blocked");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Check admin role
    const role = await getUserRole(userId);
    if (!role) {
      setAuthState("denied");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    // Authorized — redirect to admin
    toast({
      title: `Welcome, ${role === "super_admin" ? "Super Admin" : "Admin"}`,
      description: "Access granted to the admin panel.",
    });
    navigate("/admin", { replace: true });
    setLoading(false);
  };

  // Login form
  if (authState === "login" || authState === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <Card className="w-full max-w-md border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                TECHSHASTRA Admin
              </CardTitle>
              <CardDescription className="mt-1">
                Authorized personnel only. Enter your admin credentials.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@techshastra.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={authState === "checking"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={authState === "checking"}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || authState === "checking"}
              >
                {(loading || authState === "checking") && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {authState === "checking"
                  ? "Verifying Credentials..."
                  : "Access Admin Panel"}
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>
                Session expires on exit. Re-authentication required each visit.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access Denied
  if (authState === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
        <Card className="w-full max-w-md border-destructive/30">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-destructive">
                Access Denied
              </CardTitle>
              <CardDescription className="mt-2">
                Your account does not have admin privileges. Contact the Super
                Admin to request access.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setAuthState("login");
                setEmail("");
                setPassword("");
              }}
            >
              Try Different Credentials
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Blocked
  if (authState === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
        <Card className="w-full max-w-md border-destructive/30">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-destructive">
                Account Blocked
              </CardTitle>
              <CardDescription className="mt-2">
                Your admin access has been revoked by the Super Admin. If you
                believe this is an error, contact the President directly.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Auth;