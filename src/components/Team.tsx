import { Card, CardContent } from "@/components/ui/card";
import { Crown, Award, Users } from "lucide-react";

const teamMembers = [
  { name: "Dr. Sandeep Singh Negi", role: "Founder & Mentor", icon: Crown, description: "Faculty mentor providing guidance and industry connections" },
  { name: "Akhilesh Raje", role: "President", icon: Award, description: "Leading club operations and strategic partnerships" },
  { name: "Amitesh Kumar", role: "Vice President", icon: Users, description: "Coordinating technical workshops and innovation programs" },
  { name: "Pratyush Shrivastava", role: "Secretary", icon: Users, description: "Managing communications and event logistics" },
];

const Team = () => {
  return (
    <section id="team" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wider text-foreground">
            Leadership
          </h2>
          <p className="text-base font-light text-foreground/50 max-w-2xl mx-auto tracking-wide">
            Meet the team driving innovation and excellence
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamMembers.map((member, index) => {
            const Icon = member.icon;
            return (
              <Card 
                key={index}
                className="glass rounded-bento border-0 hover:scale-[1.02] transition-all duration-500 group"
              >
                <CardContent className="p-7 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-primary/8 flex items-center justify-center mx-auto group-hover:bg-primary/15 transition-colors duration-500">
                    <Icon className="w-7 h-7 text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-heading font-normal tracking-wider">{member.name}</h3>
                    <p className="text-xs font-light tracking-widest uppercase text-foreground/40">{member.role}</p>
                    <p className="text-xs font-light text-foreground/35 leading-relaxed pt-1">{member.description}</p>
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
