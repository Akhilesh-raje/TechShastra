import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            About <span className="text-gradient-neon">TECHSHASTRA</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Established in September 2023 under the guidance of Dr. Sandeep Singh Negi
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Vision</h3>
              <p className="text-muted-foreground">
                Establish a technological and entrepreneurial ecosystem in Uttarakhand that encourages students to innovate and transform ideas into successful ventures.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Mission</h3>
              <p className="text-muted-foreground">
                Build a strong technical community, provide mentorship for project development, and bridge the gap between academia and industry.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-secondary/20 hover:border-secondary/50 transition-colors">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold">Values</h3>
              <p className="text-muted-foreground">
                Innovation through collaboration, practical learning, student empowerment, and ethical technology development for society.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            TECHSHASTRA is the official <span className="text-primary font-semibold">technical and entrepreneurship club</span> of 
            Uttarakhand Technical University. We act as a hub for technical learning, innovation, and project incubation, 
            empowering students to collaborate on real-world problems, develop technical projects, and grow entrepreneurial mindsets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
