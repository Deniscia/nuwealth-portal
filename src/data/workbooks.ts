export interface WorkbookField {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'currency' | 'percentage' | 'checkbox' | 'radio' | 'date' | 'slider' | 'repeating';
  options?: string[];
  columns?: WorkbookField[];
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
}

export interface WorkbookSection {
  id: string;
  title: string;
  description?: string;
  fields: WorkbookField[];
}

export interface Workbook {
  id: string;
  title: string;
  phaseNumber: number;
  order: number;
  sections: WorkbookSection[];
}

export interface Phase {
  number: number;
  title: string;
  description: string;
  workbooks: Workbook[];
}

export const PHASES: Phase[] = [
  {
    number: 1,
    title: "Awareness & Safety",
    description: "Understanding your money story",
    workbooks: [
      {
        id: "p1-money-trauma",
        title: "Money Trauma 101",
        phaseNumber: 1,
        order: 1,
        sections: [
          {
            id: "defining-money-trauma",
            title: "Defining Money Trauma",
            description: "Before we can heal, we need to name it. Money trauma isn't just about losing money — it's about the emotional wounds tied to financial experiences.",
            fields: [
              { id: "define-trauma", label: "In your own words, what does 'money trauma' mean to you?", type: "textarea", placeholder: "There's no right or wrong answer — just your truth..." },
            ],
          },
          {
            id: "ripple-effect",
            title: "The Ripple Effect",
            description: "Think about moments in your life where money caused stress, pain, or conflict. For each event, reflect on how it affected you emotionally and behaviorally.",
            fields: [
              {
                id: "ripple-events",
                label: "Map your money events (e.g., Job loss / Fear / Shut down emotionally / Reassurance and a plan)",
                type: "repeating",
                columns: [
                  { id: "event", label: "Event", type: "text", placeholder: "e.g., Job loss, parents arguing about bills..." },
                  { id: "emotion", label: "Emotion You Felt", type: "text", placeholder: "e.g., Fear, shame, anger..." },
                  { id: "reaction", label: "How You Reacted", type: "text", placeholder: "e.g., Shut down emotionally, overspent..." },
                  { id: "needed", label: "What You Needed Instead", type: "text", placeholder: "e.g., Reassurance and a plan..." },
                ],
              },
              { id: "ripple-reflection", label: "When I think about my relationship with money, I notice that...", type: "textarea", placeholder: "Complete this sentence with whatever comes to mind..." },
            ],
          },
        ],
      },
      {
        id: "p1-money-story",
        title: "Money Story Worksheet",
        phaseNumber: 1,
        order: 2,
        sections: [
          {
            id: "earliest-memory",
            title: "Your Earliest Money Memory",
            description: "Reflect on your first experiences with money and how they shaped your beliefs.",
            fields: [
              { id: "first-memory", label: "What is your earliest memory involving money?", type: "textarea", placeholder: "Describe the scene, who was there, and how you felt..." },
              { id: "age", label: "How old were you?", type: "text", placeholder: "e.g., 5 years old" },
              { id: "feeling", label: "What emotions come up when you recall this memory?", type: "checkbox", options: ["Joy", "Fear", "Shame", "Excitement", "Anxiety", "Confusion", "Pride", "Sadness"] },
              { id: "impact-rating", label: "How strongly does this memory still affect your relationship with money? (1 = not at all, 10 = deeply)", type: "slider" },
            ],
          },
          {
            id: "family-messages",
            title: "Family Money Messages",
            description: "What messages did your family teach you — spoken or unspoken?",
            fields: [
              { id: "phrases", label: "What phrases about money did you hear growing up?", type: "textarea", placeholder: "e.g., 'Money doesn't grow on trees', 'We can't afford that'..." },
              { id: "role-model", label: "Who was your primary financial role model?", type: "text", placeholder: "e.g., Mother, grandmother, aunt..." },
              { id: "role-model-habits", label: "What financial habits did they model for you?", type: "textarea", placeholder: "Describe their spending, saving, and earning behaviors..." },
              { id: "inherited-belief", label: "What belief about money did you inherit that no longer serves you?", type: "textarea" },
            ],
          },
          {
            id: "current-relationship",
            title: "Your Current Money Relationship",
            description: "Assess where you stand today.",
            fields: [
              { id: "describe-relationship", label: "If your relationship with money were a person, how would you describe it?", type: "textarea", placeholder: "e.g., 'A distant stranger', 'A controlling partner'..." },
              { id: "money-feeling", label: "When you check your bank account, what do you typically feel?", type: "radio", options: ["Confident", "Anxious", "Indifferent", "Ashamed", "Empowered", "Overwhelmed"] },
              { id: "financial-safety", label: "On a scale of 1–10, how financially safe do you feel right now?", type: "slider" },
              { id: "one-change", label: "If you could change one thing about your financial life right now, what would it be?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p1-money-wounds-quiz",
        title: "Your Money Wounds — Self Quiz",
        phaseNumber: 1,
        order: 3,
        sections: [
          {
            id: "rate-statements",
            title: "Rate Each Statement",
            description: "For each statement, rate how true it feels to you (1 = not at all, 5 = very true).",
            fields: [
              { id: "quiz-avoid-bank", label: "I avoid checking my bank account.", type: "slider", min: 1, max: 5 },
              { id: "quiz-guilty-spending", label: "I feel guilty when I spend on myself.", type: "slider", min: 1, max: 5 },
              { id: "quiz-give-loan", label: "I give or loan money to others even when I can't afford it.", type: "slider", min: 1, max: 5 },
              { id: "quiz-impulsive-spend", label: "I spend impulsively to feel better emotionally.", type: "slider", min: 1, max: 5 },
              { id: "quiz-large-cushion", label: "I feel unsafe unless I have a large cushion of savings.", type: "slider", min: 1, max: 5 },
              { id: "quiz-resist-budget", label: "I resist budgeting or structure because it feels restrictive.", type: "slider", min: 1, max: 5 },
            ],
          },
          {
            id: "scoring-guide",
            title: "Scoring Guide",
            description: "Review your scores and identify your pattern:\n\n● Mostly 1–2 → Money Avoider — You tend to disengage from your finances as a way to cope.\n● Mostly 3s → Overgiver or Saver-Hoarder — You may over-give to others or hoard money out of fear.\n● Mostly 4–5 → Chaser or Rebel — You may chase money for validation or rebel against financial structure.",
            fields: [
              { id: "quiz-pattern", label: "Based on your scores, which pattern do you most identify with and why?", type: "textarea", placeholder: "Take your time — there's no wrong answer..." },
            ],
          },
          {
            id: "reflection",
            title: "Reflection",
            description: "Now that you've identified your money wound pattern, take a moment to journal on these two prompts. Give yourself space to be honest — this is just for you.",
            fields: [
              { id: "quiz-reflect-protect", label: "What does your money wound type reveal about how you protect yourself emotionally?", type: "textarea", placeholder: "Consider the ways this pattern has served as emotional armor..." },
              { id: "quiz-reflect-survive", label: "How has this pattern helped you survive — and how might it now be holding you back?", type: "textarea", placeholder: "Acknowledge both the protection it gave you and the cost it carries today..." },
            ],
          },
        ],
      },
      {
        id: "p1-mindset-journal",
        title: "Money Mindset Journal Prompts",
        phaseNumber: 1,
        order: 4,
        sections: [
          {
            id: "day1-prompt",
            title: "Prompt 1: Money & Identity",
            fields: [
              { id: "identity-q1", label: "What does being 'good with money' mean to you?", type: "textarea" },
              { id: "identity-q2", label: "Do you currently see yourself as someone who is good with money? Why or why not?", type: "textarea" },
              { id: "identity-q3", label: "What would change in your life if you fully trusted yourself with money?", type: "textarea" },
            ],
          },
          {
            id: "day2-prompt",
            title: "Prompt 2: Abundance vs. Scarcity",
            fields: [
              { id: "scarcity-q1", label: "When was the last time you made a financial decision from fear?", type: "textarea" },
              { id: "scarcity-q2", label: "What does abundance look like in your life beyond money?", type: "textarea" },
              { id: "scarcity-q3", label: "Write an affirmation that counters your biggest money fear.", type: "text", placeholder: "e.g., 'I am worthy of wealth and financial freedom.'" },
            ],
          },
          {
            id: "day3-prompt",
            title: "Prompt 3: Future Vision",
            fields: [
              { id: "vision-q1", label: "Describe your ideal financial life 5 years from now in vivid detail.", type: "textarea" },
              { id: "vision-q2", label: "What emotions do you want to feel about money daily?", type: "checkbox", options: ["Peace", "Confidence", "Joy", "Freedom", "Gratitude", "Empowerment"] },
              { id: "vision-q3", label: "What is the first step you can take this week toward that vision?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p1-regulating-stress",
        title: "Regulating Financial Stress",
        phaseNumber: 1,
        order: 5,
        sections: [
          {
            id: "body-awareness",
            title: "Body Awareness Mapping",
            description: "This is a guided exercise. Close your eyes and think about checking your bank account or paying a bill. Notice where you feel it in your body — your chest, throat, stomach, shoulders? Sit with the sensation for a moment without judgment.\n\n📌 Imagine an outline of your body. Where do the emotions live? Label them below.",
            fields: [
              { id: "body-sensations", label: "Where do you feel financial stress in your body? Describe the sensations and where they show up.", type: "textarea", placeholder: "e.g., 'Tight chest when I think about bills, sinking stomach when checking my account, tension in my shoulders when talking about money...'" },
            ],
          },
          {
            id: "regulation-tools",
            title: "Financial Regulation Tools",
            description: "Try each grounding technique this week and note which ones help you feel calmer when dealing with money. Check off what you've tried and whether it helped.",
            fields: [
              { id: "reg-box-breathing", label: "Box Breathing (In 4, Hold 2, Out 6)", type: "checkbox", options: ["Tried it", "Found it calming"] },
              { id: "reg-box-breathing-notes", label: "Notes on Box Breathing", type: "text", placeholder: "How did this feel? When did you try it?" },
              { id: "reg-eft-tapping", label: "EFT Tapping (Collarbone)", type: "checkbox", options: ["Tried it", "Found it calming"] },
              { id: "reg-eft-tapping-notes", label: "Notes on EFT Tapping", type: "text", placeholder: "How did this feel? When did you try it?" },
              { id: "reg-mindful-checkin", label: "Mindful Money Check-in", type: "checkbox", options: ["Tried it", "Found it calming"] },
              { id: "reg-mindful-checkin-notes", label: "Notes on Mindful Money Check-in", type: "text", placeholder: "How did this feel? When did you try it?" },
              { id: "reg-positive-self-talk", label: "Positive Self-Talk Before Bill Paying", type: "checkbox", options: ["Tried it", "Found it calming"] },
              { id: "reg-positive-self-talk-notes", label: "Notes on Positive Self-Talk", type: "text", placeholder: "How did this feel? When did you try it?" },
            ],
          },
          {
            id: "money-ritual",
            title: "Money Ritual Design",
            description: "Build a calm relationship with money by designing a personal ritual that helps you self-soothe and self-regulate while managing your finances. Use the examples as inspiration.",
            fields: [
              {
                id: "ritual-entries",
                label: "Design Your Money Rituals",
                type: "repeating",
                columns: [
                  { id: "ritual-step", label: "Ritual Step", type: "text", placeholder: "e.g., Light a candle before checking accounts" },
                  { id: "ritual-frequency", label: "Frequency", type: "text", placeholder: "e.g., Weekly" },
                  { id: "ritual-environment", label: "Environment", type: "text", placeholder: "e.g., Quiet space, favorite chair" },
                  { id: "ritual-feeling", label: "How It Makes Me Feel", type: "text", placeholder: "e.g., Calm, focused, grounded" },
                ],
              },
            ],
          },
          {
            id: "weekly-checkin",
            title: "The Weekly Money Check-In",
            description: "Use this checklist each week as a gentle practice. It's not about perfection — it's about building a safe, consistent relationship with your finances.",
            fields: [
              {
                id: "weekly-checklist",
                label: "This week, I...",
                type: "checkbox",
                options: [
                  "I reviewed my income and expenses calmly",
                  "I noticed any triggers without judgment",
                  "I celebrated one small win",
                  "I practiced gratitude for one financial blessing",
                  "I affirmed: 'I am building a safe relationship with money.'",
                ],
              },
            ],
          },
          {
            id: "moving-forward",
            title: "Moving Forward",
            description: "\"From this point forward, I choose to build wealth from a place of peace, not panic. I release shame, I honor my story, and I step into financial freedom with courage.\"",
            fields: [
              { id: "commitment-signature", label: "Sign your name here as a commitment to yourself", type: "text", placeholder: "Your full name" },
              { id: "final-thoughts", label: "Any final thoughts, feelings, or intentions as you close this chapter?", type: "textarea", placeholder: "Take your time. This space is yours." },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Healing & Reframing",
    description: "Releasing old patterns and embracing new possibilities",
    workbooks: [
      {
        id: "p1-mindset-reset",
        title: "Money Mindset Reset Guide",
        phaseNumber: 2,
        order: 1,
        sections: [
          {
            id: "limiting-beliefs",
            title: "Money Beliefs & Their Origins",
            fields: [
              { id: "beliefs-list", label: "List 3–5 limiting beliefs you hold about money.", type: "textarea", placeholder: "e.g., 'Rich people are greedy', 'I'll never be wealthy'..." },
              { id: "belief-origin", label: "Where did these beliefs originate?", type: "radio", options: ["Family", "Culture", "Media", "Personal experience", "Religion/Spirituality", "Peers"] },
              { id: "belief-cost", label: "Which of these beliefs felt true to you as a child?\nWhich still feel true today, even if logically you know they're not?", type: "textarea" },
            ],
          },
          {
            id: "belief-emotion-map",
            title: "Belief Emotion Map",
            description: "For each belief you identified, map the emotion connected to it, where you feel it in your body, and where it originated.",
            fields: [
              {
                id: "emotion-map-entries",
                label: "Map your beliefs to their emotions, body sensations, and origins",
                type: "repeating",
                columns: [
                  { id: "belief", label: "Belief", type: "text", placeholder: "e.g., 'We can't afford it'" },
                  { id: "emotion", label: "Emotion", type: "text", placeholder: "e.g., Fear" },
                  { id: "body-sensation", label: "Where You Feel It in Your Body", type: "text", placeholder: "e.g., Tight chest" },
                  { id: "origin", label: "Origin (Person/Event)", type: "text", placeholder: "e.g., Dad" },
                ],
              },
              { id: "emotion-reflection", label: "When you read your beliefs out loud, how does your body respond? What beliefs feel \"heavy\"? Which feel \"sticky\"? Which feel outdated?", type: "textarea" },
            ],
          },
          {
            id: "belief-audit",
            title: "Belief Audit",
            fields: [
              { id: "top-beliefs", label: "What are your top 5 beliefs about money that hold you back?", type: "textarea" },
              { id: "belief-strength", label: "How strongly do you hold these beliefs? (1 = loosely, 10 = deeply embedded)", type: "slider" },
              { id: "evidence-against", label: "What evidence exists that contradicts these beliefs?", type: "textarea" },
            ],
          },
          {
            id: "new-narratives",
            title: "Create New Narratives",
            fields: [
              { id: "reframe-1", label: "Old belief → New empowering belief #1", type: "text", placeholder: "e.g., 'Money is hard to earn' → 'Money flows to me through multiple channels'" },
              { id: "reframe-2", label: "Old belief → New empowering belief #2", type: "text" },
              { id: "reframe-3", label: "Old belief → New empowering belief #3", type: "text" },
              { id: "daily-practice", label: "Describe a daily practice you'll commit to for reinforcing these new beliefs.", type: "textarea" },
            ],
          },
          {
            id: "reframe-practice",
            title: "Reframing Practice",
            fields: [
              { id: "trigger-situations", label: "What situations trigger your limiting money beliefs?", type: "textarea" },
              { id: "new-response", label: "Write a new empowered response for each trigger.", type: "textarea" },
              { id: "support-needed", label: "What support do you need to maintain these new beliefs?", type: "checkbox", options: ["Accountability partner", "Journaling practice", "Therapy/coaching", "Community support", "Meditation", "Affirmations"] },
            ],
          },
        ],
      },
      {
        id: "p2-limiting-beliefs",
        title: "Limiting Beliefs Reframing Guide",
        phaseNumber: 2,
        order: 2,
        sections: [],
      },
      {
        id: "p2-self-talk",
        title: "Financial Self-Talk Script Library",
        phaseNumber: 2,
        order: 3,
        sections: [
          {
            id: "current-self-talk",
            title: "Current Self-Talk Patterns",
            fields: [
              { id: "negative-phrases", label: "What negative things do you say to yourself about money?", type: "textarea" },
              { id: "frequency", label: "How often do these thoughts occur?", type: "radio", options: ["Multiple times daily", "Daily", "Weekly", "Occasionally", "Rarely"] },
            ],
          },
          {
            id: "toxic-positivity",
            title: "Spot the Toxic Positivity",
            description: "Select the statements that feel unrealistic for your nervous system. Then reflect on how they actually make you feel — encouraged, or pressured and dismissed?",
            fields: [
              { id: "toxic-statements", label: "Which of these statements feel unrealistic or unsafe for your nervous system?", type: "checkbox", options: [
                "\"Money comes easily and effortlessly.\"",
                "\"Just be positive and money will appear.\"",
                "\"Act rich to become rich.\"",
                "\"You're broke because of your mindset.\""
              ]},
              { id: "toxic-feeling", label: "How do these statements actually make you feel? Encouraged — or pressured and dismissed?", type: "textarea", placeholder: "Be honest about what comes up for you..." },
            ],
          },
          {
            id: "safe-affirmations",
            title: "Reframe: Nervous System Safe Affirmations",
            description: "Complete each gentle affirmation in your own words. There's no wrong answer — just what feels true and safe for you right now.",
            fields: [
              { id: "safe-to", label: "\"Right now, it's safe for me to...\"", type: "text", placeholder: "Complete this affirmation" },
              { id: "learning-to-trust", label: "\"I'm learning to trust myself with...\"", type: "text", placeholder: "Complete this affirmation" },
              { id: "no-rush", label: "\"I don't have to rush. I get to...\"", type: "text", placeholder: "Complete this affirmation" },
              { id: "less-scary", label: "\"Money is becoming less scary because...\"", type: "text", placeholder: "Complete this affirmation" },
              { id: "worth-not-defined", label: "\"My worth is not defined by...\"", type: "text", placeholder: "Complete this affirmation" },
            ],
          },
          {
            id: "new-scripts",
            title: "Your New Money Scripts",
            fields: [
              { id: "morning-affirmation", label: "Write a morning money affirmation.", type: "textarea", placeholder: "e.g., 'I am a wise steward of my finances...'" },
              { id: "spending-script", label: "Write a script for when you feel guilt about spending.", type: "textarea" },
              { id: "earning-script", label: "Write a script for when you feel unworthy of earning more.", type: "textarea" },
              { id: "saving-script", label: "Write a script for when saving feels impossible.", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p2-scarcity-abundance",
        title: "Scarcity to Abundance Shifting Guide",
        phaseNumber: 2,
        order: 4,
        sections: [
          {
            id: "scarcity-map",
            title: "Map Your Scarcity Patterns",
            fields: [
              { id: "scarcity-areas", label: "In what areas of your life do you operate from scarcity?", type: "checkbox", options: ["Spending", "Saving", "Earning", "Investing", "Giving", "Receiving"] },
              { id: "scarcity-behaviors", label: "What behaviors result from your scarcity mindset?", type: "textarea" },
            ],
          },
          {
            id: "abundance-practice",
            title: "Abundance Practices",
            fields: [
              { id: "gratitude-list", label: "List 10 things you're financially grateful for right now.", type: "textarea" },
              { id: "abundance-evidence", label: "What evidence of abundance already exists in your life?", type: "textarea" },
              { id: "generosity-commitment", label: "What is one generous act you can commit to this week?", type: "text" },
              { id: "abundance-rating", label: "Rate your current abundance mindset (1–10)", type: "slider" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Stability Foundations",
    description: "Building your financial base",
    workbooks: [
      {
        id: "p3-budget-creation",
        title: "Budget Creation Workbook",
        phaseNumber: 3,
        order: 1,
        sections: [
          {
            id: "income",
            title: "Income Assessment",
            fields: [
              { id: "primary-income", label: "Primary monthly income (after tax)", type: "currency", placeholder: "0.00" },
              { id: "secondary-income", label: "Secondary/side income", type: "currency", placeholder: "0.00" },
              { id: "other-income", label: "Other income (child support, benefits, etc.)", type: "currency", placeholder: "0.00" },
              { id: "income-stability", label: "How stable is your income?", type: "radio", options: ["Very stable (salaried)", "Mostly stable", "Variable/freelance", "Unstable"] },
            ],
          },
          {
            id: "expenses",
            title: "Monthly Expenses",
            fields: [
              { id: "expense-entries", label: "List your monthly expenses", type: "repeating", columns: [
                { id: "category", label: "Category", type: "text", placeholder: "e.g., Rent, Groceries" },
                { id: "amount", label: "Amount", type: "currency", placeholder: "0.00" },
                { id: "necessity", label: "Need or Want?", type: "radio", options: ["Need", "Want"] },
              ]},
            ],
          },
          {
            id: "budget-plan",
            title: "Your Budget Plan",
            fields: [
              { id: "savings-goal-pct", label: "What percentage of income do you want to save?", type: "percentage", placeholder: "e.g., 20" },
              { id: "biggest-challenge", label: "What is your biggest budgeting challenge?", type: "textarea" },
              { id: "budget-method", label: "Which budgeting method appeals to you?", type: "radio", options: ["50/30/20 Rule", "Zero-based budgeting", "Envelope system", "Pay yourself first", "Not sure yet"] },
            ],
          },
        ],
      },
      {
        id: "p3-emotional-spending",
        title: "Triggers & Emotional Spending Tracker",
        phaseNumber: 3,
        order: 2,
        sections: [
          {
            id: "trigger-identification",
            title: "Identify Your Triggers",
            fields: [
              { id: "triggers", label: "What emotions trigger you to spend impulsively?", type: "checkbox", options: ["Stress", "Boredom", "Sadness", "Celebration", "Anxiety", "Loneliness", "Anger", "FOMO"] },
              { id: "trigger-entries", label: "Track your emotional spending moments", type: "repeating", columns: [
                { id: "date", label: "Date", type: "date" },
                { id: "emotion", label: "Emotion", type: "text", placeholder: "What were you feeling?" },
                { id: "purchase", label: "What did you buy?", type: "text" },
                { id: "amount", label: "Amount", type: "currency" },
                { id: "regret-level", label: "Regret level (1–10)", type: "slider" },
              ]},
            ],
          },
          {
            id: "coping-strategies",
            title: "Healthy Coping Strategies",
            fields: [
              { id: "alternatives", label: "List 5 free or low-cost activities you can do instead of emotional spending.", type: "textarea" },
              { id: "pause-commitment", label: "Will you commit to a 24-hour pause before unplanned purchases over $50?", type: "radio", options: ["Yes", "I'll try", "Not ready yet"] },
            ],
          },
        ],
      },
      {
        id: "p3-money-relationship",
        title: "Money Relationship Assessment",
        phaseNumber: 3,
        order: 3,
        sections: [
          {
            id: "assessment",
            title: "Self-Assessment",
            fields: [
              { id: "comfort-discussing", label: "How comfortable are you discussing money with others? (1–10)", type: "slider" },
              { id: "money-avoidance", label: "Do you avoid looking at your finances?", type: "radio", options: ["Yes, often", "Sometimes", "Rarely", "Never"] },
              { id: "financial-decisions", label: "Who makes financial decisions in your household?", type: "radio", options: ["I do alone", "Shared with partner", "Someone else", "No one — we avoid it"] },
              { id: "money-stress-areas", label: "What areas of money cause you the most stress?", type: "checkbox", options: ["Bills", "Debt", "Saving", "Investing", "Earning enough", "Spending habits", "Financial conversations"] },
              { id: "relationship-goal", label: "What does a healthy money relationship look like to you?", type: "textarea" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 4,
    title: "Empowered Earning & Flow",
    description: "Taking control of your financial power",
    workbooks: [
      {
        id: "p4-financial-identity",
        title: "Financial Identity Workbook",
        phaseNumber: 4,
        order: 1,
        sections: [
          {
            id: "current-identity",
            title: "Your Current Financial Identity",
            fields: [
              { id: "identity-words", label: "List 5 words that describe your current financial identity.", type: "textarea" },
              { id: "earning-belief", label: "What do you believe you deserve to earn annually?", type: "currency" },
              { id: "worth-rating", label: "How worthy do you feel of financial abundance? (1–10)", type: "slider" },
            ],
          },
          {
            id: "future-identity",
            title: "Your Empowered Financial Identity",
            fields: [
              { id: "future-words", label: "List 5 words that describe who you're becoming financially.", type: "textarea" },
              { id: "ideal-income", label: "What is your ideal annual income?", type: "currency" },
              { id: "income-streams", label: "What income streams do you want to develop?", type: "checkbox", options: ["Career advancement", "Side business", "Freelancing", "Investments", "Real estate", "Passive income", "Teaching/mentoring"] },
              { id: "identity-affirmation", label: "Write a financial identity affirmation statement.", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p4-debt-assessment",
        title: "Debt Assessment & Payoff Planner",
        phaseNumber: 4,
        order: 2,
        sections: [
          {
            id: "debt-inventory",
            title: "Debt Inventory",
            fields: [
              { id: "total-debt-feeling", label: "How do you feel about your current debt situation?", type: "textarea" },
              { id: "debt-entries", label: "List all your debts", type: "repeating", columns: [
                { id: "creditor", label: "Creditor", type: "text", placeholder: "e.g., Visa, Student Loan" },
                { id: "balance", label: "Balance", type: "currency" },
                { id: "interest-rate", label: "Interest Rate", type: "percentage" },
                { id: "min-payment", label: "Min. Payment", type: "currency" },
              ]},
            ],
          },
          {
            id: "payoff-strategy",
            title: "Payoff Strategy",
            fields: [
              { id: "method", label: "Which debt payoff method will you use?", type: "radio", options: ["Debt avalanche (highest interest first)", "Debt snowball (smallest balance first)", "Debt consolidation", "Not sure yet"] },
              { id: "extra-payment", label: "How much extra can you put toward debt monthly?", type: "currency" },
              { id: "debt-free-date", label: "Target debt-free date", type: "date" },
              { id: "motivation", label: "What will being debt-free mean to you?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p4-savings-strategy",
        title: "Savings Strategy Guide",
        phaseNumber: 4,
        order: 3,
        sections: [
          {
            id: "emergency-fund",
            title: "Emergency Fund",
            fields: [
              { id: "current-savings", label: "Current emergency fund balance", type: "currency" },
              { id: "monthly-expenses", label: "Total monthly essential expenses", type: "currency" },
              { id: "target-months", label: "How many months of expenses do you want saved?", type: "radio", options: ["3 months", "6 months", "9 months", "12 months"] },
              { id: "monthly-contribution", label: "How much can you save monthly toward this goal?", type: "currency" },
            ],
          },
          {
            id: "savings-goals",
            title: "Savings Goals",
            fields: [
              { id: "goal-entries", label: "Define your savings goals", type: "repeating", columns: [
                { id: "goal-name", label: "Goal", type: "text", placeholder: "e.g., Vacation, Home down payment" },
                { id: "target-amount", label: "Target Amount", type: "currency" },
                { id: "target-date", label: "Target Date", type: "date" },
                { id: "priority", label: "Priority (1–10)", type: "slider" },
              ]},
            ],
          },
        ],
      },
    ],
  },
  {
    number: 5,
    title: "Growth & Alignment",
    description: "Expanding your financial vision",
    workbooks: [
      {
        id: "p5-wealth-alignment",
        title: "Wealth Alignment Map",
        phaseNumber: 5,
        order: 1,
        sections: [
          {
            id: "values-alignment",
            title: "Values & Wealth Alignment",
            fields: [
              { id: "core-values", label: "What are your top 5 core values?", type: "textarea" },
              { id: "values-spending", label: "Does your current spending reflect these values?", type: "radio", options: ["Completely", "Mostly", "Somewhat", "Not at all"] },
              { id: "misalignment", label: "Where is the biggest misalignment between your values and your money?", type: "textarea" },
              { id: "alignment-actions", label: "What 3 actions would bring your money into alignment with your values?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p5-investing-readiness",
        title: "Investing Readiness Checklist",
        phaseNumber: 5,
        order: 2,
        sections: [
          {
            id: "readiness-check",
            title: "Are You Ready to Invest?",
            fields: [
              { id: "checklist", label: "Check all that apply to you", type: "checkbox", options: [
                "I have an emergency fund with 3+ months of expenses",
                "I have no high-interest debt (above 7%)",
                "I have a monthly budget I follow",
                "I understand the difference between stocks, bonds, and mutual funds",
                "I have a retirement account (401k, IRA, etc.)",
                "I am comfortable with some level of financial risk",
                "I have clear financial goals for the next 5+ years",
              ]},
              { id: "risk-tolerance", label: "How would you rate your risk tolerance? (1 = very conservative, 10 = very aggressive)", type: "slider" },
              { id: "investing-fears", label: "What fears do you have about investing?", type: "textarea" },
              { id: "first-step", label: "What is one investing step you can take this month?", type: "text" },
            ],
          },
        ],
      },
      {
        id: "p5-gratitude-journal",
        title: "Gratitude & Reflection Journal",
        phaseNumber: 5,
        order: 3,
        sections: [
          {
            id: "gratitude",
            title: "Financial Gratitude Practice",
            fields: [
              { id: "grateful-for", label: "List 10 financial wins — big or small — you're grateful for.", type: "textarea" },
              { id: "growth-areas", label: "In what areas have you grown the most financially?", type: "textarea" },
              { id: "growth-rating", label: "Rate your financial growth since starting this program (1–10)", type: "slider" },
              { id: "letter-to-self", label: "Write a letter to your past self about money.", type: "textarea" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 6,
    title: "Legacy & Integration",
    description: "Building lasting wealth and impact",
    workbooks: [
      {
        id: "p6-legacy-vision",
        title: "Legacy Vision Board Template",
        phaseNumber: 6,
        order: 1,
        sections: [
          {
            id: "legacy-vision",
            title: "Define Your Legacy",
            fields: [
              { id: "legacy-statement", label: "What financial legacy do you want to leave behind?", type: "textarea" },
              { id: "impact-areas", label: "What areas of impact matter most to you?", type: "checkbox", options: ["Family", "Community", "Education", "Health", "Entrepreneurship", "Philanthropy", "Generational wealth"] },
              { id: "legacy-timeline", label: "When do you want to start building this legacy?", type: "radio", options: ["Already started", "Within 1 year", "Within 5 years", "Within 10 years"] },
              { id: "legacy-amount", label: "What is the financial value of the legacy you want to build?", type: "currency" },
            ],
          },
        ],
      },
      {
        id: "p6-wealth-affirmation",
        title: "Wealth Identity Affirmation Script",
        phaseNumber: 6,
        order: 2,
        sections: [
          {
            id: "affirmation-creation",
            title: "Create Your Wealth Affirmations",
            fields: [
              { id: "i-am-statements", label: "Write 5 'I am' statements about your wealth identity.", type: "textarea", placeholder: "e.g., 'I am a generous, wise, and abundant woman...'" },
              { id: "i-deserve", label: "Complete: 'I deserve wealth because...'", type: "textarea" },
              { id: "practice-plan", label: "When and how will you practice these affirmations daily?", type: "textarea" },
              { id: "commitment-level", label: "How committed are you to this practice? (1–10)", type: "slider" },
            ],
          },
        ],
      },
      {
        id: "p6-integration",
        title: "Integration Reflection Guide",
        phaseNumber: 6,
        order: 3,
        sections: [
          {
            id: "integration",
            title: "Integrating Your Journey",
            fields: [
              { id: "biggest-shift", label: "What has been the biggest mindset shift in your financial journey?", type: "textarea" },
              { id: "habits-changed", label: "What financial habits have you changed?", type: "textarea" },
              { id: "remaining-work", label: "What areas still need attention and healing?", type: "textarea" },
              { id: "support-system", label: "Who is part of your financial support system now?", type: "textarea" },
              { id: "overall-transformation", label: "Rate your overall financial transformation (1–10)", type: "slider" },
            ],
          },
        ],
      },
    ],
  },
  {
    number: 7,
    title: "Legacy & Identity Embodiment",
    description: "Living your richest life",
    workbooks: [
      {
        id: "p7-healed-identity",
        title: "Healed Wealth Identity",
        phaseNumber: 7,
        order: 1,
        sections: [
          {
            id: "healed-identity",
            title: "Embodying Your Healed Wealth Identity",
            fields: [
              { id: "who-i-am-now", label: "Describe who you are now in relation to money.", type: "textarea" },
              { id: "transformation-story", label: "Write your transformation story — from where you started to where you are now.", type: "textarea" },
              { id: "daily-practices", label: "What daily practices keep you grounded in your new wealth identity?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p7-generational-wealth",
        title: "Generational Wealth Philosophy",
        phaseNumber: 7,
        order: 2,
        sections: [
          {
            id: "philosophy",
            title: "Your Wealth Philosophy",
            fields: [
              { id: "wealth-definition", label: "How do you define true wealth?", type: "textarea" },
              { id: "generational-values", label: "What financial values do you want to pass to the next generation?", type: "textarea" },
              { id: "wealth-vehicles", label: "What wealth-building vehicles are you using or planning?", type: "checkbox", options: ["Real estate", "Business ownership", "Stock market", "Retirement accounts", "Life insurance", "Education funds", "Trust/estate planning", "Cryptocurrency"] },
            ],
          },
        ],
      },
      {
        id: "p7-legacy-plan",
        title: "Legacy Plan",
        phaseNumber: 7,
        order: 3,
        sections: [
          {
            id: "plan",
            title: "Your Legacy Plan",
            fields: [
              { id: "beneficiaries", label: "Who are the beneficiaries of your legacy?", type: "textarea" },
              { id: "legacy-goals", label: "Define your legacy goals", type: "repeating", columns: [
                { id: "goal", label: "Goal", type: "text" },
                { id: "target-value", label: "Target Value", type: "currency" },
                { id: "timeline", label: "Timeline", type: "text", placeholder: "e.g., 5 years" },
              ]},
              { id: "estate-planning", label: "Do you have any of the following?", type: "checkbox", options: ["Will", "Trust", "Life insurance", "Power of attorney", "Healthcare directive", "None of these"] },
            ],
          },
        ],
      },
      {
        id: "p7-teaching-wealth",
        title: "Teaching Wealth Without Shame",
        phaseNumber: 7,
        order: 4,
        sections: [
          {
            id: "teaching",
            title: "Teaching Wealth to Others",
            fields: [
              { id: "who-to-teach", label: "Who do you want to teach about wealth and money?", type: "textarea" },
              { id: "key-lessons", label: "What are the 3 most important money lessons you've learned?", type: "textarea" },
              { id: "shame-free-approach", label: "How will you teach about money without shame or judgment?", type: "textarea" },
              { id: "age-appropriate", label: "What age-appropriate money conversations can you start having?", type: "textarea" },
            ],
          },
        ],
      },
      {
        id: "p7-maintaining-alignment",
        title: "Maintaining Alignment",
        phaseNumber: 7,
        order: 5,
        sections: [
          {
            id: "alignment",
            title: "Staying Aligned",
            fields: [
              { id: "alignment-practices", label: "What practices help you stay financially aligned?", type: "textarea" },
              { id: "warning-signs", label: "What are your warning signs of falling back into old patterns?", type: "textarea" },
              { id: "accountability", label: "How will you hold yourself accountable going forward?", type: "textarea" },
              { id: "review-frequency", label: "How often will you review your financial plan?", type: "radio", options: ["Weekly", "Bi-weekly", "Monthly", "Quarterly"] },
            ],
          },
        ],
      },
      {
        id: "p7-then-vs-now",
        title: "Then vs. Now Reflection",
        phaseNumber: 7,
        order: 6,
        sections: [
          {
            id: "reflection",
            title: "Your Financial Transformation",
            fields: [
              { id: "then-beliefs", label: "THEN: What did you believe about money before this program?", type: "textarea" },
              { id: "now-beliefs", label: "NOW: What do you believe about money today?", type: "textarea" },
              { id: "then-habits", label: "THEN: What were your financial habits?", type: "textarea" },
              { id: "now-habits", label: "NOW: What are your financial habits?", type: "textarea" },
              { id: "then-feeling", label: "THEN: How did money make you feel?", type: "radio", options: ["Anxious", "Ashamed", "Overwhelmed", "Indifferent", "Fearful"] },
              { id: "now-feeling", label: "NOW: How does money make you feel?", type: "radio", options: ["Confident", "Empowered", "Peaceful", "Grateful", "Excited"] },
              { id: "final-reflection", label: "What message would you give to someone starting this journey?", type: "textarea" },
              { id: "program-rating", label: "Rate your overall program experience (1–10)", type: "slider" },
            ],
          },
        ],
      },
    ],
  },
];

export function getPhase(phaseNumber: number): Phase | undefined {
  return PHASES.find((p) => p.number === phaseNumber);
}

export function getWorkbook(workbookId: string): Workbook | undefined {
  for (const phase of PHASES) {
    const wb = phase.workbooks.find((w) => w.id === workbookId);
    if (wb) return wb;
  }
  return undefined;
}

export function getRecommendedWorkbook(phase: Phase, completedIds: Set<string>): Workbook | undefined {
  return phase.workbooks.find((w) => !completedIds.has(w.id));
}
