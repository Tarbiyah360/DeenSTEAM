import { Card } from "@/components/ui/card";
import { Atom, Microscope, Telescope, Beaker, Eye, Cog, Wrench, PaintbrushIcon, Calculator} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";



const steamTopics = [
  {
    icon: Eye,
    title: "Science",
    description: "Discover the father of optics and scientific method",
    inventor: "Ibn al-Haytham",
    contribution: "Pioneered experimental physics and optics",
    link: "/scientist/ibn-al-haytham",
  },
  {
    icon: Cog,
    title: "Technology",
    description: "Revolutionary mechanical inventions and automation",
    inventor: "Al-Jazari",
    contribution: "Created the first programmable humanoid robot",
    link: "/scientist/al-jazari",
  },
  {
    icon: Wrench,
    title: "Engineering",
    description: "Ingenious mechanical devices and mathematical instruments",
    inventor: "Banu Musa Brothers",
    contribution: "Automatic control systems and clever mechanisms",
    link: "/scientist/banu-musa",
  },
  {
    icon: PaintbrushIcon,
    title: "Art & Architecture",
    description: "Master architect of magnificent Ottoman structures",
    inventor: "Mimar Sinan",
    contribution: "Designed 300+ architectural masterpieces",
    link: "/scientist/mimar-sinan",
  },
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Brilliant mathematician, astronomer, and poet",
    inventor: "Omar Khayyam",
    contribution: "Geometric algebra and calendar reform",
    link: "/scientist/omar-khayyam",
  },
  {
    icon: Telescope,
    title: "Astronomy",
    description: "Explore the universe through Islamic golden age astronomers",
    inventor: "Al-Battani",
    contribution: "Precise calculations of planetary orbits",
    link: "/scientist/al-battani",
  },
  {
    icon: Beaker,
    title: "Chemistry",
    description: "Discover the foundations of modern chemistry",
    inventor: "Jabir ibn Hayyan",
    contribution: "Father of chemistry, pioneered experimental methods",
    link: "/scientist/jabir-ibn-hayyan",
  },
  {
    icon: Microscope,
    title: "Medicine",
    description: "Learn about revolutionary medical discoveries",
    inventor: "Ibn Sina (Avicenna)",
    contribution: "The Canon of Medicine, used for 600+ years",
    link: "/scientist/ibn-sina",
  },
  {
    icon: Atom,
    title: "Algebra",
    description: "Mathematical innovations that changed the world",
    inventor: "Al-Khwarizmi",
    contribution: "Algebra and algorithms",
    link: "/scientist/al-khwarizmi",
  },
];


const STEAMExplorer = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state: { missingScientist?: string } };
  const missingScientist = location.state?.missingScientist;

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

        {missingScientist && (
          <div className="mb-8 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-900">
            <p className="font-semibold">
              "Oh no! That&apos;s all the information we had for {" "}
              <span className="underline">{missingScientist}</span>
            </p>
            <p className="mt-1">
              How about you try and explore one of the amazing Muslim scientists and inventors from the subjects below instead?
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {steamTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <Card 
                key={index}
                onClick={() => navigate(topic.link)}
                className="p-5 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group cursor-pointer hover:scale-[1.02]"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <div className="space-y-2 sm:space-y-3 flex-1">
                    <h3 className="font-bold text-lg sm:text-xl text-foreground">{topic.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
                    <div className="pt-2 border-t border-border/50">
                      <p className="font-semibold text-sm sm:text-base text-accent-foreground">{topic.inventor}</p>
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