import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleReset = async () => {
    if (!password) {
      toast({ title: "Erreur", description: "Veuillez entrer un mot de passe", variant: "destructive" });
      return;
    }

    const hash = window.location.hash;
    const token = new URLSearchParams(hash.split("?")[1]).get("access_token");
    
    if (!token) {
      toast({ title: "Erreur", description: "Token invalide", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({ title: "Erreur", description: data.message || "Une erreur s'est produite", variant: "destructive" });
        return;
      }

      toast({ title: "Mot de passe mis à jour !" });
      navigate("/auth");
    } catch (error) {
      console.error("Reset password error:", error);
      toast({ title: "Erreur", description: "Erreur de réinitialisation", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Lien invalide ou expiré.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={theme === "dark" ? "/logo-dark.png" : "/logo.png"} alt="GreenWheels" className="h-16 w-auto mx-auto mb-4 object-contain" />
          <h1 className="font-display text-3xl font-bold">Nouveau mot de passe</h1>
        </div>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
              </div>
            </div>
            <Button className="w-full" onClick={handleReset} disabled={loading || password.length < 6}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mettre à jour"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
