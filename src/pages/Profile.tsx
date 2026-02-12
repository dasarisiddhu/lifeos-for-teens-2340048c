import { useUser } from "@/contexts/UserContext";
import { getLevelFromXP, getXPForNextLevel, BADGES, CATEGORIES, LESSONS } from "@/lib/gameData";

export default function Profile() {
  const { user } = useUser();
  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const xpInfo = getXPForNextLevel(user.xp);

  // Category progress
  const categoryProgress = CATEGORIES.map((cat) => {
    const total = LESSONS.filter((l) => l.category === cat.id).length;
    const done = LESSONS.filter((l) => l.category === cat.id && user.completedLessons.includes(l.id)).length;
    return { ...cat, total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      {/* Profile card */}
      <div className="glass-card p-6 text-center animate-fade-in">
        <div className="text-6xl mb-3">{user.avatar}</div>
        <h1 className="font-display text-2xl font-black">{user.username}</h1>
        <p className="text-muted-foreground text-sm">Level {level} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
        <div className="mt-4 max-w-xs mx-auto">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="gradient-xp h-full rounded-full transition-all" style={{ width: `${xpInfo.progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{xpInfo.current}/{xpInfo.needed} XP to Level {level + 1}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
        {[
          { emoji: "⚡", value: user.xp, label: "Total XP" },
          { emoji: "🪙", value: user.coins, label: "Coins" },
          { emoji: "🔥", value: user.streak, label: "Streak" },
          { emoji: "📚", value: user.completedLessons.length, label: "Lessons" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-3 text-center">
            <span className="text-lg">{s.emoji}</span>
            <p className="font-black text-lg">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="font-display font-bold mb-3">🏆 Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const earned = user.badges.includes(badge.id);
            return (
              <div key={badge.id} className={`flex flex-col items-center p-2 rounded-xl text-center ${earned ? "badge-glow" : "opacity-40"}`}>
                <span className="text-2xl mb-1">{badge.emoji}</span>
                <p className="text-xs font-bold">{badge.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category progress / weaknesses heatmap */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="font-display font-bold mb-3">📊 Skill Progress</h3>
        <div className="space-y-3">
          {categoryProgress.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-bold">{cat.emoji} {cat.name}</span>
                <span className="text-muted-foreground">{cat.done}/{cat.total}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cat.pct >= 70 ? "gradient-primary" : cat.pct >= 40 ? "gradient-secondary" : "bg-destructive/60"
                  }`}
                  style={{ width: `${Math.max(cat.pct, 3)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assessment score */}
      {user.assessmentScore !== null && (
        <div className="glass-card p-5 text-center animate-fade-in" style={{ animationDelay: "400ms" }}>
          <h3 className="font-display font-bold mb-2">🎯 Teen Life Score</h3>
          <p className="text-5xl font-black text-gradient">{user.assessmentScore}</p>
          <p className="text-muted-foreground text-sm">/100</p>
        </div>
      )}
    </div>
  );
}
