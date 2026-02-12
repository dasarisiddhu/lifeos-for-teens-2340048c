import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Target } from "lucide-react";

const COLORS = ["hsl(142, 65%, 40%)", "hsl(35, 92%, 52%)", "hsl(215, 85%, 55%)", "hsl(270, 60%, 55%)"];

export default function BudgetPlanner() {
  const { user, updateProfile } = useUser();
  const [allowance, setAllowance] = useState(user?.budget?.allowance || 0);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  if (!user) return null;

  const budget = user.budget;
  const handleSetBudget = () => {
    if (allowance <= 0) return;
    const b = {
      allowance,
      spend: Math.round(allowance * 0.3),
      save: Math.round(allowance * 0.5),
      invest: Math.round(allowance * 0.2),
      fun: 0,
    };
    updateProfile({ budget: b });
  };

  const pieData = budget ? [
    { name: "Save (50%)", value: budget.save },
    { name: "Spend (30%)", value: budget.spend },
    { name: "Grow (20%)", value: budget.invest },
  ] : [];

  const addGoal = () => {
    if (!goalName || !goalTarget) return;
    updateProfile({
      savingsGoals: [...user.savingsGoals, { name: goalName, target: Number(goalTarget), saved: 0 }],
    });
    setGoalName("");
    setGoalTarget("");
  };

  const addSaving = (idx: number, amount: number) => {
    const goals = [...user.savingsGoals];
    goals[idx] = { ...goals[idx], saved: Math.min(goals[idx].saved + amount, goals[idx].target) };
    updateProfile({ savingsGoals: goals });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <div className="animate-fade-in">
        <h1 className="font-display text-2xl font-black">💰 Budget Planner</h1>
        <p className="text-muted-foreground text-sm">50/30/20 rule, teen edition</p>
      </div>

      {/* Allowance input */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <h3 className="font-display font-bold text-sm mb-3">Set your monthly allowance</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              value={allowance || ""}
              onChange={(e) => setAllowance(Number(e.target.value))}
              className="w-full pl-7 pr-4 py-2.5 rounded-xl bg-muted border border-border focus:ring-2 focus:ring-primary outline-none font-bold"
              placeholder="0"
            />
          </div>
          <button onClick={handleSetBudget} className="gradient-primary px-5 py-2.5 rounded-xl font-bold text-primary-foreground hover-lift">
            Split It
          </button>
        </div>
      </div>

      {/* Pie chart + breakdown */}
      {budget && (
        <div className="glass-card p-5 animate-scale-in">
          <h3 className="font-display font-bold text-sm mb-3">Your Budget Split</h3>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={3} stroke="hsl(var(--card))">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 flex-1">
              {[
                { label: "💚 Save (50%)", value: budget.save, color: COLORS[0] },
                { label: "🧡 Spend (30%)", value: budget.spend, color: COLORS[1] },
                { label: "💙 Grow (20%)", value: budget.invest, color: COLORS[2] },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-bold">{item.label}</span>
                  <span className="font-black">${item.value}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-sm font-bold">Total</span>
                <span className="font-black">${budget.allowance}</span>
              </div>
            </div>
          </div>
          {/* Tip */}
          <div className="mt-4 p-3 bg-primary/10 rounded-xl text-sm">
            💡 <strong>Tip:</strong> Saving 50% now means you'll have ${budget.save * 12}/year. That's enough for{" "}
            {budget.save * 12 > 500 ? "a new phone or gaming setup!" : "building a real emergency fund!"}
          </div>
        </div>
      )}

      {/* Savings Goals */}
      <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <h3 className="font-display font-bold text-sm mb-3">🎯 Savings Goals</h3>
        {user.savingsGoals.length > 0 && (
          <div className="space-y-3 mb-4">
            {user.savingsGoals.map((goal, i) => {
              const pct = Math.round((goal.saved / goal.target) * 100);
              return (
                <div key={i} className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">${goal.saved}/${goal.target}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden mb-2">
                    <div className="gradient-primary h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-2">
                    {[5, 10, 20].map((amt) => (
                      <button key={amt} onClick={() => addSaving(i, amt)} className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                        +${amt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Goal name..."
            className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border outline-none text-sm focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            value={goalTarget}
            onChange={(e) => setGoalTarget(e.target.value)}
            placeholder="$"
            className="w-20 px-3 py-2 rounded-xl bg-muted border border-border outline-none text-sm focus:ring-2 focus:ring-primary"
          />
          <button onClick={addGoal} className="gradient-primary p-2 rounded-xl text-primary-foreground hover-lift">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
