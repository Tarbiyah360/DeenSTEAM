import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo.png";
import { Sparkles, BookOpen, Atom, FlaskConical, Lightbulb, Cpu, Telescope, Dna } from "lucide-react";

const Hero = () => {

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero section">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="img"
        aria-label="Background with STEAM educational doodles including scientific symbols, mathematical formulas, and geometric shapes"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background/95" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Logo with Orbital Doodles */}
          <div className="relative flex justify-center mb-6 h-80">
            {/* Central Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <img 
                src={logo} 
                alt="Tarbiyah360 logo featuring a crescent moon and stars" 
                className="w-32 h-32 animate-in fade-in zoom-in duration-700 drop-shadow-2xl"
              />
            </div>

            {/* Orbiting STEAM Icons */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              {/* Science - Atom */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDelay: '0s' }}>
                <Atom className="w-12 h-12 text-accent drop-shadow-lg" strokeWidth={1.5} />
              </div>
              
              {/* Technology - CPU */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDelay: '-3.3s' }}>
                <Cpu className="w-14 h-14 text-primary-foreground/90 drop-shadow-lg" strokeWidth={1.5} />
              </div>
              
              {/* Engineering - Lightbulb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDelay: '-6.6s' }}>
                <Lightbulb className="w-11 h-11 text-accent/90 drop-shadow-lg" strokeWidth={1.5} />
              </div>
              
              {/* Arts - Telescope */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{ animationDelay: '0s' }}>
                <Telescope className="w-13 h-13 text-primary-foreground drop-shadow-lg" strokeWidth={1.5} />
              </div>
              
              {/* Math - Flask */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{ animationDelay: '-6.25s' }}>
                <FlaskConical className="w-12 h-12 text-accent/80 drop-shadow-lg" strokeWidth={1.5} />
              </div>
              
              {/* DNA */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{ animationDelay: '-12.5s' }}>
                <Dna className="w-10 h-10 text-primary-foreground/90 drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight animate-in slide-in-from-bottom-4 duration-700">
            Tarbiyah360°
          </h1>
          
          <p className="text-2xl md:text-3xl text-primary-foreground/90 font-light animate-in slide-in-from-bottom-4 duration-700 delay-150">
            Where Faith Meets Discovery
          </p>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
            Nurture your child's faith and curiosity through AI-powered Islamic tarbiyah combined with STEAM learning. 
            Qur'anic wisdom meets modern science.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button 
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/daily-wisdom">
                <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                Get Daily Wisdom
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm"
            >
              <Link to="/lesson-generator">
                <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
                Create a Lesson
              </Link>
            </Button>
          </div>
        </div>
      </div>


      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;