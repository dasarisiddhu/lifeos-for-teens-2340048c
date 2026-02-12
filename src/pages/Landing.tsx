import { Link } from "react-router-dom";
import { ArrowRight, Zap, Brain, MessageCircle, PiggyBank, Trophy, Target, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const SKILLS = [
  { icon: MessageCircle, title: "Communication", desc: "Speak with confidence, handle conflict, present ideas", emoji: "🗣️" },
  { icon: Brain, title: "Life Skills", desc: "Build habits, manage time, make decisions", emoji: "🧠" },
  { icon: PiggyBank, title: "Financial Literacy", desc: "Understand money, avoid scams, grow wealth", emoji: "💰" },
  { icon: TrendingUp, title: "Budget Planning", desc: "Track spending, save smart, reach goals", emoji: "📊" },
];

const STRUGGLES = [
  { emoji: "😰", text: "Can't speak up in class" },
  { emoji: "💸", text: "No idea how money works" },
  { emoji: "📱", text: "Addicted to scrolling" },
  { emoji: "🤷", text: "No real-world skills" },
  { emoji: "😐", text: "Zero financial confidence" },
  { emoji: "🌪️", text: "No routine or discipline" },
];

const GAMIFICATION = [
  { emoji: "⚡", label: "XP Points", desc: "Earn XP from every lesson" },
  { emoji: "🔥", label: "Daily Streaks", desc: "Build consistency" },
  { emoji: "🪙", label: "Coins", desc: "Unlock themes & items" },
  { emoji: "🏆", label: "Badges", desc: "Show off achievements" },
  { emoji: "📈", label: "Levels 1-50", desc: "Progressive unlocking" },
  { emoji: "🎯", label: "Quests", desc: "Daily & weekly missions" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass-card-strong border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-display font-black text-xl">🚀 LifeOS</span>
          <div className="flex gap-3">
            <Link to="/auth" className="px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Link to="/auth" className="gradient-primary px-4 py-2 rounded-xl text-sm font-bold text-primary-foreground hover-lift">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 text-xs font-bold text-primary mb-4">
              <Zap size={14} /> For teens 13–19
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black leading-tight mb-4">
              School teaches subjects.
              <br />
              <span className="text-gradient">We teach life.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md">
              Master communication, money, habits, and real-world skills — in 3 minutes a day. Gamified. Fun. Actually useful.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth" className="gradient-primary px-6 py-3 rounded-2xl font-bold text-primary-foreground hover-lift flex items-center gap-2 text-lg">
                Start Learning <ArrowRight size={20} />
              </Link>
              <Link to="/skill-test" className="glass-card px-6 py-3 rounded-2xl font-bold hover-lift flex items-center gap-2">
                <Target size={20} /> Take Skill Test
              </Link>
            </div>
          </div>
          <div className="animate-slide-up">
            <img src={heroImage} alt="Teens learning life skills" className="rounded-3xl shadow-2xl w-full" />
          </div>
        </div>
      </section>

      {/* Why teens struggle */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-black mb-2">Why teens struggle after school</h2>
          <p className="text-muted-foreground mb-10">Nobody teaches the skills that actually matter</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {STRUGGLES.map((s, i) => (
              <div key={i} className="glass-card p-5 hover-lift" style={{ animationDelay: `${i * 100}ms` }}>
                <span className="text-3xl block mb-2">{s.emoji}</span>
                <p className="font-bold text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill categories */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-black text-center mb-2">4 skill tracks. One platform.</h2>
          <p className="text-muted-foreground text-center mb-10">Micro-lessons that fit your life</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS.map((s, i) => (
              <div key={i} className="glass-card p-6 hover-lift group">
                <span className="text-4xl block mb-3">{s.emoji}</span>
                <h3 className="font-display font-bold text-lg mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-black mb-2">Learn like it's a game 🎮</h2>
          <p className="text-muted-foreground mb-10">Streaks, XP, coins, badges — because learning should be addictive</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GAMIFICATION.map((g, i) => (
              <div key={i} className="glass-card p-5 hover-lift">
                <span className="text-3xl block mb-2">{g.emoji}</span>
                <p className="font-bold text-sm">{g.label}</p>
                <p className="text-xs text-muted-foreground">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl font-black text-center mb-10">What teens are saying</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Alex, 16", text: "Finally learned how to budget my allowance. Already saved $200! 🐖", avatar: "🧑‍💻" },
              { name: "Maya, 15", text: "The communication lessons helped me ace my class presentation! 🎤", avatar: "👩‍🎓" },
              { name: "Jordan, 17", text: "7-day streak and counting. These habit tools actually work. 🔥", avatar: "🧑‍🚀" },
            ].map((t, i) => (
              <div key={i} className="glass-card p-5 hover-lift">
                <p className="text-sm mb-3">{t.text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.avatar}</span>
                  <span className="font-bold text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl font-black mb-4">Ready to level up your life?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of teens building real-world superpowers</p>
          <Link to="/auth" className="gradient-primary px-8 py-4 rounded-2xl font-bold text-primary-foreground hover-lift inline-flex items-center gap-2 text-lg">
            Start Learning Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>🚀 LifeOS for Teens — Learn what school doesn't teach</p>
      </footer>
    </div>
  );
}
