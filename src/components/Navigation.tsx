import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Home, Sparkles, BookOpen, Atom, Globe } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/daily-wisdom", label: "Daily Wisdom", icon: Sparkles },
    { to: "/steam-explorer", label: "STEAM Explorer", icon: Atom },
    { to: "/lesson-generator", label: "Lesson Generator", icon: BookOpen },
    { to: "/community", label: "Community", icon: Globe },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Tarbiyah360 logo" className="w-10 h-10" />
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              Tarbiyah360°
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Button
                  key={to}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Link to={to}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
