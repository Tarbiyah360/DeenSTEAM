import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LessonData {
  title: string;
  ageGroup: string;
  objectives: string[];
  materials: string[];
  activities: Array<{
    title: string;
    description: string;
    imageUrl?: string;
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

const LessonPlanDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson: initialLesson, age } = location.state as { lesson: LessonData; age: number } || {};
  
  const [lesson, setLesson] = useState<LessonData | null>(initialLesson);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!lesson) {
    navigate('/lesson-generator');
    return null;
  }

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleGenerateNew = async () => {
    if (!age) {
      toast.error("Cannot generate new plan without age information");
      return;
    }

    setIsGenerating(true);
    
    try {
      const yearMap: Record<number, number> = {
        5: 1, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6
      };
      const year = yearMap[age];

      const { data, error } = await supabase.functions.invoke('generate-lesson', {
        body: { age, year }
      });

      if (error) throw error;

      if (data?.lesson) {
        setLesson(data.lesson);
        toast.success("New lesson plan generated!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("No lesson data received");
      }
    } catch (error) {
      console.error('Error generating new lesson:', error);
      toast.error("Failed to generate new lesson plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Start Over
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
            <Button
              onClick={handleGenerateNew}
              className="gap-2"
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate New Plan"}
            </Button>
          </div>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {lesson.ageGroup}
                  </Badge>
                </div>
                <CardTitle className="text-3xl md:text-4xl text-primary">
                  🌙 DeenSTEAM Lesson Plan – Inspired by Allah's Creation
                </CardTitle>
                <h2 className="text-2xl md:text-3xl font-bold text-accent mt-3">
                  {lesson.title}
                </h2>
                <p className="text-muted-foreground mt-2">
                  Designed for {lesson.ageGroup.toLowerCase()} learners
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Learning Objectives */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-semibold text-accent">Learning Objectives</h3>
              </div>
              <ul className="space-y-2 ml-8">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Materials Needed */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎨</span>
                <h3 className="text-xl font-semibold text-accent">Materials Needed</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-8">
                {lesson.materials.map((material, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{material}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Activities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="text-xl font-semibold text-accent">Fun Activities</h3>
              </div>
              <div className="space-y-6">
                {lesson.activities.map((activity, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-muted/30 p-5 rounded-lg border border-border/50">
                      <h4 className="font-semibold text-lg text-foreground mb-2">
                        {index + 1}. {activity.title}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                    {activity.imageUrl && (
                      <Card className="w-full md:w-64 overflow-hidden shadow-lg">
                        <img 
                          src={activity.imageUrl} 
                          alt={activity.title}
                          className="w-full h-48 object-cover"
                        />
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Try This at Home */}
            <div className="bg-accent/5 p-6 rounded-lg border-2 border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🏠</span>
                <h3 className="text-xl font-semibold text-accent">Try This at Home</h3>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">{lesson.tryAtHome.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {lesson.tryAtHome.description}
                </p>
              </div>
            </div>

            {/* Muslim Heritage Connection */}
            {lesson.scientist && (
              <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">⭐</span>
                  <h3 className="text-xl font-semibold text-primary">Muslim Heritage Connection</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-foreground font-semibold text-lg">
                    {lesson.scientist.name}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {lesson.scientist.biography}
                  </p>
                  <Button
                    onClick={() => navigate(lesson.scientist.link)}
                    variant="outline"
                    className="mt-2"
                  >
                    Learn more about {lesson.scientist.name}
                  </Button>
                </div>
              </div>
            )}

            {/* Reflecting on Allah's Creation */}
            <div className="bg-secondary/10 p-6 rounded-lg border-2 border-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌙</span>
                <h3 className="text-xl font-semibold text-secondary-foreground">
                  Reflecting on Allah's Creation
                </h3>
              </div>
              <p className="text-foreground leading-relaxed italic">
                {lesson.reflection}
              </p>
            </div>

            {/* Think and Be Grateful */}
            <div className="text-center py-4">
              <div className="flex items-center gap-2 justify-center mb-2">
                <span className="text-2xl">💭</span>
                <h3 className="text-xl font-semibold text-accent">Think and Be Grateful</h3>
              </div>
              <p className="text-muted-foreground italic">
                SubhanAllah! Reflect on Allah's perfect creation
              </p>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Aligned with the UK National Curriculum for Science (Years 1-6)
              </p>
              <p className="text-sm text-muted-foreground">
                Enriched with Islamic reflections on Allah's creation
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LessonPlanDisplay;
