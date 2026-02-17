import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wider text-foreground">
            About Us
          </h2>
          <p className="text-base font-light text-foreground/50 max-w-2xl mx-auto tracking-wide">
            Established in September 2023 under the guidance of Dr. Sandeep Singh Negi
          </p>
        </div>

        {/* Mission Cards - Bento glass style */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          <Card className="glass rounded-bento border-0 hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-8 space-y-5">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary/70" />
              </div>
              <h3 className="text-lg font-heading font-light tracking-wider">Vision</h3>
              <p className="text-sm font-light text-foreground/50 leading-relaxed">
                Establish a technological and entrepreneurial ecosystem in Uttarakhand that encourages students to innovate and transform ideas into successful ventures.
              </p>
            </CardContent>
          </Card>

          <Card className="glass rounded-bento border-0 hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-8 space-y-5">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-accent/70" />
              </div>
              <h3 className="text-lg font-heading font-light tracking-wider">Mission</h3>
              <p className="text-sm font-light text-foreground/50 leading-relaxed">
                Build a strong technical community, provide mentorship for project development, and bridge the gap between academia and industry.
              </p>
            </CardContent>
          </Card>

          <Card className="glass rounded-bento border-0 hover:scale-[1.02] transition-all duration-500">
            <CardContent className="p-8 space-y-5">
              <div className="w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-secondary/70 dark:text-secondary" />
              </div>
              <h3 className="text-lg font-heading font-light tracking-wider">Values</h3>
              <p className="text-sm font-light text-foreground/50 leading-relaxed">
                Innovation through collaboration, practical learning, student empowerment, and ethical technology development for society.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <div className="glass rounded-bento p-10 border-0">
          <p className="text-base font-light text-foreground/60 leading-loose text-center tracking-wide">
            TECHSHASTRA is the official technical and entrepreneurship club of 
            Uttarakhand Technical University. We act as a hub for technical learning, innovation, and project incubation, 
            empowering students to collaborate on real-world problems, develop technical projects, and grow entrepreneurial mindsets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
