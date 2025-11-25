import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicroscope } from "@fortawesome/free-solid-svg-icons";

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
import { text } from "stream/consumers";

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
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson",
        {
          body: { age: parseInt(age), year: yearData.year },
        }
      );

      if (error) throw error;

      // Navigate to the lesson plan display page with the lesson data
      navigate("/lesson-plan", {
        state: { lesson: data.lesson, age: parseInt(age) },
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
            <FontAwesomeIcon
              icon={faMicroscope}
              className="h-8 w-8"
              style={{ color: "#003600" }}
            />
          </div>
          <h2
            id="lesson-heading"
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            DeenSTEAM Lesson Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
           Create personalized STEAM focused lessons alligned with the UK National Curriculum, enriched with Islamic reflections. Perfect for curious young minds aged 5-11!
          </p>
        </div>

        {/* Process Instructions */}
        <div className="max-w-3xl mx-auto mb-10">
          <Card
            className="p-8 rounded-3xl shadow-md"
            style={{
              backgroundColor: "#d3ded3",
              borderColor: "#d3ded3",
            }}
          >
            <h3
              className="text-2xl font-semibold text-center mb-8"
              style={{ color: "#003600" }}
            >
              How It Works
            </h3>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: 1,
                  text: "Select your child's age",
                },
                {
                  step: 2,
                  text: "Click generate to create a lesson",
                },
                {
                  step: 3,
                  text: "View and save your personalized plan",
                },
              ].map((s, i) => (
                <div key={i} className="text-center space-y-3">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full shadow-md font-extrabold text-2xl"
                    style={{
                      backgroundColor: "#88a788ff",
                      color: "#304130",
                    }}
                  >
                    {s.step}
                  </div>
                  <p
                    className="text-base leading-snug"
                    style={{ color: "#003600" }}
                  >
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Input Section */}

        <Card
          className="mb-8 shadow-lg border rounded-3xl"
          style={{
            backgroundColor: "#ecf5eaff",
            borderColor: "#E0E5D8",
          }}
        >
          <h3
            className="text-2xl font-bold text-center mt-4 mb-0"
            style={{ color: "#1B5E20" }}
          >
            Let&apos;s Get Started!
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              generateLesson();
            }}
            className="space-y-6 p-6 md:p-8"
            role="search"
            aria-label="Lesson generation form"
          >
            <div className="space-y-2">
              <Label htmlFor="age" className="text-[#1B5E20] font-semibold">
                Child&apos;s Age
              </Label>

              {/* 
        Custom child age select
        - Still uses shadcn's Select, but we add our colours + dot.
      */}
              <Select value={age} onValueChange={setAge}>
                <SelectTrigger
                  id="age"
                  className="bg-white/80 border-[#E0E5D8] focus:ring-2 focus:ring-[#2F7F36]/40"
                >
                  <SelectValue placeholder="Select age (5–11)" />
                </SelectTrigger>
                <SelectContent className="bg-[#FFFDF7] border border-[#E0E5D8]">
                  {[
                    { value: "5", label: "5 years old" },
                    { value: "6", label: "6 years old" },
                    { value: "7", label: "7 years old" },
                    { value: "8", label: "8 years old" },
                    { value: "9", label: "9 years old" },
                    { value: "10", label: "10 years old" },
                    { value: "11", label: "11 years old" },
                  ].map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: "#FDE062" }}
                        />
                        <span>{item.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Age → Year helper text */}
              {age && (
                <p className="text-sm mt-2" style={{ color: "#4A5A3D" }}>
                  📚 {ageToYearMap[age]?.yearLabel}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || !age}
              size="lg"
              className="w-full rounded-full font-semibold flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#2F7F36",
                color: "#d7f3d8ff",
                borderColor: "#1B5E20",
              }}
              aria-label={
                isLoading ? "Generating lesson plan" : "Generate lesson plan"
              }
            >
              {isLoading ? (
                <>
                  <Loader2
                    className="h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Generating Your Lesson Plan...
                </>
              ) : (
                <>
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                  Generate Lesson Plan
                </>
              )}
            </Button>

            {/* 
      Small helper text under button
      - Reassures user what will happen next.
    */}
            <p
              className="text-xs text-center mt-1"
              style={{ color: "#6B7A55" }}
            >
              You&apos;ll be taken to a detailed lesson plan once it&apos;s
              ready.
            </p>
          </form>
        </Card>

        {/* What you will get section - could help with clarity */}

        <div className="max-w-4xl mx-auto mb-12">
          <h3
            className="text-2xl font-semibold text-center mb-6"
            style={{ color: "#1B5E20" }}
          >
            What You&apos;ll Get
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Clear and fun learning objectives",
              "Material checklist for activities",
              "Step-by-step activity instructions (with images)",
              "Try-at-home activities for curious minds",
              "Reflection prompts to reinforce learning and faith",
              "Spotlight on Muslim scientists and inventors",
            ].map((text) => (
              <div
                key={text}
                className="rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-5 text-center"
                style={{
                  backgroundColor: "#ecf5eaff", //FFFDF7(cream version)
                  border: "1px solid #E0E5D8",
                }}
              >
                <div
                  className="flex justify-center mb-3"
                  style={{
                    color: "#FDE062",
                    fontSize: "1.5rem",
                  }}
                >
                  ⭐
                </div>
                <p className="text-sm font-medium" style={{ color: "#1B5E20" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonGenerator;
