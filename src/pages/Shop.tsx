import { useUser } from "@/contexts/UserContext";
import { SHOP_ITEMS } from "@/lib/gameData";
import { ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Shop() {
  const { user, spendCoins, updateProfile } = useUser();
  if (!user) return null;

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (user.purchasedItems.includes(item.id) && item.id !== "streak_freeze" && item.id !== "xp_boost") {
      toast({ title: "Already owned!", description: "You already have this item." });
      return;
    }
    if (!spendCoins(item.cost)) {
      toast({ title: "Not enough coins!", description: `You need ${item.cost} coins.`, variant: "destructive" });
      return;
    }
    if (item.id === "streak_freeze") {
      updateProfile({ streakFreezes: user.streakFreezes + 1 });
    } else {
      updateProfile({ purchasedItems: [...user.purchasedItems, item.id] });
    }
    toast({ title: "Purchased! 🎉", description: `You got ${item.name}!` });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-5">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-black">🛍️ Shop</h1>
          <p className="text-muted-foreground text-sm">Spend your hard-earned coins</p>
        </div>
        <span className="text-lg font-black flex items-center gap-1">🪙 {user.coins}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SHOP_ITEMS.map((item, i) => {
          const owned = user.purchasedItems.includes(item.id);
          return (
            <div key={item.id} className="glass-card p-4 hover-lift animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-sm">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-coin">🪙 {item.cost}</span>
                    <button
                      onClick={() => handleBuy(item)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        owned ? "bg-muted text-muted-foreground" : "gradient-primary text-primary-foreground hover-lift"
                      }`}
                    >
                      {owned ? "Owned" : "Buy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
