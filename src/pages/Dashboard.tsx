import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { BookOpen, Sparkles, Globe, Atom } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Welcome back, {user?.email}
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your favorite features</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => navigate("/lesson-generator")}
                >
                  <BookOpen className="h-5 w-5" />
                  Generate a Lesson
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => navigate("/daily-wisdom")}
                >
                  <Sparkles className="h-5 w-5" />
                  Get Daily Wisdom
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => navigate("/steam-explorer")}
                >
                  <Atom className="h-5 w-5" />
                  Explore STEAM
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-3"
                  onClick={() => navigate("/community")}
                >
                  <Globe className="h-5 w-5" />
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>Track your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lessons Completed</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Daily Wisdom Views</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Community Connections</span>
                    <span className="font-bold">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-8 px-4 border-t border-border/50 bg-muted/30" role="contentinfo">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            DeenSTEAM - Nurturing Faith & Curiosity
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
