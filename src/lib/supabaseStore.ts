import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type EventStatus = Database["public"]["Enums"]["event_status"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type FAQ = Database["public"]["Tables"]["faqs"]["Row"];
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

// ─── EVENTS ──────────────────────────────────────────────────────────

export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addEvent = async (event: Database["public"]["Tables"]["events"]["Insert"]): Promise<Event> => {
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
};

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────

export const getAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addAchievement = async (achievement: Database["public"]["Tables"]["achievements"]["Insert"]): Promise<Achievement> => {
  const { data, error } = await supabase
    .from("achievements")
    .insert(achievement)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteAchievement = async (id: string): Promise<void> => {
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw error;
};

// ─── FAQs ────────────────────────────────────────────────────────────

export const getFAQs = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const addFAQ = async (faq: Database["public"]["Tables"]["faqs"]["Insert"]): Promise<FAQ> => {
  const { data, error } = await supabase
    .from("faqs")
    .insert(faq)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteFAQ = async (id: string): Promise<void> => {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
};

export const updateFAQOrder = async (id: string, newOrder: number): Promise<void> => {
  const { error } = await supabase.from("faqs").update({ order_index: newOrder }).eq("id", id);
  if (error) throw error;
};

// ─── MESSAGES ─────────────────────────────────────────────────────────

export const getMessages = async (): Promise<ContactMessage[]> => {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const markMessageRead = async (id: string, read: boolean = true): Promise<void> => {
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);
  if (error) throw error;
};

export const deleteMessage = async (id: string): Promise<void> => {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw error;
};

// ─── PROJECTS ─────────────────────────────────────────────────────────

export type Project = Database["public"]["Tables"]["projects"]["Row"];

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addProject = async (project: Database["public"]["Tables"]["projects"]["Insert"]): Promise<Project> => {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
};

// ─── BLOG ─────────────────────────────────────────────────────────────

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addBlogPost = async (post: Database["public"]["Tables"]["blog_posts"]["Insert"]): Promise<BlogPost> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateBlogPost = async (id: string, updates: Database["public"]["Tables"]["blog_posts"]["Update"]): Promise<void> => {
  const { error } = await supabase.from("blog_posts").update(updates).eq("id", id);
  if (error) throw error;
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
};

// ─── GALLERY ──────────────────────────────────────────────────────────

export type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addGalleryImage = async (image: Database["public"]["Tables"]["gallery_images"]["Insert"]): Promise<GalleryImage> => {
  const { data, error } = await supabase
    .from("gallery_images")
    .insert(image)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
};

// ─── SOCIAL POSTS ───────────────────────────────────────────────────

export type SocialPost = Database["public"]["Tables"]["social_posts"]["Row"];

export const getSocialPosts = async (): Promise<SocialPost[]> => {
  const { data, error } = await supabase
    .from("social_posts")
    .select("*")
    .order("posted_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const addSocialPost = async (post: Database["public"]["Tables"]["social_posts"]["Insert"]): Promise<SocialPost> => {
  const { data, error } = await supabase
    .from("social_posts")
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteSocialPost = async (id: string): Promise<void> => {
  const { error } = await supabase.from("social_posts").delete().eq("id", id);
  if (error) throw error;
};

// ─── CONSOLIDATED API ────────────────────────────────────────────────
export const db = {
  // Events
  getEvents,
  addEvent,
  deleteEvent,

  // Achievements
  getAchievements,
  addAchievement,
  deleteAchievement,

  // FAQs
  getFAQs,
  addFAQ,
  deleteFAQ,
  updateFAQOrder,

  // Messages
  getMessages,
  markMessageRead,
  deleteMessage,

  // Projects
  getProjects,
  getAllProjects: getProjects, // Alias for consistency
  addProject,
  deleteProject,

  // Blog
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,

  // Gallery
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,

  // Socials
  getSocialPosts,
  addSocialPost,
  deleteSocialPost,
};
