import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Loader2, Users, BookOpen, Award, TrendingUp } from "lucide-react";

const AmbassadorDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session?.user) {
        setUser(session.user);
        checkAmbassadorRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    await checkAmbassadorRole(session.user.id);
  };

  const checkAmbassadorRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) throw error;

      const hasAmbassadorRole = roles?.some(r => r.role === "ambassador");
      
      if (!hasAmbassadorRole) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You need to be a STEAM Ambassador to access this page.",
        });
        navigate("/");
        return;
      }

      setIsAmbassador(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAmbassador) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">STEAM Ambassador Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your ambassador activities and track your impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students Reached</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No students yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lessons Created</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start creating lessons</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Hosted</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No events yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Build your impact</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for ambassadors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" onClick={() => navigate("/lesson-generator")}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Lesson
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/steam-explorer")}>
                  <Award className="mr-2 h-4 w-4" />
                  Explore STEAM Resources
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/community")}>
                  <Users className="mr-2 h-4 w-4" />
                  Connect with Community
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ambassador Resources</CardTitle>
                <CardDescription>Tools and guides to help you succeed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Getting Started Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn the basics of being a STEAM Ambassador and how to make the most impact.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Best Practices</h3>
                  <p className="text-sm text-muted-foreground">
                    Tips and techniques from experienced ambassadors in the community.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AmbassadorDashboard;
