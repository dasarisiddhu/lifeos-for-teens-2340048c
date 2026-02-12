import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { LESSONS } from "@/lib/gameData";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy } from "lucide-react";

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, completeLesson, addBadge } = useUser();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const lesson = LESSONS.find((l) => l.id === id);
  if (!lesson || !user) return <div className="p-8 text-center">Lesson not found</div>;

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;
  const alreadyCompleted = user.completedLessons.includes(lesson.id);

  const handleAnswer = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswer(idx);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (isLastStep && !completed) {
      if (!alreadyCompleted) {
        completeLesson(lesson.id, lesson.xp, lesson.coins);
        // Check for badges
        const commLessons = user.completedLessons.filter(id => id.startsWith("comm-")).length + (lesson.id.startsWith("comm-") ? 1 : 0);
        if (commLessons >= 5) addBadge("communicator");
        if (user.completedLessons.length === 0) addBadge("first_lesson");
      }
      setCompleted(true);
      return;
    }
    setStepIndex(stepIndex + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  if (completed) {
    return (
      <div className="max-w-lg mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
        <div className="glass-card p-8 text-center w-full">
          <Trophy size={48} className="text-secondary mx-auto mb-4 animate-bounce-in" />
          <h2 className="font-display text-2xl font-black mb-2">Lesson Complete! 🎉</h2>
          {!alreadyCompleted ? (
            <div className="space-y-2 mb-6">
              <p className="text-lg font-bold text-xp">+{lesson.xp} XP ⚡</p>
              <p className="text-lg font-bold text-coin">+{lesson.coins} Coins 🪙</p>
            </div>
          ) : (
            <p className="text-muted-foreground mb-6">You've already earned rewards for this lesson</p>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/modules")} className="glass-card px-5 py-2 rounded-xl font-bold hover-lift">
              More Lessons
            </button>
            <button onClick={() => navigate("/dashboard")} className="gradient-primary px-5 py-2 rounded-xl font-bold text-primary-foreground hover-lift">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-bold">{lesson.emoji} {lesson.title}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div className="gradient-primary h-full rounded-full transition-all duration-300" style={{ width: `${((stepIndex + 1) / lesson.steps.length) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-bold">{stepIndex + 1}/{lesson.steps.length}</span>
      </div>

      {/* Step content */}
      <div className="glass-card p-5 animate-fade-in" key={stepIndex}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            step.type === "learn" ? "bg-accent/15 text-accent" :
            step.type === "scenario" ? "bg-secondary/15 text-secondary" :
            step.type === "quiz" ? "bg-primary/15 text-primary" :
            "bg-streak/15 text-streak"
          }`}>
            {step.type === "learn" ? "📖 Learn" : step.type === "scenario" ? "🎭 Scenario" : step.type === "quiz" ? "❓ Quiz" : "🎯 Action"}
          </span>
          <h3 className="font-display font-bold text-sm">{step.title}</h3>
        </div>

        <div className="text-sm leading-relaxed whitespace-pre-line">{step.content}</div>

        {/* Quiz options */}
        {step.options && (
          <div className="space-y-2 mt-4">
            {step.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left p-3 rounded-xl text-sm font-medium transition-all border ${
                  showFeedback && selectedAnswer === i
                    ? opt.correct
                      ? "bg-primary/15 border-primary ring-2 ring-primary"
                      : "bg-destructive/10 border-destructive ring-2 ring-destructive"
                    : showFeedback && opt.correct
                    ? "bg-primary/10 border-primary/50"
                    : "bg-muted border-transparent hover:border-border"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showFeedback && selectedAnswer === i && (opt.correct ? <CheckCircle size={16} className="text-primary shrink-0" /> : <XCircle size={16} className="text-destructive shrink-0" />)}
                  <span>{opt.text}</span>
                </div>
                {showFeedback && selectedAnswer === i && (
                  <p className="text-xs mt-1 text-muted-foreground">{opt.feedback}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={step.options && !showFeedback}
        className="w-full gradient-primary py-3 rounded-xl font-bold text-primary-foreground hover-lift disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLastStep ? "Complete Lesson 🎉" : "Continue"} <ArrowRight size={18} />
      </button>
    </div>
  );
}
