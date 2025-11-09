import { Card } from "@/components/ui/card";
import { Atom, Microscope, Telescope, Beaker } from "lucide-react";

const steamTopics = [
  {
    icon: Telescope,
    title: "Astronomy",
    description: "Explore the universe through Islamic golden age astronomers",
    inventor: "Al-Battani",
    contribution: "Precise calculations of planetary orbits",
  },
  {
    icon: Beaker,
    title: "Chemistry",
    description: "Discover the foundations of modern chemistry",
    inventor: "Jabir ibn Hayyan",
    contribution: "Father of chemistry, pioneered experimental methods",
  },
  {
    icon: Microscope,
    title: "Medicine",
    description: "Learn about revolutionary medical discoveries",
    inventor: "Ibn Sina (Avicenna)",
    contribution: "The Canon of Medicine, used for 600+ years",
  },
  {
    icon: Atom,
    title: "Mathematics",
    description: "Mathematical innovations that changed the world",
    inventor: "Al-Khwarizmi",
    contribution: "Algebra and algorithms",
  },
];

const STEAMExplorer = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            STEAM Learning Explorer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Muslim scientists and inventors who shaped modern science, inspired by the 1001 Inventions heritage
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steamTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <Card 
                key={index}
                className="p-6 md:p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="font-bold text-xl text-foreground">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                    <div className="pt-2 border-t border-border/50">
                      <p className="font-semibold text-accent-foreground">{topic.inventor}</p>
                      <p className="text-xs text-muted-foreground mt-1">{topic.contribution}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default STEAMExplorer;