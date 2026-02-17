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

const Contact = () => {
  return (
    <section id="contact" className="py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wider text-foreground">
            Get In Touch
          </h2>
          <p className="text-base font-light text-foreground/50 max-w-2xl mx-auto tracking-wide">
            Ready to innovate with us? Reach out and join the community
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="glass rounded-bento border-0 hover:scale-[1.01] transition-all duration-500">
                  <CardContent className="p-6">
                    <a href={info.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                      <div className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-500">
                        <Icon className="w-5 h-5 text-foreground/35 group-hover:text-foreground/60 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-light tracking-wider uppercase text-foreground/35 mb-0.5">{info.label}</p>
                        <p className="text-sm font-light tracking-wide text-foreground/70 group-hover:text-foreground transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Card */}
          <Card className="glass rounded-bento border-0">
            <CardContent className="p-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-heading font-light tracking-wider">Join Our Community</h3>
                <p className="text-sm font-light text-foreground/45 leading-relaxed">
                  Connect with us on social media and stay updated with the latest events, 
                  workshops, and opportunities at TECHSHASTRA.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className="w-11 h-11 rounded-full border-foreground/10 bg-primary/5 hover:bg-primary/15 text-foreground/40 hover:text-foreground/70 transition-all duration-500"
                      asChild
                    >
                      <a href={social.link} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                        <Icon className="w-4 h-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>

              {/* Address */}
              <div className="pt-6 border-t border-foreground/5">
                <p className="text-xs font-light tracking-wider uppercase text-foreground/30 mb-3">Visit Us</p>
                <p className="text-sm font-light text-foreground/50 leading-relaxed">
                  Uttarakhand Technical University<br />
                  Post Office Chandanwadi, Prem Nagar<br />
                  Sudhowala, Dehradun, Uttarakhand
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
