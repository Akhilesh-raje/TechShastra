import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Code, 
  Shield, 
  Cpu, 
  Bot, 
  Smartphone, 
  Cloud, 
  TrendingUp,
  Database 
} from "lucide-react";

const domains = [
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Explore cutting-edge artificial intelligence and ML technologies"
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Build modern, responsive web applications and platforms"
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Learn ethical hacking and security best practices"
  },
  {
    icon: Cpu,
    title: "IoT & Embedded",
    description: "Create smart devices and Internet of Things solutions"
  },
  {
    icon: Bot,
    title: "Robotics & Automation",
    description: "Design and build intelligent robotic systems"
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Develop mobile applications for iOS and Android"
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Master cloud infrastructure and deployment pipelines"
  },
  {
    icon: TrendingUp,
    title: "Entrepreneurship",
    description: "Transform ideas into successful startup ventures"
  },
  {
    icon: Database,
    title: "Data Science",
    description: "Analyze data and extract meaningful insights"
  }
];

const Domains = () => {
  return (
    <section id="domains" className="py-20 px-4 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-gradient-neon">Domains</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore diverse fields of technology and innovation
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            return (
              <Card 
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold">{domain.title}</h3>
                  <p className="text-muted-foreground text-sm">
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
