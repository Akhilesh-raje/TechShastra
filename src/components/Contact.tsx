import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "vmsb.utu.ddn.2023@gmail.com",
    link: "mailto:vmsb.utu.ddn.2023@gmail.com"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 7817030426",
    link: "tel:+917817030426"
  },
  {
    icon: Phone,
    label: "Alternative",
    value: "+91 7439587546",
    link: "tel:+917439587546"
  },
  {
    icon: MapPin,
    label: "Location",
    value: "UTU Dehradun, Uttarakhand",
    link: "https://maps.google.com/?q=Uttarakhand+Technical+University"
  }
];

const socialLinks = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    link: "https://www.linkedin.com/company/tech-shastra/",
    color: "hover:text-[#0077B5]"
  },
  {
    icon: Instagram,
    label: "Instagram", 
    link: "https://www.instagram.com/techshastra_utu",
    color: "hover:text-[#E4405F]"
  }
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Get In <span className="text-gradient-neon">Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to innovate with us? Reach out and join the community
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-6">
                    <a 
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                        <p className="font-semibold group-hover:text-primary transition-colors">
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
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-primary/20">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Join Our Community</h3>
                <p className="text-muted-foreground">
                  Connect with us on social media and stay updated with the latest events, 
                  workshops, and opportunities at TECHSHASTRA.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="icon"
                      className={`w-12 h-12 rounded-full border-primary/30 ${social.color} transition-colors`}
                      asChild
                    >
                      <a 
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>

              {/* Address */}
              <div className="pt-6 border-t border-primary/10">
                <p className="text-sm text-muted-foreground mb-2">Visit Us</p>
                <p className="text-sm">
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
