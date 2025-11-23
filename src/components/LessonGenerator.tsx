import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LessonContent {
  title: string;
  ageGroup: string;
  objectives: string[];
  materials: string[];
  activities: Array<{
    title: string;
    description: string;
  }>;
  tryAtHome: {
    title: string;
    description: string;
  };
  reflection: string;
  scientist?: {
    name: string;
    link: string;
    biography: string;
  };
}

const LessonGenerator = () => {
  const [age, setAge] = useState("");
  const [topic, setTopic] = useState(""); // 👈 NEW
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Age to year mapping based on UK curriculum
  const ageToYearMap: Record<string, { year: number; yearLabel: string }> = {
    "5": { year: 1, yearLabel: "Year 1 (Ages 5-6)" },
    "6": { year: 2, yearLabel: "Year 2 (Ages 6-7)" },
    "7": { year: 3, yearLabel: "Year 3 (Ages 7-8)" },
    "8": { year: 4, yearLabel: "Year 4 (Ages 8-9)" },
    "9": { year: 5, yearLabel: "Year 5 (Ages 9-10)" },
    "10": { year: 6, yearLabel: "Year 6 (Ages 10-11)" },
    "11": { year: 6, yearLabel: "Year 6 (Ages 10-11)" },
  };

  const generateLesson = async () => {
    if (!age) {
      toast({
        title: "Please select age",
        description: "Select your child's age to generate a lesson",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const yearData = ageToYearMap[age];

      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: {
          age: parseInt(age, 10),
          year: yearData.year,
          topic: topic.trim() || null,
        },
      });

      if (error) throw error;

      navigate("/lesson-plan", {
        state: { lesson: data.lesson, age: parseInt(age, 10) },
      });

      toast({
        title: "Lesson Created!",
        description: "Your lesson plan is ready.",
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
    <section
      id="lesson-generator"
      className="py-20 px-4 bg-muted/30"
      aria-labelledby="lesson-heading"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4"
            aria-hidden="true"
          >
            <BookOpen className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2
            id="lesson-heading"
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            DeenSTEAM Lesson Generator (DEBUG)
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get age-appropriate STEM lessons inspired by Qur&apos;anic wisdom and Muslim
            heritage
          </p>
        </div>

        {/* Process Instructions */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="p-6 bg-muted/50 border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              How It Works
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mb-2">
                  1
                </div>
                <p className="text-sm text-muted-foreground">
                  Select your child&apos;s age
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mb-2">
                  2
                </div>
                <p className="text-sm text-muted-foreground">
                  Click generate to create a custom lesson
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold mb-2">
                  3
                </div>
                <p className="text-sm text-muted-foreground">
                  View and save your personalized lesson plan
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 mb-8 shadow-lg border-border/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateLesson();
            }}
            className="space-y-6"
            role="search"
            aria-label="Lesson generation form"
          >
            {/* Age Selector */}
            <div className="space-y-2">
              <Label htmlFor="age">Child&apos;s Age</Label>
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger id="age">
                  <SelectValue placeholder="Select age (5-11)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 years old</SelectItem>
                  <SelectItem value="6">6 years old</SelectItem>
                  <SelectItem value="7">7 years old</SelectItem>
                  <SelectItem value="8">8 years old</SelectItem>
                  <SelectItem value="9">9 years old</SelectItem>
                  <SelectItem value="10">10 years old</SelectItem>
                  <SelectItem value="11">11 years old</SelectItem>
                </SelectContent>
              </Select>
              {age && (
                <p className="text-sm text-muted-foreground mt-2">
                  📚 {ageToYearMap[age]?.yearLabel}
                </p>
              )}
            </div>

            {/* Topic Input (NEW) */}
            <div className="space-y-2">
              <Label htmlFor="topic">Topic (optional)</Label>
              <Input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Solar System, Plants, Light, Animals"
              />
              <p className="text-sm text-muted-foreground">
                Leave this empty if you want DeenSTEAM to choose a topic.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !age}
              size="lg"
              className="w-full"
              aria-label={
                isLoading ? "Generating lesson plan" : "Generate lesson plan"
              }
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Generating Your Lesson Plan...
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                  Generate Lesson Plan
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default LessonGenerator;