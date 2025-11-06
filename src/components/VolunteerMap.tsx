import { Card } from "@/components/ui/card";
import { Globe, Users, Heart } from "lucide-react";

const regions = [
  { name: "North America", contributors: 45, educators: 23 },
  { name: "Europe", contributors: 38, educators: 19 },
  { name: "Middle East", contributors: 67, educators: 34 },
  { name: "Asia", contributors: 89, educators: 42 },
  { name: "Africa", contributors: 34, educators: 18 },
  { name: "Australia", contributors: 12, educators: 7 },
];

const VolunteerMap = () => {
  const totalContributors = regions.reduce((sum, r) => sum + r.contributors, 0);
  const totalEducators = regions.reduce((sum, r) => sum + r.educators, 0);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Global Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join educators and contributors from around the world nurturing the next generation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground">{totalContributors}</p>
            <p className="text-sm text-muted-foreground mt-1">Global Contributors</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <Users className="h-10 w-10 text-secondary-foreground mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground">{totalEducators}</p>
            <p className="text-sm text-muted-foreground mt-1">Active Educators</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <Heart className="h-10 w-10 text-accent-foreground mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground">1000+</p>
            <p className="text-sm text-muted-foreground mt-1">Families Reached</p>
          </Card>
        </div>

        {/* Regional Breakdown */}
        <Card className="p-8 shadow-lg border-border/50">
          <h3 className="font-bold text-xl text-foreground mb-6 text-center">
            Community by Region
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((region, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
              >
                <h4 className="font-semibold text-foreground mb-2">{region.name}</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-primary">{region.contributors}</span> Contributors
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-secondary-foreground">{region.educators}</span> Educators
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-border/30">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Join Our Global Mission
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Help us reach more families worldwide by contributing lessons, translations, or becoming an educator
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Whoever guides someone to goodness will have a reward like those who follow it" - Prophet Muhammad ﷺ
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VolunteerMap;