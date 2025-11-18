import { Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary/10 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xl font-bold text-background">TS</span>
              </div>
              <span className="text-xl font-bold text-gradient-neon">TECHSHASTRA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Innovate. Create. Dominate.<br />
              The official technical club of UTU Dehradun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/projects" className="hover:text-primary transition-colors">Projects</a></li>
              <li><a href="/events" className="hover:text-primary transition-colors">Events</a></li>
              <li><a href="/#team" className="hover:text-primary transition-colors">Team</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>Uttarakhand Technical University</p>
              <p>Dehradun, Uttarakhand</p>
            </div>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/company/tech-shastra/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-primary" />
              </a>
              <a 
                href="https://www.instagram.com/techshastra_utu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Instagram className="w-4 h-4 text-accent" />
              </a>
              <a 
                href="mailto:vmsb.utu.ddn.2023@gmail.com"
                className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
              >
                <Mail className="w-4 h-4 text-secondary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary/10 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TECHSHASTRA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
