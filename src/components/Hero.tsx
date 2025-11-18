import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import heroBg from "@/assets/hero-bg.jpg";
import heroBgLight from "@/assets/hero-bg-light.jpg";

const Hero = () => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url(${isDark ? heroBg : heroBgLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background dark:from-background/80 dark:via-background/60"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-primary/30 shadow-lg dark:shadow-[0_0_20px_rgba(0,230,118,0.2)]">
            <Sparkles className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(0,230,118,0.6)]" />
            <span className="text-sm font-medium text-foreground">Uttarakhand Technical University</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient-neon drop-shadow-[0_0_30px_rgba(0,230,118,0.3)] dark:drop-shadow-[0_0_50px_rgba(0,230,118,0.5)]">
              TECHSHASTRA
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-md">
            Innovate. Create. Dominate.
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-foreground/80 dark:text-muted-foreground max-w-2xl mx-auto font-medium">
            The official technical and entrepreneurship club fostering innovation, 
            collaboration, and leadership among students at UTU.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/join">
              <Button size="lg" className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(0,230,118,0.3)] hover:shadow-[0_0_50px_rgba(0,230,118,0.5)] transition-all duration-300 font-semibold">
                Join Our Community
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-2 border-primary/60 hover:bg-primary/20 hover:border-primary font-semibold backdrop-blur-sm bg-background/50">
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_20px_rgba(0,230,118,0.4)]">500+</div>
              <div className="text-sm font-medium text-foreground/70">Active Members</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-accent drop-shadow-[0_0_20px_rgba(0,212,255,0.4)]">50+</div>
              <div className="text-sm font-medium text-foreground/70">Projects Launched</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-secondary drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">20+</div>
              <div className="text-sm font-medium text-foreground/70">Events Hosted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/60 rounded-full p-1 shadow-[0_0_20px_rgba(0,230,118,0.3)]">
          <div className="w-1.5 h-3 bg-primary rounded-full mx-auto animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.6)]"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
