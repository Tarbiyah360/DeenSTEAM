import Hero from "@/components/Hero";
import ParentingAssistant from "@/components/ParentingAssistant";
import STEAMExplorer from "@/components/STEAMExplorer";
import LessonGenerator from "@/components/LessonGenerator";
import VolunteerMap from "@/components/VolunteerMap";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ParentingAssistant />
      <STEAMExplorer />
      <LessonGenerator />
      <VolunteerMap />
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 bg-muted/30">
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