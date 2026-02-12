import { useUser } from "@/contexts/UserContext";
import { getLevelFromXP, getXPForNextLevel, HABITS, QUESTS, LESSONS } from "@/lib/gameData";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowRight, Sparkles } from "lucide-react";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Dashboard() {
  const { user, toggleHabit } = useUser();
  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const xpInfo = getXPForNextLevel(user.xp);
  const completedCount = user.completedLessons.length;
  const nextLesson = LESSONS.find((l) => !user.completedLessons.includes(l.id));
  const dailyQuests = QUESTS.filter((q) => q.type === "daily");

  const chartData = user.weeklyXP.map((xp, i) => ({ name: DAY_LABELS[i], xp }));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      {/* Welcome */}
      <div className="glass-card p-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-black">Hey {user.username}! {user.avatar}</h1>
            <p className="text-muted-foreground text-sm">Ready to level up today?</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-level">Lv. {level}</span>
          </div>
        </div>
      </div>

      {/* XP + Streak row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <p className="text-xs text-muted-foreground font-bold mb-1">⚡ XP Progress</p>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="gradient-xp h-full rounded-full transition-all duration-500" style={{ width: `${xpInfo.progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{xpInfo.current}/{xpInfo.needed} to Level {level + 1}</p>
        </div>
        <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <p className="text-xs text-muted-foreground font-bold mb-1">🔥 Streak</p>
          <p className="text-3xl font-black text-streak">{user.streak}</p>
          <p className="text-xs text-muted-foreground">Best: {user.longestStreak} days</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: "🪙", label: "Coins", value: user.coins, color: "text-coin" },
          { emoji: "📚", label: "Lessons", value: completedCount, color: "text-primary" },
          { emoji: "🏆", label: "Badges", value: user.badges.length, color: "text-secondary" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-3 text-center animate-fade-in" style={{ animationDelay: `${200 + i * 50}ms` }}>
            <span className="text-xl">{s.emoji}</span>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daily Habits */}
      <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="font-display font-bold text-sm mb-3">✅ Daily Habits</h3>
        <div className="grid grid-cols-5 gap-2">
          {HABITS.map((h) => (
            <button
              key={h.id}
              onClick={() => toggleHabit(h.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all text-xs ${
                user.todayHabits[h.id]
                  ? "bg-primary/15 ring-2 ring-primary"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <span className="text-xl mb-0.5">{h.emoji}</span>
              <span className="font-bold truncate w-full text-center">{h.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "350ms" }}>
        <h3 className="font-display font-bold text-sm mb-3">📈 Weekly XP</h3>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="xp" fill="hsl(142, 65%, 40%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommended lesson */}
      {nextLesson && (
        <Link to={`/lesson/${nextLesson.id}`} className="glass-card p-4 flex items-center gap-4 hover-lift animate-fade-in" style={{ animationDelay: "400ms" }}>
          <span className="text-3xl">{nextLesson.emoji}</span>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-bold flex items-center gap-1"><Sparkles size={12} /> Recommended</p>
            <p className="font-display font-bold">{nextLesson.title}</p>
            <p className="text-xs text-muted-foreground">{nextLesson.duration} • +{nextLesson.xp} XP</p>
          </div>
          <ArrowRight size={18} className="text-muted-foreground" />
        </Link>
      )}

      {/* Daily Quests */}
      <div className="glass-card p-4 animate-fade-in" style={{ animationDelay: "450ms" }}>
        <h3 className="font-display font-bold text-sm mb-3">🎯 Daily Quests</h3>
        <div className="space-y-2">
          {dailyQuests.map((q) => (
            <div key={q.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
              <span className="text-xl">{q.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-sm">{q.title}</p>
                <p className="text-xs text-muted-foreground">+{q.reward.xp} XP, +{q.reward.coins} 🪙</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
