import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SKILL_TEST_QUESTIONS, CATEGORIES } from "@/lib/gameData";

export default function SkillTest() {
  const { user, updateProfile, addXP, addCoins, addBadge } = useUser();
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const isLoggedIn = !!user?.username;
  const q = SKILL_TEST_QUESTIONS[currentQ];

  const handleAnswer = (scoreIdx: number) => {
    const newAnswers = [...answers, q.scores[scoreIdx]];
    setAnswers(newAnswers);

    if (currentQ < SKILL_TEST_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate results
      const total = newAnswers.reduce((a, b) => a + b, 0);
      const maxScore = SKILL_TEST_QUESTIONS.length * 4;
      const score = Math.round((total / maxScore) * 100);

      const catScores: Record<string, number[]> = {};
      SKILL_TEST_QUESTIONS.forEach((q, i) => {
        if (!catScores[q.category]) catScores[q.category] = [];
        catScores[q.category].push(newAnswers[i]);
      });

      const results: Record<string, number> = {};
      Object.entries(catScores).forEach(([cat, scores]) => {
        results[cat] = Math.round((scores.reduce((a, b) => a + b, 0) / (scores.length * 4)) * 100);
      });

      if (isLoggedIn) {
        updateProfile({ assessmentScore: score, assessmentResults: results });
        addXP(50);
        addCoins(10);
      }
      setDone(true);
    }
  };

  const score = user?.assessmentScore ?? Math.round((answers.reduce((a, b) => a + b, 0) / (SKILL_TEST_QUESTIONS.length * 4)) * 100);
  const results = user?.assessmentResults;

  if (done || (isLoggedIn && user?.assessmentScore !== null && answers.length === 0)) {
    const finalResults = results || {};
    const sorted = Object.entries(finalResults).sort((a, b) => a[1] - b[1]);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];

    return (
      <div className="max-w-lg mx-auto p-4 space-y-5 animate-scale-in">
        <div className="glass-card p-6 text-center">
          <h2 className="font-display text-2xl font-black mb-2">Your Teen Life Score</h2>
          <div className="text-6xl font-black text-gradient my-6">{score}</div>
          <p className="text-muted-foreground">/100</p>
        </div>

        {Object.keys(finalResults).length > 0 && (
          <div className="glass-card p-5">
            <h3 className="font-display font-bold mb-3">📊 Breakdown</h3>
            <div className="space-y-3">
              {CATEGORIES.map((cat) => {
                const val = finalResults[cat.id] ?? 0;
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold">{cat.emoji} {cat.name}</span>
                      <span className={val < 50 ? "text-destructive font-bold" : "text-primary font-bold"}>{val}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className={`h-full rounded-full transition-all ${val >= 60 ? "gradient-primary" : "bg-destructive/60"}`} style={{ width: `${val}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {weakest && strongest && (
          <div className="glass-card p-5">
            <h3 className="font-display font-bold mb-3">💡 Recommendations</h3>
            <div className="space-y-2 text-sm">
              <p>💪 <strong>Strongest:</strong> {CATEGORIES.find(c => c.id === strongest[0])?.name} ({strongest[1]}%)</p>
              <p>🎯 <strong>Focus area:</strong> {CATEGORIES.find(c => c.id === weakest[0])?.name} ({weakest[1]}%)</p>
              <p className="text-muted-foreground">Start with the {CATEGORIES.find(c => c.id === weakest[0])?.name} module to boost your weakest skill!</p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setCurrentQ(0); setAnswers([]); setDone(false); }} className="flex-1 glass-card py-3 rounded-xl font-bold hover-lift text-center">
            Retake Test
          </button>
          {isLoggedIn && (
            <button onClick={() => navigate("/modules")} className="flex-1 gradient-primary py-3 rounded-xl font-bold text-primary-foreground hover-lift text-center">
              Start Learning
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-black">🎯 Skill Assessment</h1>
        <p className="text-muted-foreground text-sm">Discover your Teen Life Score</p>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2">
        <div className="gradient-primary h-full rounded-full transition-all" style={{ width: `${((currentQ + 1) / SKILL_TEST_QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="glass-card p-5 animate-fade-in" key={currentQ}>
        <p className="text-xs text-muted-foreground font-bold mb-2">Question {currentQ + 1}/{SKILL_TEST_QUESTIONS.length}</p>
        <h3 className="font-display font-bold text-lg mb-4">{q.question}</h3>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left p-3 rounded-xl bg-muted hover:bg-primary/10 hover:ring-2 hover:ring-primary transition-all text-sm font-medium"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
