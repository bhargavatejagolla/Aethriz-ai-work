"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getSession, UserProfile } from "@/lib/auth";
import PatientNavbar from "@/components/navigation/PatientNavbar";
import { useLanguage } from "@/lib/language";

interface Biomarker {
  id: string;
  code: string;
  name: string;
  nameHi: string;
  category: "metabolic" | "heart" | "vitamins" | "thyroid" | "blood";
  categoryLabel: string;
  categoryLabelHi: string;
  refRange: string;
  value: string;
  unit: string;
  numericVal: number;
  minRef: number;
  maxRef: number;
  status: "Borderline" | "Elevated" | "Low" | "In range";
  statusHi: "सीमावर्ती" | "बढ़ा हुआ" | "कम" | "सामान्य";
  statusColor: "red" | "amber" | "emerald";
  whatItMeans: string;
  whatItMeansHi: string;
  whatYouCanDo: string;
  whatYouCanDoHi: string;
  julyBaseline: string;
  julyDelta: string;
  isImproved: boolean;
}

const BIOMARKERS: Biomarker[] = [
  {
    id: "hba1c",
    code: "A1c",
    name: "HbA1c",
    nameHi: "एचबीए1सी (ग्लाइकेटेड हीमोग्लोबिन)",
    category: "metabolic",
    categoryLabel: "Metabolic",
    categoryLabelHi: "चयापचय",
    refRange: "Ref 4.0–5.6",
    value: "6.1",
    unit: "%",
    numericVal: 6.1,
    minRef: 4.0,
    maxRef: 5.6,
    status: "Borderline",
    statusHi: "सीमावर्ती",
    statusColor: "amber",
    whatItMeans: "Your average blood sugar over the last ~3 months is slightly above ideal. It rose a little since July.",
    whatItMeansHi: "पिछले 3 महीनों में आपका औसत रक्त शर्करा सामान्य से थोड़ा अधिक है। जुलाई की तुलना में इसमें थोड़ी वृद्धि हुई है।",
    whatYouCanDo: "Swap refined carbs for whole grains, add a 10-minute walk after meals, and re-test in 3 months.",
    whatYouCanDoHi: "मैदा व चीनी कम करें, साबुत अनाज अपनाएं, भोजन के बाद 10 मिनट टहलें और 3 महीने में पुनः जांच कराएं।",
    julyBaseline: "5.8 %",
    julyDelta: "+0.3%",
    isImproved: false,
  },
  {
    id: "fbs",
    code: "FBS",
    name: "Fasting glucose",
    nameHi: "फास्टिंग ब्लड ग्लूकोज",
    category: "metabolic",
    categoryLabel: "Metabolic",
    categoryLabelHi: "चयापचय",
    refRange: "Ref 70–99",
    value: "108",
    unit: "mg/dL",
    numericVal: 108,
    minRef: 70,
    maxRef: 99,
    status: "Borderline",
    statusHi: "सीमावर्ती",
    statusColor: "amber",
    whatItMeans: "Morning blood sugar is slightly elevated before eating, indicating early hepatic gluconeogenesis variation.",
    whatItMeansHi: "सुबह खाली पेट रक्त शर्करा थोड़ा बढ़ा हुआ है, जो रात के मेटाबॉलिज्म में हल्का असंतुलन दर्शाता है।",
    whatYouCanDo: "Finish dinner by 8:30 PM, avoid sugary post-dinner snacks, and ensure 7+ hours of quality sleep.",
    whatYouCanDoHi: "रात का खाना रात 8:30 बजे तक समाप्त करें, देर रात मीठा खाने से बचें और 7+ घंटे की गहरी नींद लें।",
    julyBaseline: "98 mg/dL",
    julyDelta: "+10 mg/dL",
    isImproved: false,
  },
  {
    id: "ldl",
    code: "LDL",
    name: "LDL cholesterol",
    nameHi: "एलडीएल कोलेस्ट्रॉल",
    category: "heart",
    categoryLabel: "Heart",
    categoryLabelHi: "हृदय स्वास्थ्य",
    refRange: "Ref < 100",
    value: "142",
    unit: "mg/dL",
    numericVal: 142,
    minRef: 60,
    maxRef: 100,
    status: "Elevated",
    statusHi: "बढ़ा हुआ",
    statusColor: "red",
    whatItMeans: "Atherogenic lipoprotein concentration is above optimal cardiovascular longevity targets.",
    whatItMeansHi: "यह बैड कोलेस्ट्रॉल है, जिसका स्तर आदर्श सीमा से अधिक है, हालांकि जुलाई से इसमें सुधार हुआ है।",
    whatYouCanDo: "Increase soluble fiber (oats, psyllium husk, fenugreek), reduce saturated fats (deep-fried foods), and re-evaluate.",
    whatYouCanDoHi: "घुलनशील फाइबर (ओट्स, इसबगोल, मेथी) बढ़ाएं, तली-भुनी चीजें कम करें और नियमित व्यायाम करें।",
    julyBaseline: "155 mg/dL",
    julyDelta: "-13 mg/dL",
    isImproved: true,
  },
  {
    id: "tg",
    code: "TG",
    name: "Triglycerides",
    nameHi: "ट्राइग्लिसराइड्स",
    category: "heart",
    categoryLabel: "Heart",
    categoryLabelHi: "हृदय स्वास्थ्य",
    refRange: "Ref < 150",
    value: "168",
    unit: "mg/dL",
    numericVal: 168,
    minRef: 50,
    maxRef: 150,
    status: "Elevated",
    statusHi: "बढ़ा हुआ",
    statusColor: "red",
    whatItMeans: "Circulating blood fats are slightly elevated, frequently linked to simple refined carbohydrates and dinner timing.",
    whatItMeansHi: "रक्त में वसा का स्तर थोड़ा अधिक है, जो अक्सर अत्यधिक मीठे पेय या देर रात के भारी भोजन से जुड़ा होता है।",
    whatYouCanDo: "Limit sugary chai, refined flours, and late-night carbohydrate meals. Incorporate brisk aerobic activity.",
    whatYouCanDoHi: "मीठी चाय और रिफाइंड कार्ब्स सीमित करें। रोजाना 30 मिनट तेज गति से सैर करें।",
    julyBaseline: "185 mg/dL",
    julyDelta: "-17 mg/dL",
    isImproved: true,
  },
  {
    id: "hdl",
    code: "HDL",
    name: "HDL cholesterol",
    nameHi: "एचडीएल कोलेस्ट्रॉल",
    category: "heart",
    categoryLabel: "Heart",
    categoryLabelHi: "हृदय स्वास्थ्य",
    refRange: "Ref > 40",
    value: "44",
    unit: "mg/dL",
    numericVal: 44,
    minRef: 40,
    maxRef: 70,
    status: "In range",
    statusHi: "सामान्य",
    statusColor: "emerald",
    whatItMeans: "Cardioprotective reverse-cholesterol transport particles are within safe reference boundaries.",
    whatItMeansHi: "यह गुड कोलेस्ट्रॉल है जो रक्त वाहिकाओं की सुरक्षा करता है और बिल्कुल सुरक्षित सीमा में है।",
    whatYouCanDo: "Sustain daily physical activity, consume healthy fats like walnuts and flaxseeds to support HDL functionality.",
    whatYouCanDoHi: "नियमित व्यायाम जारी रखें और अखरोट व अलसी जैसे स्वस्थ वसायुक्त खाद्य पदार्थों का सेवन करें।",
    julyBaseline: "42 mg/dL",
    julyDelta: "+2 mg/dL",
    isImproved: true,
  },
  {
    id: "vitd",
    code: "D",
    name: "Vitamin D",
    nameHi: "विटामिन डी",
    category: "vitamins",
    categoryLabel: "Vitamins & minerals",
    categoryLabelHi: "विटामिन एवं खनिज",
    refRange: "Ref 30–100",
    value: "18.2",
    unit: "ng/mL",
    numericVal: 18.2,
    minRef: 30,
    maxRef: 100,
    status: "Low",
    statusHi: "कम",
    statusColor: "amber",
    whatItMeans: "Insufficient circulating 25-hydroxyvitamin D, impacting calcium absorption, immune health, and insulin sensitivity.",
    whatItMeansHi: "विटामिन डी का स्तर कम है, जो हड्डियों की मजबूती, रोग प्रतिरोधक क्षमता और ऊर्जा स्तर को प्रभावित करता है।",
    whatYouCanDo: "15 minutes of direct morning sunlight before 10 AM, and consult your doctor for a 60,000 IU clinical course.",
    whatYouCanDoHi: "सुबह 10 बजे से पहले 15 मिनट धूप लें और डॉक्टर की सलाह से 60k IU सप्लीमेंट का कोर्स पूरा करें।",
    julyBaseline: "16.5 ng/mL",
    julyDelta: "+1.7 ng/mL",
    isImproved: true,
  },
  {
    id: "ferritin",
    code: "Fe",
    name: "Ferritin",
    nameHi: "फेरिटिन (आयरन भंडार)",
    category: "vitamins",
    categoryLabel: "Vitamins & minerals",
    categoryLabelHi: "विटामिन एवं खनिज",
    refRange: "Ref 30–400",
    value: "22",
    unit: "ng/mL",
    numericVal: 22,
    minRef: 30,
    maxRef: 400,
    status: "Low",
    statusHi: "कम",
    statusColor: "amber",
    whatItMeans: "Cellular iron reserves are below optimal, which can cause early afternoon fatigue and reduced metabolic endurance.",
    whatItMeansHi: "शरीर में आयरन का आंतरिक भंडार कम है, जिससे दोपहर में थकान और कमजोरी महसूस हो सकती है।",
    whatYouCanDo: "Pair iron-rich foods (spinach, beetroot, lentils, pomegranate) with Vitamin C (lemon, amla) for enhanced absorption.",
    whatYouCanDoHi: "पालक, चुकंदर और अनार के साथ नींबू या आंवला लें जिससे आयरन का अवशोषण तेजी से हो सके।",
    julyBaseline: "20 ng/mL",
    julyDelta: "+2 ng/mL",
    isImproved: true,
  },
  {
    id: "vitb12",
    code: "B12",
    name: "Vitamin B12",
    nameHi: "विटामिन बी12",
    category: "vitamins",
    categoryLabel: "Vitamins & minerals",
    categoryLabelHi: "विटामिन एवं खनिज",
    refRange: "Ref 200–900",
    value: "310",
    unit: "pg/mL",
    numericVal: 310,
    minRef: 200,
    maxRef: 900,
    status: "In range",
    statusHi: "सामान्य",
    statusColor: "emerald",
    whatItMeans: "Healthy circulating cobalamin supporting red blood cell formation and myelin sheath neurological integrity.",
    whatItMeansHi: "रक्त कोशिकाओं और तंत्रिका तंत्र के सुचारू कार्य के लिए बी12 का स्तर पूरी तरह स्वस्थ और संतुलित है।",
    whatYouCanDo: "Continue consuming fortified dairy (curd, paneer, milk) or dietary supplements if strictly plant-based.",
    whatYouCanDoHi: "दही, पनीर और दूध का संतुलित सेवन बनाए रखें।",
    julyBaseline: "285 pg/mL",
    julyDelta: "+25 pg/mL",
    isImproved: true,
  },
  {
    id: "tsh",
    code: "TSH",
    name: "TSH",
    nameHi: "टीएसएच (थायरॉयड उत्तेजक हार्मोन)",
    category: "thyroid",
    categoryLabel: "Thyroid",
    categoryLabelHi: "थायरॉयड",
    refRange: "Ref 0.4–4.0",
    value: "2.1",
    unit: "μIU/mL",
    numericVal: 2.1,
    minRef: 0.4,
    maxRef: 4.0,
    status: "In range",
    statusHi: "सामान्य",
    statusColor: "emerald",
    whatItMeans: "Thyroid-stimulating hormone is optimal, reflecting steady pituitary-thyroid metabolic axis signaling.",
    whatItMeansHi: "थायरॉयड ग्रंथि का कार्य पूरी तरह संतुलित है और शरीर का बेसल मेटाबॉलिज्म स्थिर है।",
    whatYouCanDo: "Maintain balanced dietary iodine and selenium from normal household diet.",
    whatYouCanDoHi: "सामान्य संतुलित भोजन से आयोडीन और सेलेनियम का सेवन बनाए रखें।",
    julyBaseline: "2.3 μIU/mL",
    julyDelta: "-0.2 μIU/mL",
    isImproved: true,
  },
  {
    id: "hb",
    code: "Hb",
    name: "Haemoglobin",
    nameHi: "हीमोग्लोबिन",
    category: "blood",
    categoryLabel: "Blood",
    categoryLabelHi: "रक्त स्वास्थ्य",
    refRange: "Ref 13–17",
    value: "13.8",
    unit: "g/dL",
    numericVal: 13.8,
    minRef: 13,
    maxRef: 17,
    status: "In range",
    statusHi: "सामान्य",
    statusColor: "emerald",
    whatItMeans: "Erythrocyte oxygen-carrying capacity is robust and completely within healthy physiological standards.",
    whatItMeansHi: "रक्त में ऑक्सीजन ले जाने की क्षमता उत्तम और पूरी तरह स्वस्थ स्तर पर है।",
    whatYouCanDo: "Maintain hydration and well-rounded balanced nutritional intake.",
    whatYouCanDoHi: "पर्याप्त पानी पिएं और पौष्टिक आहार जारी रखें।",
    julyBaseline: "13.5 g/dL",
    julyDelta: "+0.3 g/dL",
    isImproved: true,
  },
];

export default function HealthAnalysisPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>("hba1c");
  const [compareWithJuly, setCompareWithJuly] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (session?.role === "doctor") {
      router.push("/doctor/nexus");
      return;
    }
    if (session) {
      setUser(session);
    }
  }, [router]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setUploadProgress(15);
    const t1 = setTimeout(() => setUploadProgress(45), 400);
    const t2 = setTimeout(() => setUploadProgress(85), 900);
    const t3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
        setUploadProgress(0);
      }, 1200);
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const filteredBiomarkers =
    selectedCategory === "all"
      ? BIOMARKERS
      : BIOMARKERS.filter((b) => b.category === selectedCategory);

  const counts = {
    all: BIOMARKERS.length,
    metabolic: BIOMARKERS.filter((b) => b.category === "metabolic").length,
    heart: BIOMARKERS.filter((b) => b.category === "heart").length,
    vitamins: BIOMARKERS.filter((b) => b.category === "vitamins").length,
    thyroid: BIOMARKERS.filter((b) => b.category === "thyroid").length,
    blood: BIOMARKERS.filter((b) => b.category === "blood").length,
  };

  const userName = user?.name?.split(" ")[0] || "Aarav";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#1D1F22] font-sans antialiased selection:bg-[#E3202B] selection:text-white pb-16 relative overflow-x-hidden">
      {/* Signature Ambient Red Navbar Glow */}
      <div className="ae-top-nav-glow" />
      {/* ============ STANDARD PATIENT NAVBAR ============ */}
      <PatientNavbar activeTab="analysis" />

      {/* ============ MAIN ANALYSIS CONTAINER ============ */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* ============ SUBHEADER: BREADCRUMB & TITLE ============ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#64748B]">
              {language === "hi"
                ? "एआई स्वास्थ्य · लैब रिपोर्ट · 28 अक्टूबर 2026"
                : "AI Health · Lab report · 28 Oct 2026"}
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1D1F22] mt-1"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {language === "hi" ? "आपकी संपूर्ण स्वास्थ्य रिपोर्ट।" : "Your health analysis."}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-full text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                    : "text-[#64748B] hover:text-[#1D1F22]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  language === "hi"
                    ? "bg-white text-[#1D1F22] font-semibold shadow-xs"
                    : "text-[#64748B] hover:text-[#1D1F22]"
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Download PDF button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer text-[#1D1F22]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <span>{language === "hi" ? "पीडीएफ डाउनलोड" : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* ============ TOP SPLIT SECTION: AI SUMMARY & LAB REPORT CARD ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* LEFT: DARK OBSIDIAN AI CLINICAL SYNTHESIS (8 COLS) */}
          <div
            className="lg:col-span-8 rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, #18191E 0%, #101115 60%, #1F0D12 100%)",
            }}
          >
            {/* Ambient Crimson Halo */}
            <div
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(227,32,43,0.35) 0%, transparent 70%)",
                filter: "blur(36px)",
              }}
            />

            <div className="relative z-10 space-y-4">
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#E3202B] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E3202B] ae-pulse-glow" />
                {language === "hi" ? "एथ्रिज एआई सारांश" : "AETHRIZ AI summary"}
              </span>

              <h2
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-tight max-w-2xl"
                style={{ fontFamily: "'Inter Tight', sans-serif" }}
              >
                {language === "hi"
                  ? "ज्यादातर रिपोर्ट्स अच्छी हैं — आपके ब्लड शुगर पर ध्यान देने की आवश्यकता है।"
                  : "Mostly good news — your blood sugar needs attention."}
              </h2>

              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
                {language === "hi"
                  ? "आपका थायरॉयड, ब्लड काउंट और विटामिन बी12 पूरी तरह स्वस्थ हैं, और जुलाई की तुलना में कोलेस्ट्रॉल में स्पष्ट सुधार हुआ है। केवल HbA1c और फास्टिंग ग्लूकोज सीमावर्ती हैं, और विटामिन डी व आयरन कम हैं। अच्छी बात यह है कि आहार और दिनचर्या में छोटे बदलावों से ये आसानी से सामान्य हो जाते हैं।"
                  : "Your thyroid, blood count and B12 look healthy, and cholesterol has improved since July. HbA1c and fasting glucose are borderline and rising, and vitamin D and iron are low. The good news: these respond well to food and routine changes."}
              </p>
            </div>

            {/* Bottom Metrics Bar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-12 gap-4 items-center">
              {/* Score Dial (4 cols) */}
              <div className="sm:col-span-4 flex items-center gap-3">
                <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-white/10" strokeWidth="10" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E3202B"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * 0.14}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-white">86</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {language === "hi" ? "स्वास्थ्य स्कोर" : "Health score"}
                  </span>
                  <span className="text-[11px] text-white/60">
                    {language === "hi" ? "अच्छा स्तर" : "Good range"}
                  </span>
                </div>
              </div>

              {/* 4 Stat Boxes (8 cols) */}
              <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xl font-bold text-[#FF6B6F] block">3</span>
                  <span className="text-[10px] text-white/70">
                    {language === "hi" ? "ध्यान दें" : "need attention"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xl font-bold text-amber-400 block">3</span>
                  <span className="text-[10px] text-white/70">
                    {language === "hi" ? "निगरानी रखें" : "to watch"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xl font-bold text-emerald-400 block">4</span>
                  <span className="text-[10px] text-white/70">
                    {language === "hi" ? "सामान्य सीमा" : "in range"}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xl font-bold text-emerald-400 block">↑ 4</span>
                  <span className="text-[10px] text-white/70">
                    {language === "hi" ? "जुलाई से सुधार" : "score since July"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LAB REPORT CARD (4 COLS) */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 sm:p-7 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-4">
                <span className="text-[#1D1F22]">
                  {language === "hi" ? "लैब रिपोर्ट · 28 अक्टूबर" : "Lab report · 28 Oct"}
                </span>
                <span className="text-[11px] text-[#64748B]">PDF · 4 pages</span>
              </div>

              {/* 3D Floating Lab Report Graphic */}
              <div className="py-4 flex justify-center">
                <div className="relative w-36 h-44 bg-gradient-to-b from-white to-slate-50 rounded-2xl border border-slate-200 shadow-[0_16px_32px_rgba(29,31,34,0.08)] p-3.5 flex flex-col justify-between group hover:scale-105 transition-transform">
                  <div className="space-y-2">
                    <div className="w-12 h-1.5 rounded-full bg-slate-300" />
                    <div className="w-20 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-full h-1.5 rounded-full bg-red-400/80 mt-3" />
                    <div className="w-24 h-1.5 rounded-full bg-amber-400/80" />
                    <div className="w-28 h-1.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
                    <span>AETHRIZ LAB</span>
                    <span className="text-emerald-600 font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[#475569]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>{language === "hi" ? "रिपोर्ट प्राप्त हुई" : "Report received"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#475569]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>{language === "hi" ? "42 बायोमार्कर विश्लेषित" : "Reading 42 values"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#475569]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>{language === "hi" ? "जुलाई डेटा से तुलना पूरी" : "Comparing with July"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#475569]">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span>{language === "hi" ? "व्यक्तिगत योजना तैयार" : "Personalising your plan"}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="w-full py-3 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span>{language === "hi" ? "नई रिपोर्ट अपलोड करें" : "Analyse a new report"}</span>
              </button>

              <Link
                href="/health-check-in"
                className="w-full py-2.5 rounded-full text-xs font-semibold text-[#64748B] hover:text-[#E11D48] bg-slate-50 hover:bg-rose-50/50 border border-slate-200/80 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>{language === "hi" ? "बिना लैब रिपोर्ट? जीवनशैली चेक-इन करें →" : "No lab report? Try lifestyle check-in →"}</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ============ MAIN SECTION: EVERY VALUE, EXPLAINED ============ */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] space-y-6">
          
          {/* Header Row & Compare Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1D1F22] tracking-tight">
              {language === "hi" ? "प्रत्येक परीक्षण मान, सरल भाषा में" : "Every value, explained"}
            </h2>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#64748B]">
                {language === "hi" ? "जुलाई से तुलना करें" : "Compare with July"}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={compareWithJuly}
                onClick={() => setCompareWithJuly(!compareWithJuly)}
                className={`w-11 h-6 rounded-full transition-colors cursor-pointer p-0.5 flex items-center ${
                  compareWithJuly ? "bg-[#E3202B]" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    compareWithJuly ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: language === "hi" ? "सभी" : "All", count: counts.all },
              { id: "metabolic", label: language === "hi" ? "चयापचय" : "Metabolic", count: counts.metabolic },
              { id: "heart", label: language === "hi" ? "हृदय" : "Heart", count: counts.heart },
              { id: "vitamins", label: language === "hi" ? "विटामिन एवं खनिज" : "Vitamins & minerals", count: counts.vitamins },
              { id: "thyroid", label: language === "hi" ? "थायरॉयड" : "Thyroid", count: counts.thyroid },
              { id: "blood", label: language === "hi" ? "रक्त" : "Blood", count: counts.blood },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-[#1D1F22] text-white shadow-xs"
                    : "bg-slate-100/80 text-[#64748B] hover:text-[#1D1F22] hover:bg-slate-200/70"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10.5px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-200 text-[#64748B]"
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="space-y-3 pt-2">
            {filteredBiomarkers.map((b) => {
              const isExpanded = expandedId === b.id;

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? "bg-white border-slate-300 shadow-xs"
                      : "bg-[#F8FAFC] border-slate-200/80 hover:bg-white"
                  }`}
                >
                  {/* Clickable Header Row */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(b.id)}
                    className="w-full text-left p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                  >
                    {/* Left: Code badge & Name */}
                    <div className="flex items-center gap-3.5 min-w-[220px]">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#E3202B] flex items-center justify-center shadow-2xs flex-shrink-0">
                        {b.code}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1D1F22] leading-tight">
                          {language === "hi" ? b.nameHi : b.name}
                        </h4>
                        <p className="text-[11.5px] text-[#64748B]">
                          {language === "hi" ? b.categoryLabelHi : b.categoryLabel} · {b.refRange}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Gauge Track Slider */}
                    <div className="flex-1 max-w-xs px-2">
                      <div className="relative h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-[#E3202B]">
                        {/* Needle / Indicator */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-700 shadow-xs transition-all duration-300"
                          style={{
                            left: `${Math.min(
                              92,
                              Math.max(
                                8,
                                ((b.numericVal - b.minRef) / (b.maxRef - b.minRef)) * 100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Right: Value, Status badge & Chevron */}
                    <div className="flex items-center gap-4 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-[#1D1F22]">
                          {b.value}
                        </span>
                        <span className="text-xs text-[#64748B] ml-1">{b.unit}</span>
                        {compareWithJuly && (
                          <div className="flex items-center justify-end gap-1 text-[10px] mt-0.5">
                            <span className="text-[#94A3B8]">Jul: {b.julyBaseline}</span>
                            <span
                              className={`font-semibold ${
                                b.isImproved ? "text-emerald-600" : "text-[#E3202B]"
                              }`}
                            >
                              ({b.julyDelta})
                            </span>
                          </div>
                        )}
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          b.statusColor === "red"
                            ? "bg-red-50 text-[#E3202B] border border-red-200"
                            : b.statusColor === "amber"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {language === "hi" ? b.statusHi : b.status}
                      </span>

                      <div className="text-slate-400">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Diagnostic Guidance */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 border-t border-slate-100 pt-4 ae-fade-in space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                          <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#E3202B] font-bold block mb-1">
                            {language === "hi" ? "इसका क्या अर्थ है" : "WHAT IT MEANS"}
                          </span>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {language === "hi" ? b.whatItMeansHi : b.whatItMeans}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70">
                          <span className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                            {language === "hi" ? "आप क्या कर सकते हैं" : "WHAT YOU CAN DO"}
                          </span>
                          <p className="text-xs text-[#475569] leading-relaxed">
                            {language === "hi" ? b.whatYouCanDoHi : b.whatYouCanDo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                          href={`/dashboard?query=${encodeURIComponent(
                            `Tell me more about my ${b.name} level of ${b.value} ${b.unit} and specific meal suggestions.`
                          )}`}
                          className="px-4 py-2 rounded-full text-xs font-semibold text-[#E3202B] bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1.5"
                        >
                          <span>✦</span>
                          <span>{language === "hi" ? "एआई से पूछें" : "Ask AETHRIZ"}</span>
                        </Link>

                        <Link
                          href={`/doctors?specialty=${b.category}`}
                          className="px-5 py-2 rounded-full text-xs font-semibold text-white shadow-2xs hover:opacity-95 transition-all"
                          style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                        >
                          {language === "hi" ? "डॉक्टर से परामर्श लें" : "Talk to a doctor"}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* ============ BOTTOM SECTION: OUTLOOK & 30-DAY PLAN ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* OUTLOOK GAUGES (6 COLS) */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#1D1F22] tracking-tight">
                {language === "hi" ? "भविष्य का रुझान (आउटलुक)" : "Outlook"}
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {language === "hi"
                  ? "आपकी रिपोर्ट के आधार पर सांकेतिक रुझान — यह कोई चिकित्सीय निदान नहीं है।"
                  : "Indicative trends from your reports — not a diagnosis."}
              </p>

              {/* 3 Semi-circular Dials */}
              <div className="grid grid-cols-3 gap-3 my-8 text-center">
                {/* Watch: Blood sugar */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-14 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="9" />
                      <path d="M 10 50 A 40 40 0 0 1 70 18" fill="none" stroke="#E3202B" strokeWidth="9" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-[#E3202B] mt-2">
                    {language === "hi" ? "निगरानी" : "Watch"}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {language === "hi" ? "ब्लड शुगर" : "Blood sugar"}
                  </p>
                </div>

                {/* Improving: Heart */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-14 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="9" />
                      <path d="M 10 50 A 40 40 0 0 1 80 32" fill="none" stroke="#F59E0B" strokeWidth="9" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-amber-600 mt-2">
                    {language === "hi" ? "सुधार जारी" : "Improving"}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {language === "hi" ? "हृदय" : "Heart"}
                  </p>
                </div>

                {/* Low: Nutrients */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-14 flex items-center justify-center overflow-hidden">
                    <svg viewBox="0 0 100 50" className="w-full h-full">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="9" />
                      <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#B45309" strokeWidth="9" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-amber-700 mt-2">
                    {language === "hi" ? "कम स्तर" : "Low"}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    {language === "hi" ? "पोषक तत्व" : "Nutrients"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* YOUR 30-DAY PLAN (6 COLS) */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/80 shadow-[0_12px_36px_rgba(29,31,34,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#1D1F22] tracking-tight">
                  {language === "hi" ? "आपकी 30-दिन की कार्ययोजना" : "Your 30-day plan"}
                </h3>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-[#475569] font-medium border border-slate-200">
                  {user?.diet || "Vegetarian"} · {language === "hi" ? "हिन्दी" : "English"}
                </span>
              </div>

              {/* 3 Step Cards */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-mono">
                    01
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1F22]">
                      {language === "hi" ? "थाली को संतुलित करें" : "Rebalance your plate"}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                      {language === "hi"
                        ? "आधी थाली हरी सब्जी/सलाद, एक चौथाई दाल या पनीर, और एक चौथाई रोटी या मोटा अनाज।"
                        : "Half sabzi, a quarter dal or paneer, a quarter roti or millet."}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-mono">
                    02
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1F22]">
                      {language === "hi" ? "भोजन के बाद 10 मिनट टहलें" : "Walk after meals"}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                      {language === "hi"
                        ? "दोपहर और रात के खाने के बाद 10 मिनट की हल्की सैर से शुगर स्पाइक 30% तक कम होता है।"
                        : "10 minutes after lunch and dinner flattens sugar spikes."}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#E3202B] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs font-mono">
                    03
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#1D1F22]">
                      {language === "hi" ? "90 दिनों में पुनः जांच कराएं" : "Re-test in 90 days"}
                    </h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-snug">
                      {language === "hi"
                        ? "HbA1c, लिपिड प्रोफाइल और विटामिन डी — समय आने पर AETHRIZ आपको अलर्ट करेगा।"
                        : "HbA1c, lipid profile and vitamin D — we will remind you."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ============ SPECIALIST CALLOUT BANNER ============ */}
        <div
          className="rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xs border border-red-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FEE2E2 100%)",
          }}
        >
          {/* Ambient Red Pearl Sphere */}
          <div
            className="absolute right-40 -top-8 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FF6469 0%, #E3202B 55%, #7F1D1D 100%)",
              boxShadow: "0 12px 28px rgba(227,32,43,0.35)",
            }}
          />

          <div className="relative z-10 max-w-lg">
            <h3
              className="text-2xl font-bold text-[#1D1F22] tracking-tight"
              style={{ fontFamily: "'Inter Tight', sans-serif" }}
            >
              {language === "hi"
                ? "विशेषज्ञ डॉक्टर से परामर्श लें।"
                : "Talk it through with a specialist."}
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
              {language === "hi"
                ? "हम एंडोक्रिनोलॉजिस्ट से परामर्श की अनुशंसा करते हैं। आपकी यह विश्लेषण रिपोर्ट परामर्श से पूर्व डॉक्टर के साथ साझा की जा सकती है।"
                : "We recommend an endocrinologist. Your analysis can be shared before the visit."}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Link
              href="/doctors"
              className="px-6 py-3 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
              style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
            >
              <span>{language === "hi" ? "डॉक्टर खोजें" : "Find a doctor"}</span>
              <span className="font-bold">→</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-full text-xs font-semibold text-[#1D1F22] bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
            >
              {language === "hi" ? "डैशबोर्ड पर वापस जाएं" : "Back to dashboard"}
            </Link>
          </div>
        </div>

        {/* ============ FOOTER DISCLAIMER ============ */}
        <p className="text-center text-xs text-[#94A3B8] pt-4">
          AETHRIZ supports health awareness. It does not replace a qualified doctor, diagnosis or emergency care.
        </p>

      </main>

      {/* ============ ANALYSE NEW REPORT MODAL ============ */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ae-fade-in">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => {
                if (!isUploading) setShowUploadModal(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E3202B] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-[#1D1F22]">
              {language === "hi" ? "नई लैब रिपोर्ट अपलोड करें" : "Upload New Lab Report"}
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              {language === "hi"
                ? "नवीनतम ब्लड पैनल जोड़ें ताकि आपके बायोमार्कर ग्राफ तुरंत अपडेट हो सकें।"
                : "Add your latest blood panel to update biomarker trajectories and trend lines."}
            </p>

            <div className="mt-5 space-y-4">
              <div
                onClick={() => !isUploading && handleSimulatedUpload()}
                className="border-2 border-dashed border-slate-200 hover:border-[#E3202B]/60 rounded-2xl p-6 text-center transition-colors cursor-pointer bg-slate-50/50"
              >
                {isUploading ? (
                  <div className="space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-red-200 border-t-[#E3202B] animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-[#1D1F22]">
                      AI reading and verifying 42 parameters... {uploadProgress}%
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-[#E3202B] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : uploadSuccess ? (
                  <div className="space-y-2 text-emerald-600">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-lg font-bold">
                      ✓
                    </div>
                    <p className="text-xs font-bold">Report verified & integrated successfully!</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-[#1D1F22]">
                      Drag and drop your report PDF, or <span className="text-[#E3202B]">browse</span>
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">PDF, JPG, PNG up to 25MB</p>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUploading || uploadSuccess}
                  onClick={handleSimulatedUpload}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  style={{ background: "linear-gradient(180deg, #32363A 0%, #1D1F22 100%)" }}
                >
                  {isUploading ? "Analysing..." : "Process with AI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
