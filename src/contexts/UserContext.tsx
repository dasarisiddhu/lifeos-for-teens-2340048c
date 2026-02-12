import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getStore, setStore } from "@/lib/storage";
import { getLevelFromXP } from "@/lib/gameData";

export interface UserProfile {
  username: string;
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  streakFreezes: number;
  completedLessons: string[];
  badges: string[];
  habits: Record<string, boolean[]>; // habitId -> last 7 days
  todayHabits: Record<string, boolean>;
  weeklyXP: number[];
  assessmentScore: number | null;
  assessmentResults: Record<string, number> | null;
  savingsGoals: { name: string; target: number; saved: number }[];
  budget: { allowance: number; spend: number; save: number; invest: number; fun: number } | null;
  purchasedItems: string[];
  createdAt: string;
}

const defaultProfile: UserProfile = {
  username: "",
  avatar: "😎",
  xp: 0,
  coins: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  streakFreezes: 0,
  completedLessons: [],
  badges: [],
  habits: {},
  todayHabits: {},
  weeklyXP: [0, 0, 0, 0, 0, 0, 0],
  assessmentScore: null,
  assessmentResults: null,
  savingsGoals: [],
  budget: null,
  purchasedItems: [],
  createdAt: new Date().toISOString(),
};

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  completeLesson: (lessonId: string, xp: number, coins: number) => void;
  toggleHabit: (habitId: string) => void;
  addBadge: (badgeId: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateStreak: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = getStore<UserProfile | null>("user_profile", null);
    return saved?.username ? saved : null;
  });

  const save = useCallback((profile: UserProfile) => {
    setUser(profile);
    setStore("user_profile", profile);
  }, []);

  const login = useCallback((username: string) => {
    const existing = getStore<UserProfile | null>("user_profile", null);
    if (existing?.username === username) {
      setUser(existing);
      return;
    }
    const profile = { ...defaultProfile, username, createdAt: new Date().toISOString(), lastActiveDate: new Date().toDateString() };
    save(profile);
  }, [save]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addXP = useCallback((amount: number) => {
    if (!user) return;
    const weeklyXP = [...user.weeklyXP];
    weeklyXP[new Date().getDay()] += amount;
    save({ ...user, xp: user.xp + amount, weeklyXP });
  }, [user, save]);

  const addCoins = useCallback((amount: number) => {
    if (!user) return;
    save({ ...user, coins: user.coins + amount });
  }, [user, save]);

  const spendCoins = useCallback((amount: number) => {
    if (!user || user.coins < amount) return false;
    save({ ...user, coins: user.coins - amount });
    return true;
  }, [user, save]);

  const completeLesson = useCallback((lessonId: string, xp: number, coins: number) => {
    if (!user || user.completedLessons.includes(lessonId)) return;
    const weeklyXP = [...user.weeklyXP];
    weeklyXP[new Date().getDay()] += xp;
    save({
      ...user,
      xp: user.xp + xp,
      coins: user.coins + coins,
      completedLessons: [...user.completedLessons, lessonId],
      weeklyXP,
    });
  }, [user, save]);

  const toggleHabit = useCallback((habitId: string) => {
    if (!user) return;
    const todayHabits = { ...user.todayHabits, [habitId]: !user.todayHabits[habitId] };
    save({ ...user, todayHabits });
  }, [user, save]);

  const addBadge = useCallback((badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    save({ ...user, badges: [...user.badges, badgeId] });
  }, [user, save]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!user) return;
    save({ ...user, ...updates });
  }, [user, save]);

  const updateStreak = useCallback(() => {
    if (!user) return;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (user.lastActiveDate === today) return;
    let streak = user.streak;
    if (user.lastActiveDate === yesterday) {
      streak += 1;
    } else if (user.lastActiveDate !== today) {
      if (user.streakFreezes > 0) {
        save({ ...user, streakFreezes: user.streakFreezes - 1, lastActiveDate: today });
        return;
      }
      streak = 1;
    }
    const longestStreak = Math.max(streak, user.longestStreak);
    save({ ...user, streak, longestStreak, lastActiveDate: today, weeklyXP: streak === 1 && user.lastActiveDate !== yesterday ? [0, 0, 0, 0, 0, 0, 0] : user.weeklyXP });
  }, [user, save]);

  useEffect(() => {
    if (user) updateStreak();
  }, [user?.username]);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user?.username, login, logout, addXP, addCoins, spendCoins, completeLesson, toggleHabit, addBadge, updateProfile, updateStreak }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
