import { Card, CardContent } from "@/components/ui/card";
import { Crown, Award, Users } from "lucide-react";

const teamMembers = [
  {
    name: "Dr. Sandeep Singh Negi",
    role: "Founder & Mentor",
    icon: Crown,
    description: "Faculty mentor providing guidance and industry connections"
  },
  {
    name: "Akhilesh Raje",
    role: "President",
    icon: Award,
    description: "Leading club operations and strategic partnerships"
  },
  {
    name: "Amitesh Kumar",
    role: "Vice President",
    icon: Users,
    description: "Coordinating technical workshops and innovation programs"
  },
  {
    name: "Pratyush Shrivastava",
    role: "Secretary",
    icon: Users,
    description: "Managing communications and event logistics"
  }
];

const Team = () => {
  return (
    <section id="team" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-gradient-neon">Leadership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the team driving innovation and excellence
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card 
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/40 transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform animate-glow">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary font-semibold mb-2">{member.role}</p>
                    <p className="text-xs text-muted-foreground">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
