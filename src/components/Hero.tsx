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
        <div className="absolute inset-0 bg-background/40 dark:bg-background/55" />
      </div>

      {/* Subtle ambient shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-secondary/15 blur-[120px] animate-float animate-soft-pulse" />
        <div className="absolute -bottom-24 -right-24 w-[560px] h-[560px] rounded-full bg-accent/10 blur-[140px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Subtle tag */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass text-xs font-sans font-normal tracking-[0.16em] uppercase text-foreground/70">
            Uttarakhand Technical University
          </div>

          {/* Main Heading */}
          <h1 className="font-heading font-light tracking-[0.12em] leading-none text-foreground">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              TECHSHASTRA
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-heading text-lg md:text-xl font-light tracking-[0.18em] uppercase text-foreground/60">
            Innovate · Create · Dominate
          </p>

          {/* Description */}
          <p className="font-sans text-sm md:text-base font-light leading-relaxed text-foreground/55 max-w-md mx-auto">
            The official technical and entrepreneurship club fostering innovation, 
            collaboration, and leadership among students.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Link to="/join">
              <Button
                size="lg"
                className="rounded-full px-10 py-6 font-sans font-light text-sm tracking-[0.08em] bg-primary text-primary-foreground hover:bg-primary/85 transition-all duration-500 shadow-lg"
              >
                Join Our Community
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-6 font-sans font-light text-sm tracking-[0.08em] border border-foreground/15 bg-card/20 backdrop-blur-sm hover:bg-card/50 text-foreground/70 hover:text-foreground transition-all duration-500"
              >
                Explore Projects
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-14 max-w-sm mx-auto">
            {[
              { value: "500+", label: "Members" },
              { value: "50+", label: "Projects" },
              { value: "20+", label: "Events" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1.5">
                <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-foreground">
                  {stat.value}
                </div>
                <div className="font-sans text-[10px] sm:text-xs font-normal tracking-[0.16em] uppercase text-foreground/45">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-5 h-9 border border-foreground/15 rounded-full p-1">
          <div className="w-1 h-2.5 bg-foreground/25 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
