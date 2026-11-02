"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import PatientNavbar from "@/components/navigation/PatientNavbar";
import { useLanguage } from "@/lib/language";

interface Article {
  id: string;
  category: "General health" | "Nutrition" | "Fitness" | "Mental wellbeing";
  subCategory: string;
  readTime: string;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  accentBg: string;
  symbol: string;
  body: string[];
}

interface MemberStory {
  id: string;
  author: string;
  memberTenure: string;
  avatar: string;
  title: string;
  quote: string;
  date: string;
  likes: number;
  comments: number;
}

const ARTICLES: Article[] = [
  {
    id: "art-1",
    category: "Nutrition",
    subCategory: "Metabolic health",
    readTime: "8 min",
    date: "28 Oct 2026",
    title: "Vegetarian protein, made practical",
    excerpt: "Dal, paneer, curd and sprouts — how to reach your daily protein without supplements.",
    author: "Dr. Meera Iyer",
    authorRole: "Clinical Nutrition Specialist",
    authorAvatar: "MI",
    accentBg: "from-amber-100 to-rose-100 text-amber-900",
    symbol: "◐",
    body: [
      "Protein deficiency is widespread across Indian vegetarian diets, often averaging less than 45 grams per day compared to the recommended 60–75 grams.",
      "The easiest hack is diversification: pairing legumes with whole grains (e.g., khichdi with curd or dal with sprouted moong salad) completes the essential amino acid chain.",
      "Aim for 20 grams of protein per meal: 1 cup cooked dal (8g), 100g low-fat paneer (14g), and 1 bowl of set curd (6g) effortlessly meets your target without powders.",
    ],
  },
  {
    id: "art-2",
    category: "General health",
    subCategory: "Vitamins",
    readTime: "5 min",
    date: "22 Oct 2026",
    title: "Vitamin D in India: why most of us are low",
    excerpt: "Plenty of sun, yet widespread deficiency. What helps, and when a test makes sense.",
    author: "Dr. Ananya Rao",
    authorRole: "Endocrinologist",
    authorAvatar: "AR",
    accentBg: "from-blue-100 to-indigo-100 text-indigo-900",
    symbol: "D",
    body: [
      "Despite India being sun-drenched, over 70% of urban Indians test below 20 ng/mL on 25-hydroxy vitamin D panels.",
      "Melanin in Indian skin reduces cutaneous synthesis of vitamin D3 by up to 80%, requiring roughly 25 to 40 minutes of direct midday sun exposure (between 11 AM and 1 PM) without sunscreen.",
      "If you experience chronic morning fatigue, dull lower-back aches, or hair shedding, check your levels. A short oral cholecalciferol course under clinical supervision normalizes levels within 8 weeks.",
    ],
  },
  {
    id: "art-3",
    category: "General health",
    subCategory: "Blood tests",
    readTime: "7 min",
    date: "18 Oct 2026",
    title: "Reading your CBC report at home",
    excerpt: "Haemoglobin, WBC, platelets — what each line means and when to ask your doctor.",
    author: "Dr. Arjun Sethi",
    authorRole: "General Physician",
    authorAvatar: "AS",
    accentBg: "from-sky-100 to-cyan-100 text-cyan-900",
    symbol: "⊕",
    body: [
      "A Complete Blood Count (CBC) is the foundational mirror of your immune system, oxygen delivery capacity, and cellular turnover.",
      "Haemoglobin below 12 g/dL in women or 13.5 g/dL in men indicates microcytic anaemia. Check MCV and serum ferritin before taking generic iron tonics.",
      "White Blood Cells (WBC) between 4,000–11,000 cells/mcL are normal. Mild elevations often point to acute bacterial infections, whereas persistent drops warrant clinical hematology triage.",
    ],
  },
  {
    id: "art-4",
    category: "Mental wellbeing",
    subCategory: "Sleep",
    readTime: "8 min",
    date: "14 Oct 2026",
    title: "Sleep, stress and late-night snacking",
    excerpt: "How cortisol and late dinners feed each other — and a simple wind-down routine.",
    author: "Dr. Farah Siddiqui",
    authorRole: "Neuro-Psychiatrist",
    authorAvatar: "FS",
    accentBg: "from-purple-100 to-violet-100 text-purple-900",
    symbol: "Z",
    body: [
      "Elevated evening cortisol blunts ghrelin satiety cues, triggering cravings for carbohydrates and ultra-processed comfort foods past 10 PM.",
      "Late calorie intake delays core body temperature drop, fragmenting REM and deep restorative sleep cycles.",
      "Try a 45-minute digital curfew, chamomile or warm cinnamon water, and dim warm amber lighting to cue endogenous melatonin secretion naturally.",
    ],
  },
  {
    id: "art-5",
    category: "Fitness",
    subCategory: "Joint health",
    readTime: "6 min",
    date: "11 Oct 2026",
    title: "Strength training after 40, without the knee pain",
    excerpt: "Three moves that protect joints and build the muscle that helps blood sugar.",
    author: "Dr. Vikram Menon",
    authorRole: "Cardiologist & Sports Medicine",
    authorAvatar: "VM",
    accentBg: "from-emerald-100 to-teal-100 text-emerald-900",
    symbol: "⟌",
    body: [
      "Skeletal muscle is our largest metabolic glucose sink. As sarcopenia begins past age 40, insulin resistance climbs unless resistance work is sustained.",
      "Replace deep jumping squats with Romanian deadlifts, wall sits, and seated leg presses to protect the patellar tendon while loading the quadriceps and glutes.",
      "Two 25-minute sessions per week yield a measurable 0.3% drop in HbA1c over 12 weeks, independent of dietary changes.",
    ],
  },
  {
    id: "art-6",
    category: "Nutrition",
    subCategory: "Diabetes",
    readTime: "4 min",
    date: "08 Oct 2026",
    title: "Rice, roti or millets? A calm look at carbs",
    excerpt: "Portions, pairing and timing matter more than cutting out your favourite grain.",
    author: "Dr. Kavya Reddy",
    authorRole: "Metabolic Nutritionist",
    authorAvatar: "KR",
    accentBg: "from-rose-100 to-orange-100 text-rose-900",
    symbol: "C",
    body: [
      "Demonizing white rice or wheat roti is rarely necessary or sustainable for lifelong glucose management in Indian households.",
      "The order of eating alters the glycemic curve drastically: eating cucumber, bhindi, or dal first creates a viscous fiber barrier that slows carbohydrate absorption by up to 35%.",
      "Foxtail millet (kangni) and finger millet (ragi) have slower starch breakdown, making them excellent rotis or idlis when paired with roasted chana and green chutney.",
    ],
  },
];

const MEMBER_STORIES: MemberStory[] = [
  {
    id: "story-1",
    author: "Rekha S.",
    memberTenure: "Member for 1 year",
    avatar: "RS",
    title: "Bringing my HbA1c down with my mother's recipes",
    quote: '"I didn\'t give up rotis. I changed the plate — more sabzi, less rice, and a walk after dinner."',
    date: "Posted 12 Oct 2026",
    likes: 48,
    comments: 12,
  },
  {
    id: "story-2",
    author: "Imran K.",
    memberTenure: "Member for 8 months",
    avatar: "IK",
    title: "Walking my way to lower blood pressure",
    quote: '"Cutting pickles and papad was hard. Seeing my readings drop week after week kept me going."',
    date: "Posted 9 Oct 2026",
    likes: 62,
    comments: 27,
  },
  {
    id: "story-3",
    author: "Priya R.",
    memberTenure: "Member for 6 months",
    avatar: "PR",
    title: "Learning to rest after burnout",
    quote: '"Ten minutes of quiet breathing at lunch changed my afternoons more than any coffee."',
    date: "Posted 4 Oct 2026",
    likes: 65,
    comments: 19,
  },
];

export default function HealthStoriesPage() {
  const [language] = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [storyLikes, setStoryLikes] = useState<Record<string, number>>({});
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New story submission form state
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryQuote, setNewStoryQuote] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const toggleBookmark = (id: string, title: string) => {
    setBookmarks((prev) => {
      const next = !prev[id];
      triggerToast(next ? `Saved "${title}" to your reading list.` : `Removed "${title}" from reading list.`);
      return { ...prev, [id]: next };
    });
  };

  const toggleLike = (id: string) => {
    setStoryLikes((prev) => {
      const current = prev[id] || 0;
      return { ...prev, [id]: current + 1 };
    });
    triggerToast("Thank you for supporting this member's journey!");
  };

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const matchCat =
        selectedCategory === "All" ||
        selectedCategory === "Member stories" ||
        art.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.subCategory.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q);

      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleShareStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle || !newStoryQuote) return;
    setIsShareModalOpen(false);
    setNewStoryTitle("");
    setNewStoryQuote("");
    triggerToast("Your story has been submitted for clinical moderation. Thank you!");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-20 relative overflow-x-hidden">
      
      {/* ============ STANDARD PATIENT NAVBAR ============ */}
      <PatientNavbar activeTab="stories" />

      {/* ============ MAIN STORIES CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        
        {/* ============ HEADER & BREADCRUMBS ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#64748B]">
              <span>{language === "hi" ? "होम / लेख एवं अंतर्दृष्टि" : "Home / Articles & Insights"}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E3202B]" />
                {language === "hi" ? "डॉक्टरों द्वारा समीक्षित · समुदाय की आवाजें" : "Reviewed by doctors · community voices"}
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {language === "hi" ? (
                <>
                  स्वास्थ्य कहानियाँ और{" "}
                  <span className="italic text-[#E3202B] font-serif font-normal">
                    जानकारियाँ।
                  </span>
                </>
              ) : (
                <>
                  Health stories &{" "}
                  <span className="italic text-[#E3202B] font-serif font-normal">
                    insights.
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 max-w-xl">
              {language === "hi"
                ? "डॉक्टरों द्वारा जांची गई मार्गदर्शिकाएँ और वास्तविक स्वस्थ होने की कहानियाँ — सरल भाषा में।"
                : "Doctor-reviewed guides and real recovery stories — in plain language, for everyday life in India."}
            </p>
          </div>

          {/* Share Your Story Button */}
          <div>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#E3202B] hover:bg-[#c91822] text-white shadow-[0_8px_20px_rgba(227,32,43,0.25)] transition-all cursor-pointer active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>{language === "hi" ? "अपनी कहानी साझा करें" : "Share your story"}</span>
            </button>
          </div>
        </div>

        {/* ============ SEARCH & FILTER BAR ============ */}
        <div className="space-y-4">
          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, biomarkers, topics or experiences..."
              className="w-full pl-11 pr-14 py-3 rounded-full bg-white border border-slate-200/80 shadow-2xs text-xs sm:text-sm text-[#1D1F22] placeholder:text-slate-400 focus:outline-hidden focus:border-[#E3202B] focus:ring-2 focus:ring-red-100 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50">
                ⌘ K
              </span>
            </div>
          </div>

          {/* Category Tabs & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center flex-wrap gap-2 text-xs font-semibold">
              {["All", "General health", "Nutrition", "Fitness", "Mental wellbeing", "Member stories"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#E3202B] text-white shadow-xs"
                      : "bg-white text-[#64748B] hover:text-[#1D1F22] border border-slate-200/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#94A3B8] font-medium">
              Showing {filteredArticles.length + (selectedCategory === "All" || selectedCategory === "Member stories" ? 3 : 0)} guides & stories
            </span>
          </div>
        </div>

        {/* ============ HERO CLINICAL SPOTLIGHT CARD ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-9 border border-slate-200/80 shadow-[0_16px_40px_rgba(29,31,34,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Article Spotlight Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-[#E3202B] border border-rose-200/60">
                • CLINICAL SPOTLIGHT · NUTRITION
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Doctor reviewed
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1D1F22] tracking-tight leading-snug"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              The 10-minute walk: how a short stroll after meals steadies your blood sugar
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Muscles soak up glucose when they move. Studies suggest short walks after lunch and dinner can soften post-meal spikes — no gym, no special diet.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-7 h-7 rounded-full bg-rose-100 text-[#E3202B] text-xs font-bold flex items-center justify-center">
                AR
              </div>
              <span className="text-xs text-[#64748B]">
                <strong className="text-[#1D1F22]">Dr. Ananya Rao</strong> · 28 Oct 2026 · 6 min read
              </span>
            </div>

            {/* Actions: Read Full Article, Bookmark, Share */}
            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() =>
                  setActiveArticle({
                    id: "spotlight",
                    category: "Nutrition",
                    subCategory: "Metabolic clinical spotlight",
                    readTime: "6 min",
                    date: "28 Oct 2026",
                    title: "The 10-minute walk: how a short stroll after meals steadies your blood sugar",
                    excerpt: "Muscles soak up glucose when they move. Studies suggest short walks after lunch and dinner can soften post-meal spikes.",
                    author: "Dr. Ananya Rao",
                    authorRole: "Endocrinologist",
                    authorAvatar: "AR",
                    accentBg: "from-rose-100 to-amber-100 text-rose-900",
                    symbol: "W",
                    body: [
                      "When you take a brisk 10 to 15-minute walk within 30 minutes of eating, skeletal muscle contractions activate GLUT4 transporters to take up glucose directly from the bloodstream, completely bypassing the need for an insulin surge.",
                      "Continuous Glucose Monitoring (CGM) trials show that post-prandial glycemic excursions are reduced by an average of 22 to 34 mg/dL when a light stroll is completed after dinners.",
                      "This simple habit also promotes gastric motility, reduces gastroesophageal reflux, and prevents the lethargy and brain fog commonly reported after carbohydrate-heavy lunches.",
                    ],
                  })
                }
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#1D1F22] hover:bg-black text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Read full article</span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => toggleBookmark("spotlight", "The 10-minute walk")}
                title="Bookmark article"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  bookmarks["spotlight"]
                    ? "bg-red-50 border-red-300 text-[#E3202B]"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarks["spotlight"] ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => triggerToast("Article link copied to clipboard.")}
                title="Share article"
                className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Glucose After Dinner Graph Widget */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-4">
            
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#1D1F22]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                GLUCOSE AFTER DINNER
              </span>
              <span className="text-[#94A3B8] font-mono text-[11px]">
                target &lt; 140 mg/dL
              </span>
            </div>

            {/* Dual Curve Comparative Graph */}
            <div className="relative w-full h-32 select-none">
              <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                {/* Safe zone line */}
                <line x1="10" y1="70" x2="390" y2="70" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
                
                {/* Curve WITHOUT walk (Spike in light pink) */}
                <path
                  d="M 15 95 C 60 95, 120 15, 190 15 C 260 15, 320 80, 385 85"
                  fill="none"
                  stroke="#FCA5A5"
                  strokeWidth="2.2"
                  strokeDasharray="4 4"
                />
                <circle cx="190" cy="15" r="4.5" fill="#F87171" />

                {/* Curve WITH walk (Flattened curve in bold crimson) */}
                <path
                  d="M 15 95 C 60 95, 120 50, 190 48 C 260 48, 320 85, 385 88"
                  fill="none"
                  stroke="#E3202B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="190" cy="48" r="4.5" fill="#E3202B" />
              </svg>

              {/* Legend row */}
              <div className="flex items-center justify-center gap-4 text-[11px] font-semibold mt-1">
                <span className="flex items-center gap-1.5 text-[#E3202B]">
                  <span className="w-3.5 h-[3px] bg-[#E3202B] rounded-full inline-block" />
                  with 10-min walk
                </span>
                <span className="flex items-center gap-1.5 text-rose-300">
                  <span className="w-3.5 h-[2px] bg-rose-300 border-dashed inline-block" />
                  without
                </span>
              </div>
            </div>

            {/* 3 Metric Stat Blocks */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">PEAK</span>
                <span className="text-xs sm:text-sm font-bold text-[#1D1F22]">Lower</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">TIME</span>
                <span className="text-xs sm:text-sm font-bold text-[#E3202B]">10 min</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200/70">
                <span className="text-[9px] font-mono text-[#94A3B8] uppercase block">EFFORT</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600">Easy</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono text-center">
              Illustrative curve.
            </p>
          </div>
        </div>

        {/* ============ MIDDLE SECTION: GUIDES & BIOMARKER EXPLAINERS ============ */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1F22]">
                Guides & biomarker explainers
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Written with specialists, turned into everyday steps.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#94A3B8]">
              Updated today
            </span>
          </div>

          {/* 6 Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => {
              const isBookmarked = !!bookmarks[article.id];

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-[26px] p-5 border border-slate-200/80 shadow-[0_10px_25px_rgba(29,31,34,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group cursor-pointer"
                  onClick={() => setActiveArticle(article)}
                >
                  <div className="space-y-3.5">
                    {/* Top Abstract Visual Banner */}
                    <div className={`w-full h-28 rounded-2xl bg-gradient-to-br ${article.accentBg} p-3 flex items-start justify-between relative overflow-hidden shadow-2xs`}>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/80 backdrop-blur-xs text-[#1D1F22]">
                        {article.category}
                      </span>

                      {/* White Center Squircle with Symbol */}
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center font-bold text-xl my-auto mx-auto absolute inset-0">
                        {article.symbol}
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-white ml-auto">
                        ⏱ {article.readTime}
                      </span>
                    </div>

                    {/* Metadata line */}
                    <p className="text-[11px] font-semibold text-[#64748B]">
                      {article.date} · <span className="text-[#E3202B]">{article.subCategory}</span>
                    </p>

                    {/* Title */}
                    <h4 className="text-base font-bold text-[#1D1F22] leading-snug group-hover:text-[#E3202B] transition-colors">
                      {article.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Card Footer: Read Link & Bookmark */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-xs font-bold text-[#E3202B] group-hover:underline flex items-center gap-1">
                      <span>Read article</span>
                      <span>→</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(article.id, article.title);
                      }}
                      title="Bookmark article"
                      className="text-slate-400 hover:text-[#E3202B] transition-colors p-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isBookmarked ? "#E3202B" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ BOTTOM SECTION: STORIES THAT BRING US TOGETHER ============ */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-[#E3202B] border border-rose-200/60 uppercase">
                • COMMUNITY
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1D1F22] mt-1">
                Stories that bring us together
              </h3>
              <p className="text-xs text-[#64748B]">
                Real journeys shared by AETHRIZ members.
              </p>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#475569] flex items-center gap-1">
              ✓ Moderated
            </span>
          </div>

          {/* Medical Advice Disclaimer Callout */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] flex items-center gap-2">
            <span className="text-amber-600 font-bold">ⓘ</span>
            <span>Personal stories aren&apos;t medical advice. Talk to your doctor before changing treatment.</span>
          </div>

          {/* 3 Member Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MEMBER_STORIES.map((story) => {
              const extraLikes = storyLikes[story.id] || 0;

              return (
                <div
                  key={story.id}
                  className="bg-white rounded-[26px] p-5 border border-slate-200/80 shadow-[0_10px_25px_rgba(29,31,34,0.03)] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Avatar, Name & Member Story badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-[#E3202B] font-bold text-xs flex items-center justify-center">
                          {story.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1D1F22] flex items-center gap-1">
                            <span>{story.author}</span>
                            <span className="text-emerald-600 text-[10px]">✓</span>
                          </p>
                          <p className="text-[10px] text-[#94A3B8]">
                            {story.memberTenure}
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-[#E3202B] border border-rose-200/60">
                        Member story
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#1D1F22] leading-snug">
                      {story.title}
                    </h4>

                    <p className="text-xs text-[#64748B] italic leading-relaxed">
                      {story.quote}
                    </p>
                  </div>

                  {/* Footer: Date & Likes */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#94A3B8]">
                    <span>{story.date}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleLike(story.id)}
                        className="flex items-center gap-1 hover:text-[#E3202B] transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-[#E3202B] text-[#E3202B]" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span>{story.likes + extraLikes}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>{story.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ FOOTER NOTICE ============ */}
        <div className="pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <p className="text-center sm:text-left leading-relaxed">
            Medical information & community note: Content here is for education and support. It is not a substitute for diagnosis, prescription or emergency care.
          </p>
          <button
            type="button"
            onClick={() => triggerToast("AETHRIZ Clinical Guidelines: All published materials are peer-reviewed by registered specialists.")}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[#1D1F22] font-semibold flex-shrink-0 transition-all cursor-pointer"
          >
            Review guidelines
          </button>
        </div>
      </main>

      {/* ============ ARTICLE READER MODAL OVERLAY ============ */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#E3202B] border border-rose-200">
                {activeArticle.subCategory}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#1D1F22] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1F22] leading-snug">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-[#64748B]">
                <div className="w-6 h-6 rounded-full bg-rose-100 text-[#E3202B] text-[10px] font-bold flex items-center justify-center">
                  {activeArticle.authorAvatar}
                </div>
                <span>
                  <strong className="text-[#1D1F22]">{activeArticle.author}</strong> ({activeArticle.authorRole}) · {activeArticle.readTime} read
                </span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-[#475569] leading-relaxed pt-2 border-t border-slate-100">
              {activeArticle.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <p className="font-bold">Clinical Takeaway:</p>
              <p>Small, regular adjustments in dietary sequence and light mobility outperform severe restrictive diets over 6 to 12-month clinical biomarkers.</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  toggleBookmark(activeArticle.id, activeArticle.title);
                }}
                className="text-xs font-semibold text-[#E3202B] hover:underline"
              >
                {bookmarks[activeArticle.id] ? "Saved in bookmarks ✓" : "+ Add to reading list"}
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 rounded-full bg-[#1D1F22] text-white text-xs font-semibold hover:bg-black"
              >
                Close reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ SHARE STORY SUBMISSION MODAL ============ */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#1D1F22]">Share Your Health Journey</h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#1D1F22] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleShareStorySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1F22]">Story Title</label>
                <input
                  type="text"
                  required
                  value={newStoryTitle}
                  onChange={(e) => setNewStoryTitle(e.target.value)}
                  placeholder="e.g. How I brought down my post-meal glucose spikes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1D1F22]">Your Key Takeaway / Experience</label>
                <textarea
                  rows={4}
                  required
                  value={newStoryQuote}
                  onChange={(e) => setNewStoryQuote(e.target.value)}
                  placeholder="What was the habit or food shift that helped you most? What advice would you give someone starting out?"
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1D1F22] focus:bg-white focus:outline-hidden focus:border-[#E3202B]"
                />
              </div>

              <p className="text-[11px] text-[#94A3B8]">
                All stories are reviewed by our medical board before publishing to protect member safety and privacy.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-[#E3202B] text-white hover:bg-[#c91822] shadow-xs"
                >
                  Submit for moderation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1D1F22] text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
