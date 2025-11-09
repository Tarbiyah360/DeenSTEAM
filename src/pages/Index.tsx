import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, BookOpen, Atom, Globe, ArrowRight, Users, Heart, Microscope, Cpu, Cog, Palette, Calculator } from "lucide-react";

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

const steamCategories = [
  {
    icon: Microscope,
    title: "Science",
    description: "Explore discoveries in chemistry, medicine, and natural sciences",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Cpu,
    title: "Technology",
    description: "Innovations in computing, engineering, and digital tools",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Cog,
    title: "Engineering",
    description: "Revolutionary designs in mechanics, architecture, and systems",
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    icon: Palette,
    title: "Arts",
    description: "Geometric patterns, calligraphy, and visual innovations",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Algebra, algorithms, and numerical breakthroughs",
    color: "from-yellow-500/20 to-amber-500/20",
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

        {/* STEAM Explorer Preview */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Atom className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                STEAM Learning
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover Muslim scientists and inventors who shaped modern science
              </p>
            </div>

            {/* STEAM Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {steamCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={index}
                    className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7 text-foreground" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </Card>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/steam-explorer">
                  Explore All STEAM Topics
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Global Community Section */}
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

            {/* Stats Preview */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">285</p>
                <p className="text-sm text-muted-foreground mt-1">Global Contributors</p>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
                <Users className="h-10 w-10 text-secondary-foreground mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">143</p>
                <p className="text-sm text-muted-foreground mt-1">Active Educators</p>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
                <Heart className="h-10 w-10 text-accent-foreground mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">1000+</p>
                <p className="text-sm text-muted-foreground mt-1">Families Reached</p>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/community">
                  View Full Community Map
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-12 px-4 border-t border-border/50 bg-muted/30" role="contentinfo">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg text-foreground mb-3">Tarbiyah360°</h3>
              <p className="text-sm text-muted-foreground">
                Nurturing Faith & Curiosity through Islamic education and STEAM learning
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h3 className="font-bold text-lg text-foreground mb-3">Resources</h3>
              <nav aria-label="Footer navigation">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/daily-wisdom" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Daily Wisdom
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/steam-explorer" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      STEAM Explorer
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/lesson-generator" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Lesson Generator
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/community" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Community
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Legal & Accessibility */}
            <div className="text-center md:text-right">
              <h3 className="font-bold text-lg text-foreground mb-3">Legal & Support</h3>
              <nav aria-label="Legal navigation">
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/privacy-policy" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/terms-of-use" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Terms of Use
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/accessibility-statement" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded inline-block"
                    >
                      Accessibility Statement
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Copyright & Social */}
          <div className="pt-8 border-t border-border/50 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Tarbiyah360°. All rights reserved.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4" role="list" aria-label="Social media links">
              <a 
                href="https://twitter.com/tarbiyah360" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-2"
                aria-label="Follow Tarbiyah360 on Twitter (opens in new window)"
                role="listitem"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://facebook.com/tarbiyah360" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-2"
                aria-label="Follow Tarbiyah360 on Facebook (opens in new window)"
                role="listitem"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://instagram.com/tarbiyah360" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded p-2"
                aria-label="Follow Tarbiyah360 on Instagram (opens in new window)"
                role="listitem"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;