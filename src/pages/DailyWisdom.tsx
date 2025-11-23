import Navigation from "@/components/Navigation";
import ParentingAssistant from "@/components/ParentingAssistant";

const DailyWisdom = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ParentingAssistant />
      </main>
      <footer className="py-8 px-4 border-t border-border/50 bg-muted/30" role="contentinfo">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            DeenSTEAM - Nurturing Faith & Curiosity
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © 2025 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DailyWisdom;
