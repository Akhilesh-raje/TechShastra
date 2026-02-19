import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ─── TYPES ───────────────────────────────────────────────────────────
export interface AdminPresence {
    user_id: string;
    full_name: string;
    current_tab: string;
    joined_at: string;
    last_action: string;
    last_action_at: string;
}

export interface ActivityLogEntry {
    id: string;
    user_id: string;
    full_name: string;
    action: string;
    tab: string;
    timestamp: string;
    is_login?: boolean;
    is_logout?: boolean;
}

// ─── PRESENCE HOOK ───────────────────────────────────────────────────
/**
 * Tracks admin presence using Supabase Realtime.
 * - Broadcasts current admin's state (tab, last action)
 * - Receives all other admins' states
 * - Detects joins (🟢 online) and leaves (🔴 gone)
 */
export function useAdminPresence(
    userId: string | null,
    fullName: string,
    currentTab: string
) {
    const [onlineAdmins, setOnlineAdmins] = useState<AdminPresence[]>([]);
    const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
    const channelRef = useRef<RealtimeChannel | null>(null);
    const lastActionRef = useRef<string>("Opened admin panel");

    // Log helper
    const addLog = (entry: Omit<ActivityLogEntry, "id">) => {
        setActivityLog((prev) => [
            { ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
            ...prev.slice(0, 99), // keep last 100
        ]);
    };

    // Update last action (called by Admin.tsx when user does something)
    const trackAction = (action: string) => {
        lastActionRef.current = action;
        if (channelRef.current && userId) {
            channelRef.current.track({
                user_id: userId,
                full_name: fullName,
                current_tab: currentTab,
                joined_at: new Date().toISOString(),
                last_action: action,
                last_action_at: new Date().toISOString(),
            });
            addLog({
                user_id: userId,
                full_name: fullName,
                action,
                tab: currentTab,
                timestamp: new Date().toISOString(),
            });
        }
    };

    useEffect(() => {
        if (!userId) return;

        const channel = supabase.channel("admin-presence", {
            config: { presence: { key: userId } },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const state = channel.presenceState<AdminPresence>();
                const admins: AdminPresence[] = [];
                for (const key of Object.keys(state)) {
                    const presences = state[key];
                    if (presences && presences.length > 0) {
                        admins.push(presences[0] as unknown as AdminPresence);
                    }
                }
                setOnlineAdmins(admins);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                const p = newPresences[0] as unknown as AdminPresence;
                if (p && key !== userId) {
                    addLog({
                        user_id: key,
                        full_name: p.full_name || key.slice(0, 8),
                        action: "Came online",
                        tab: p.current_tab || "overview",
                        timestamp: new Date().toISOString(),
                        is_login: true,
                    });
                }
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                const p = leftPresences[0] as unknown as AdminPresence;
                addLog({
                    user_id: key,
                    full_name: p?.full_name || key.slice(0, 8),
                    action: "Went offline",
                    tab: p?.current_tab || "unknown",
                    timestamp: new Date().toISOString(),
                    is_logout: true,
                });
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        user_id: userId,
                        full_name: fullName,
                        current_tab: currentTab,
                        joined_at: new Date().toISOString(),
                        last_action: "Opened admin panel",
                        last_action_at: new Date().toISOString(),
                    });
                }
            });

        channelRef.current = channel;

        return () => {
            channel.unsubscribe();
            channelRef.current = null;
        };
    }, [userId]);

    // Track tab changes
    useEffect(() => {
        if (channelRef.current && userId) {
            channelRef.current.track({
                user_id: userId,
                full_name: fullName,
                current_tab: currentTab,
                joined_at: new Date().toISOString(),
                last_action: `Switched to ${currentTab}`,
                last_action_at: new Date().toISOString(),
            });
        }
    }, [currentTab]);

    return { onlineAdmins, activityLog, trackAction };
}
