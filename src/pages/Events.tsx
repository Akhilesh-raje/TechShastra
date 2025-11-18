import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

const upcomingEvents = [
  {
    title: "AI/ML Bootcamp 2025",
    description: "Intensive 3-day workshop on Machine Learning fundamentals, neural networks, and hands-on projects.",
    date: "March 15-17, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "UTU Main Auditorium",
    capacity: "100 seats",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    type: "Workshop",
    status: "Registration Open"
  },
  {
    title: "HackUTU 2025",
    description: "24-hour hackathon featuring innovation challenges, mentorship sessions, and exciting prizes.",
    date: "April 5-6, 2025",
    time: "24 Hours",
    location: "Computer Science Block",
    capacity: "200 participants",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    type: "Hackathon",
    status: "Registration Open"
  },
  {
    title: "Cybersecurity Summit",
    description: "Expert talks on ethical hacking, penetration testing, and emerging security threats.",
    date: "March 28, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Seminar Hall A",
    capacity: "150 seats",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    type: "Seminar",
    status: "Registration Open"
  },
  {
    title: "Web Dev Masterclass",
    description: "Learn modern web development with React, Next.js, and full-stack deployment strategies.",
    date: "April 12, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Lab 301",
    capacity: "80 seats",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    type: "Workshop",
    status: "Coming Soon"
  }
];

const pastEvents = [
  {
    title: "Tech Orientation 2024",
    description: "Introduction to TECHSHASTRA and technical domains for new members.",
    date: "January 10, 2024",
    attendees: "250+"
  },
  {
    title: "IoT Innovation Challenge",
    description: "Competition to build IoT solutions for campus automation.",
    date: "November 2024",
    attendees: "120+"
  },
  {
    title: "Startup Ideathon",
    description: "Pitching session for entrepreneurial ideas with industry mentors.",
    date: "September 2024",
    attendees: "80+"
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              Events & <span className="text-gradient-neon">Workshops</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our technical events, workshops, and hackathons to learn, build, and network
            </p>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">
              Upcoming <span className="text-primary">Events</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {upcomingEvents.map((event, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 overflow-hidden"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-70"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge 
                        className={`${
                          event.status === "Registration Open"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-accent" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{event.capacity}</span>
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.3)]"
                      disabled={event.status !== "Registration Open"}
                      asChild={event.status === "Registration Open"}
                    >
                      <a href="/join">
                        {event.status === "Registration Open" ? "Register Now" : "Coming Soon"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Events */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Past <span className="text-accent">Events</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {pastEvents.map((event, index) => (
                <Card 
                  key={index}
                  className="bg-card/30 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors"
                >
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="pt-2 border-t border-primary/10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{event.date}</span>
                        <Badge variant="outline" className="border-primary/30">
                          {event.attendees}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border-primary/20 p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Never Miss an Event</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join TECHSHASTRA to get notified about upcoming events, workshops, and opportunities.
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

export default Events;
