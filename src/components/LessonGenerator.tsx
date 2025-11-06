import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, Lightbulb, Heart } from "lucide-react";
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

  return (
    <section id="lesson-generator" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Interactive Lesson Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any topic and receive a complete lesson combining Qur'anic wisdom, Muslim heritage, and hands-on learning
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 mb-8 shadow-lg border-border/50">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter a topic (e.g., water, planets, patience, kindness)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateLesson()}
              className="flex-1 text-lg py-6"
            />
            <Button
              size="lg"
              onClick={generateLesson}
              disabled={isLoading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Lesson
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Lesson Display */}
        {lesson && (
          <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Qur'anic Verse */}
            <Card className="p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Qur'anic Wisdom</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.verse}</p>
                </div>
              </div>
            </Card>

            {/* Muslim Inventor */}
            <Card className="p-6 shadow-md border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Muslim Heritage</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.inventor}</p>
                </div>
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6 shadow-md border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Hands-On Activity</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.activity}</p>
                </div>
              </div>
            </Card>

            {/* Reflection */}
            <Card className="p-6 shadow-md border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">Reflection & Dua</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{lesson.reflection}</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default LessonGenerator;