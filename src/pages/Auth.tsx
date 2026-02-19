import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateCustom, type AdminRole } from "@/lib/adminStore";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState<AuthState>("login");
  const [blockedName, setBlockedName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthState("checking");

    // Simulate a brief auth delay for UX
    await new Promise((r) => setTimeout(r, 600));

    // Authenticate against custom credentials
    const result = authenticateCustom(username.trim(), password);

    if (result.blocked) {
      setBlockedName(result.name || "");
      setAuthState("blocked");
      setLoading(false);
      return;
    }

    if (!result.role) {
      setAuthState("denied");
      setLoading(false);
      return;
    }

    // Store auth info in sessionStorage (auto-clears on tab close)
    sessionStorage.setItem(
      "ts_admin_session",
      JSON.stringify({
        role: result.role,
        name: result.name,
        authenticated_at: new Date().toISOString(),
      })
    );

    toast({
      title: `Welcome, ${result.role === "super_admin" ? "Super Admin" : result.name || "Admin"}`,
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
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="your_username@ts"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={authState === "checking"}
                  autoComplete="off"
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
                  autoComplete="off"
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
                Session expires when you close the tab. Credentials are provided by the Super Admin.
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
                Invalid credentials. If you're an authorized admin, contact the
                Super Admin for your login details.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setAuthState("login");
                setUsername("");
                setPassword("");
              }}
            >
              Try Again
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
                {blockedName ? `${blockedName}, your` : "Your"} admin access has
                been revoked by the Super Admin. Contact the President directly
                if you believe this is an error.
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