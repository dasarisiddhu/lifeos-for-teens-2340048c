import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Target, PiggyBank, MessageCircle, User, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getLevelFromXP } from "@/lib/gameData";

const NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/modules", icon: BookOpen, label: "Learn" },
  { to: "/skill-test", icon: Target, label: "Test" },
  { to: "/budget", icon: PiggyBank, label: "Budget" },
  { to: "/simulator", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-card-strong border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{user?.avatar}</span>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-sm">{user?.username}</p>
            <p className="text-xs text-muted-foreground">Level {getLevelFromXP(user?.xp || 0)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="flex items-center gap-1" title="XP"><span className="text-xp">⚡</span> {user?.xp || 0}</span>
          <span className="flex items-center gap-1" title="Coins"><span className="text-coin">🪙</span> {user?.coins || 0}</span>
          <span className="flex items-center gap-1" title="Streak"><span className="text-streak">🔥</span> {user?.streak || 0}</span>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors ml-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-4">{children}</main>

      {/* Bottom nav - mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card-strong border-t md:hidden">
        <div className="flex justify-around py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all text-xs ${
                  isActive ? "text-primary font-bold scale-110" : "text-muted-foreground"
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Side nav - desktop */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center gap-2 pt-20 pb-4 glass-card-strong border-r z-40">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all text-xs ${
                isActive ? "text-primary font-bold bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Desktop content offset */}
      <style>{`@media (min-width: 768px) { main { margin-left: 80px; } header { margin-left: 80px; } }`}</style>
    </div>
  );
}
