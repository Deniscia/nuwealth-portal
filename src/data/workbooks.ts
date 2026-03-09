export interface WorkbookField {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'currency' | 'percentage' | 'checkbox' | 'radio' | 'date' | 'slider' | 'repeating';
  options?: string[];
  columns?: WorkbookField[];
  placeholder?: string;
  description?: string;
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
        id: "p1-money-story",
        title: "Money Story Worksheet",
        phaseNumber: 1,
        order: 1,
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
        id: "p1-mindset-journal",
        title: "Money Mindset Journal Prompts",
        phaseNumber: 1,
        order: 2,
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
            title: "Identify Limiting Beliefs",
            fields: [
              { id: "beliefs-list", label: "List 3–5 limiting beliefs you hold about money.", type: "textarea", placeholder: "e.g., 'Rich people are greedy', 'I'll never be wealthy'..." },
              { id: "belief-origin", label: "Where did these beliefs originate?", type: "radio", options: ["Family", "Culture", "Media", "Personal experience", "Religion/Spirituality", "Peers"] },
              { id: "belief-cost", label: "What has holding onto these beliefs cost you?", type: "textarea" },
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
        ],
      },
      {
        id: "p2-limiting-beliefs",
        title: "Limiting Beliefs Reframing Guide",
        phaseNumber: 2,
        order: 2,
        sections: [
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
