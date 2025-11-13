import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

interface LessonData {
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

const LessonPlanDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson } = location.state as { lesson: LessonData } || {};

  if (!lesson) {
    navigate('/dashboard');
    return null;
  }

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleGenerateNew = () => {
    navigate('/dashboard');
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
            >
              <Sparkles className="h-4 w-4" />
              Generate New Plan
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
              <div className="space-y-4">
                {lesson.activities.map((activity, index) => (
                  <div key={index} className="bg-muted/30 p-5 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-lg text-foreground mb-2">
                      {index + 1}. {activity.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <h3 className="text-xl font-semibold text-primary">Muslim Heritage Connection</h3>
                </div>
                <p className="text-foreground mb-3">
                  Learn more about <button
                    onClick={() => navigate(lesson.scientist.link)}
                    className="text-primary underline font-semibold hover:text-primary/80"
                  >
                    {lesson.scientist.name}
                  </button>, a brilliant Muslim scientist who contributed to this field!
                </p>
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
