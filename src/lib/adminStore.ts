// ─── TYPES ───────────────────────────────────────────────────────────
export type AdminRole = "super_admin" | "admin";

export interface AdminCredential {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  email?: string;
  role: AdminRole;
  is_blocked: boolean;
  blocked_at?: string;
  block_reason?: string;
  created_at: string;
}

export interface PageVisibility {
  id: string;
  page_path: string;
  page_name: string;
  is_visible: boolean;
  updated_at: string;
}

// ─── HARDCODED SUPER ADMIN ──────────────────────────────────────────
// Change these credentials before deployment
const SUPER_ADMIN = {
  name: "Super Admin",
  mobile: "1234567890",
  dob: "2000-01-01",
};

// Generate credential key: name + mobile + dob
const generateCredKey = (name: string, mobile: string, dob: string): string => {
  return `${name.toLowerCase().trim()}${mobile}${dob}`;
};

const SUPER_ADMIN_KEY = generateCredKey(SUPER_ADMIN.name, SUPER_ADMIN.mobile, SUPER_ADMIN.dob);

// ─── STORAGE HELPERS ─────────────────────────────────────────────────
const STORAGE_KEY = "ts_admin_credentials";

const getCredentials = (): AdminCredential[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStoredCredentials = getCredentials;

const saveCredentials = (creds: AdminCredential[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
};

// ─── AUTH ────────────────────────────────────────────────────────────

/** Verify login credentials */
export const verifyAdmin = (name: string, mobile: string, dob: string): { success: boolean; role?: AdminRole; id?: string } => {
  const key = generateCredKey(name, mobile, dob);
  
  // Check super admin
  if (key === SUPER_ADMIN_KEY) {
    return { success: true, role: "super_admin", id: "super_admin" };
  }
  
  // Check regular admins
  const creds = getCredentials();
  const admin = creds.find(c => generateCredKey(c.name, c.mobile, c.dob) === key);
  
  if (admin && !admin.is_blocked) {
    return { success: true, role: admin.role, id: admin.id };
  }
  
  return { success: false };
};

/** Get user role by ID */
export const getUserRole = async (userId: string): Promise<AdminRole | null> => {
  if (userId === "super_admin") return "super_admin";
  
  const creds = getCredentials();
  const admin = creds.find(c => c.id === userId);
  return admin ? admin.role : null;
};

/** Check if user is blocked */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
  if (userId === "super_admin") return false;
  
  const creds = getCredentials();
  const admin = creds.find(c => c.id === userId);
  return admin ? admin.is_blocked : false;
};

// ─── USER MANAGEMENT (Super Admin Only) ──────────────────────────────

/** Get all admin users */
export const getAdminUsers = async (): Promise<AdminCredential[]> => {
  return getCredentials();
};

/** Create new admin credential */
export const createAdminCredential = (
  name: string,
  mobile: string,
  dob: string,
  role: AdminRole = "admin",
  email?: string
): AdminCredential => {
  const creds = getCredentials();
  
  const newCred: AdminCredential = {
    id: Date.now().toString(),
    name,
    mobile,
    dob,
    email,
    role,
    is_blocked: false,
    created_at: new Date().toISOString(),
  };
  
  creds.push(newCred);
  saveCredentials(creds);
  
  return newCred;
};

/** Block an admin */
export const blockAdmin = (userId: string, reason?: string): void => {
  const creds = getCredentials();
  const index = creds.findIndex(c => c.id === userId);
  
  if (index !== -1) {
    creds[index].is_blocked = true;
    creds[index].blocked_at = new Date().toISOString();
    creds[index].block_reason = reason;
    saveCredentials(creds);
  }
};

/** Unblock an admin */
export const unblockAdmin = (userId: string): void => {
  const creds = getCredentials();
  const index = creds.findIndex(c => c.id === userId);
  
  if (index !== -1) {
    creds[index].is_blocked = false;
    creds[index].blocked_at = undefined;
    creds[index].block_reason = undefined;
    saveCredentials(creds);
  }
};

/** Delete admin credential */
export const deleteAdminCredential = (userId: string): void => {
  const creds = getCredentials();
  const filtered = creds.filter(c => c.id !== userId);
  saveCredentials(filtered);
};

// ─── PAGE VISIBILITY ─────────────────────────────────────────────────

const PAGE_VISIBILITY_KEY = "ts_page_visibility";

const getPageVisibility = (): PageVisibility[] => {
  const data = localStorage.getItem(PAGE_VISIBILITY_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStoredPageVisibility = getPageVisibility;

const savePageVisibility = (pages: PageVisibility[]): void => {
  localStorage.setItem(PAGE_VISIBILITY_KEY, JSON.stringify(pages));
};

/** Get all page visibility settings */
export const getAllPageVisibility = async (): Promise<PageVisibility[]> => {
  return getPageVisibility();
};

/** Toggle page visibility */
export const togglePageVisibility = async (pageId: string): Promise<void> => {
  const pages = getPageVisibility();
  const index = pages.findIndex(p => p.id === pageId);
  
  if (index !== -1) {
    pages[index].is_visible = !pages[index].is_visible;
    pages[index].updated_at = new Date().toISOString();
    savePageVisibility(pages);
  }
};

/** Initialize default pages if not exists */
export const initializePages = (): void => {
  const existing = getPageVisibility();
  if (existing.length > 0) return;
  
  const defaultPages: PageVisibility[] = [
    { id: "1", page_path: "/projects", page_name: "Projects", is_visible: true, updated_at: new Date().toISOString() },
    { id: "2", page_path: "/events", page_name: "Events", is_visible: true, updated_at: new Date().toISOString() },
    { id: "3", page_path: "/blog", page_name: "Blog", is_visible: true, updated_at: new Date().toISOString() },
    { id: "4", page_path: "/gallery", page_name: "Gallery", is_visible: true, updated_at: new Date().toISOString() },
    { id: "5", page_path: "/achievements", page_name: "Achievements", is_visible: true, updated_at: new Date().toISOString() },
    { id: "6", page_path: "/publications", page_name: "Publications", is_visible: true, updated_at: new Date().toISOString() },
    { id: "7", page_path: "/resources", page_name: "Resources", is_visible: true, updated_at: new Date().toISOString() },
    { id: "8", page_path: "/faq", page_name: "FAQ", is_visible: true, updated_at: new Date().toISOString() },
    { id: "9", page_path: "/socials", page_name: "Socials", is_visible: true, updated_at: new Date().toISOString() },
  ];
  
  savePageVisibility(defaultPages);
};

// Initialize on module load
initializePages();
