import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X, User, LogOut, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "Vélos", to: "/vehicles" },
  { label: "Stations", to: "/map" },
  { label: "Abonnements", to: "/subscriptions" },
  { label: "À propos", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faq" },
];

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2">
          <img
            src={theme === "dark" ? "/logo-dark.png" : "/logo.png"}
            alt="GreenWheels"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {!isAdmin && <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                location.pathname === l.to ? "bg-accent text-primary font-semibold" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>}

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:inline-flex gap-2">
                  <User className="h-4 w-4" />
                  {profile?.full_name || user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
                  {isAdmin ? <Shield className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                  {isAdmin ? "Administration" : "Mon espace"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm" className="hidden md:inline-flex gap-2">
                <User className="h-4 w-4" /> Connexion
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-card px-4 pb-4">
          {!isAdmin && navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                location.pathname === l.to ? "bg-accent text-primary font-semibold" : "text-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={isAdmin ? "/admin" : "/dashboard"} onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                  {isAdmin ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {isAdmin ? "Administration" : "Mon espace"}
                </Button>
              </Link>
              <Button variant="destructive" size="sm" className="w-full mt-2 gap-2" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Déconnexion
              </Button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)}>
              <Button variant="default" size="sm" className="w-full mt-2 gap-2">
                <User className="h-4 w-4" /> Connexion
              </Button>
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
