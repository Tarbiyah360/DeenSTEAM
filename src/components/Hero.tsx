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
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-background/95" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="DeenSTEAM logo featuring a crescent moon and stars" 
              className="w-24 h-24 animate-in fade-in zoom-in duration-700"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight animate-in slide-in-from-bottom-4 duration-700">
            DeenSTEAM
          </h1>
          
          <p className="text-xl sm:text-2xl md:text-3xl text-primary-foreground/90 font-light animate-in slide-in-from-bottom-4 duration-700 delay-150">
            Where Faith Meets Discovery
          </p>

          <p className="text-base sm:text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-700 delay-300">
            Nurture your child's faith and curiosity through AI-powered Islamic tarbiyah combined with STEAM learning. 
            Qur'anic wisdom meets modern science.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 animate-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button 
              size="lg"
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/daily-wisdom">
                <Sparkles className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
                Get Daily Wisdom
              </Link>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full backdrop-blur-sm"
            >
              <Link to="/lesson-generator">
                <BookOpen className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
                Create a Lesson
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating STEAM Icons - Decorative */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Science - Atom */}
        <div className="absolute top-[15%] left-[8%] opacity-90 animate-float" style={{ animationDelay: '0s' }}>
          <Atom className="w-20 h-20 text-accent" strokeWidth={1.5} />
        </div>
        
        {/* Technology - CPU */}
        <div className="absolute top-[25%] right-[12%] opacity-85 animate-float-slow" style={{ animationDelay: '1s' }}>
          <Cpu className="w-24 h-24 text-primary-foreground/90" strokeWidth={1.5} />
        </div>
        
        {/* Engineering - Lightbulb */}
        <div className="absolute top-[60%] left-[15%] opacity-90 animate-float" style={{ animationDelay: '2s' }}>
          <Lightbulb className="w-18 h-18 text-accent/95" strokeWidth={1.5} />
        </div>
        
        {/* Arts - Telescope */}
        <div className="absolute top-[45%] right-[8%] opacity-90 animate-float-slow" style={{ animationDelay: '1.5s' }}>
          <Telescope className="w-22 h-22 text-primary-foreground/95" strokeWidth={1.5} />
        </div>
        
        {/* Math - Flask */}
        <div className="absolute top-[70%] right-[20%] opacity-85 animate-float" style={{ animationDelay: '0.5s' }}>
          <FlaskConical className="w-20 h-20 text-accent/90" strokeWidth={1.5} />
        </div>
        
        {/* DNA */}
        <div className="absolute top-[35%] left-[5%] opacity-90 animate-float-slow" style={{ animationDelay: '2.5s' }}>
          <Dna className="w-16 h-16 text-primary-foreground/90" strokeWidth={1.5} />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;