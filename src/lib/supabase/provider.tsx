"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "./client";
import type { User } from "@supabase/supabase-js";
import type { Profile, Bookmark, WatchHistoryItem } from "@/types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  bookmarks: Bookmark[];
  watchHistory: WatchHistoryItem[];
  toggleBookmark: (anime: { id: string; title: string; poster?: string }) => Promise<boolean>;
  isBookmarked: (animeId: string) => boolean;
  saveWatchHistory: (item: {
    animeId: string;
    animeTitle: string;
    animePoster?: string;
    episodeId: string;
    episodeTitle: string;
    episodeNumber?: number;
  }) => Promise<void>;
  removeBookmark: (animeId: string) => Promise<void>;
  removeHistoryItem: (animeId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_BOOKMARKS = "nontonanime_bookmarks";
const LOCAL_STORAGE_HISTORY = "nontonanime_history";

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  const supabase = createClient();
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy");

  // Load initial local storage data
  useEffect(() => {
    try {
      const localBookmarks = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS);
      if (localBookmarks) {
        setBookmarks(JSON.parse(localBookmarks));
      }
      const localHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY);
      if (localHistory) {
        setWatchHistory(JSON.parse(localHistory));
      }
    } catch (e) {
      console.warn("Could not read local storage:", e);
    }
  }, []);

  // Fetch Supabase User & sync
  useEffect(() => {
    async function initAuth() {
      try {
        if (!isSupabaseConfigured) {
          setIsLoading(false);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch profile
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          if (prof) setProfile(prof);

          // Fetch bookmarks
          const { data: bms } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (bms) {
            setBookmarks(bms);
            localStorage.setItem(LOCAL_STORAGE_BOOKMARKS, JSON.stringify(bms));
          }

          // Fetch history
          const { data: hist } = await supabase
            .from("watch_history")
            .select("*")
            .eq("user_id", user.id)
            .order("last_watched_at", { ascending: false });
          if (hist) {
            setWatchHistory(hist);
            localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify(hist));
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    if (isSupabaseConfigured) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (!currentUser) {
            setProfile(null);
          }
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isSupabaseConfigured]);

  // Toggle Bookmark
  const toggleBookmark = async (anime: { id: string; title: string; poster?: string }): Promise<boolean> => {
    const exists = bookmarks.some((b) => b.anime_id === anime.id);

    if (exists) {
      // Remove
      await removeBookmark(anime.id);
      return false;
    } else {
      // Add
      const newBookmark: Bookmark = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        user_id: user?.id || "guest",
        anime_id: anime.id,
        anime_title: anime.title,
        anime_poster: anime.poster || null,
        status: "watching",
        created_at: new Date().toISOString(),
      };

      const updated = [newBookmark, ...bookmarks.filter((b) => b.anime_id !== anime.id)];
      setBookmarks(updated);
      localStorage.setItem(LOCAL_STORAGE_BOOKMARKS, JSON.stringify(updated));

      if (user && isSupabaseConfigured) {
        try {
          await supabase.from("bookmarks").upsert({
            user_id: user.id,
            anime_id: anime.id,
            anime_title: anime.title,
            anime_poster: anime.poster || null,
            status: "watching",
          });
        } catch (e) {
          console.error("Failed to save bookmark to Supabase:", e);
        }
      }
      return true;
    }
  };

  const removeBookmark = async (animeId: string) => {
    const updated = bookmarks.filter((b) => b.anime_id !== animeId);
    setBookmarks(updated);
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS, JSON.stringify(updated));

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("anime_id", animeId);
      } catch (e) {
        console.error("Failed to delete bookmark from Supabase:", e);
      }
    }
  };

  const isBookmarked = (animeId: string) => {
    return bookmarks.some((b) => b.anime_id === animeId);
  };

  // Save Watch History
  const saveWatchHistory = async (item: {
    animeId: string;
    animeTitle: string;
    animePoster?: string;
    episodeId: string;
    episodeTitle: string;
    episodeNumber?: number;
  }) => {
    const newHistoryItem: WatchHistoryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      user_id: user?.id || "guest",
      anime_id: item.animeId,
      anime_title: item.animeTitle,
      anime_poster: item.animePoster || null,
      episode_id: item.episodeId,
      episode_title: item.episodeTitle,
      episode_number: item.episodeNumber || 1,
      last_watched_at: new Date().toISOString(),
    };

    const filtered = watchHistory.filter((h) => h.anime_id !== item.animeId);
    const updated = [newHistoryItem, ...filtered];
    setWatchHistory(updated);
    localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify(updated));

    if (user && isSupabaseConfigured) {
      try {
        await supabase.from("watch_history").upsert({
          user_id: user.id,
          anime_id: item.animeId,
          anime_title: item.animeTitle,
          anime_poster: item.animePoster || null,
          episode_id: item.episodeId,
          episode_title: item.episodeTitle,
          episode_number: item.episodeNumber || 1,
          last_watched_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Failed to save history to Supabase:", e);
      }
    }
  };

  const removeHistoryItem = async (animeId: string) => {
    const updated = watchHistory.filter((h) => h.anime_id !== animeId);
    setWatchHistory(updated);
    localStorage.setItem(LOCAL_STORAGE_HISTORY, JSON.stringify(updated));

    if (user && isSupabaseConfigured) {
      try {
        await supabase
          .from("watch_history")
          .delete()
          .eq("user_id", user.id)
          .eq("anime_id", animeId);
      } catch (e) {
        console.error("Failed to delete history from Supabase:", e);
      }
    }
  };

  const clearHistory = async () => {
    setWatchHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY);

    if (user && isSupabaseConfigured) {
      try {
        await supabase.from("watch_history").delete().eq("user_id", user.id);
      } catch (e) {
        console.error("Failed to clear history from Supabase:", e);
      }
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        bookmarks,
        watchHistory,
        toggleBookmark,
        isBookmarked,
        saveWatchHistory,
        removeBookmark,
        removeHistoryItem,
        clearHistory,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a SupabaseProvider");
  }
  return context;
}
