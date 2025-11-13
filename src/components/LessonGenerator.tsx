import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  };
}

const LessonGenerator = () => {
  const [topic, setTopic] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateLesson = async () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter a topic",
        description: "Enter a STEM topic like 'sound', 'plants', or 'forces'",
        variant: "destructive",
      });
      return;
    }

    if (!age || !year) {
      toast({
        title: "Please select age and year",
        description: "Select your child's age and school year",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-lesson", {
        body: { topic, age: parseInt(age), year: parseInt(year) },
      });

      if (error) throw error;

      // Navigate to the lesson plan display page with the lesson data
      navigate('/lesson-plan', { state: { lesson: data.lesson, topic } });
      
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
    <section id="lesson-generator" className="py-20 px-4 bg-muted/30" aria-labelledby="lesson-heading">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4" aria-hidden="true">
            <BookOpen className="h-8 w-8 text-accent-foreground" />
          </div>
          <h2 id="lesson-heading" className="text-4xl md:text-5xl font-bold text-foreground">
            DeenSTEAM Lesson Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get age-appropriate STEM lessons inspired by Qur'anic wisdom and Muslim heritage
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 md:p-8 mb-8 shadow-lg border-border/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); generateLesson(); }}
            className="space-y-6"
            role="search"
            aria-label="Lesson generation form"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Child's Age</Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">School Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year (1-6)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                    <SelectItem value="5">Year 5</SelectItem>
                    <SelectItem value="6">Year 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">STEM Topic</Label>
              <Input
                id="topic"
                type="text"
                placeholder="Enter a STEM topic (e.g., Sound, Plants, Forces)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
                className="text-lg"
                aria-label="Enter STEM topic"
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading || !topic.trim() || !age || !year}
              size="lg"
              className="w-full"
              aria-label={isLoading ? "Generating lesson plan" : "Generate lesson plan"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
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