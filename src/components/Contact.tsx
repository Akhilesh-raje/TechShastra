import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

const contactInfo = [
  { icon: Mail, label: "Email", value: "vmsb.utu.ddn.2023@gmail.com", link: "mailto:vmsb.utu.ddn.2023@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 7817030426", link: "tel:+917817030426" },
  { icon: Phone, label: "Alternative", value: "+91 7439587546", link: "tel:+917439587546" },
  { icon: MapPin, label: "Location", value: "UTU Dehradun, Uttarakhand", link: "https://maps.google.com/?q=Uttarakhand+Technical+University" },
];

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", link: "https://www.linkedin.com/company/tech-shastra/" },
  { icon: Instagram, label: "Instagram", link: "https://www.instagram.com/techshastra_utu" },
];

const leadershipContacts = [
  { name: "Amitesh Kumar", role: "Vice-President", email: "amitesh.kumar@example.com", phone: "+91 7439587546" },
  { name: "Akhilesh Raje", role: "President", email: "akhilesh.raje@example.com", phone: "+91 7817030426" },
  { name: "Pratyush Shrivastava", role: "Secretary", email: "pratyush@example.com", phone: "+91 XXXXXXXXXX" },
];

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wider text-foreground">
            Contact Authority
          </h2>
          <div className="space-y-2">
            <p className="text-sm font-light tracking-[0.2em] uppercase text-primary/60">
              For collaborations, partnerships, and institutional coordination
            </p>
            <p className="text-base font-light text-foreground/50 max-w-2xl mx-auto tracking-wide italic">
              "Direct access to leadership for strategic inquiries and partnerships."
            </p>
          </div>
        </div>

        {/* Leadership Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {leadershipContacts.map((lead, index) => (
            <Card key={index} className="glass border-0 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 group">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-heading font-normal tracking-wide text-foreground group-hover:text-primary transition-colors">
                    {lead.name}
                  </h3>
                  <p className="text-[10px] font-light tracking-[0.2em] uppercase text-foreground/40">{lead.role}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-foreground/5">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-3 text-sm font-light text-foreground/50 hover:text-foreground transition-colors group/link">
                    <Mail className="w-4 h-4 text-primary/40 group-hover/link:text-primary" />
                    {lead.email}
                  </a>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-3 text-sm font-light text-foreground/50 hover:text-foreground transition-colors group/link">
                    <Phone className="w-4 h-4 text-primary/40 group-hover/link:text-primary" />
                    {lead.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* General Contact Info */}
          <div className="space-y-4">
            <Card className="glass rounded-3xl border-0 p-10 space-y-6">
              <h3 className="text-xl font-heading font-light tracking-wider">Office Location</h3>
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-light text-foreground/60 leading-relaxed">
                    Uttarakhand Technical University<br />
                    Post Office Chandanwadi, Prem Nagar<br />
                    Sudhowala, Dehradun, Uttarakhand
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-foreground/5">
                <p className="text-xs font-light tracking-widest uppercase text-foreground/30 mb-2">Social Reach</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="w-12 h-12 rounded-2xl border-0 bg-primary/5 hover:bg-primary/15 text-foreground/40 hover:text-foreground/70 transition-all duration-500"
                        asChild
                      >
                        <a href={social.link} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                          <Icon className="w-5 h-5" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Business Hours / Identity */}
          <Card className="glass rounded-3xl border-0 p-10 bg-primary/5">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-light tracking-wider text-primary">Organizational Identity</h3>
                <p className="text-sm font-light text-foreground/50 leading-loose italic">
                  TECHSHASTRA is a student-led innovation ecosystem anchored by academic excellence.
                  We respond to strategic inquiries within 48 business hours.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-foreground/5">
                <div className="flex justify-between items-center text-sm font-light">
                  <span className="text-foreground/40 uppercase tracking-widest text-[10px]">Strategic Queries</span>
                  <span className="text-foreground/70">President's Office</span>
                </div>
                <div className="flex justify-between items-center text-sm font-light">
                  <span className="text-foreground/40 uppercase tracking-widest text-[10px]">Ops & Culture</span>
                  <span className="text-foreground/70">VP's Office</span>
                </div>
                <div className="flex justify-between items-center text-sm font-light">
                  <span className="text-foreground/40 uppercase tracking-widest text-[10px]">Innovation Lab</span>
                  <span className="text-foreground/70">CTO Board</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
