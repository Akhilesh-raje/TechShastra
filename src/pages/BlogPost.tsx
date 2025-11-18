import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        profiles:author_id (full_name, avatar_url)
      `)
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (!error && data) {
      setPost(data as any);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded mb-4" />
            <div className="h-6 bg-muted rounded w-1/3 mb-8" />
            <div className="h-96 bg-muted rounded mb-8" />
          </div>
        ) : post ? (
          <article>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <Avatar>
                <AvatarFallback>{post.profiles.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.profiles.full_name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                </div>
              </div>
            </div>

            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full rounded-lg mb-8 shadow-lg"
              />
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {post.content.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;