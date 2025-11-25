import { useLocation, useNavigate, Link } from "react-router-dom";
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
    duration?: string;
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

const LessonPlanDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson: initialLesson, age, topic } = location.state as { lesson: LessonData; age: number; topic: string } || {};
  
  const [lesson, setLesson] = useState<LessonData | null>(initialLesson);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!lesson) {
    navigate('/lesson-generator');
    return null;
  }

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `DeenSTEAM - ${lesson.title}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleGenerateNew = async () => {
    if (!age || !topic) {
      toast.error("Cannot generate new plan without age and topic information");
      return;
    }

    setIsGenerating(true);
    
    try {
      const yearMap: Record<number, number> = {
        5: 1, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6
      };
      const year = yearMap[age];

      const { data, error } = await supabase.functions.invoke('generate-lesson', {
        body: { age, year, topic }
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
            onClick={() => navigate('/')}
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
                    <span className="text-lg">
                      {material.toLowerCase().includes('paper') ? '📄' :
                       material.toLowerCase().includes('pen') || material.toLowerCase().includes('pencil') ? '✏️' :
                       material.toLowerCase().includes('scissors') ? '✂️' :
                       material.toLowerCase().includes('glue') || material.toLowerCase().includes('tape') ? '📎' :
                       material.toLowerCase().includes('paint') || material.toLowerCase().includes('color') || material.toLowerCase().includes('crayon') ? '🎨' :
                       material.toLowerCase().includes('book') ? '📚' :
                       material.toLowerCase().includes('water') ? '💧' :
                       material.toLowerCase().includes('bowl') || material.toLowerCase().includes('container') ? '🥣' :
                       '✓'}
                    </span>
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
                  <div key={index} className="bg-muted/30 p-5 rounded-lg border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg text-foreground">
                        {index + 1}. {activity.title}
                      </h4>
                      {activity.duration && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          ⏱️ {activity.duration}
                        </span>
                      )}
                    </div>
                    
                    {activity.steps && activity.steps.length > 0 ? (
                      <div className="space-y-4">
                        {activity.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-32 h-32 bg-background rounded-lg overflow-hidden border border-border">
                              {step.imageUrl ? (
                                <img 
                                  src={step.imageUrl} 
                                  alt={`Step ${step.stepNumber}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  Step {step.stepNumber}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-1 text-foreground">Step {step.stepNumber}</p>
                              <p className="text-muted-foreground leading-relaxed">{step.instruction}</p>
                            </div>
                          </div>
                        ))}
                        
                        {activity.finalImageUrl && (
                          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h5 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              Final Result:
                            </h5>
                            <div className="w-48 h-48 mx-auto bg-background rounded-lg overflow-hidden border-2 border-primary/30">
                              <img 
                                src={activity.finalImageUrl} 
                                alt="Finished craft"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
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
              <Link to={lesson.scientist.link}>
                <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20 transition-all hover:bg-primary/10 hover:border-primary/30 cursor-pointer">
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
                  </div>
                </div>
              </Link>
            )}

            {/* Reflecting on Allah's Creation */}
            <div className="bg-secondary/10 p-6 rounded-lg border-2 border-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🌙</span>
                <h3 className="text-xl font-semibold text-secondary-foreground">
                  Reflection
                </h3>
              </div>
              <p className="text-foreground leading-relaxed text-center italic text-lg">
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
