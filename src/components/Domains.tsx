import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, Code, Shield, Cpu, Bot, Smartphone, Cloud, TrendingUp, Database 
} from "lucide-react";

const domains = [
  { icon: Brain, title: "AI & Machine Learning", description: "Explore cutting-edge artificial intelligence and ML technologies" },
  { icon: Code, title: "Web Development", description: "Build modern, responsive web applications and platforms" },
  { icon: Shield, title: "Cybersecurity", description: "Learn ethical hacking and security best practices" },
  { icon: Cpu, title: "IoT & Embedded", description: "Create smart devices and Internet of Things solutions" },
  { icon: Bot, title: "Robotics & Automation", description: "Design and build intelligent robotic systems" },
  { icon: Smartphone, title: "App Development", description: "Develop mobile applications for iOS and Android" },
  { icon: Cloud, title: "Cloud & DevOps", description: "Master cloud infrastructure and deployment pipelines" },
  { icon: TrendingUp, title: "Entrepreneurship", description: "Transform ideas into successful startup ventures" },
  { icon: Database, title: "Data Science", description: "Analyze data and extract meaningful insights" },
];

const Domains = () => {
  return (
    <section id="domains" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wider text-foreground">
            Our Domains
          </h2>
          <p className="text-base font-light text-foreground/50 max-w-2xl mx-auto tracking-wide">
            Explore diverse fields of technology and innovation
          </p>
        </div>

        {/* Domains Grid - Bento glass cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card 
                key={index}
                className="glass rounded-bento border-0 hover:scale-[1.02] transition-all duration-500 group"
              >
                <CardContent className="p-7 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-500">
                    <Icon className="w-5 h-5 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-500" />
                  </div>
                  <h3 className="text-base font-heading font-light tracking-wider">{domain.title}</h3>
                  <p className="text-sm font-light text-foreground/40 leading-relaxed">
                    {domain.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Domains;
