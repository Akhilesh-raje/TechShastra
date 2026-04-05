import { AdminCredential, getStoredCredentials } from "./adminStore";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type LogEntryType =
    | "create_credential"
    | "delete_credential"
    | "block_credential"
    | "unblock_credential"
    | "toggle_page";

export interface LogEntry {
    id: string;
    timestamp: string;           // ISO string
    actor: string;               // e.g. "Akhilesh Raje"
    action: string;              // human-readable description
    type: LogEntryType;
    revertible: boolean;
    /** For create/delete: full snapshot of the credential so we can restore/remove. */
    credentialSnapshot?: AdminCredential;
    /** For block/unblock: id of the credential that was toggled. */
    credentialId?: string;
    /** For page visibility: the page ID and target visibility */
    pageId?: string;
    pageName?: string;
    pagePath?: string;
    isVisible?: boolean;
}

const LOG_KEY = "ts_super_admin_log";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export const getLogEntries = (): LogEntry[] => {
    try {
        const raw = localStorage.getItem(LOG_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveLogEntries = (entries: LogEntry[]) => {
    localStorage.setItem(LOG_KEY, JSON.stringify(entries));
};

export const addLogEntry = (entry: Omit<LogEntry, "id" | "timestamp">): LogEntry => {
    const full: LogEntry = {
        ...entry,
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
    };
    const existing = getLogEntries();
    saveLogEntries([full, ...existing]);
    return full;
};

export const clearLog = () => {
    localStorage.removeItem(LOG_KEY);
};

// ─── REVERT ───────────────────────────────────────────────────────────────────

/**
 * Attempt to revert the action described by a log entry.
 * Returns { success, message } describing the outcome.
 */
export const revertEntry = (
    entryId: string,
    saveCredentials: (creds: AdminCredential[]) => void
): { success: boolean; message: string } => {
    const entries = getLogEntries();
    const entry = entries.find((e) => e.id === entryId);

    if (!entry) return { success: false, message: "Log entry not found." };
    if (!entry.revertible) return { success: false, message: "This action cannot be reverted." };

    const creds = getStoredCredentials();

    switch (entry.type) {
        case "delete_credential": {
            // Restore the deleted credential
            if (!entry.credentialSnapshot) return { success: false, message: "No snapshot to restore." };
            const already = creds.some((c) => c.id === entry.credentialSnapshot!.id);
            if (already) return { success: false, message: "Credential already exists." };
            const restored = [...creds, entry.credentialSnapshot];
            saveCredentials(restored);
            addLogEntry({
                actor: entry.actor,
                action: `↩️ Reverted deletion of ${entry.credentialSnapshot.name}'s credentials`,
                type: "create_credential",
                revertible: false,
                credentialSnapshot: entry.credentialSnapshot,
            });
            return { success: true, message: `Restored credentials for ${entry.credentialSnapshot.name}.` };
        }

        case "create_credential": {
            // Delete the credential that was created
            if (!entry.credentialSnapshot) return { success: false, message: "No snapshot available." };
            const filtered = creds.filter((c) => c.id !== entry.credentialSnapshot!.id);
            saveCredentials(filtered);
            addLogEntry({
                actor: entry.actor,
                action: `↩️ Reverted creation of ${entry.credentialSnapshot.name}'s credentials`,
                type: "delete_credential",
                revertible: false,
                credentialId: entry.credentialSnapshot.id,
            });
            return { success: true, message: `Removed credentials for ${entry.credentialSnapshot.name}.` };
        }

        case "block_credential": {
            // Unblock the credential
            const id = entry.credentialId;
            if (!id) return { success: false, message: "No credential ID to unblock." };
            const updated = creds.map((c) => (c.id === id ? { ...c, is_blocked: false } : c));
            saveCredentials(updated);
            const target = creds.find((c) => c.id === id);
            addLogEntry({
                actor: entry.actor,
                action: `↩️ Reverted block on ${target?.name ?? id}`,
                type: "unblock_credential",
                revertible: false,
                credentialId: id,
            });
            return { success: true, message: `Unblocked ${target?.name ?? id}.` };
        }

        case "unblock_credential": {
            // Re-block the credential
            const id = entry.credentialId;
            if (!id) return { success: false, message: "No credential ID to block." };
            const updated = creds.map((c) => (c.id === id ? { ...c, is_blocked: true } : c));
            saveCredentials(updated);
            const target = creds.find((c) => c.id === id);
            addLogEntry({
                actor: entry.actor,
                action: `↩️ Reverted unblock on ${target?.name ?? id}`,
                type: "block_credential",
                revertible: false,
                credentialId: id,
            });
            return { success: true, message: `Re-blocked ${target?.name ?? id}.` };
        }

        case "toggle_page": {
            // Import togglePageVisibility dynamically or assume it's handled in Admin.tsx
            // Actually, since this is a pure store, we should return a signal for Admin.tsx to perform the action.
            // But for consistency with credentials, let's keep the revert logic here if possible.
            // Since page_visibility is in Supabase, we need a way to call the API.
            // For now, let's just return a failure or mark it as non-revertible in the store
            // OR pass a callback. Let's pass a broader callback.
            return { success: false, message: "Page visibility revert must be handled via the Admin panel." };
        }

        default:
            return { success: false, message: "Revert not supported for this action type." };
    }
};

// ─── INTERNAL SAVE HELPER (used by revertEntry) ──────────────────────────────
export const saveCredentialsRaw = (creds: AdminCredential[]) => {
    localStorage.setItem("ts_admin_credentials", JSON.stringify(creds));
};
