import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Home, Sparkles, BookOpen, Atom, Globe, LogOut, User, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } else {
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };
  
  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/daily-wisdom", label: "Daily Wisdom", icon: Sparkles },
    { to: "/steam-explorer", label: "STEAM Explorer", icon: Atom },
    { to: "/lesson-generator", label: "Lesson Generator", icon: BookOpen },
    { to: "/community", label: "Community", icon: Globe },
  ];

  return (
    <>
      {/* Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      
      <nav 
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50"
        role="navigation"
        aria-label="Main navigation"
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
            aria-label="Tarbiyah360 home page"
          >
            <img src={logo} alt="Tarbiyah360 logo - Islamic education platform" className="w-10 h-10" />
            <span className="font-bold text-xl text-foreground hidden sm:inline" aria-hidden="true">
              Tarbiyah360°
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1" role="list">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Button
                  key={to}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  role="listitem"
                >
                  <Link 
                    to={to}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Navigate to ${label}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden md:inline">{label}</span>
                    <span className="sr-only md:hidden">{label}</span>
                  </Link>
                </Button>
              );
            })}
            
            {/* Auth Buttons */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">Sign Out</span>
                <span className="sr-only md:hidden">Sign Out</span>
              </Button>
            ) : (
              <Button
                asChild
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Link to="/auth" aria-label="Sign in to your account">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:inline">Sign In</span>
                  <span className="sr-only md:hidden">Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navigation;
