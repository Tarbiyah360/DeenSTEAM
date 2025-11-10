import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ParentingAssistant = () => {
  const [wisdom, setWisdom] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getWisdom = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-daily-wisdom");
      
      if (error) throw error;
      
      setWisdom(data.wisdom);
      toast({
        title: "Daily Wisdom Retrieved",
        description: "May this guidance benefit you and your family.",
      });
    } catch (error: any) {
      console.error("Error getting wisdom:", error);
      toast({
        title: "Error",
        description: "Failed to get daily wisdom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="parenting-assistant" className="py-20 px-4" aria-labelledby="parenting-heading">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4" aria-hidden="true">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h2 id="parenting-heading" className="text-4xl md:text-5xl font-bold text-foreground">
            Daily Wisdom for Parents
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Receive AI-powered guidance rooted in Qur'anic principles to nurture your child's faith and character
          </p>
        </div>

        <Card className="p-8 md:p-12 shadow-xl border-2 border-primary/10 bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm rounded-3xl">
          {!wisdom ? (
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Click below to receive your personalized daily wisdom
              </p>
              <Button
                size="lg"
                onClick={getWisdom}
                disabled={isLoading}
                className="shadow-lg hover:shadow-xl"
                aria-label={isLoading ? "Generating daily wisdom, please wait" : "Get your daily parenting wisdom"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                    Generating Wisdom...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                    Get Daily Wisdom
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div 
                className="prose prose-lg max-w-none" 
                role="article" 
                aria-label="Daily parenting wisdom"
                aria-live="polite"
              >
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {wisdom}
                </p>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={getWisdom}
                  disabled={isLoading}
                  aria-label={isLoading ? "Loading new wisdom, please wait" : "Get new daily wisdom"}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                      Get New Wisdom
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

      </div>
    </section>
  );
};

export default ParentingAssistant;