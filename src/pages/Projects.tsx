import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Smart Campus System",
    description: "IoT-based attendance and campus management system with real-time tracking and analytics.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    tags: ["IoT", "React", "Node.js", "MongoDB"],
    github: "#",
    demo: "#",
    status: "Completed"
  },
  {
    title: "AI Study Assistant",
    description: "Machine learning powered chatbot to help students with course materials and doubt solving.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tags: ["AI/ML", "Python", "TensorFlow", "FastAPI"],
    github: "#",
    demo: "#",
    status: "In Progress"
  },
  {
    title: "CyberShield Platform",
    description: "Educational cybersecurity training platform with interactive challenges and CTF competitions.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    tags: ["Cybersecurity", "React", "Docker", "PostgreSQL"],
    github: "#",
    demo: "#",
    status: "Completed"
  },
  {
    title: "EcoTrack Mobile App",
    description: "Mobile application for tracking carbon footprint and promoting sustainable practices.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    tags: ["Mobile", "React Native", "Firebase"],
    github: "#",
    demo: "#",
    status: "In Progress"
  },
  {
    title: "Code Collab",
    description: "Real-time collaborative coding platform with video chat and whiteboard features.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
    tags: ["Web Dev", "WebRTC", "Socket.io", "Next.js"],
    github: "#",
    demo: "#",
    status: "Completed"
  },
  {
    title: "Robo Arm Control",
    description: "Gesture-controlled robotic arm using computer vision and Arduino integration.",
    image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80",
    tags: ["Robotics", "Python", "OpenCV", "Arduino"],
    github: "#",
    demo: "#",
    status: "In Progress"
  }
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Our <span className="text-gradient-neon">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore innovative projects built by TECHSHASTRA members across various domains
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 overflow-hidden group"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60"></div>
                  <Badge 
                    className={`absolute top-4 right-4 ${
                      project.status === "Completed" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>

                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="border-primary/30 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 border-primary/40 hover:bg-primary/10"
                      asChild
                    >
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-primary/20 p-8">
              <h3 className="text-2xl font-bold mb-4">Have a Project Idea?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join TECHSHASTRA and bring your innovative ideas to life with our community of creators and mentors.
              </p>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(0,230,118,0.3)]"
                asChild
              >
                <a href="/join">Join Our Community</a>
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
