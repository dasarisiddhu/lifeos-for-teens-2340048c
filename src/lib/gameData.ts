export interface Lesson {
  id: string;
  title: string;
  emoji: string;
  category: string;
  duration: string;
  xp: number;
  coins: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  steps: LessonStep[];
}

export interface LessonStep {
  type: "learn" | "scenario" | "quiz" | "action";
  title: string;
  content: string;
  options?: { text: string; correct?: boolean; feedback: string }[];
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
}

export interface Quest {
  id: string;
  title: string;
  emoji: string;
  description: string;
  target: number;
  type: "daily" | "weekly" | "monthly";
  reward: { xp: number; coins: number };
}

export const CATEGORIES = [
  { id: "communication", name: "Communication", emoji: "🗣️", color: "accent" },
  { id: "life-skills", name: "Life Skills", emoji: "🧠", color: "primary" },
  { id: "financial", name: "Financial Skills", emoji: "💰", color: "secondary" },
  { id: "budget", name: "Budget Planning", emoji: "📊", color: "level" },
];

export const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => (i + 1) * 100 + i * 50);

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 2;
    else break;
  }
  return Math.min(level, 50);
}

export function getXPForNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXP(xp);
  if (level >= 50) return { current: xp, needed: xp, progress: 100 };
  const prevThreshold = level > 1 ? LEVEL_THRESHOLDS[level - 2] : 0;
  const nextThreshold = LEVEL_THRESHOLDS[level - 1];
  const current = xp - prevThreshold;
  const needed = nextThreshold - prevThreshold;
  return { current, needed, progress: Math.round((current / needed) * 100) };
}

export const BADGES: Badge[] = [
  { id: "communicator", name: "Communicator", emoji: "🎤", description: "Complete 5 communication lessons", condition: "comm_5" },
  { id: "disciplined", name: "Disciplined", emoji: "⚡", description: "7-day streak", condition: "streak_7" },
  { id: "saver", name: "Smart Saver", emoji: "🐖", description: "Set a savings goal", condition: "savings_goal" },
  { id: "planner", name: "Planner", emoji: "📋", description: "Complete budget planning module", condition: "budget_done" },
  { id: "negotiator", name: "Negotiator", emoji: "🤝", description: "Ace a negotiation scenario", condition: "negotiate" },
  { id: "first_lesson", name: "First Step", emoji: "🎯", description: "Complete your first lesson", condition: "lessons_1" },
  { id: "streak_30", name: "On Fire", emoji: "🔥", description: "30-day streak", condition: "streak_30" },
  { id: "level_10", name: "Rising Star", emoji: "⭐", description: "Reach Level 10", condition: "level_10" },
];

export const QUESTS: Quest[] = [
  { id: "dq1", title: "Complete 2 lessons", emoji: "📖", description: "Finish any 2 lessons today", target: 2, type: "daily", reward: { xp: 30, coins: 5 } },
  { id: "dq2", title: "Log all habits", emoji: "✅", description: "Check off all 5 habits", target: 5, type: "daily", reward: { xp: 20, coins: 3 } },
  { id: "wq1", title: "Earn 200 XP", emoji: "🚀", description: "Accumulate 200 XP this week", target: 200, type: "weekly", reward: { xp: 50, coins: 15 } },
  { id: "wq2", title: "Try all categories", emoji: "🌈", description: "Do a lesson from each category", target: 4, type: "weekly", reward: { xp: 80, coins: 20 } },
  { id: "mq1", title: "Reach next level", emoji: "🏆", description: "Level up this month", target: 1, type: "monthly", reward: { xp: 200, coins: 50 } },
];

export const HABITS = [
  { id: "sleep", emoji: "😴", label: "8h Sleep" },
  { id: "study", emoji: "📚", label: "Study Session" },
  { id: "water", emoji: "💧", label: "Drink Water" },
  { id: "exercise", emoji: "🏃", label: "Exercise" },
  { id: "no-scroll", emoji: "📵", label: "No Scrolling" },
];

export const SHOP_ITEMS = [
  { id: "streak_freeze", name: "Streak Freeze", emoji: "🧊", cost: 20, description: "Protect your streak for 1 day" },
  { id: "theme_ocean", name: "Ocean Theme", emoji: "🌊", cost: 50, description: "Cool blue theme" },
  { id: "avatar_ninja", name: "Ninja Avatar", emoji: "🥷", cost: 30, description: "Ninja avatar frame" },
  { id: "badge_gold", name: "Gold Frame", emoji: "🖼️", cost: 40, description: "Gold badge frame" },
  { id: "xp_boost", name: "XP Boost", emoji: "⚡", cost: 25, description: "2x XP for 1 hour" },
];

export const LESSONS: Lesson[] = [
  // Communication
  {
    id: "comm-filler",
    title: "Speak Without Fillers",
    emoji: "🎙️",
    category: "communication",
    duration: "3 min",
    xp: 25,
    coins: 5,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Why fillers hurt you", content: "\"Um\", \"like\", \"you know\" — these filler words make you sound uncertain. Confident speakers pause instead of filling silence. A simple pause actually makes you sound MORE authoritative." },
      { type: "scenario", title: "Spot the difference", content: "Which sounds more confident?\n\nA: \"So, um, I was thinking, like, maybe we could, you know, try a different approach?\"\n\nB: \"I've been thinking. Let's try a different approach.\"" },
      { type: "quiz", title: "Quick check", content: "What should you do instead of saying 'um'?", options: [
        { text: "Speak faster", correct: false, feedback: "Speaking faster actually increases fillers!" },
        { text: "Pause silently", correct: true, feedback: "Yes! A pause is powerful and shows confidence." },
        { text: "Say 'basically'", correct: false, feedback: "That's just another filler word." },
      ]},
      { type: "action", title: "Real-life challenge", content: "🎯 Record yourself talking about your day for 60 seconds. Count how many filler words you use. Try again and beat your score!" },
    ],
  },
  {
    id: "comm-eye",
    title: "Eye Contact Drills",
    emoji: "👁️",
    category: "communication",
    duration: "2 min",
    xp: 20,
    coins: 4,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "The power of eye contact", content: "Eye contact builds trust, shows confidence, and makes people feel heard. The 50/70 rule: make eye contact 50% of the time when talking, 70% when listening." },
      { type: "scenario", title: "Real situation", content: "You're presenting in class. Where should you look?\n\nA: At your notes the entire time\nB: At the back wall\nC: Rotating between 3-4 people in different parts of the room" },
      { type: "quiz", title: "Test yourself", content: "How long should you hold eye contact before it gets uncomfortable?", options: [
        { text: "1 second", correct: false, feedback: "Too short — seems evasive." },
        { text: "3-5 seconds", correct: true, feedback: "Perfect! Natural and confident." },
        { text: "10+ seconds", correct: false, feedback: "That's a stare, not eye contact! 😅" },
      ]},
      { type: "action", title: "Try it!", content: "🎯 In your next conversation, practice the 50/70 rule. Notice how the other person responds." },
    ],
  },
  {
    id: "comm-questions",
    title: "Ask Great Questions",
    emoji: "❓",
    category: "communication",
    duration: "3 min",
    xp: 25,
    coins: 5,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Questions > Answers", content: "The best conversationalists aren't great talkers — they're great askers. Open-ended questions (starting with How, What, Why) keep conversations alive and make people feel valued." },
      { type: "quiz", title: "Which is better?", content: "Which question would lead to a better conversation?", options: [
        { text: "Did you like the movie?", correct: false, feedback: "Yes/no questions kill conversations." },
        { text: "What was your favorite part of the movie?", correct: true, feedback: "Open-ended! Gets them talking." },
        { text: "Was it good?", correct: false, feedback: "Too closed. Try asking 'what' or 'how'." },
      ]},
      { type: "action", title: "Challenge", content: "🎯 Ask 3 open-ended questions today. Notice how conversations flow better!" },
    ],
  },
  {
    id: "comm-conflict",
    title: "Conflict Resolution 101",
    emoji: "🕊️",
    category: "communication",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "The I-Statement", content: "Instead of blaming ('You always...'), use I-statements: 'I feel [emotion] when [situation] because [reason].' This disarms defensiveness and focuses on solutions." },
      { type: "scenario", title: "Apply it", content: "Your friend keeps canceling plans last minute. Which response works better?\n\nA: \"You're so unreliable!\"\nB: \"I feel disappointed when plans get canceled because I was looking forward to hanging out.\"" },
      { type: "quiz", title: "Build one", content: "Complete the I-statement: 'I feel ___ when you use my stuff without asking because ___'", options: [
        { text: "angry / it's mine", correct: false, feedback: "Valid feeling, but the reason could be more specific." },
        { text: "frustrated / I can't find things when I need them", correct: true, feedback: "Specific and non-attacking. 👏" },
        { text: "Whatever, just stop", correct: false, feedback: "That's not an I-statement — it's avoidance." },
      ]},
      { type: "action", title: "Practice", content: "🎯 Think of a recent conflict. Write an I-statement for it in your notes." },
    ],
  },
  {
    id: "comm-negotiate",
    title: "Negotiation Mini Tactics",
    emoji: "🤝",
    category: "communication",
    duration: "3 min",
    xp: 35,
    coins: 7,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Negotiation basics", content: "Negotiation isn't manipulation — it's finding win-win outcomes. Three teen-friendly tactics: 1) Anchor high (ask for more than you expect), 2) Show value (explain why you deserve it), 3) Give to get (offer something in return)." },
      { type: "quiz", title: "Apply it", content: "You want a later curfew on weekends. Best approach?", options: [
        { text: "Just stay out late and see what happens", correct: false, feedback: "Breaking rules loses trust and leverage." },
        { text: "Ask for midnight, explain your responsibility track record, offer to text check-ins", correct: true, feedback: "Anchor high + show value + give to get. 🎯" },
        { text: "Complain until they give in", correct: false, feedback: "Nagging makes people dig in harder." },
      ]},
      { type: "action", title: "Real negotiation", content: "🎯 Identify something you want to negotiate this week. Plan your anchor, value, and trade." },
    ],
  },
  {
    id: "comm-group",
    title: "Group Discussion Survival",
    emoji: "👥",
    category: "communication",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Stand out in groups", content: "In group discussions: 1) Speak early (first 2 minutes), 2) Build on others' ideas ('Adding to what X said...'), 3) Summarize when things get messy. You don't need to talk the most — just talk the smartest." },
      { type: "quiz", title: "Best move?", content: "Everyone is talking over each other. What do you do?", options: [
        { text: "Talk louder", correct: false, feedback: "More noise doesn't equal more impact." },
        { text: "Stay quiet entirely", correct: false, feedback: "You miss the chance to contribute." },
        { text: "Wait for a pause, then summarize: 'So it sounds like we're deciding between X and Y'", correct: true, feedback: "Leadership move! You organized the chaos. 👑" },
      ]},
      { type: "action", title: "Try it", content: "🎯 In your next group project, try the summarizer role." },
    ],
  },
  {
    id: "comm-presentation",
    title: "HOOK-POINT-STORY-END",
    emoji: "🎬",
    category: "communication",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "advanced",
    steps: [
      { type: "learn", title: "The 4-part structure", content: "Every great presentation follows HPSE:\n🪝 HOOK — Grab attention (question, stat, story)\n📍 POINT — State your main idea clearly\n📖 STORY — Support with example/evidence\n🎯 END — Call to action or memorable closer" },
      { type: "quiz", title: "Order these", content: "Which is a HOOK?", options: [
        { text: "Today I'll talk about climate change", correct: false, feedback: "Boring! That's just an announcement." },
        { text: "By 2050, your hometown could be underwater", correct: true, feedback: "Shocking stat = instant attention! 🪝" },
        { text: "In conclusion, we must act", correct: false, feedback: "That's an END, not a HOOK." },
      ]},
      { type: "action", title: "Build yours", content: "🎯 Pick any topic. Write a 4-line HPSE outline and practice saying it aloud." },
    ],
  },
  // Life Skills
  {
    id: "life-dopamine",
    title: "Dopamine Management",
    emoji: "🧪",
    category: "life-skills",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Your brain's reward system", content: "Dopamine is the 'motivation molecule'. Scrolling, junk food, and games give cheap dopamine — making hard tasks feel impossible. Solution: Dopamine detox (1-2h daily without screens) resets your baseline." },
      { type: "quiz", title: "Check your knowledge", content: "Why does homework feel boring after gaming?", options: [
        { text: "You're just lazy", correct: false, feedback: "It's not about laziness — it's brain chemistry!" },
        { text: "Gaming spiked dopamine, making normal tasks feel underwhelming", correct: true, feedback: "Exactly! Your brain needs harder hits to feel motivated. 🧠" },
        { text: "Homework is pointless", correct: false, feedback: "The task isn't the problem — your baseline dopamine is." },
      ]},
      { type: "action", title: "Detox challenge", content: "🎯 Try 1 hour without screens before starting homework tomorrow. Notice the difference!" },
    ],
  },
  {
    id: "life-habits",
    title: "Habit Stacking",
    emoji: "🔗",
    category: "life-skills",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Stack new on old", content: "Habit stacking: attach a NEW habit to an EXISTING one. Formula: 'After I [current habit], I will [new habit].' Example: 'After I brush my teeth, I will read 1 page.'" },
      { type: "quiz", title: "Build a stack", content: "Which is a proper habit stack?", options: [
        { text: "I should exercise more", correct: false, feedback: "Too vague — no trigger attached!" },
        { text: "After I eat lunch, I will walk for 5 minutes", correct: true, feedback: "Specific trigger + specific action = habit formed! 🔗" },
        { text: "Exercise every day at some point", correct: false, feedback: "No anchor = likely to forget." },
      ]},
      { type: "action", title: "Create yours", content: "🎯 Write 3 habit stacks using things you already do daily as anchors." },
    ],
  },
  {
    id: "life-deepwork",
    title: "Deep Work Sprint",
    emoji: "🎯",
    category: "life-skills",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "25 minutes of focus", content: "The Pomodoro technique: 25 min focused work → 5 min break. No phone, no tabs, no distractions. Your brain can do incredible things in a focused 25-min sprint." },
      { type: "quiz", title: "Quick check", content: "During a deep work sprint, your friend texts you. What do you do?", options: [
        { text: "Reply quickly, it'll only take a sec", correct: false, feedback: "Context switching costs 23 minutes to refocus!" },
        { text: "Ignore until the sprint ends", correct: true, feedback: "Correct! They can wait 25 minutes. 💪" },
        { text: "Put phone away but check every 5 min", correct: false, feedback: "That's still a distraction loop." },
      ]},
      { type: "action", title: "Sprint now!", content: "🎯 Set a 25-minute timer. Pick your hardest task. Go!" },
    ],
  },
  {
    id: "life-decisions",
    title: "Decision Trees",
    emoji: "🌳",
    category: "life-skills",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Think in trees", content: "Big decisions? Map them as trees. Start with the choice, branch into options, and for each option ask: 'What's the best case? Worst case? Most likely case?' This prevents emotional snap decisions." },
      { type: "quiz", title: "Practice", content: "You're deciding between studying for a test or going to a party. What's the BEST way to decide?", options: [
        { text: "Go with what feels right", correct: false, feedback: "Feelings are often short-term biased." },
        { text: "Map best/worst/likely outcomes for both choices", correct: true, feedback: "Now you're thinking strategically! 🌳" },
        { text: "Flip a coin", correct: false, feedback: "This works for small decisions, not important ones." },
      ]},
      { type: "action", title: "Map it", content: "🎯 Draw a decision tree for something you're currently deciding." },
    ],
  },
  {
    id: "life-procrastination",
    title: "Anti-Procrastination",
    emoji: "⚡",
    category: "life-skills",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "The 2-minute rule", content: "If it takes less than 2 minutes, do it NOW. For bigger tasks, just commit to starting for 2 minutes. Starting is the hardest part — once you begin, momentum kicks in." },
      { type: "quiz", title: "Apply it", content: "You need to write an essay but can't start. Best approach?", options: [
        { text: "Wait for motivation", correct: false, feedback: "Motivation follows action, not the other way around!" },
        { text: "Tell yourself: just write ONE sentence", correct: true, feedback: "The 2-minute start! You'll likely keep going. ⚡" },
        { text: "Do something else productive instead", correct: false, feedback: "That's productive procrastination — still avoidance." },
      ]},
      { type: "action", title: "Do it now", content: "🎯 What have you been putting off? Commit to just 2 minutes on it RIGHT NOW." },
    ],
  },
  {
    id: "life-failure",
    title: "Failure Reframing",
    emoji: "🔄",
    category: "life-skills",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "advanced",
    steps: [
      { type: "learn", title: "Failure = data", content: "Every failure is feedback. Edison didn't fail 1000 times — he found 1000 ways that didn't work. Reframe: 'I failed' → 'I learned that this approach doesn't work, so I'll try another.' Growth mindset is a skill you can practice." },
      { type: "quiz", title: "Reframe this", content: "You bombed a presentation. Best response?", options: [
        { text: "I'm terrible at public speaking", correct: false, feedback: "That's a fixed mindset trap! 🪤" },
        { text: "I learned I need to practice more and structure my points better", correct: true, feedback: "Growth mindset! Specific, actionable, forward-looking. 🔄" },
        { text: "Who cares about presentations anyway", correct: false, feedback: "Dismissing it = missing the learning opportunity." },
      ]},
      { type: "action", title: "Your turn", content: "🎯 Write down a recent 'failure'. Now rewrite it as a lesson learned." },
    ],
  },
  // Financial Skills
  {
    id: "fin-inflation",
    title: "Inflation Explained",
    emoji: "📈",
    category: "financial",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Your money shrinks", content: "Inflation = prices going up over time. A $5 burger today might cost $7 in 5 years. If your money just sits in a drawer, it LOSES value. That's why saving isn't enough — you need your money to grow (savings accounts, investments)." },
      { type: "quiz", title: "Quick math", content: "If inflation is 5% per year, what happens to $100 in a drawer after 1 year?", options: [
        { text: "It's still $100", correct: false, feedback: "Nominally yes, but its purchasing power dropped!" },
        { text: "It can only buy what $95 used to", correct: true, feedback: "Exactly! Your $100 lost 5% of its buying power. 📉" },
        { text: "It increases to $105", correct: false, feedback: "Only if it's invested/earning interest!" },
      ]},
      { type: "action", title: "Research", content: "🎯 Look up current inflation rates. Compare prices of 3 items now vs 5 years ago." },
    ],
  },
  {
    id: "fin-scams",
    title: "Digital Scam Detection",
    emoji: "🕵️",
    category: "financial",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Spot the red flags", content: "Scam red flags: 🚩 Too good to be true offers 🚩 Urgency ('Act NOW!') 🚩 Asking for personal info 🚩 Weird URLs or email addresses 🚩 'You won!' when you didn't enter anything. If it feels off, it IS off." },
      { type: "quiz", title: "Is this a scam?", content: "You get a DM: 'Congrats! You won a free iPhone! Click here and enter your address to claim!'", options: [
        { text: "Seems legit, I'll click", correct: false, feedback: "Classic scam! You didn't enter any contest. 🚩" },
        { text: "Definitely a scam — unsolicited prize + link + asks for info", correct: true, feedback: "Sharp eye! All 3 red flags present. 🕵️" },
        { text: "I'll click but not enter info", correct: false, feedback: "Even clicking can install malware! Don't click." },
      ]},
      { type: "action", title: "Scam hunt", content: "🎯 Check your spam/DMs. How many scam red flags can you spot?" },
    ],
  },
  {
    id: "fin-compound",
    title: "Compound Interest Magic",
    emoji: "✨",
    category: "financial",
    duration: "3 min",
    xp: 35,
    coins: 7,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Money making money", content: "Simple interest: earn on your original amount. Compound interest: earn on your original PLUS previous interest. At 7% annual compound interest, $1000 becomes ~$2000 in 10 years without adding anything. Start early = massive advantage." },
      { type: "quiz", title: "See the difference", content: "Who ends up with more money?", options: [
        { text: "Alex: invests $1000/year from age 15-25, then stops", correct: true, feedback: "Starting 10 years earlier = hundreds of thousands more by retirement! Time beats amount. ✨" },
        { text: "Sam: invests $1000/year from age 25-65 (40 years!)", correct: false, feedback: "Even investing for 30 more years, Sam can't catch up to Alex's 10-year head start!" },
      ]},
      { type: "action", title: "Calculate", content: "🎯 Google 'compound interest calculator'. See how $50/month from age 15 grows by age 60." },
    ],
  },
  {
    id: "fin-credit",
    title: "Credit Cards Simplified",
    emoji: "💳",
    category: "financial",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Not free money", content: "Credit cards are short-term loans. Pay the FULL balance monthly = free rewards. Pay minimum only = 20%+ interest = debt trap. Rule: Never charge more than you can pay off this month." },
      { type: "quiz", title: "Test yourself", content: "You have a $500 credit card balance. You pay $25/month minimum at 20% interest. How long to pay it off?", options: [
        { text: "About 2 years", correct: false, feedback: "Way longer than that!" },
        { text: "Over 2 years, paying $150+ in interest", correct: true, feedback: "That $500 purchase actually cost you $650+! 💸" },
        { text: "6 months", correct: false, feedback: "Interest makes minimum payments a trap." },
      ]},
      { type: "action", title: "Learn more", content: "🎯 Ask a parent/guardian about their credit card rules and interest rates." },
    ],
  },
  {
    id: "fin-income",
    title: "First Income Planning",
    emoji: "💵",
    category: "financial",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Your first money plan", content: "Whether it's allowance, part-time job, or birthday money — having a PLAN beats winging it. The teen split: 50% save, 30% spend, 20% grow (invest/learn). Even $20/week following this plan builds real wealth habits." },
      { type: "quiz", title: "Apply the split", content: "You earned $100 from a weekend job. Using the 50/30/20 rule:", options: [
        { text: "$50 save, $30 spend, $20 invest", correct: true, feedback: "Perfect split! You're building wealth habits early. 💵" },
        { text: "Save it all", correct: false, feedback: "Admirable but unrealistic long-term. Balance is key." },
        { text: "Spend it all — you earned it!", correct: false, feedback: "You earned it, so invest in your future self too!" },
      ]},
      { type: "action", title: "Start now", content: "🎯 Take your next income and apply the 50/30/20 split. Track it for a month!" },
    ],
  },
  // Budget Planning
  {
    id: "budget-5030",
    title: "50/30/20 Teen Edition",
    emoji: "📊",
    category: "budget",
    duration: "3 min",
    xp: 30,
    coins: 6,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Split your money smart", content: "The 50/30/20 rule adapted for teens:\n• 50% → Savings (future you will thank you)\n• 30% → Wants (games, food, fun)\n• 20% → Growth (courses, books, tools)\nThis works whether you get $20/week or $200/month." },
      { type: "quiz", title: "Practice", content: "You get $60 allowance. How should you split it?", options: [
        { text: "$30 save, $18 wants, $12 growth", correct: true, feedback: "Math checks out! 50/30/20 applied perfectly. 📊" },
        { text: "$60 wants", correct: false, feedback: "Living in the moment is fun, but future-you needs love too!" },
        { text: "$20 each category", correct: false, feedback: "Equal split isn't bad, but prioritizing savings gives you more power." },
      ]},
      { type: "action", title: "Budget it", content: "🎯 Use the Budget Planner tool in the app to set up your real budget!" },
    ],
  },
  {
    id: "budget-gadget",
    title: "Saving for Gadgets",
    emoji: "🎮",
    category: "budget",
    duration: "2 min",
    xp: 25,
    coins: 5,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "Goal-based saving", content: "Want something expensive? Break it down: Price ÷ Weekly savings = Weeks to goal. A $300 headset at $15/week = 20 weeks. Track progress visually — watching it grow keeps you motivated!" },
      { type: "quiz", title: "Calculate", content: "You want a $120 game. You save $10/week. When can you buy it?", options: [
        { text: "8 weeks", correct: false, feedback: "Close! 120 ÷ 10 = 12 weeks." },
        { text: "12 weeks", correct: true, feedback: "3 months of patience = earned reward! 🎮" },
        { text: "Just ask for it as a gift", correct: false, feedback: "Valid shortcut, but the saving skill is the real prize." },
      ]},
      { type: "action", title: "Set a goal", content: "🎯 Pick something you want. Calculate your save-by date. Set it in the Budget Planner!" },
    ],
  },
  {
    id: "budget-impulse",
    title: "Impulse Delay Timer",
    emoji: "⏰",
    category: "budget",
    duration: "2 min",
    xp: 20,
    coins: 4,
    difficulty: "beginner",
    steps: [
      { type: "learn", title: "The 48-hour rule", content: "Before any non-essential purchase over $15, wait 48 hours. If you still want it AND it fits your budget — buy it guilt-free. 70% of impulse purchases are regretted within a week." },
      { type: "quiz", title: "Should you buy it?", content: "You see cool sneakers for $80. Your wants budget has $30 left this month.", options: [
        { text: "Buy now, adjust next month", correct: false, feedback: "Borrowing from future budgets is a slippery slope!" },
        { text: "Wait 48h, and if still wanted, save for 2 months", correct: true, feedback: "Patient AND planned. That's how wealth is built! ⏰" },
        { text: "Buy a cheaper pair instead", correct: false, feedback: "Not bad, but the 48h rule would still help you decide." },
      ]},
      { type: "action", title: "Test yourself", content: "🎯 Next time you want to buy something, set a 48-hour timer. Journal how you feel after." },
    ],
  },
  {
    id: "budget-subs",
    title: "Subscription Awareness",
    emoji: "📱",
    category: "budget",
    duration: "2 min",
    xp: 20,
    coins: 4,
    difficulty: "intermediate",
    steps: [
      { type: "learn", title: "Death by subscriptions", content: "Netflix ($15) + Spotify ($10) + iCloud ($3) + gaming ($15) = $43/month = $516/year! Most people don't realize how much they spend on subscriptions. Audit quarterly: Do I use this weekly? If not, cancel." },
      { type: "quiz", title: "Subscription audit", content: "You have 6 subscriptions totaling $50/month but only use 3 regularly. What should you do?", options: [
        { text: "Keep all — might use them later", correct: false, feedback: "'Might use' = paying for nothing. Cancel and resubscribe if needed." },
        { text: "Cancel the 3 unused ones immediately", correct: true, feedback: "That's $25/month or $300/year saved! 💰" },
        { text: "Downgrade all to cheaper plans", correct: false, feedback: "Better than nothing, but why pay for what you don't use?" },
      ]},
      { type: "action", title: "Audit now", content: "🎯 List every subscription you or your family pays for. Calculate the yearly total. Surprised?" },
    ],
  },
];

export const SKILL_TEST_QUESTIONS = [
  { id: "st1", question: "How comfortable are you speaking in front of a group?", category: "communication", options: ["😰 Very nervous", "😐 Okay-ish", "😊 Pretty comfortable", "🎤 Love it!"], scores: [1, 2, 3, 4] },
  { id: "st2", question: "Do you know where your money goes each month?", category: "financial", options: ["🤷 No idea", "📝 Roughly", "📊 I track it", "💰 Budgeted down to the dollar"], scores: [1, 2, 3, 4] },
  { id: "st3", question: "How often do you procrastinate on important tasks?", category: "life-skills", options: ["😅 Always", "🙃 Often", "🤔 Sometimes", "💪 Rarely"], scores: [1, 2, 3, 4] },
  { id: "st4", question: "Can you say 'no' to peer pressure?", category: "communication", options: ["😣 Very hard", "😕 Depends", "😊 Usually", "🛡️ Always"], scores: [1, 2, 3, 4] },
  { id: "st5", question: "Do you have savings goals?", category: "budget", options: ["❌ None", "🤔 Thinking about it", "📋 Yes, informal", "📊 Written & tracked"], scores: [1, 2, 3, 4] },
  { id: "st6", question: "How do you handle disagreements?", category: "communication", options: ["🤐 Avoid them", "😤 Get heated", "🗣️ Discuss calmly", "🤝 Find compromises"], scores: [1, 2, 3, 4] },
  { id: "st7", question: "Do you have a daily routine?", category: "life-skills", options: ["🌪️ Total chaos", "📅 Loose plan", "⏰ Mostly consistent", "🎯 Optimized"], scores: [1, 2, 3, 4] },
  { id: "st8", question: "Can you explain compound interest?", category: "financial", options: ["❓ What's that?", "🤔 Heard of it", "📚 Know the basics", "✨ Could teach it"], scores: [1, 2, 3, 4] },
  { id: "st9", question: "How well do you manage screen time?", category: "life-skills", options: ["📱 Addicted", "😬 Too much", "⚖️ Balanced", "🧘 Intentional"], scores: [1, 2, 3, 4] },
  { id: "st10", question: "Do you plan before spending?", category: "budget", options: ["💸 Spend first", "🤷 Sometimes", "📋 Usually plan", "📊 Always budget"], scores: [1, 2, 3, 4] },
];

export const COMMUNICATION_SCENARIOS = [
  {
    id: "sc-teacher",
    title: "Talking to Your Teacher",
    emoji: "👩‍🏫",
    description: "Ask your teacher for a deadline extension",
    steps: [
      {
        speaker: "narrator",
        text: "You need to ask your teacher for an extension on your project. You approach them after class.",
        choices: [
          { text: "Hey, I need more time for the project.", next: 1, score: 1 },
          { text: "Hi Mrs. Johnson, could I talk to you about the project deadline?", next: 2, score: 3 },
          { text: "This project is impossible, nobody can finish it on time!", next: 3, score: 0 },
        ],
      },
      {
        speaker: "teacher",
        text: "Sure, what about it?",
        choices: [
          { text: "I just can't do it on time, can I have more days?", next: 4, score: 1 },
          { text: "I've been working on it but need 2 more days to deliver quality work. I can show you my progress so far.", next: 5, score: 3 },
        ],
      },
      {
        speaker: "teacher",
        text: "Of course! What's going on?",
        choices: [
          { text: "I've completed 70% but want to do thorough research on the last section. Could I have until Wednesday?", next: 5, score: 3 },
          { text: "I haven't started yet... when is it due again?", next: 4, score: 0 },
        ],
      },
      {
        speaker: "teacher",
        text: "That's not a productive approach. Complaining won't get you extra time.",
        choices: [
          { text: "You're right. Can I try again? I actually need more time because I want to do good work.", next: 2, score: 2 },
        ],
      },
      {
        speaker: "teacher",
        text: "I appreciate you telling me, but I need a specific plan. When can you realistically finish?",
        choices: [
          { text: "I can finish by Wednesday if I focus this weekend.", next: 5, score: 2 },
        ],
      },
      {
        speaker: "teacher",
        text: "That's very responsible of you. I'll give you the extension. Thanks for communicating clearly!",
        choices: [],
      },
    ],
  },
  {
    id: "sc-parents",
    title: "Asking Parents Permission",
    emoji: "🏠",
    description: "Convince your parents to let you go to a concert",
    steps: [
      {
        speaker: "narrator",
        text: "You want to go to a concert with friends next Saturday. Time to talk to your parents.",
        choices: [
          { text: "Mom, Dad — can I go to a concert Saturday? Here's the plan...", next: 1, score: 3 },
          { text: "Everyone's going to the concert, I HAVE to go!", next: 2, score: 1 },
          { text: "I'll just tell them I'm at a friend's house...", next: 3, score: 0 },
        ],
      },
      {
        speaker: "parent",
        text: "Tell us more about it. Who's going, where is it, and how are you getting there?",
        choices: [
          { text: "It's at the city venue, 7-10pm. Jake's mom is driving us. I have $30 saved for the ticket. I'll text when we arrive and leave.", next: 4, score: 3 },
          { text: "Just some friends... I dunno the details yet", next: 2, score: 1 },
        ],
      },
      {
        speaker: "parent",
        text: "That doesn't help me feel comfortable. I need more details before I can say yes.",
        choices: [
          { text: "You never let me do anything!", next: 3, score: 0 },
          { text: "You're right. Let me get the details and come back to you.", next: 1, score: 2 },
        ],
      },
      {
        speaker: "narrator",
        text: "That approach broke trust. Being dishonest or dramatic closes doors. Honesty and preparation open them. 💡",
        choices: [],
      },
      {
        speaker: "parent",
        text: "That's really well planned! You can go. Thanks for being responsible about it. 😊",
        choices: [],
      },
    ],
  },
  {
    id: "sc-peer",
    title: "Handling Peer Pressure",
    emoji: "🛡️",
    description: "Friends pressuring you to skip class",
    steps: [
      {
        speaker: "narrator",
        text: "Your friends want to skip last period to go get food. They're pressuring you to come.",
        choices: [
          { text: "Nah, I'm good. I have a quiz next period.", next: 1, score: 3 },
          { text: "I guess... if everyone else is going...", next: 2, score: 1 },
          { text: "That's not worth the risk. But let's go after school?", next: 3, score: 3 },
        ],
      },
      {
        speaker: "friend",
        text: "Come on, don't be boring! It's just one class.",
        choices: [
          { text: "I get it, but I'd rather not risk it. See you after school!", next: 3, score: 3 },
          { text: "Fine, I'll come. Let's go.", next: 2, score: 0 },
        ],
      },
      {
        speaker: "narrator",
        text: "You went along to fit in. The school called your parents. Was it worth it? Standing firm is hard but builds real respect. 🤔",
        choices: [],
      },
      {
        speaker: "friend",
        text: "Fair enough. We'll save you some fries. 😄",
        choices: [],
      },
    ],
  },
];
