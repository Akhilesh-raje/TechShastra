import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, FileText, Calendar, Image, Trophy, HelpCircle, MessageSquare, Users, Plus, Trash2, Github, Globe, Terminal, Loader2, Award, Newspaper, Eye, EyeOff, Book, ShieldCheck, LogOut, Ban, UserCheck, UserX, ToggleLeft, ToggleRight, UserPlus, Phone, CalendarDays, Copy, Key, Mail, RotateCcw, ClipboardList, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { addProject, deleteProject, getAllProjects, getStoredProjects, Project, parseGitHubUrl } from "@/lib/projectStore";
import { addBlogPost, deleteBlogPost, getAllBlogPosts, generateSlug, BlogPost, BlogCategory, updateBlogPost } from "@/lib/blogStore";
import { addGalleryImage, deleteGalleryImage, getAllGalleryImages, GalleryImage } from "@/lib/galleryStore";
import { addPublication, deletePublication, getAllPublications, Publication, PublicationType } from "@/lib/publicationStore";
import { getAdminUsers, removeAdminUser, blockUser, unblockUser, getPageVisibility, togglePageVisibility, createAdminCredential, getStoredCredentials, deleteAdminCredential, toggleAdminCredBlock, type AdminUser, type PageVisibility, type AdminRole } from "@/lib/adminStore";
import { addLogEntry, clearLog, getLogEntries, revertEntry, saveCredentialsRaw, type LogEntry } from "@/lib/activityLogStore";
import { useAdminPresence } from "@/hooks/use-admin-presence";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import CertificateSender from "@/components/CertificateSender";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

const CATEGORY_LABELS: Record<BlogCategory, string> = {
  blog: "Blog",
  news: "News",
  announcement: "Announcement",
};

const CATEGORY_COLORS: Record<BlogCategory, string> = {
  blog: "default",
  news: "secondary",
  announcement: "outline",
};

interface AdminProps {
  userRole: AdminRole;
}

const Admin = ({ userRole }: AdminProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isSuperAdmin = userRole === "super_admin";
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState("Admin");

  // Get current user info on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle();
        setCurrentUserName(profile?.full_name || session.user.email?.split("@")[0] || "Admin");
      }
    };
    getUser();
  }, []);

  // Presence tracking (only active when Super Admin or for all admins to broadcast)
  const { onlineAdmins, activityLog, trackAction } = useAdminPresence(
    currentUserId,
    currentUserName,
    activeTab
  );

  // ── Projects state ──────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    github: string;
    image: string;
    tags: string;
    lead: string;
    designer: string;
    status: "Completed" | "In Progress";
    language: "javascript" | "python" | "other";
  }>({
    title: "",
    description: "",
    github: "",
    image: "",
    tags: "",
    lead: "",
    designer: "",
    status: "Completed",
    language: "javascript"
  });

  // ── Blog state ───────────────────────────────────────────────────────────────
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    category: BlogCategory;
    author: string;
    published: boolean;
  }>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    category: "blog",
    author: "",
    published: true,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // ── Gallery state ────────────────────────────────────────────────────────────
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryForm, setGalleryForm] = useState<{
    title: string;
    description: string;
    image_url: string;
  }>({
    title: "",
    description: "",
    image_url: "",
  });

  // ── Publications state ───────────────────────────────────────────────────────
  const [publications, setPublications] = useState<Publication[]>([]);
  const [pubForm, setPubForm] = useState<{
    title: string;
    authors: string;
    description: string;
    type: PublicationType;
    link_url: string;
    file_url: string;
  }>({
    title: "",
    authors: "",
    description: "",
    type: "paper",
    link_url: "",
    file_url: "",
  });

  // ── Super Admin state ─────────────────────────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [pages, setPages] = useState<PageVisibility[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [superAdminLoading, setSuperAdminLoading] = useState(false);
  // credential list is kept in state so changes re-render without page refresh
  const [credsList, setCredsList] = useState(() => getStoredCredentials());
  // persistent activity log
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => getLogEntries());

  const refreshCredsAndLog = () => {
    setCredsList(getStoredCredentials());
    setLogEntries(getLogEntries());
  };

  // ── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setProjects(getAllProjects());
    setBlogPosts(getAllBlogPosts());
    setGalleryImages(getAllGalleryImages());
    setPublications(getAllPublications());
    if (isSuperAdmin) {
      loadSuperAdminData();
    }
  }, []);

  const loadSuperAdminData = async () => {
    setSuperAdminLoading(true);
    const [users, pageData] = await Promise.all([
      getAdminUsers(),
      getPageVisibility(),
    ]);
    setAdminUsers(users);
    setPages(pageData);
    setSuperAdminLoading(false);
  };

  const handleRemoveAdmin = async (userId: string, name?: string) => {
    await removeAdminUser(userId);
    setAdminUsers(prev => prev.filter(u => u.user_id !== userId));
    toast({ title: "Admin Removed", description: `${name || "User"} has been removed from admin roster.` });
  };

  const handleBlockAdmin = async (userId: string, name?: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await blockUser(userId, session.user.id, blockReason || undefined);
    setAdminUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_blocked: true, block_reason: blockReason || undefined } : u));
    setBlockReason("");
    toast({ title: "Admin Blocked", description: `${name || "User"} has been blocked from accessing the admin panel.` });
  };

  const handleUnblockAdmin = async (userId: string, name?: string) => {
    await unblockUser(userId);
    setAdminUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_blocked: false, block_reason: undefined } : u));
    toast({ title: "Admin Unblocked", description: `${name || "User"} can now access the admin panel again.` });
  };

  const handleTogglePage = async (page: PageVisibility) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await togglePageVisibility(page.id, !page.is_visible, session.user.id);
    setPages(prev => prev.map(p => p.id === page.id ? { ...p, is_visible: !p.is_visible } : p));
    toast({ title: page.is_visible ? "Page Hidden" : "Page Visible", description: `${page.page_name} is now ${page.is_visible ? "hidden from" : "visible to"} visitors.` });
  };

  // ── Project helpers ──────────────────────────────────────────────────────────
  const generateProjectImage = (title: string, description: string, tags: string) => {
    const encodedTitle = encodeURIComponent(title.slice(0, 60));
    const encodedText = encodeURIComponent((description || tags || 'A TECHSHASTRA project').slice(0, 100));
    return `https://og.tailgraph.com/og?fontFamily=Inter&title=${encodedTitle}&text=${encodedText}&bgColor=0f172a&titleColor=a855f7&textColor=94a3b8&bgImage=&logoText=TECHSHASTRA`;
  };

  const fetchRepoMetadata = async (url: string) => {
    const gitInfo = parseGitHubUrl(url);
    if (!gitInfo) return;

    setIsFetching(true);
    try {
      const [repoRes, readmeRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${gitInfo.owner}/${gitInfo.repo}`),
        fetch(`https://api.github.com/repos/${gitInfo.owner}/${gitInfo.repo}/readme`).catch(() => null),
      ]);

      if (!repoRes.ok) throw new Error("Repo not found");
      const data = await repoRes.json();

      let readmeDescription = "";
      if (readmeRes && readmeRes.ok) {
        const readmeData = await readmeRes.json();
        const decoded = atob(readmeData.content.replace(/\n/g, ""));
        const plainText = decoded
          .replace(/#{1,6}\s+.*/g, "")
          .replace(/!\[.*?\]\(.*?\)/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[`*_~]/g, "")
          .replace(/<!--[\s\S]*?-->/g, "")
          .trim();
        const firstParagraph = plainText.split(/\n{2,}/).find(p => p.trim().length > 30);
        if (firstParagraph) readmeDescription = firstParagraph.trim().replace(/\n/g, " ").slice(0, 300);
      }

      let detectedLang: "javascript" | "python" | "other" = "other";
      const ghLang = data.language?.toLowerCase() || "";
      if (["javascript", "typescript", "typescriptreact", "javascriptreact"].includes(ghLang)) {
        detectedLang = "javascript";
      } else if (ghLang === "python") {
        detectedLang = "python";
      }

      const finalTitle = data.name
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

      const finalDescription = readmeDescription || data.description || "";
      const finalTags = data.topics?.join(", ") || (data.language ? data.language : "");
      const autoImage = generateProjectImage(finalTitle, finalDescription, finalTags);

      setFormData(prev => ({
        ...prev,
        github: url,
        title: prev.title || finalTitle,
        description: prev.description || finalDescription,
        language: detectedLang,
        tags: prev.tags || finalTags,
        image: prev.image || autoImage,
      }));

      toast({
        title: "✅ Metadata Fetched",
        description: `Imported details for "${finalTitle}"${readmeDescription ? " (including README)" : ""}. Image auto-generated.`
      });
    } catch (err: any) {
      console.error("Fetch metadata failed", err);
      toast({
        title: "Fetch Failed",
        description: "Could not retrieve repo details. You may need to enter them manually.",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === "github" && value.includes("github.com/") && value.split("/").length >= 5) {
      fetchRepoMetadata(value);
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
        return;
      }
      // Compress image via canvas before storing as base64 to avoid localStorage quota issues
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = document.createElement('img') as HTMLImageElement;
        img.onload = () => {
          const MAX_W = 800;
          const MAX_H = 450;
          let { width, height } = img;
          if (width > MAX_W || height > MAX_H) {
            const ratio = Math.min(MAX_W / width, MAX_H / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, image: compressed }));
          toast({ title: "Image Uploaded", description: "Project preview image compressed and uploaded successfully." });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.github) {
      toast({ title: "Missing GitHub URL", description: "Please provide a GitHub repository URL.", variant: "destructive" });
      return;
    }
    const gitInfo = parseGitHubUrl(formData.github);
    const finalTitle = formData.title || (gitInfo ? gitInfo.repo.replace(/-/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) : "Untitled Project");
    try {
      const newProj = addProject({
        title: finalTitle,
        description: formData.description || "A project by TECHSHASTRA member.",
        github: formData.github,
        image: formData.image || generateProjectImage(finalTitle, formData.description || "", formData.tags),
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
        team: { lead: formData.lead || "Anonymous", designer: formData.designer || "Anonymous" },
        status: formData.status,
        language: formData.language
      });
      setProjects(prev => [newProj, ...prev]);
      setFormData({ title: "", description: "", github: "", image: "", tags: "", lead: "", designer: "", status: "Completed", language: "javascript" });
      toast({ title: "Project Added", description: `${newProj.title} has been added to the showcase.` });
      trackAction(`Added project: ${newProj.title}`);
    } catch (err: any) {
      console.error("Submission failed", err);
      toast({
        title: "Publication Failed",
        description: err.name === "QuotaExceededError"
          ? "Image size too large for local storage. Please use a smaller image or a URL."
          : "An error occurred while saving the project.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    toast({ title: "Project Deleted", description: "The project has been removed from the showcase." });
    trackAction("Deleted a project");
  };

  // ── Blog helpers ─────────────────────────────────────────────────────────────
  const handleBlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (id === "blog-title") {
      setBlogForm(prev => ({
        ...prev,
        title: value,
        slug: slugManuallyEdited ? prev.slug : generateSlug(value),
      }));
    } else if (id === "blog-slug") {
      setSlugManuallyEdited(true);
      setBlogForm(prev => ({ ...prev, slug: value }));
    } else {
      const key = id.replace("blog-", "") as keyof typeof blogForm;
      setBlogForm(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm(prev => ({ ...prev, image_url: reader.result as string }));
        toast({ title: "Image Uploaded", description: "Cover image uploaded successfully." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      toast({ title: "Missing Title", description: "Please enter a post title.", variant: "destructive" });
      return;
    }
    if (!blogForm.excerpt.trim()) {
      toast({ title: "Missing Excerpt", description: "Please enter a short excerpt/summary.", variant: "destructive" });
      return;
    }
    if (!blogForm.content.trim()) {
      toast({ title: "Missing Content", description: "Please enter the post content.", variant: "destructive" });
      return;
    }
    try {
      const img = document.createElement('img') as HTMLImageElement;
      const now = new Date().toISOString();
      const newPost = addBlogPost({
        title: blogForm.title.trim(),
        slug: blogForm.slug || generateSlug(blogForm.title),
        excerpt: blogForm.excerpt.trim(),
        content: blogForm.content.trim(),
        image_url: blogForm.image_url,
        category: blogForm.category,
        author: blogForm.author.trim() || "TECHSHASTRA Team",
        published: blogForm.published,
        published_at: now,
      });
      setBlogPosts(prev => [newPost, ...prev]);
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", image_url: "", category: "blog", author: "", published: true });
      setSlugManuallyEdited(false);
      toast({ title: "✅ Post Published!", description: `"${newPost.title}" is now live on the Blog page.` });
      trackAction(`Published blog: ${newPost.title}`);
    } catch (err: any) {
      toast({
        title: "Publish Failed",
        description: err.name === "QuotaExceededError"
          ? "Storage full. Try using an image URL instead of uploading."
          : "Could not save the post. Check console for details.",
        variant: "destructive"
      });
    }
  };

  const handleBlogDelete = (id: string) => {
    deleteBlogPost(id);
    setBlogPosts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Post Deleted", description: "The post has been removed." });
    trackAction("Deleted a blog post");
  };

  const handleTogglePublish = (post: BlogPost) => {
    updateBlogPost(post.id, { published: !post.published });
    setBlogPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
    toast({ title: post.published ? "Post Unpublished" : "Post Published", description: `"${post.title}" is now ${post.published ? "hidden" : "visible"} on the Blog page.` });
  };

  // ── Gallery helpers ──────────────────────────────────────────────────────────
  const handleGalleryInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = id.replace("gallery-", "") as keyof typeof galleryForm;
    setGalleryForm(prev => ({ ...prev, [key]: value }));
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image file.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryForm(prev => ({ ...prev, image_url: reader.result as string }));
        toast({ title: "Image Uploaded", description: "Gallery image uploaded successfully." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) {
      toast({ title: "Missing Title", description: "Please enter an image title.", variant: "destructive" });
      return;
    }
    if (!galleryForm.image_url) {
      toast({ title: "Missing Image", description: "Please upload an image or provide a URL.", variant: "destructive" });
      return;
    }
    try {
      const newImage = addGalleryImage({
        title: galleryForm.title.trim(),
        description: galleryForm.description.trim(),
        image_url: galleryForm.image_url,
      });
      setGalleryImages(prev => [newImage, ...prev]);
      setGalleryForm({ title: "", description: "", image_url: "" });
      toast({ title: "✅ Image Added!", description: "The image is now live in the Gallery." });
      trackAction("Added gallery image");
    } catch (err: any) {
      toast({
        title: "Upload Failed",
        description: err.name === "QuotaExceededError"
          ? "Storage full. Try using an image URL instead of uploading."
          : "Could not save the image.",
        variant: "destructive"
      });
    }
  };

  const handleGalleryDelete = (id: string) => {
    deleteGalleryImage(id);
    setGalleryImages(prev => prev.filter(img => img.id !== id));
    toast({ title: "Image Deleted", description: "The image has been removed from the gallery." });
    trackAction("Deleted gallery image");
  };

  // ── Publications helpers ────────────────────────────────────────────────────
  const handlePubInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = id.replace("pub-", "") as keyof typeof pubForm;
    setPubForm(prev => ({ ...prev, [key]: value }));
  };

  const handlePubSelectChange = (value: string) => {
    setPubForm(prev => ({ ...prev, type: value as PublicationType }));
  };

  const handlePubFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPubForm(prev => ({ ...prev, file_url: reader.result as string }));
        toast({ title: "File Uploaded", description: "PDF file saved locally." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubForm.title.trim() || !pubForm.authors.trim()) {
      toast({ title: "Missing Fields", description: "Title and Authors are required.", variant: "destructive" });
      return;
    }
    if (!pubForm.link_url && !pubForm.file_url) {
      toast({ title: "Missing Resource", description: "Provide either a link or upload a PDF.", variant: "destructive" });
      return;
    }
    try {
      const newPub = addPublication({
        title: pubForm.title.trim(),
        authors: pubForm.authors.trim(),
        description: pubForm.description.trim(),
        type: pubForm.type,
        link_url: pubForm.link_url.trim(),
        file_url: pubForm.file_url,
      });
      setPublications(prev => [newPub, ...prev]);
      setPubForm({ title: "", authors: "", description: "", type: "paper", link_url: "", file_url: "" });
      toast({ title: "✅ Publication Added!", description: "It is now visible in the Research & Books section." });
      trackAction(`Added publication: ${pubForm.title}`);
    } catch (err: any) {
      toast({ title: "Save Failed", description: "Could not save the publication.", variant: "destructive" });
    }
  };

  const handlePubDelete = (id: string) => {
    deletePublication(id);
    setPublications(prev => prev.filter(p => p.id !== id));
    toast({ title: "Publication Deleted", description: "Removed from the records." });
    trackAction("Deleted a publication");
  };

  const publishedBlogCount = blogPosts.filter(p => p.published).length;

  const handleSignOut = () => {
    sessionStorage.removeItem("ts_admin_session");
    navigate("/auth", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <main className="container mx-auto px-4 py-24">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <Badge variant={isSuperAdmin ? "default" : "secondary"} className="text-xs">
                {isSuperAdmin ? "⭐ Super Admin" : "Admin"}
              </Badge>
            </div>
            <p className="text-muted-foreground">Manage your tech club content and settings</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap w-full h-auto bg-muted/50 p-1 gap-1">
            <TabsTrigger value="overview"><LayoutDashboard className="w-4 h-4 mr-2" />Overview</TabsTrigger>
            <TabsTrigger value="projects"><FileText className="w-4 h-4 mr-2 hidden sm:inline" />Projects</TabsTrigger>
            <TabsTrigger value="events"><Calendar className="w-4 h-4 mr-2 hidden sm:inline" />Events</TabsTrigger>
            <TabsTrigger value="blog"><Newspaper className="w-4 h-4 mr-2 hidden sm:inline" />Blog</TabsTrigger>
            <TabsTrigger value="gallery"><Image className="w-4 h-4 mr-2 hidden sm:inline" />Gallery</TabsTrigger>
            <TabsTrigger value="publications"><Book className="w-4 h-4 mr-2 hidden sm:inline" />Research</TabsTrigger>
            <TabsTrigger value="achievements"><Trophy className="w-4 h-4 mr-2 hidden sm:inline" />Awards</TabsTrigger>
            <TabsTrigger value="faq"><HelpCircle className="w-4 h-4 mr-2 hidden sm:inline" />FAQ</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="w-4 h-4 mr-2 hidden sm:inline" />Messages</TabsTrigger>
            <TabsTrigger value="certificates"><Award className="w-4 h-4 mr-2 hidden sm:inline" />Certs</TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger value="super-admin" className="bg-primary/10 text-primary">
                <ShieldCheck className="w-4 h-4 mr-2" />Super Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* ── Overview ── */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">500+</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projects.length + 6}</div>
                  <p className="text-xs text-muted-foreground">Total showcase items</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20+</div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publishedBlogCount}</div>
                  <p className="text-xs text-muted-foreground">Published</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Projects ── */}
          <TabsContent value="projects">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Project
                  </CardTitle>
                  <CardDescription>Enter GitHub repository details to add a live project.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub Repository URL</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            {isFetching ? (
                              <Loader2 className="absolute left-3 top-3 w-4 h-4 text-primary animate-spin" />
                            ) : (
                              <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            )}
                            <Input
                              id="github"
                              placeholder="https://github.com/user/repo"
                              className="pl-10 h-11"
                              value={formData.github}
                              onChange={handleInputChange}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={isFetching || !formData.github.includes("github.com")}
                            onClick={() => fetchRepoMetadata(formData.github)}
                            className="h-11 px-4"
                          >
                            Fetch
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic font-light px-1">
                          * Paste URL and click Fetch to auto-populate details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" placeholder="Project Name" value={formData.title} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Short Description</Label>
                      <Textarea id="description" placeholder="What does this project do?" value={formData.description} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-primary/20">
                      <Label htmlFor="image" className="flex items-center gap-2">
                        Project Preview Image
                        <span className="text-[10px] text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">auto-generated if empty</span>
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">or</span>
                        </div>
                        <Input id="image" placeholder="Paste image URL here" value={formData.image} onChange={handleInputChange} />
                        {formData.image && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-primary/20">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image"; }}
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optional — if left blank, an image will be auto-generated from the repo name and description.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Execution Tech</Label>
                        <Select value={formData.language} onValueChange={(v) => handleSelectChange("language", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="javascript">JS / React (StackBlitz)</SelectItem>
                            <SelectItem value="python">Python (Pyodide)</SelectItem>
                            <SelectItem value="other">Other (Static)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lead">Team Lead</Label>
                        <Input id="lead" placeholder="Lead name" value={formData.lead} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designer">UI Designer</Label>
                        <Input id="designer" placeholder="Designer name" value={formData.designer} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" placeholder="React, AI, IoT" value={formData.tags} onChange={handleInputChange} />
                    </div>

                    <Button type="submit" className="w-full">Publish Project</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Currently Published Projects</CardTitle>
                  <CardDescription>A list of projects added by admins via this dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.length === 0 ? (
                      <div className="text-center py-12 border border-dashed rounded-xl">
                        <p className="text-muted-foreground italic">No admin-added projects yet.</p>
                      </div>
                    ) : (
                      projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-primary/5 transition-colors">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {project.language === 'python' ? <Terminal className="w-6 h-6 text-primary" /> : project.language === 'javascript' ? <Globe className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-muted-foreground" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-xs text-muted-foreground truncate max-w-[300px]">{project.github}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant={project.language === 'other' ? 'secondary' : 'default'} className="text-[9px] px-2 py-0">
                                  {project.language === 'javascript' ? 'JS/React' : project.language === 'python' ? 'Python' : 'Other'}
                                </Badge>
                                <Badge variant="outline" className="text-[9px] px-2 py-0 text-green-600 border-green-600">
                                  Live Runnable
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Blog & News ── */}
          <TabsContent value="blog">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Add Post Form */}
              <Card className="lg:col-span-2 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    New Blog / News Post
                  </CardTitle>
                  <CardDescription>Write and publish posts that appear on the Blog & News page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBlogSubmit} className="space-y-4">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Post Type</Label>
                      <Select value={blogForm.category} onValueChange={(v) => setBlogForm(prev => ({ ...prev, category: v as BlogCategory }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">📝 Blog Post</SelectItem>
                          <SelectItem value="news">📰 News</SelectItem>
                          <SelectItem value="announcement">📢 Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="blog-title">Title *</Label>
                      <Input
                        id="blog-title"
                        placeholder="Enter post title..."
                        value={blogForm.title}
                        onChange={handleBlogInputChange}
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="blog-slug" className="flex items-center gap-2">
                        URL Slug
                        <span className="text-[10px] text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">auto-generated</span>
                      </Label>
                      <Input
                        id="blog-slug"
                        placeholder="url-friendly-slug"
                        value={blogForm.slug}
                        onChange={handleBlogInputChange}
                      />
                      <p className="text-[10px] text-muted-foreground px-1">
                        /blog/<span className="text-primary">{blogForm.slug || "your-slug-here"}</span>
                      </p>
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                      <Label htmlFor="blog-author">Author Name</Label>
                      <Input
                        id="blog-author"
                        placeholder="TECHSHASTRA Team"
                        value={blogForm.author}
                        onChange={handleBlogInputChange}
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label htmlFor="blog-excerpt">Excerpt / Summary *</Label>
                      <Textarea
                        id="blog-excerpt"
                        placeholder="A short summary shown on the blog listing page..."
                        rows={2}
                        value={blogForm.excerpt}
                        onChange={handleBlogInputChange}
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor="blog-content">Full Content *</Label>
                      <Textarea
                        id="blog-content"
                        placeholder="Write your full post here. Use blank lines to separate paragraphs..."
                        rows={8}
                        value={blogForm.content}
                        onChange={handleBlogInputChange}
                        className="font-mono text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground px-1">
                        Tip: Leave a blank line between paragraphs for proper formatting.
                      </p>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-primary/20">
                      <Label className="flex items-center gap-2">
                        Cover Image
                        <span className="text-[10px] text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">optional</span>
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" onChange={handleBlogImageUpload} className="flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">or</span>
                        </div>
                        <Input
                          id="blog-image_url"
                          placeholder="Paste image URL here"
                          value={blogForm.image_url}
                          onChange={handleBlogInputChange}
                        />
                        {blogForm.image_url && (
                          <div className="relative w-full h-28 rounded-lg overflow-hidden border border-primary/20">
                            <img
                              src={blogForm.image_url}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image"; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Publish toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="text-sm font-medium">Publish immediately</p>
                        <p className="text-xs text-muted-foreground">Toggle off to save as draft</p>
                      </div>
                      <Switch
                        checked={blogForm.published}
                        onCheckedChange={(v) => setBlogForm(prev => ({ ...prev, published: v }))}
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      {blogForm.published ? "🚀 Publish Post" : "💾 Save as Draft"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Posts List */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>All Posts</span>
                    <div className="flex gap-2 text-sm font-normal">
                      <Badge variant="default">{publishedBlogCount} Published</Badge>
                      <Badge variant="secondary">{blogPosts.length - publishedBlogCount} Drafts</Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>Manage all blog posts, news, and announcements.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blogPosts.length === 0 ? (
                      <div className="text-center py-16 border border-dashed rounded-xl">
                        <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                        <p className="text-muted-foreground italic">No posts yet. Create your first post!</p>
                      </div>
                    ) : (
                      blogPosts.map((post) => (
                        <div
                          key={post.id}
                          className={`flex items-start justify-between p-4 border rounded-xl transition-colors ${post.published ? "hover:bg-primary/5" : "opacity-60 bg-muted/20"}`}
                        >
                          <div className="flex gap-3 flex-1 min-w-0">
                            {post.image_url ? (
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                {post.category === "news" ? <Newspaper className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge variant={CATEGORY_COLORS[post.category] as any} className="text-[9px] px-2 py-0">
                                  {CATEGORY_LABELS[post.category]}
                                </Badge>
                                {!post.published && (
                                  <Badge variant="outline" className="text-[9px] px-2 py-0 text-amber-600 border-amber-600">
                                    Draft
                                  </Badge>
                                )}
                                {post.id.startsWith('sample-') && (
                                  <Badge variant="outline" className="text-[9px] px-2 py-0 border-blue-400 text-blue-500">
                                    Sample
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-medium text-sm leading-tight truncate">{post.title}</h4>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{post.excerpt}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                By {post.author} · {format(new Date(post.published_at), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {!post.id.startsWith('sample-') && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleTogglePublish(post)}
                                  className={post.published ? "text-green-600 hover:bg-green-50" : "text-muted-foreground hover:bg-muted"}
                                  title={post.published ? "Unpublish" : "Publish"}
                                >
                                  {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleBlogDelete(post.id)}
                                  className="text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Certificates ── */}
          {/* ── Publications ── */}
          <TabsContent value="publications">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Add Publication Form */}
              <Card className="lg:col-span-2 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    Add Research / Book
                  </CardTitle>
                  <CardDescription>Share research papers and books with the community.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePubSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="pub-title">Publication Title *</Label>
                        <Input
                          id="pub-title"
                          placeholder="Project name or book title..."
                          value={pubForm.title}
                          onChange={handlePubInputChange}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="pub-authors">Authors *</Label>
                        <Input
                          id="pub-authors"
                          placeholder="List of contributors..."
                          value={pubForm.authors}
                          onChange={handlePubInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pub-type">Type</Label>
                      <Select value={pubForm.type} onValueChange={handlePubSelectChange}>
                        <SelectTrigger id="pub-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paper">Research Paper</SelectItem>
                          <SelectItem value="book">Book</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pub-description">Description</Label>
                      <Textarea
                        id="pub-description"
                        placeholder="Abstract or summary..."
                        rows={3}
                        value={pubForm.description}
                        onChange={handlePubInputChange}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-primary/10">
                      <div className="space-y-2">
                        <Label htmlFor="pub-link_url">External Link</Label>
                        <Input
                          id="pub-link_url"
                          placeholder="https://..."
                          value={pubForm.link_url}
                          onChange={handlePubInputChange}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">or upload PDF</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Input type="file" accept="application/pdf" onChange={handlePubFileUpload} />
                        {pubForm.file_url && (
                          <p className="text-[10px] text-green-600 font-medium">✅ PDF Ready to save</p>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">💾 Save Publication</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Publications List */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Directory</CardTitle>
                  <CardDescription>Manage published papers and books.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {publications.length === 0 ? (
                      <div className="text-center py-12 border border-dashed rounded-xl">
                        <p className="text-muted-foreground italic">No publications yet.</p>
                      </div>
                    ) : (
                      publications.map((pub) => (
                        <div key={pub.id} className="flex items-start justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-all group">
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${pub.type === 'book' ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'}`}>
                              {pub.type === 'book' ? <Book className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{pub.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 font-medium">{pub.authors}</p>
                              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">{pub.description}</p>
                              <div className="flex gap-2 mt-2">
                                {pub.link_url && (
                                  <Badge variant="outline" className="text-[9px] h-5">Link Attached</Badge>
                                )}
                                {pub.file_url && (
                                  <Badge variant="outline" className="text-[9px] h-5 border-green-500 text-green-600">PDF Hosted</Badge>
                                )}
                                {pub.id.startsWith('pub-sample-') && (
                                  <Badge variant="secondary" className="text-[9px] h-5">Sample</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {!pub.id.startsWith('pub-sample-') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePubDelete(pub.id)}
                              className="text-destructive hover:bg-destructive/10 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ── Gallery ── */}
          <TabsContent value="gallery">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Add Image Form */}
              <Card className="lg:col-span-2 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Gallery Image
                  </CardTitle>
                  <CardDescription>Upload images from events and workshops.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGallerySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="gallery-title">Image Title *</Label>
                      <Input
                        id="gallery-title"
                        placeholder="Event name or activity..."
                        value={galleryForm.title}
                        onChange={handleGalleryInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gallery-description">Description</Label>
                      <Textarea
                        id="gallery-description"
                        placeholder="Briefly describe the moment..."
                        rows={3}
                        value={galleryForm.description}
                        onChange={handleGalleryInputChange}
                      />
                    </div>

                    <div className="space-y-2 p-4 rounded-lg bg-muted/30 border border-primary/20">
                      <Label className="flex items-center gap-2">
                        Image *
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="flex-1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">or</span>
                          <Input
                            id="gallery-image_url"
                            placeholder="Paste image URL here"
                            value={galleryForm.image_url}
                            onChange={handleGalleryInputChange}
                          />
                        </div>
                        {galleryForm.image_url && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-primary/20">
                            <img
                              src={galleryForm.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x200?text=Invalid+Image"; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">✨ Add to Gallery</Button>
                  </form>
                </CardContent>
              </Card>

              {/* Gallery List */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Currently in Gallery</CardTitle>
                  <CardDescription>All images shown on the public gallery page.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.length === 0 ? (
                      <div className="col-span-full text-center py-12 border border-dashed rounded-xl">
                        <p className="text-muted-foreground italic">No images yet.</p>
                      </div>
                    ) : (
                      galleryImages.map((image) => (
                        <div key={image.id} className="group relative aspect-square rounded-xl overflow-hidden border hover:border-primary/50 transition-all">
                          <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                            <p className="text-white text-xs font-medium mb-1 line-clamp-2">{image.title}</p>
                            {!image.id.startsWith('gallery-sample-') && (
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleGalleryDelete(image.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                            {image.id.startsWith('gallery-sample-') && (
                              <Badge variant="secondary" className="text-[10px]">Sample Content</Badge>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateSender />
          </TabsContent>

          {/* ── Super Admin Panel ── */}
          {isSuperAdmin && (
            <TabsContent value="super-admin">
              <div className="space-y-8">
                {/* ── Create Admin Credentials ── */}
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-green-500" />
                      Create Admin Credentials
                    </CardTitle>
                    <CardDescription>
                      Generate unique login credentials for a new admin. The system creates a username and password from their name, mobile, and date of birth.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const name = (form.elements.namedItem("cred-name") as HTMLInputElement).value;
                        const mobile = (form.elements.namedItem("cred-mobile") as HTMLInputElement).value;
                        const dob = (form.elements.namedItem("cred-dob") as HTMLInputElement).value;
                        const email = (form.elements.namedItem("cred-email") as HTMLInputElement).value;
                        try {
                          const cred = createAdminCredential(name, mobile, dob, email);
                          // Log creation
                          addLogEntry({
                            actor: currentUserName,
                            action: `Created admin credentials for ${cred.name}${email ? ` (${email})` : ""}`,
                            type: "create_credential",
                            revertible: true,
                            credentialSnapshot: cred,
                          });
                          // Send credentials via email
                          if (email) {
                            const subject = encodeURIComponent("Your TECHSHASTRA Admin Credentials");
                            const body = encodeURIComponent(
                              `Hello ${cred.name},\n\nYour admin credentials for the TECHSHASTRA Admin Panel have been created.\n\n` +
                              `🔑 Username: ${cred.username}\n🔒 Password: ${cred.password}\n\n` +
                              `Please login at: ${window.location.origin}/auth\n\n` +
                              `Keep these credentials private. Do not share them with anyone.\n\n` +
                              `Regards,\nTECHSHASTRA Super Admin`
                            );
                            window.open(`mailto:${email}?subject=${subject}&body=${body}`);
                          }
                          toast({
                            title: "✅ Admin Created!",
                            description: email
                              ? `Credentials sent to ${email}. Username: ${cred.username}`
                              : `Username: ${cred.username} | Password: ${cred.password}`,
                          });
                          trackAction(`Created admin: ${name}`);
                          form.reset();
                          refreshCredsAndLog();
                        } catch (err: any) {
                          toast({ title: "Failed", description: err.message, variant: "destructive" });
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cred-name" className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Full Name
                          </Label>
                          <Input id="cred-name" name="cred-name" placeholder="Rahul Sharma" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cred-mobile" className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Mobile Number
                          </Label>
                          <Input id="cred-mobile" name="cred-mobile" placeholder="9876543210" required pattern="[0-9]{10,}" title="Enter a valid mobile number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cred-dob" className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" /> Date of Birth
                          </Label>
                          <Input id="cred-dob" name="cred-dob" type="date" required />
                        </div>
                      </div>
                      {/* Email field — full width */}
                      <div className="space-y-2">
                        <Label htmlFor="cred-email" className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" /> Email Address
                          <span className="text-[10px] text-muted-foreground font-normal bg-muted px-2 py-0.5 rounded-full">credentials sent here</span>
                        </Label>
                        <Input
                          id="cred-email"
                          name="cred-email"
                          type="email"
                          placeholder="admin@example.com"
                          className="w-full"
                        />
                        <p className="text-[10px] text-muted-foreground px-1">
                          If provided, your default mail app will open pre-filled with the credentials to send.
                        </p>
                      </div>
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        <Key className="w-4 h-4 mr-2" /> Generate & Save Credentials
                      </Button>
                    </form>

                    {/* Existing Credentials List */}
                    {credsList.length > 0 && (
                      <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold mb-3">Active Admin Accounts ({credsList.length})</h4>
                        {credsList.map(cred => (
                          <div
                            key={cred.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${cred.is_blocked ? "border-destructive/30 bg-destructive/5" : "border-border hover:bg-muted/30"
                              } transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${cred.is_blocked ? "bg-destructive/20" : "bg-green-500/10"
                                }`}>
                                {cred.is_blocked ? (
                                  <Ban className="w-4 h-4 text-destructive" />
                                ) : (
                                  <UserCheck className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-sm">{cred.name}</p>
                                  {cred.is_blocked && (
                                    <Badge variant="destructive" className="text-[10px]">BLOCKED</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-[10px] font-mono">
                                    {cred.username}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">
                                    {cred.mobile} · {new Date(cred.dob).toLocaleDateString('en-IN')}
                                  </span>
                                </div>
                                {cred.email && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] text-muted-foreground">{cred.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Copy credentials"
                                onClick={() => {
                                  navigator.clipboard.writeText(`Username: ${cred.username}\nPassword: ${cred.password}`);
                                  toast({ title: "Copied!", description: "Credentials copied to clipboard" });
                                }}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                              {cred.email && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  title="Resend credentials by email"
                                  onClick={() => {
                                    const subject = encodeURIComponent("Your TECHSHASTRA Admin Credentials");
                                    const body = encodeURIComponent(
                                      `Hello ${cred.name},\n\nYour admin credentials for the TECHSHASTRA Admin Panel:\n\n` +
                                      `🔑 Username: ${cred.username}\n🔒 Password: ${cred.password}\n\n` +
                                      `Login at: ${window.location.origin}/auth\n\nKeep these private.\n\nRegards,\nTECHSHASTRA Super Admin`
                                    );
                                    window.open(`mailto:${cred.email}?subject=${subject}&body=${body}`);
                                    toast({ title: "Mail Opened", description: `Email draft opened for ${cred.email}` });
                                  }}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant={cred.is_blocked ? "default" : "outline"}
                                onClick={() => {
                                  const wasBlocked = cred.is_blocked;
                                  toggleAdminCredBlock(cred.id, !wasBlocked);
                                  addLogEntry({
                                    actor: currentUserName,
                                    action: `${wasBlocked ? "Unblocked" : "Blocked"} admin: ${cred.name}`,
                                    type: wasBlocked ? "unblock_credential" : "block_credential",
                                    revertible: true,
                                    credentialId: cred.id,
                                    credentialSnapshot: cred,
                                  });
                                  toast({
                                    title: wasBlocked ? "Unblocked" : "Blocked",
                                    description: `${cred.name} has been ${wasBlocked ? "unblocked" : "blocked"}.`,
                                  });
                                  trackAction(`${wasBlocked ? "Unblocked" : "Blocked"} admin: ${cred.name}`);
                                  refreshCredsAndLog();
                                }}
                              >
                                {cred.is_blocked ? "Unblock" : "Block"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  addLogEntry({
                                    actor: currentUserName,
                                    action: `Deleted admin credentials for ${cred.name}`,
                                    type: "delete_credential",
                                    revertible: true,
                                    credentialSnapshot: { ...cred },
                                  });
                                  deleteAdminCredential(cred.id);
                                  toast({ title: "Deleted", description: `${cred.name}'s credentials removed. You can revert this from the Activity Log.` });
                                  trackAction(`Deleted admin: ${cred.name}`);
                                  refreshCredsAndLog();
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Admin User Management ── */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                      Admin User Management
                    </CardTitle>
                    <CardDescription>
                      Manage who has admin access. You can add, remove, block, or unblock admins.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current admins list */}
                    {superAdminLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {adminUsers.length === 0 ? (
                          <div className="text-center py-8 border border-dashed rounded-xl">
                            <p className="text-muted-foreground">No admin users configured yet.</p>
                          </div>
                        ) : (
                          adminUsers.map(user => (
                            <div
                              key={user.user_id}
                              className={`flex items-center justify-between p-4 rounded-lg border ${user.is_blocked ? "border-destructive/30 bg-destructive/5" : "border-border hover:bg-muted/50"
                                } transition-colors`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === "super_admin" ? "bg-primary/20" : user.is_blocked ? "bg-destructive/20" : "bg-muted"
                                  }`}>
                                  {user.role === "super_admin" ? (
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                  ) : user.is_blocked ? (
                                    <Ban className="w-5 h-5 text-destructive" />
                                  ) : (
                                    <UserCheck className="w-5 h-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{user.full_name || user.user_id.slice(0, 8)}</p>
                                    <Badge variant={user.role === "super_admin" ? "default" : "secondary"} className="text-[10px]">
                                      {user.role === "super_admin" ? "⭐ Super" : "Admin"}
                                    </Badge>
                                    {user.is_blocked && (
                                      <Badge variant="destructive" className="text-[10px]">BLOCKED</Badge>
                                    )}
                                  </div>
                                  {user.block_reason && (
                                    <p className="text-[11px] text-destructive mt-0.5">Reason: {user.block_reason}</p>
                                  )}
                                </div>
                              </div>

                              {/* Actions — can't modify own super_admin account */}
                              {user.role !== "super_admin" && (
                                <div className="flex items-center gap-2">
                                  {user.is_blocked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUnblockAdmin(user.user_id, user.full_name)}
                                      className="gap-1 text-xs"
                                    >
                                      <UserCheck className="w-3 h-3" /> Unblock
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleBlockAdmin(user.user_id, user.full_name)}
                                      className="gap-1 text-xs text-orange-600 border-orange-600/30 hover:bg-orange-600/10"
                                    >
                                      <Ban className="w-3 h-3" /> Block
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveAdmin(user.user_id, user.full_name)}
                                    className="gap-1 text-xs text-destructive hover:bg-destructive/10"
                                  >
                                    <UserX className="w-3 h-3" /> Remove
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Page Visibility Controls ── */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Page Visibility Controls
                    </CardTitle>
                    <CardDescription>
                      Toggle pages on or off. Hidden pages will show a 404 to visitors and be removed from the navigation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {superAdminLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pages.map(page => (
                          <div
                            key={page.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${page.is_visible ? "border-border" : "border-orange-500/30 bg-orange-500/5"
                              } transition-colors`}
                          >
                            <div className="flex items-center gap-3">
                              {page.is_visible ? (
                                <Eye className="w-5 h-5 text-green-500" />
                              ) : (
                                <EyeOff className="w-5 h-5 text-orange-500" />
                              )}
                              <div>
                                <p className="font-medium text-sm">{page.page_name}</p>
                                <p className="text-[11px] text-muted-foreground">{page.page_path}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-medium ${page.is_visible ? "text-green-500" : "text-orange-500"}`}>
                                {page.is_visible ? "Visible" : "Hidden"}
                              </span>
                              <Switch
                                checked={page.is_visible}
                                onCheckedChange={() => handleTogglePage(page)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* ── Live Activity Monitor ── */}
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Live Activity Monitor
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Real-time view of admin activity. See who's online, what tab they're on, and their last action.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Online Admins */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Currently Online ({onlineAdmins.length})
                      </h4>
                      {onlineAdmins.length === 0 ? (
                        <div className="text-center py-6 border border-dashed rounded-xl">
                          <p className="text-muted-foreground text-sm">No admins currently online</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {onlineAdmins.map(admin => (
                            <div
                              key={admin.user_id}
                              className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20"
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-green-600" />
                                  </div>
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{admin.full_name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                                      💻 {admin.current_tab}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">
                                      {admin.last_action}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="default" className="bg-green-500 text-[10px]">
                                  🟢 LIVE
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Activity Feed */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Activity Feed</h4>
                      {activityLog.length === 0 ? (
                        <div className="text-center py-6 border border-dashed rounded-xl">
                          <p className="text-muted-foreground text-sm">No activity recorded yet. Actions will appear here in real-time.</p>
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2">
                          {activityLog.map(entry => (
                            <div
                              key={entry.id}
                              className={`flex items-start gap-3 p-2.5 rounded-lg text-xs transition-colors ${entry.is_login
                                ? "bg-green-500/5 border border-green-500/10"
                                : entry.is_logout
                                  ? "bg-red-500/5 border border-red-500/10"
                                  : "bg-muted/30 border border-transparent hover:border-border"
                                }`}
                            >
                              <div className="mt-0.5">
                                {entry.is_login ? (
                                  <span className="text-green-500 text-base">🟢</span>
                                ) : entry.is_logout ? (
                                  <span className="text-red-500 text-base">🔴</span>
                                ) : (
                                  <span className="text-blue-400 text-base">▶️</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold">{entry.full_name}</span>
                                  <span className="text-muted-foreground">—</span>
                                  <span className={`${entry.is_login ? "text-green-600 font-medium"
                                    : entry.is_logout ? "text-red-500 font-medium"
                                      : "text-foreground"
                                    }`}>
                                    {entry.action}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                  <span>💻 {entry.tab}</span>
                                  <span>·</span>
                                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {/* ── Persistent Activity Log ── */}
                <Card className="border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-amber-500" />
                        Super Admin Activity Log
                      </span>
                      {logEntries.length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            clearLog();
                            refreshCredsAndLog();
                            toast({ title: "Log Cleared", description: "All activity log entries have been removed." });
                          }}
                        >
                          <X className="w-3.5 h-3.5 mr-1" /> Clear Log
                        </Button>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Every Super Admin action is recorded here. Reversible actions can be undone with the Revert button.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {logEntries.length === 0 ? (
                      <div className="text-center py-8 border border-dashed rounded-xl">
                        <ClipboardList className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                        <p className="text-muted-foreground text-sm">No actions recorded yet. Actions will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {logEntries.map(entry => (
                          <div
                            key={entry.id}
                            className={`flex items-start justify-between gap-3 p-3 rounded-lg border text-xs ${entry.type === "create_credential"
                                ? "border-green-500/20 bg-green-500/5"
                                : entry.type === "delete_credential"
                                  ? "border-destructive/20 bg-destructive/5"
                                  : entry.type === "block_credential"
                                    ? "border-orange-500/20 bg-orange-500/5"
                                    : entry.type === "unblock_credential"
                                      ? "border-blue-500/20 bg-blue-500/5"
                                      : "border-border bg-muted/20"
                              }`}
                          >
                            <div className="flex gap-2.5 flex-1 min-w-0">
                              <span className="text-base mt-0.5 flex-shrink-0">
                                {entry.type === "create_credential" ? "✅"
                                  : entry.type === "delete_credential" ? "🗑️"
                                    : entry.type === "block_credential" ? "🚫"
                                      : entry.type === "unblock_credential" ? "✔️"
                                        : "📋"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium leading-snug">{entry.action}</p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                                  <span>👤 {entry.actor}</span>
                                  <span>·</span>
                                  <span>{new Date(entry.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                              </div>
                            </div>
                            {entry.revertible && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] h-7 px-2 flex-shrink-0 gap-1 border-amber-500/40 text-amber-600 hover:bg-amber-500/10"
                                onClick={() => {
                                  const result = revertEntry(entry.id, saveCredentialsRaw);
                                  if (result.success) {
                                    toast({ title: "↩️ Reverted", description: result.message });
                                  } else {
                                    toast({ title: "Revert Failed", description: result.message, variant: "destructive" });
                                  }
                                  refreshCredsAndLog();
                                }}
                              >
                                <RotateCcw className="w-3 h-3" /> Revert
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;