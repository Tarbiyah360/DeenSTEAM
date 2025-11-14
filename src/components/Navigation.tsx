import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { Home, Sparkles, BookOpen, Atom, Globe, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/daily-wisdom", label: "Daily Wisdom", icon: Sparkles },
    { to: "/steam-explorer", label: "STEAM Explorer", icon: Atom },
    { to: "/lesson-generator", label: "Lesson Generator", icon: BookOpen },
    { to: "/saved-lessons", label: "Saved Lessons", icon: BookOpen },
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
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
            aria-label="DeenSTEAM home page"
          >
            <img src={logo} alt="DeenSTEAM logo - Islamic education platform" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="font-bold text-lg sm:text-xl text-foreground" aria-hidden="true">
              DeenSTEAM
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1" role="list">
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
                    <span>{label}</span>
                  </Link>
                </Button>
              );
            })}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
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
                <span>Sign Out</span>
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
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu - Only show on smallest screens when logged in */}
          {user && (
            <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map(({ to, label, icon: Icon }) => {
                    const isActive = location.pathname === to;
                    return (
                      <Button
                        key={to}
                        asChild
                        variant={isActive ? "default" : "ghost"}
                        className="justify-start gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link to={to}>
                          <Icon className="h-5 w-5" />
                          <span>{label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                  
                  <div className="border-t border-border my-2" />
                  
                  {user ? (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-3"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      variant="default"
                      onClick={() => setMobileMenuOpen(false)}
                      className="justify-start gap-3"
                    >
                      <Link to="/auth">
                        <User className="h-5 w-5" />
                        <span>Sign In</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navigation;
