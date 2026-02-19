import { supabase } from "@/integrations/supabase/client";

// ─── TYPES ───────────────────────────────────────────────────────────
export type AdminRole = "super_admin" | "admin";

export interface AdminUser {
    user_id: string;
    role: AdminRole;
    email?: string;
    full_name?: string;
    is_blocked: boolean;
    blocked_at?: string;
    block_reason?: string;
}

export interface PageVisibility {
    id: string;
    page_path: string;
    page_name: string;
    is_visible: boolean;
    updated_at: string;
}

// ─── ROLE CHECKS ─────────────────────────────────────────────────────

/** Get the current user's admin role (super_admin | admin | null) */
export const getUserRole = async (userId: string): Promise<AdminRole | null> => {
    const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .in("role", ["super_admin", "admin"])
        .maybeSingle();

    if (!data) return null;
    return data.role as AdminRole;
};

/** Check if user is blocked */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
    const { data } = await supabase
        .from("admin_blocklist")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

    return !!data;
};

// ─── USER MANAGEMENT (Super Admin Only) ──────────────────────────────

/** Get all admin users with their block status */
export const getAdminUsers = async (): Promise<AdminUser[]> => {
    // Get all users with admin/super_admin roles
    const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["super_admin", "admin"]);

    if (error || !roles) return [];

    // Get block status for each
    const { data: blocklist } = await supabase
        .from("admin_blocklist")
        .select("user_id, blocked_at, reason");

    const blockMap = new Map(
        (blocklist || []).map((b: { user_id: string; blocked_at: string; reason: string | null }) => [
            b.user_id,
            { blocked_at: b.blocked_at, reason: b.reason },
        ])
    );

    // Get profiles for names/emails
    const userIds = roles.map((r: { user_id: string }) => r.user_id);
    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

    const profileMap = new Map(
        (profiles || []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
    );

    return roles.map((r: { user_id: string; role: string }) => {
        const block = blockMap.get(r.user_id);
        return {
            user_id: r.user_id,
            role: r.role as AdminRole,
            full_name: profileMap.get(r.user_id) || undefined,
            is_blocked: !!block,
            blocked_at: block?.blocked_at,
            block_reason: block?.reason || undefined,
        };
    });
};

/** Add a user as admin by their email */
export const addAdminByEmail = async (
    email: string
): Promise<{ success: boolean; error?: string }> => {
    // Look up the user in auth — we need to find them by email in profiles or auth
    // Since we can't query auth.users from client, we'll search profiles
    // The user must have signed up first
    const { data: authData } = await supabase.auth.admin.listUsers();

    if (!authData) {
        return { success: false, error: "Cannot access user list" };
    }

    const user = authData.users.find((u) => u.email === email);
    if (!user) {
        return { success: false, error: `No account found for ${email}. User must sign up first.` };
    }

    // Check if they already have a role
    const { data: existing } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existing) {
        return { success: false, error: "User already has an admin role" };
    }

    const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "admin" });

    if (error) return { success: false, error: error.message };
    return { success: true };
};

/** Remove admin role from a user */
export const removeAdminUser = async (userId: string): Promise<void> => {
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
    // Also remove from blocklist if present
    await supabase.from("admin_blocklist").delete().eq("user_id", userId);
};

/** Block an admin user */
export const blockUser = async (
    userId: string,
    blockedBy: string,
    reason?: string
): Promise<void> => {
    await supabase.from("admin_blocklist").upsert({
        user_id: userId,
        blocked_by: blockedBy,
        reason: reason || null,
    });
};

/** Unblock an admin user */
export const unblockUser = async (userId: string): Promise<void> => {
    await supabase.from("admin_blocklist").delete().eq("user_id", userId);
};

// ─── PAGE VISIBILITY (Super Admin Only) ──────────────────────────────

/** Get visibility status for all pages */
export const getPageVisibility = async (): Promise<PageVisibility[]> => {
    const { data, error } = await supabase
        .from("page_visibility")
        .select("*")
        .order("page_name");

    if (error || !data) return [];
    return data as PageVisibility[];
};

/** Toggle a page's visibility */
export const togglePageVisibility = async (
    pageId: string,
    isVisible: boolean,
    userId: string
): Promise<void> => {
    await supabase
        .from("page_visibility")
        .update({
            is_visible: isVisible,
            hidden_by: isVisible ? null : userId,
            updated_at: new Date().toISOString(),
        })
        .eq("id", pageId);
};

/** Get list of hidden page paths (for route filtering) */
export const getHiddenPages = async (): Promise<string[]> => {
    const { data } = await supabase
        .from("page_visibility")
        .select("page_path")
        .eq("is_visible", false);

    return (data || []).map((d: { page_path: string }) => d.page_path);
};

// ─── CUSTOM CREDENTIAL SYSTEM ────────────────────────────────────────

const ADMIN_CREDS_KEY = "ts_admin_credentials";

/** Hardcoded Super Admin credentials */
const SUPER_ADMIN_CREDS = {
    username: "techshastra@AK",
    password: "7817030426@AK",
};

/** Stored admin credential */
export interface AdminCredential {
    id: string;
    name: string;
    mobile: string;
    dob: string; // YYYY-MM-DD
    username: string;
    password: string;
    created_at: string;
    is_blocked: boolean;
}

/**
 * Generate unique credentials from name, mobile, DOB.
 * Username: first3chars_of_name + last4_of_mobile + "@ts"
 * Password: DOB(ddmm) + first2chars_of_name + mid4_of_mobile + "!"
 */
export const generateCredentials = (
    name: string,
    mobile: string,
    dob: string
): { username: string; password: string } => {
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, "");
    const cleanMobile = mobile.replace(/\D/g, "");
    const dobParts = dob.split("-"); // YYYY-MM-DD

    // Username: first3 of name + last4 of mobile + @ts
    const namePrefix = cleanName.slice(0, 3);
    const mobileSuffix = cleanMobile.slice(-4);
    const username = `${namePrefix}${mobileSuffix}@ts`;

    // Password: dd + mm + first2uppercase + mid4ofmobile + !
    const dd = dobParts[2] || "01";
    const mm = dobParts[1] || "01";
    const nameUpper = name.trim().slice(0, 2).toUpperCase();
    const mobileMid = cleanMobile.slice(3, 7);
    const password = `${dd}${mm}${nameUpper}${mobileMid}!`;

    return { username, password };
};

/** Get all stored admin credentials */
export const getStoredCredentials = (): AdminCredential[] => {
    try {
        const raw = localStorage.getItem(ADMIN_CREDS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_e) {
        return [];
    }
};

/** Save credentials to localStorage */
const saveCredentials = (creds: AdminCredential[]) => {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
};

/** Create a new admin with generated credentials */
export const createAdminCredential = (
    name: string,
    mobile: string,
    dob: string
): AdminCredential => {
    const { username, password } = generateCredentials(name, mobile, dob);
    const newCred: AdminCredential = {
        id: `adm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: name.trim(),
        mobile: mobile.trim(),
        dob,
        username,
        password,
        created_at: new Date().toISOString(),
        is_blocked: false,
    };

    const existing = getStoredCredentials();
    // Check for duplicate username
    if (existing.some((c) => c.username === username)) {
        throw new Error(`Credential already exists for similar name/mobile combo`);
    }
    saveCredentials([...existing, newCred]);
    return newCred;
};

/** Delete an admin credential */
export const deleteAdminCredential = (id: string) => {
    const creds = getStoredCredentials().filter((c) => c.id !== id);
    saveCredentials(creds);
};

/** Block/unblock an admin credential */
export const toggleAdminCredBlock = (id: string, blocked: boolean) => {
    const creds = getStoredCredentials().map((c) =>
        c.id === id ? { ...c, is_blocked: blocked } : c
    );
    saveCredentials(creds);
};

/**
 * Authenticate against custom credentials.
 * Returns: { role: "super_admin" | "admin" | null, name: string | null, blocked: boolean }
 */
export const authenticateCustom = (
    username: string,
    password: string
): { role: AdminRole | null; name: string | null; blocked: boolean } => {
    // 1. Check Super Admin hardcoded creds
    if (
        username === SUPER_ADMIN_CREDS.username &&
        password === SUPER_ADMIN_CREDS.password
    ) {
        return { role: "super_admin", name: "Akhilesh Raje", blocked: false };
    }

    // 2. Check stored admin credentials
    const creds = getStoredCredentials();
    const match = creds.find(
        (c) => c.username === username && c.password === password
    );

    if (match) {
        if (match.is_blocked) {
            return { role: null, name: match.name, blocked: true };
        }
        return { role: "admin", name: match.name, blocked: false };
    }

    return { role: null, name: null, blocked: false };
};
