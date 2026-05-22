import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, refetchUser } = useAuth();
  const { theme } = useTheme();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      const redirectPath = isAdmin ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    }
  }, [authLoading, isAdmin, navigate, user]);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ 
          title: "Erreur de connexion", 
          description: data.message || "Une erreur s'est produite",
          variant: "destructive" 
        });
        return;
      }

      toast({ title: "Connexion réussie !", description: `Bienvenue ${data.user.full_name}` });

      // Refresh user data and redirect
      await refetchUser();

      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({ 
        title: "Erreur", 
        description: "Erreur de connexion. Veuillez réessayer.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword || !signupPhone) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: signupName,
          email: signupEmail,
          password: signupPassword,
          phone: signupPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ 
          title: "Erreur d'inscription", 
          description: data.message || "Une erreur s'est produite",
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Compte créé !", 
        description: "Inscription réussie. Redirection..." 
      });

      // Clear form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupPhone("");

      // Refresh user data and redirect
      await refetchUser();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      toast({ 
        title: "Erreur", 
        description: "Erreur d'inscription. Veuillez réessayer.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!forgotEmail) {
      toast({ title: "Erreur", description: "Veuillez entrer votre email", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ 
          title: "Erreur", 
          description: data.message || "Une erreur s'est produite",
          variant: "destructive" 
        });
        return;
      }

      toast({ 
        title: "Email envoyé", 
        description: data.message || "Consultez votre boîte mail pour réinitialiser votre mot de passe." 
      });

      setForgotEmail("");
      setTab("login");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la demande. Veuillez réessayer.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={theme === "dark" ? "/logo-dark.png" : "/logo.png"} alt="GreenWheels" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold">
            {tab === "login" ? "Connexion" : tab === "signup" ? "Inscription" : "Mot de passe oublié"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {tab === "login" ? "Connectez-vous à votre compte" : tab === "signup" ? "Créez votre compte GreenWheels" : "Réinitialisez votre mot de passe"}
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="email@exemple.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <button onClick={() => setTab("forgot")} className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                </button>
                <Button className="w-full gap-2" onClick={handleLogin} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Se connecter
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-name" placeholder="Votre nom" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-email" type="email" placeholder="email@exemple.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Téléphone</Label>
                  <Input id="signup-phone" placeholder="+213 555 XXX XXX" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="signup-password" type="password" placeholder="••••••••" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={handleSignup} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Créer mon compte
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forgot">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">Entrez votre email pour recevoir un lien de réinitialisation.</p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="forgot-email" type="email" placeholder="email@exemple.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <Button className="w-full" onClick={handleForgot} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
                </Button>
                <button onClick={() => setTab("login")} className="text-sm text-primary hover:underline w-full text-center block">
                  Retour à la connexion
                </button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
