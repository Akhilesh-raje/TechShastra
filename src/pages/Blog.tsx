import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper, FileText, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { getPublishedBlogPosts, BlogPost, BlogCategory } from "@/lib/blogStore";

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  blog: "Blog",
  news: "News",
  announcement: "Announcement",
};

const CATEGORY_ICONS: Record<BlogCategory, React.ReactNode> = {
  blog: <FileText className="w-3 h-3" />,
  news: <Newspaper className="w-3 h-3" />,
  announcement: <Megaphone className="w-3 h-3" />,
};

const CATEGORY_BADGE_STYLE: Record<BlogCategory, string> = {
  blog: "bg-primary/10 text-primary border-primary/20",
  news: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  announcement: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

type FilterTab = "all" | BlogCategory;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    // Load from localStorage store
    const stored = getPublishedBlogPosts();
    setPosts(stored);
    setLoading(false);
  }, []);

  const filteredPosts = activeTab === "all"
    ? posts
    : posts.filter(p => p.category === activeTab);

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: null },
    { key: "blog", label: "Blog", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "news", label: "News", icon: <Newspaper className="w-3.5 h-3.5" /> },
    { key: "announcement", label: "Announcements", icon: <Megaphone className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Blog & News
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest announcements, tutorials, and tech insights
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${activeTab === tab.key
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key !== "all" && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-muted"}`}>
                  {posts.filter(p => p.category === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-2xl">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-xl text-muted-foreground">
              {activeTab === "all"
                ? "No posts yet. Check back soon!"
                : `No ${CATEGORY_LABELS[activeTab as BlogCategory]} posts yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="h-full group hover:shadow-xl hover:shadow-primary/10 overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
                  {post.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      {post.category === "news" ? (
                        <Newspaper className="w-10 h-10 text-primary/30" />
                      ) : post.category === "announcement" ? (
                        <Megaphone className="w-10 h-10 text-primary/30" />
                      ) : (
                        <FileText className="w-10 h-10 text-primary/30" />
                      )}
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${CATEGORY_BADGE_STYLE[post.category]}`}>
                        {CATEGORY_ICONS[post.category]}
                        {CATEGORY_LABELS[post.category]}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">By {post.author}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;