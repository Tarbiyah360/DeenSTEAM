import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, Lightbulb, Heart, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonContent {
  verse: string;
  inventor: string;
  activity: string;
  reflection: string;
}

const LessonGenerator = () => {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const generateLesson = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a topic like 'water', 'planets', or 'patience'",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: { topic },
      });

      if (error) throw error;

      setLesson(data.lesson);
      toast({
        title: "Lesson Created!",
        description: "Your personalized lesson is ready.",
      });
    } catch (error: any) {
      console.error("Error generating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveLesson = async () => {
    if (!lesson || !topic) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save lessons.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("saved_lessons")
        .insert({
          user_id: user.id,
          topic: topic,
          lesson_content: lesson as any,
        });

      if (error) throw error;

      toast({
        title: "Lesson Saved!",
        description: "You can view it in your Saved Lessons.",
      });
    } catch (error: any) {
      console.error("Error saving lesson:", error);
      toast({
        title: "Error",
        description: "Failed to save lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="lesson-generator" className="py-20 px-4 bg-muted/30" aria-labelledby="lesson-heading">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4" aria-hidden="true">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 id="lesson-heading" className="text-4xl md:text-5xl font-bold text-foreground">
            Interactive Lesson Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any topic and receive a complete lesson combining Qur'anic wisdom, Muslim heritage, and hands-on learning
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 mb-8 shadow-lg border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); generateLesson(); }}
            className="flex flex-col md:flex-row gap-4"
            role="search"
            aria-label="Lesson topic search form"
          >
            <label htmlFor="lesson-topic" className="sr-only">
              Enter a lesson topic
            </label>
            <Input
              id="lesson-topic"
              placeholder="Enter a topic (e.g., water, planets, patience, kindness)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateLesson()}
              className="flex-1 text-lg py-6"
              aria-describedby="topic-description"
              aria-required="true"
            />
            <span id="topic-description" className="sr-only">
              Enter any educational topic to generate a comprehensive lesson
            </span>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
              aria-label={isLoading ? "Creating lesson, please wait" : "Generate lesson for entered topic"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                  Generate Lesson
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Lesson Display */}
        {lesson && (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={saveLesson}
                disabled={isSaving}
                variant="outline"
                className="gap-2"
                aria-label="Save this lesson to your library"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                    Save Lesson
                  </>
                )}
              </Button>
            </div>
            <div 
              className="grid sm:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
              role="region"
              aria-label="Generated lesson content"
              aria-live="polite"
            >
            {/* Qur'anic Verse */}
            <Card className="p-5 sm:p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground">Qur'anic Wisdom</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{lesson.verse}</p>
                </div>
              </div>
            </Card>

            {/* Muslim Inventor */}
            <Card className="p-5 sm:p-6 shadow-md border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-secondary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground">Muslim Heritage</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{lesson.inventor}</p>
                </div>
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-5 sm:p-6 shadow-md border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground">Hands-On Activity</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{lesson.activity}</p>
                </div>
              </div>
            </Card>

            {/* Reflection */}
            <Card className="p-5 sm:p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-foreground">Reflection & Dua</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{lesson.reflection}</p>
                </div>
              </div>
            </Card>
          </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LessonGenerator;