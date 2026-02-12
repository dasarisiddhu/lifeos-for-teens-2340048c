import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { COMMUNICATION_SCENARIOS } from "@/lib/gameData";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommunicationSim() {
  const { user, addXP, addCoins, addBadge } = useUser();
  const navigate = useNavigate();
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [history, setHistory] = useState<{ speaker: string; text: string }[]>([]);
  const [finished, setFinished] = useState(false);

  if (!user) return null;

  const scenario = COMMUNICATION_SCENARIOS.find((s) => s.id === scenarioId);

  // Scenario selection
  if (!scenarioId) {
    return (
      <div className="max-w-lg mx-auto p-4 space-y-5">
        <div className="animate-fade-in">
          <h1 className="font-display text-2xl font-black">💬 Communication Simulator</h1>
          <p className="text-muted-foreground text-sm">Practice real-life conversations</p>
        </div>
        <div className="space-y-3">
          {COMMUNICATION_SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => {
                setScenarioId(sc.id);
                setStepIndex(0);
                setTotalScore(0);
                setHistory([]);
                setFinished(false);
              }}
              className="w-full glass-card p-4 text-left hover-lift animate-fade-in flex items-center gap-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-3xl">{sc.emoji}</span>
              <div>
                <h3 className="font-display font-bold">{sc.title}</h3>
                <p className="text-sm text-muted-foreground">{sc.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!scenario) return null;
  const step = scenario.steps[stepIndex];

  if (finished || !step) {
    const maxPossible = scenario.steps.reduce((sum, s) => {
      const maxChoice = Math.max(...(s.choices?.map(c => c.score) || [0]));
      return sum + maxChoice;
    }, 0);
    const confidence = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

    return (
      <div className="max-w-lg mx-auto p-4 space-y-5 animate-scale-in">
        <div className="glass-card p-6 text-center">
          <span className="text-5xl block mb-3">🏆</span>
          <h2 className="font-display text-xl font-black mb-2">Scenario Complete!</h2>
          <p className="text-4xl font-black text-gradient my-4">{confidence}%</p>
          <p className="text-muted-foreground text-sm">Confidence Rating</p>
          <div className="mt-4 text-sm">
            {confidence >= 80 ? "🌟 Excellent communication skills!" :
             confidence >= 50 ? "👍 Good effort! Room to improve." :
             "💪 Keep practicing — you'll get better!"}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setScenarioId(null)} className="flex-1 glass-card py-3 rounded-xl font-bold hover-lift text-center">
            Try Another
          </button>
          <button onClick={() => navigate("/dashboard")} className="flex-1 gradient-primary py-3 rounded-xl font-bold text-primary-foreground hover-lift text-center">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChoice = (choice: { text: string; next: number; score: number }) => {
    setHistory([...history, { speaker: "you", text: choice.text }]);
    setTotalScore(totalScore + choice.score);

    const nextStep = scenario.steps[choice.next];
    if (nextStep) {
      setHistory((h) => [...h, { speaker: nextStep.speaker, text: nextStep.text }]);
      if (nextStep.choices.length === 0) {
        setFinished(true);
        addXP(25);
        addCoins(5);
        return;
      }
      setStepIndex(choice.next);
    } else {
      setFinished(true);
      addXP(25);
      addCoins(5);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setScenarioId(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-display font-bold text-sm">{scenario.emoji} {scenario.title}</h2>
          <p className="text-xs text-muted-foreground">{scenario.description}</p>
        </div>
      </div>

      {/* Chat history */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {history.length === 0 && (
          <div className="glass-card p-4 animate-fade-in">
            <p className="text-xs text-muted-foreground font-bold mb-1">{step.speaker === "narrator" ? "📖 Narrator" : step.speaker}</p>
            <p className="text-sm">{step.text}</p>
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.speaker === "you" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.speaker === "you"
                ? "gradient-primary text-primary-foreground rounded-br-md"
                : "glass-card rounded-bl-md"
            }`}>
              <p className="text-xs opacity-70 mb-1 font-bold">{msg.speaker === "you" ? "You" : msg.speaker}</p>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Choices */}
      {step.choices.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-bold flex items-center gap-1"><MessageCircle size={12} /> Choose your response:</p>
          {step.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3 rounded-xl bg-muted hover:bg-primary/10 hover:ring-2 hover:ring-primary transition-all text-sm"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
