import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Rocket } from "lucide-react";

const AVATARS = ["😎", "🧑‍🚀", "🦊", "🐱", "🎮", "🌟", "🔥", "💎", "🦄", "🐼", "🎯", "⚡"];

export default function Auth() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("😎");
  const { login, updateProfile } = useUser();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!username.trim()) return;
    login(username.trim());
    updateProfile({ avatar });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card-strong p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🚀</span>
          <h1 className="font-display text-2xl font-black">Join LifeOS</h1>
          <p className="text-muted-foreground text-sm mt-1">Pick a username and avatar to start</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-bold mb-2 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="Enter your username..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold"
              maxLength={20}
            />
          </div>

          <div>
            <label className="text-sm font-bold mb-2 block">Choose your avatar</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`text-2xl p-2 rounded-xl transition-all ${
                    avatar === a ? "bg-primary/20 ring-2 ring-primary scale-110" : "hover:bg-muted"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!username.trim()}
            className="w-full gradient-primary py-3 rounded-xl font-bold text-primary-foreground hover-lift disabled:opacity-50 disabled:hover:transform-none flex items-center justify-center gap-2 text-lg"
          >
            <Rocket size={20} /> Start My Journey
          </button>
        </div>
      </div>
    </div>
  );
}
