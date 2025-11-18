import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

interface ProjectWithMembers {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string[];
  status: string;
  project_members: Array<{
    role: string;
    profiles: {
      full_name: string;
    };
  }>;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectWithMembers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_members (
          role,
          profiles (full_name)
        )
      `)
      .eq("id", id)
      .single();

    if (!error && data) {
      setProject(data as any);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 max-w-5xl">
        <Link to="/projects">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        ) : project ? (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge>{project.status}</Badge>
                {project.tech_stack && project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="outline">{tech}</Badge>
                ))}
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground">{project.description}</p>
            </div>

            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full rounded-lg shadow-lg"
              />
            )}

            <div className="flex gap-4">
              {project.github_url && (
                <Button asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button asChild variant="outline">
                  <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>

            {project.long_description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">About the Project</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {project.long_description}
                  </p>
                </CardContent>
              </Card>
            )}

            {project.project_members.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Team Members</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.project_members.map((member, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>
                            {member.profiles.full_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{member.profiles.full_name}</p>
                          {member.role && (
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;