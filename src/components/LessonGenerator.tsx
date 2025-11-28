import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import picture from "@/assets/hero-background.png"
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
import logo from "@/assets/deensteam-logo.png";
interface LessonContent {
  title: string;
  ageGroup: string;
  objectives: string[];
  materials: string[];
  activities: Array<{
    title: string;
    description?: string;
    steps?: Array<{
      stepNumber: number;
      instruction: string;
      imageUrl?: string;
    }>;
    finalImageUrl?: string;
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
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Age to year mapping based on UK curriculum
  const ageToYearMap: Record<
    string,
    {
      year: number;
      yearLabel: string;
    }
  > = {
    "5": {
      year: 1,
      yearLabel: "Year 1 (Ages 5-6)",
    },
    "6": {
      year: 2,
      yearLabel: "Year 2 (Ages 6-7)",
    },
    "7": {
      year: 3,
      yearLabel: "Year 3 (Ages 7-8)",
    },
    "8": {
      year: 4,
      yearLabel: "Year 4 (Ages 8-9)",
    },
    "9": {
      year: 5,
      yearLabel: "Year 5 (Ages 9-10)",
    },
    "10": {
      year: 6,
      yearLabel: "Year 6 (Ages 10-11)",
    },
    "11": {
      year: 6,
      yearLabel: "Year 6 (Ages 10-11)",
    },
  };
  const curriculumTopics = [
    "Forces and Magnets",
    "Light and Shadows",
    "Electricity",
    "Sound",
    "States of Matter",
    "Living Things and Their Habitats",
    "Plants",
    "Animals Including Humans",
    "Rocks and Soils",
    "Earth and Space",
    "Properties of Materials",
    "Evolution and Inheritance",
  ];
  const generateLesson = async () => {
    if (!age) {
      toast({
        title: "Please select age",
        description: "Select your child's age to generate a lesson",
        variant: "destructive",
      });
      return;
    }
    if (!topic) {
      toast({
        title: "Please select topic",
        description: "Select a curriculum topic to generate a lesson",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const yearData = ageToYearMap[age];
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson",
        {
          body: {
            age: parseInt(age),
            year: yearData.year,
            topic,
          },
        }
      );
      if (error) throw error;

      // Navigate to the lesson plan display page with the lesson data
      navigate("/lesson-plan", {
        state: {
          lesson: data.lesson,
          age: parseInt(age),
          topic: topic,
        },
      });
      toast({
        title: "Lesson Created!",
        description: "Your lesson plan is ready.",
      });
    } catch (error: any) {
      console.error("Error generating lesson:", error);
      const errorMessage =
        error?.message || "Failed to generate lesson. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section
      // id="lesson-generator"
      // className="py-20 px-4"
      // aria-labelledby="lesson-heading"
      className="relative py-20 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${picture})`}}
    >
      <div className="absolute inset-0 bg-white/70"></div>
      <div className=" relative z-10 container mx-auto max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div
            className="inline-flex items-center justify-center mb-4"
            aria-hidden="true"
          ></div>
          <h2
            id="lesson-heading"
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            DeenSTEAM Lesson Generator
          </h2>
          <div
            className="flex flex-wrap justify-center gap-2 mb-6"
            style={{ color: "#e9c763" }}
          >
            {["Science", "Technology", "Engineering", "Art", "Mathematics"].map(
              (item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-[#e9c763] text-[#0a1103] text-sm font-semibold shadow-sm"
                >
                  {item}
                </span>
              )
            )}
          </div>
         

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create personalized STEAM focused lessons alligned with the UK
            National Curriculum, enriched with Islamic reflections. Perfect for
            curious young minds aged 5-11!
          </p>
        </div>

        {/* How It Works Steps */}
        <Card className="p-6 mb-8 bg-card/50 border-border/50">
          <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                1
              </div>
              <h4 className="font-semibold text-foreground">Select Age</h4>
              <p className="text-sm text-muted-foreground">
                Choose your child's age (5-11 years)
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                2
              </div>
              <h4 className="font-semibold text-foreground">Pick a Topic</h4>
              <p className="text-sm text-muted-foreground">
                Select from UK STEM curriculum topics
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mb-2">
                3
              </div>
              <h4 className="font-semibold text-foreground">Generate Lesson</h4>
              <p className="text-sm text-muted-foreground">
                Get an Islamic-inspired STEM lesson plan
              </p>
            </div>
          </div>
        </Card>

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
            <div className="space-y-2">
              <h3
                className="text-2xl font-bold text-center mt-4 mb-0"
                style={{ color: "#1B5E20" }}
              >
                Let&apos;s Get Started!
              </h3>
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
              {age && (
                <p className="text-sm text-muted-foreground mt-2">
                  📚 {ageToYearMap[age]?.yearLabel}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Curriculum Topic</Label>
              <Select value={topic} onValueChange={setTopic}>
                <SelectTrigger id="topic">
                  <SelectValue placeholder="Select a STEM topic" />
                </SelectTrigger>
                <SelectContent>
                  {curriculumTopics.map((curriculumTopic) => (
                    <SelectItem key={curriculumTopic} value={curriculumTopic}>
                      {curriculumTopic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !age || !topic}
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
