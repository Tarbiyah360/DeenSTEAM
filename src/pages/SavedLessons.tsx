import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Lightbulb, Heart, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonContent {
  verse: string;
  inventor: string;
  activity: string;
  reflection: string;
}

interface SavedLesson {
  id: string;
  topic: string;
  lesson_content: LessonContent;
  created_at: string;
}

const SavedLessons = () => {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchLessons();
  }, []);

  const checkAuthAndFetchLessons = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await fetchLessons();
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_lessons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLessons((data || []) as unknown as SavedLesson[]);
    } catch (error: any) {
      console.error("Error fetching saved lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load saved lessons.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLesson = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("saved_lessons")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLessons(lessons.filter(lesson => lesson.id !== id));
      toast({
        title: "Lesson Deleted",
        description: "The lesson has been removed from your library.",
      });
    } catch (error: any) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-12 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 mb-4">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Saved Lessons
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Your personal library of saved lessons
            </p>
          </div>

          {lessons.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center">
              <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">No Saved Lessons Yet</h2>
              <p className="text-muted-foreground mb-6">
                Generate and save lessons to build your personal library
              </p>
              <Button onClick={() => navigate("/lesson-generator")}>
                Generate Your First Lesson
              </Button>
            </Card>
          ) : (
            <div className="space-y-8">
              {lessons.map((savedLesson) => (
                <Card key={savedLesson.id} className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                        {savedLesson.topic}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Saved on {new Date(savedLesson.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteLesson(savedLesson.id)}
                      disabled={deletingId === savedLesson.id}
                      className="self-start sm:self-auto"
                    >
                      {deletingId === savedLesson.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="p-4 sm:p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-foreground">
                            Qur'anic Wisdom
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {savedLesson.lesson_content.verse}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6 shadow-md border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-foreground">
                            Muslim Heritage
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {savedLesson.lesson_content.inventor}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6 shadow-md border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-foreground">
                            Hands-On Activity
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {savedLesson.lesson_content.activity}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 sm:p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm sm:text-base md:text-lg text-foreground">
                            Reflection & Dua
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {savedLesson.lesson_content.reflection}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="py-6 sm:py-8 px-4 border-t border-border/50 bg-muted/30">
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

export default SavedLessons;
