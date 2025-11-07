import Hero from "@/components/Hero";
import ParentingAssistant from "@/components/ParentingAssistant";
import STEAMExplorer from "@/components/STEAMExplorer";
import LessonGenerator from "@/components/LessonGenerator";
import VolunteerMap from "@/components/VolunteerMap";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <Hero />
      
      <main id="main-content">
        <ParentingAssistant />
        <STEAMExplorer />
        <LessonGenerator />
        <VolunteerMap />
      </main>
      
      {/* Footer */}
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