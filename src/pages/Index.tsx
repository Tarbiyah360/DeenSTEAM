import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, BookOpen, Atom, Globe, ArrowRight } from "lucide-react";

const sections = [
  {
    icon: Sparkles,
    title: "Daily Wisdom",
    description: "Receive AI-powered guidance rooted in Qur'anic principles to nurture your child's faith and character",
    path: "/daily-wisdom",
    color: "from-primary/20 to-secondary/20",
  },
  {
    icon: Atom,
    title: "STEAM Explorer",
    description: "Discover Muslim scientists and inventors who shaped modern science",
    path: "/steam-explorer",
    color: "from-secondary/20 to-accent/20",
  },
  {
    icon: BookOpen,
    title: "Lesson Generator",
    description: "Create custom Islamic tarbiyah lessons combined with STEAM topics",
    path: "/lesson-generator",
    color: "from-accent/20 to-primary/20",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Join educators and contributors from around the world nurturing the next generation",
    path: "/community",
    color: "from-primary/20 to-accent/20",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <Hero />
      
      <main id="main-content">
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Explore Our Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools to nurture faith and curiosity in your children
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card 
                    key={index}
                    className="p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
                  >
                    <div className="space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-2xl text-foreground">{section.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                      <Button asChild className="w-full group-hover:bg-primary/90">
                        <Link to={section.path}>
                          Explore <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-4 border-t border-border/50 bg-muted/30" role="contentinfo">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Tarbiyah360° - Nurturing Faith & Curiosity
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;