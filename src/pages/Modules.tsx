import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { CATEGORIES, LESSONS } from "@/lib/gameData";
import { Check, Lock } from "lucide-react";
import { getLevelFromXP } from "@/lib/gameData";

export default function Modules() {
  const [activeCategory, setActiveCategory] = useState("communication");
  const { user } = useUser();
  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const filteredLessons = LESSONS.filter((l) => l.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-black">Learning Modules</h1>
        <p className="text-muted-foreground text-sm">Micro-lessons that fit your life</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none animate-fade-in" style={{ animationDelay: "100ms" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "gradient-primary text-primary-foreground shadow-lg"
                : "glass-card hover:bg-muted"
            }`}
          >
            <span>{cat.emoji}</span> {cat.name}
          </button>
        ))}
      </div>

      {/* Lesson cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredLessons.map((lesson, i) => {
          const completed = user.completedLessons.includes(lesson.id);
          const locked = lesson.difficulty === "advanced" && level < 5;

          return (
            <Link
              key={lesson.id}
              to={locked ? "#" : `/lesson/${lesson.id}`}
              className={`glass-card p-4 hover-lift animate-fade-in ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ animationDelay: `${150 + i * 80}ms` }}
              onClick={(e) => locked && e.preventDefault()}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{lesson.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-sm truncate">{lesson.title}</h3>
                    {completed && <Check size={16} className="text-primary shrink-0" />}
                    {locked && <Lock size={14} className="text-muted-foreground shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>⏱ {lesson.duration}</span>
                    <span>⚡ +{lesson.xp} XP</span>
                    <span>🪙 +{lesson.coins}</span>
                  </div>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                    lesson.difficulty === "beginner" ? "bg-primary/15 text-primary" :
                    lesson.difficulty === "intermediate" ? "bg-secondary/15 text-secondary" :
                    "bg-accent/15 text-accent"
                  }`}>
                    {lesson.difficulty}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
