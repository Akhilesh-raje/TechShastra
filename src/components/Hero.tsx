import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
        className="absolute inset-0 z-0 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${isDark ? heroBg : heroBgLight})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Soft lilac overlay keeping photography dominant */}
        <div className="absolute inset-0 bg-background/50 dark:bg-background/60" />
      </div>

      {/* Subtle ambient shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px] animate-float animate-soft-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Subtle tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-sm font-light tracking-wider text-foreground/80">
            Uttarakhand Technical University
          </div>

          {/* Main Heading - calm, not loud */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-light tracking-[0.08em] text-foreground">
            TECHSHASTRA
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-light tracking-[0.12em] text-foreground/70">
            Innovate · Create · Dominate
          </p>

          {/* Description */}
          <p className="text-base md:text-lg font-light text-foreground/60 max-w-xl mx-auto leading-relaxed">
            The official technical and entrepreneurship club fostering innovation, 
            collaboration, and leadership among students.
          </p>

          {/* CTA Buttons - pill-shaped, low-contrast, confident */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/join">
              <Button size="lg" className="rounded-full px-10 py-6 font-light tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-500 shadow-lg">
                Join Our Community
                <ArrowRight className="ml-3 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="rounded-full px-10 py-6 font-light tracking-wider border border-foreground/20 bg-card/30 backdrop-blur-sm hover:bg-card/60 text-foreground/80 hover:text-foreground transition-all duration-500">
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats - understated */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-lg mx-auto">
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-heading font-light text-foreground">500+</div>
              <div className="text-xs font-light tracking-wider text-foreground/50 uppercase">Members</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-heading font-light text-foreground">50+</div>
              <div className="text-xs font-light tracking-wider text-foreground/50 uppercase">Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl md:text-4xl font-heading font-light text-foreground">20+</div>
              <div className="text-xs font-light tracking-wider text-foreground/50 uppercase">Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border border-foreground/20 rounded-full p-1">
          <div className="w-1.5 h-3 bg-foreground/30 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
