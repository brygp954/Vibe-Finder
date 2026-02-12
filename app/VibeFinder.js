'use client'
import { useState, useEffect, useRef } from "react";

const EXPERIENCE_VIBES = [
  { id: "unwind", emoji: "🌙", label: "Unwind", desc: "Decompress, let go, melt into the couch", color: "#B47AEA" },
  { id: "social", emoji: "✨", label: "Get Social", desc: "Laughs, conversation, good company", color: "#FF6B6B" },
  { id: "creative", emoji: "🎨", label: "Get Creative", desc: "Music, art, ideas flowing", color: "#FF8A5C" },
  { id: "focused", emoji: "⚡", label: "Stay Focused", desc: "Clear-headed, productive, dialed in", color: "#4ECDC4" },
  { id: "explore", emoji: "🔮", label: "Go Deep", desc: "Introspective, expansive, meaningful", color: "#C471ED" },
  { id: "feelgood", emoji: "☀️", label: "Feel Good", desc: "Mood lift, euphoria, just vibing", color: "#FFD166" },
];

const EXPERIENCE_LEVELS = [
  { id: "new", label: "I'm pretty new to this", icon: "🌱" },
  { id: "casual", label: "I partake from time to time", icon: "🍃" },
  { id: "regular", label: "I'm a regular", icon: "🌿" },
  { id: "connoisseur", label: "I know my stuff", icon: "🌳" },
];

const METHODS = [
  { id: "flower", label: "Flower", icon: "🌸" },
  { id: "edible", label: "Edibles", icon: "🍫" },
  { id: "vape", label: "Vape", icon: "💨" },
  { id: "any", label: "Open to anything", icon: "🤷" },
];

const TIMING = [
  { id: "morning", label: "Morning / Daytime", icon: "☀️" },
  { id: "afternoon", label: "Afternoon", icon: "🌤️" },
  { id: "evening", label: "Evening", icon: "🌅" },
  { id: "night", label: "Late Night", icon: "🌙" },
];

const AVOID = [
  { id: "munchies", label: "The munchies" },
  { id: "anxiety", label: "Anxiety or racing thoughts" },
  { id: "couch", label: "Couch lock" },
  { id: "dry", label: "Dry mouth / eyes" },
  { id: "none", label: "Nothing — I'm open" },
];

const DOSAGE_BY_LEVEL = {
  new: { range: "5 mg", label: "Low / Starter", note: "One gummy, one dose. Give it a full 90 minutes before you even think about taking another." },
  casual: { range: "5 – 10 mg", label: "Low / Standard", note: "Start with one. If you know 5mg is comfortable, go for two. Give it 90 minutes." },
  regular: { range: "10 – 25 mg", label: "Standard / Elevated", note: "You know your tolerance. Adjust based on the product and your plans." },
  connoisseur: { range: "25 – 50+ mg", label: "Elevated / Strong", note: "You know the deal. Edibles still hit different — respect the onset." },
};

const STRAIN_DB = {
  unwind: [
    { name: "Granddaddy Purple", type: "Indica", thc: "20%", terpenes: ["Myrcene", "Caryophyllene", "Pinene"], vibe: "Like a weighted blanket for your brain. Deep relaxation without total knockout.", match: 96 },
    { name: "Northern Lights", type: "Indica", thc: "18%", terpenes: ["Myrcene", "Caryophyllene", "Limonene"], vibe: "The classic evening strain. Smooth, dreamy, and forgiving if you overdo it a little.", match: 92 },
    { name: "Blue Cheese", type: "Indica Hybrid", thc: "17%", terpenes: ["Myrcene", "Caryophyllene", "Linalool"], vibe: "Funky flavor, deeply calming. Great for when your mind won't stop racing.", match: 88 },
  ],
  social: [
    { name: "Wedding Cake", type: "Hybrid", thc: "22%", terpenes: ["Limonene", "Caryophyllene", "Myrcene"], vibe: "Sweet, euphoric, and chatty. You'll be the life of the kickback.", match: 95 },
    { name: "Blue Dream", type: "Sativa Hybrid", thc: "21%", terpenes: ["Myrcene", "Pinene", "Caryophyllene"], vibe: "Balanced and easygoing. Good vibes without overdoing it in either direction.", match: 91 },
    { name: "Mimosa", type: "Sativa Hybrid", thc: "19%", terpenes: ["Limonene", "Linalool", "Myrcene"], vibe: "Bright and uplifting, like brunch energy in a strain. Keeps the laughs coming.", match: 87 },
  ],
  creative: [
    { name: "Jack Herer", type: "Sativa", thc: "20%", terpenes: ["Pinene", "Limonene", "Myrcene"], vibe: "Clear-headed inspiration. Ideas come easy and music sounds incredible.", match: 97 },
    { name: "Durban Poison", type: "Sativa", thc: "19%", terpenes: ["Myrcene", "Terpinolene", "Ocimene"], vibe: "Pure creative energy. Great for making art, writing, or just seeing the world differently.", match: 93 },
    { name: "Tangie", type: "Sativa", thc: "19%", terpenes: ["Limonene", "Myrcene", "Pinene"], vibe: "Citrusy and euphoric. The kind of high where you reorganize your whole playlist.", match: 89 },
  ],
  focused: [
    { name: "Green Crack", type: "Sativa", thc: "17%", terpenes: ["Myrcene", "Pinene", "Caryophyllene"], vibe: "Don't let the name scare you — it's just clean, focused energy. Great daytime strain.", match: 94 },
    { name: "Super Lemon Haze", type: "Sativa", thc: "20%", terpenes: ["Limonene", "Terpinolene", "Caryophyllene"], vibe: "Zesty and sharp. Good for deep work sessions where you need to stay locked in.", match: 90 },
    { name: "Harlequin", type: "Sativa", thc: "9%", terpenes: ["Myrcene", "Pinene", "Caryophyllene"], vibe: "High CBD, low THC. Functional and clear — you'll barely feel 'high' but everything flows better.", match: 86 },
  ],
  explore: [
    { name: "Zkittlez", type: "Indica Hybrid", thc: "23%", terpenes: ["Caryophyllene", "Linalool", "Humulene"], vibe: "Candy-sweet and deeply introspective. Great for journaling or long walks alone.", match: 95 },
    { name: "Pineapple Express", type: "Hybrid", thc: "19%", terpenes: ["Myrcene", "Pinene", "Caryophyllene"], vibe: "Balanced but expansive. Your thoughts go interesting places without losing the thread.", match: 91 },
    { name: "Trainwreck", type: "Sativa Hybrid", thc: "21%", terpenes: ["Myrcene", "Limonene", "Pinene"], vibe: "Hits fast and opens doors. Best with intention — set up your space first.", match: 87 },
  ],
  feelgood: [
    { name: "Gelato", type: "Hybrid", thc: "22%", terpenes: ["Limonene", "Caryophyllene", "Humulene"], vibe: "Pure joy in a jar. Sweet, smooth, and everything just feels a little more wonderful.", match: 96 },
    { name: "Runtz", type: "Hybrid", thc: "24%", terpenes: ["Limonene", "Caryophyllene", "Linalool"], vibe: "Candy vibes, euphoric lift. The one that makes a regular Tuesday feel like a celebration.", match: 93 },
    { name: "MAC (Miracle Alien Cookies)", type: "Hybrid", thc: "21%", terpenes: ["Limonene", "Caryophyllene", "Myrcene"], vibe: "Creamy, dreamy, and giggly. You'll feel great about everything for a few hours.", match: 89 },
  ],
};

const EDIBLE_DB = {
  unwind: [
    { name: "Indica Gummies", format: "Gummies", icon: "🍬", leaning: "Indica", ratio: "THC-dominant", vibe: "The go-to for melting into the evening. Predictable dosing, slow onset, long-lasting calm.", onset: "45 – 90 min", duration: "4 – 6 hours", match: 96 },
    { name: "CBD:THC Sleep Gummies", format: "Gummies", icon: "😴", leaning: "Indica + CBD", ratio: "1:1 CBD:THC", vibe: "The CBD takes the edge off while the THC does the heavy lifting. Great if you tend to get anxious.", onset: "45 – 90 min", duration: "5 – 7 hours", match: 93 },
    { name: "Cannabis-Infused Chocolate", format: "Chocolate", icon: "🍫", leaning: "Indica", ratio: "THC-dominant", vibe: "A little ritual before bed. The fat content helps absorption — smooth, even onset.", onset: "60 – 120 min", duration: "4 – 6 hours", match: 88 },
  ],
  social: [
    { name: "Sativa Gummies", format: "Gummies", icon: "🍬", leaning: "Sativa", ratio: "THC-dominant", vibe: "Pop one before the hangout. Upbeat, chatty, and easy to dose precisely.", onset: "45 – 90 min", duration: "3 – 5 hours", match: 95 },
    { name: "Cannabis Beverage", format: "Beverage", icon: "🥤", leaning: "Hybrid", ratio: "Low-dose THC", vibe: "The social sipper. Fast-acting nano-emulsion tech means you feel it in 15 minutes. Easy to pace yourself like a drink.", onset: "10 – 20 min", duration: "1.5 – 3 hours", match: 94 },
    { name: "Hybrid Fruit Chews", format: "Chews", icon: "🍭", leaning: "Sativa Hybrid", ratio: "THC-dominant", vibe: "Shareable, fun flavors, and a balanced lift that keeps the conversation flowing.", onset: "45 – 90 min", duration: "3 – 5 hours", match: 89 },
  ],
  creative: [
    { name: "Sativa Gummies", format: "Gummies", icon: "🍬", leaning: "Sativa", ratio: "THC-dominant", vibe: "Clean creative fuel. Precise dosing means you can find exactly the right level for flow state.", onset: "45 – 90 min", duration: "3 – 5 hours", match: 96 },
    { name: "Cannabis Beverage", format: "Beverage", icon: "🥤", leaning: "Sativa", ratio: "Low-dose THC", vibe: "Sip and create. The fast onset lets you dial in your level in real time — like a volume knob for creativity.", onset: "10 – 20 min", duration: "1.5 – 3 hours", match: 92 },
    { name: "THC Mints", format: "Mints", icon: "🌿", leaning: "Sativa", ratio: "Microdose THC", vibe: "Subtle and functional. A little creative spark without going deep. Great for daytime projects.", onset: "30 – 60 min", duration: "2 – 3 hours", match: 87 },
  ],
  focused: [
    { name: "CBD:THC Mints", format: "Mints", icon: "🌿", leaning: "Sativa", ratio: "2:1 CBD:THC", vibe: "The productivity hack. CBD keeps you grounded while a touch of THC sharpens the edges.", onset: "30 – 60 min", duration: "2 – 4 hours", match: 95 },
    { name: "Microdose Gummies", format: "Gummies", icon: "🍬", leaning: "Sativa", ratio: "Low THC (5mg)", vibe: "Just one and everything works a little better. Focus without the fog — like a gentle cognitive tune-up.", onset: "45 – 90 min", duration: "3 – 4 hours", match: 93 },
    { name: "Cannabis-Infused Coffee", format: "Beverage", icon: "☕", leaning: "Sativa", ratio: "THC + Caffeine", vibe: "The best of both worlds. Alert and smooth. The THC rounds off the caffeine jitters.", onset: "15 – 30 min", duration: "2 – 4 hours", match: 88 },
  ],
  explore: [
    { name: "High-Dose Gummies", format: "Gummies", icon: "🍬", leaning: "Hybrid", ratio: "THC-dominant", vibe: "For the experienced explorer. Set your intention, get comfortable, and let the journey unfold.", onset: "60 – 120 min", duration: "5 – 8 hours", match: 94 },
    { name: "Cannabis Chocolate Bar", format: "Chocolate", icon: "🍫", leaning: "Indica Hybrid", ratio: "THC-dominant", vibe: "Slow, layered onset. Like the experience builds in chapters — great for a quiet evening of introspection.", onset: "60 – 120 min", duration: "5 – 7 hours", match: 91 },
    { name: "Full-Spectrum Tincture", format: "Tincture", icon: "💧", leaning: "Hybrid", ratio: "Full-spectrum", vibe: "Sublingual for faster onset, precise control. The entourage effect from full-spectrum gives it more depth.", onset: "15 – 45 min", duration: "4 – 6 hours", match: 87 },
  ],
  feelgood: [
    { name: "Hybrid Gummies", format: "Gummies", icon: "🍬", leaning: "Hybrid", ratio: "THC-dominant", vibe: "Pure euphoric lift in a gummy. Pick your dose, pick your flavor, and enjoy the ride.", onset: "45 – 90 min", duration: "4 – 6 hours", match: 96 },
    { name: "Cannabis Seltzer", format: "Beverage", icon: "🫧", leaning: "Hybrid", ratio: "Low-dose THC", vibe: "Bubbly, light, and instantly mood-boosting. The sparkling water of getting elevated.", onset: "10 – 20 min", duration: "1.5 – 3 hours", match: 93 },
    { name: "Fruit Chews", format: "Chews", icon: "🍭", leaning: "Sativa Hybrid", ratio: "THC-dominant", vibe: "Candy that makes everything better. Fruity, fun, and reliably uplifting.", onset: "45 – 90 min", duration: "3 – 5 hours", match: 89 },
  ],
};

const TERPENE_INFO = {
  Myrcene: { color: "#4ECDC4", note: "Earthy, musky. The chill terpene." },
  Limonene: { color: "#FFD166", note: "Citrusy. Mood lifter." },
  Caryophyllene: { color: "#FF8A5C", note: "Spicy, peppery. Anti-anxiety." },
  Pinene: { color: "#45E6A0", note: "Pine-fresh. Helps focus." },
  Linalool: { color: "#C471ED", note: "Floral, lavender. Calming." },
  Terpinolene: { color: "#6BC5F2", note: "Herbal, fresh. Uplifting." },
  Humulene: { color: "#E8A838", note: "Woody, hoppy. Grounding." },
  Ocimene: { color: "#7AE582", note: "Sweet, herbal. Energizing." },
};

function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
      {children}
    </div>
  );
}

export default function VibeFinder() {
  const [step, setStep] = useState(-1); // -1 = splash
  const [vibe, setVibe] = useState(null);
  const [level, setLevel] = useState(null);
  const [method, setMethod] = useState(null);
  const [timing, setTiming] = useState(null);
  const [avoid, setAvoid] = useState([]);
  const [checkinResponse, setCheckinResponse] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [shared, setShared] = useState(false);
  const containerRef = useRef(null);

  const reset = () => {
    setStep(0); setVibe(null); setLevel(null); setMethod(null);
    setTiming(null); setAvoid([]); setCheckinResponse(null); setShared(false);
  };

  const goNext = (nextStep) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
      if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const toggleAvoid = (id) => {
    if (id === "none") { setAvoid(["none"]); return; }
    setAvoid(prev => {
      const filtered = prev.filter(a => a !== "none");
      return filtered.includes(id) ? filtered.filter(a => a !== id) : [...filtered, id];
    });
  };

  const handleShare = async () => {
    const text = `🌿 Find Your Vibe matched me with cannabis picks for my "${selectedVibe?.label}" mood. Check it out:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Find Your Vibe", text, url: window.location.href });
        setShared(true);
      } catch (e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const selectedVibe = EXPERIENCE_VIBES.find(v => v.id === vibe);
  const strains = vibe ? STRAIN_DB[vibe] : [];

  const st = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0F0E13 0%, #171520 35%, #1A1324 60%, #12101A 100%)",
      color: "#ECE6F0",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    ambientOrb1: {
      position: "fixed", top: -180, right: -120,
      width: 450, height: 450, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(255,107,107,0.08) 0%, rgba(255,94,125,0.04) 40%, transparent 70%)",
      pointerEvents: "none", zIndex: 0,
    },
    ambientOrb2: {
      position: "fixed", bottom: -200, left: -150,
      width: 500, height: 500, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(196,113,237,0.06) 0%, rgba(78,205,196,0.03) 50%, transparent 70%)",
      pointerEvents: "none", zIndex: 0,
    },
    noise: {
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
      pointerEvents: "none", zIndex: 0,
    },
    container: {
      maxWidth: 520, margin: "0 auto", padding: "40px 24px 60px",
      position: "relative", zIndex: 1,
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? "translateY(8px)" : "translateY(0)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
    },
    sectionQ: {
      fontFamily: "'Fraunces', serif",
      fontSize: 26, fontWeight: 700, color: "#F0EAF5",
      marginBottom: 8, lineHeight: 1.25,
    },
    sectionHint: {
      fontSize: 14, color: "#7A7189", marginBottom: 28, lineHeight: 1.5,
    },
    vibeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    vibeCard: (isSelected, color) => ({
      background: isSelected ? `${color}15` : "rgba(255,255,255,0.03)",
      border: `1.5px solid ${isSelected ? `${color}88` : "rgba(255,255,255,0.06)"}`,
      borderRadius: 18, padding: "22px 16px", cursor: "pointer",
      transition: "all 0.25s ease",
      transform: isSelected ? "scale(1.02)" : "scale(1)",
      boxShadow: isSelected ? `0 4px 20px ${color}15` : "none",
    }),
    optionBtn: (isSelected) => ({
      display: "flex", alignItems: "center", gap: 14,
      background: isSelected ? "rgba(255,107,107,0.1)" : "rgba(255,255,255,0.03)",
      border: `1.5px solid ${isSelected ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 14, padding: "16px 18px", cursor: "pointer",
      transition: "all 0.2s ease", width: "100%", textAlign: "left",
      boxShadow: isSelected ? "0 2px 12px rgba(255,107,107,0.08)" : "none",
    }),
    chipRow: { display: "flex", flexWrap: "wrap", gap: 10 },
    chip: (isSelected) => ({
      background: isSelected ? "rgba(255,107,107,0.12)" : "rgba(255,255,255,0.03)",
      border: `1.5px solid ${isSelected ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 100, padding: "10px 18px", cursor: "pointer",
      fontSize: 14, fontWeight: 500, color: isSelected ? "#FF8A7A" : "#7A7189",
      transition: "all 0.2s ease",
    }),
    nextBtn: (enabled) => ({
      display: "block", width: "100%", marginTop: 36,
      background: enabled ? "linear-gradient(135deg, #FF6B6B 0%, #FF8A5C 60%, #FFD166 100%)" : "rgba(255,255,255,0.04)",
      color: enabled ? "#12101A" : "#4A4358",
      border: "none", borderRadius: 14, padding: "16px 24px",
      fontSize: 16, fontWeight: 700, cursor: enabled ? "pointer" : "default",
      transition: "all 0.3s ease",
      boxShadow: enabled ? "0 4px 20px rgba(255,107,107,0.2)" : "none",
    }),
    backBtn: {
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "none", border: "none", color: "#7A7189",
      fontSize: 14, cursor: "pointer", padding: "8px 0", marginBottom: 24,
    },
    resultCard: {
      background: "rgba(255,255,255,0.03)",
      border: "1.5px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: 24, marginBottom: 16,
    },
    matchBadge: (pct) => ({
      display: "inline-flex", alignItems: "center", gap: 6,
      background: pct > 93 ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)",
      color: pct > 93 ? "#FF8A7A" : "#9B90A8",
      borderRadius: 100, padding: "6px 14px",
      fontSize: 13, fontWeight: 700,
    }),
    strainName: {
      fontFamily: "'Fraunces', serif",
      fontSize: 22, fontWeight: 800, color: "#F0EAF5",
      marginTop: 10, marginBottom: 4,
    },
    strainType: {
      fontSize: 13, color: "#7A7189", fontWeight: 600,
      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
    },
    strainVibe: {
      fontSize: 15, color: "#B0A6BC", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic",
    },
    terpTag: (color) => ({
      display: "inline-flex", alignItems: "center", gap: 6,
      background: `${color}14`, border: `1px solid ${color}30`,
      borderRadius: 100, padding: "5px 12px",
      fontSize: 12, fontWeight: 600, color: color,
      marginRight: 6, marginBottom: 6,
    }),
    divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" },
    stepIndicator: { display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 },
    stepDot: (active, completed) => ({
      width: completed || active ? 24 : 8, height: 8, borderRadius: 100,
      background: active ? "linear-gradient(135deg, #FF6B6B, #FF8A5C)" : completed ? "rgba(255,107,107,0.35)" : "rgba(255,255,255,0.08)",
      transition: "all 0.3s ease",
    }),
  };

  // ── SPLASH ──
  if (step === -1) {
    return (
      <div style={st.app} ref={containerRef}>
        <div style={st.noise} />
        <div style={st.ambientOrb1} />
        <div style={st.ambientOrb2} />
        <div style={{ ...st.container, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: "40px 28px" }}>
          <FadeIn delay={200}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
          </FadeIn>
          <FadeIn delay={400}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 44, fontWeight: 800, lineHeight: 1.05, marginBottom: 6, background: "linear-gradient(135deg, #FF6B6B 0%, #FF8A5C 40%, #FFD166 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Find Your Vibe
            </div>
          </FadeIn>
          <FadeIn delay={550}>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7A7189", fontWeight: 600, marginBottom: 24 }}>
              Cannabis Explorer
            </div>
          </FadeIn>
          <FadeIn delay={700}>
            <div style={{ fontSize: 17, color: "#9B90A8", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 16px" }}>
              Answer a few quick questions and we'll match you with the perfect cannabis experience — then show you where to find it.
            </div>
          </FadeIn>
          <FadeIn delay={850}>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 40 }}>
              {["🎯 Personalized", "🔬 Data-backed", "🏪 Shop local"].map((item, i) => (
                <div key={i} style={{ fontSize: 13, color: "#7A7189", fontWeight: 500 }}>{item}</div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={1000}>
            <button
              onClick={() => goNext(0)}
              style={{
                ...st.nextBtn(true),
                maxWidth: 320, margin: "0 auto",
                fontSize: 18, padding: "18px 32px",
              }}
            >
              Let's find your vibe →
            </button>
          </FadeIn>
          <FadeIn delay={1200}>
            <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ECDC4" }} />
              <span style={{ fontSize: 11, color: "#5A5068" }}>Powered by Apiverde Health and UFCW 1189</span>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // ── RESULTS HELPERS ──
  const showEdibles = method === "edible";
  const showBoth = method === "any";
  const edibles = vibe ? EDIBLE_DB[vibe] : [];
  const dosage = level ? DOSAGE_BY_LEVEL[level] : null;

  const edibleBudtenderScript = selectedVibe?.id === "unwind" ? "a relaxing indica edible — something calming for the evening, good for winding down" : selectedVibe?.id === "social" ? "something upbeat and social — a sativa-leaning edible or a cannabis beverage, good energy for hanging out" : selectedVibe?.id === "creative" ? "a sativa edible for creativity — clear-headed, energizing, good for flow state" : selectedVibe?.id === "focused" ? "something functional — maybe a low-dose sativa edible or a CBD:THC blend, productive not foggy" : selectedVibe?.id === "explore" ? "something for a deeper experience — full-spectrum, longer-lasting, good for introspection" : "something mood-boosting — a hybrid edible, euphoric, just feel-good vibes";

  const renderEdibleCards = (delayStart) => (
    <>
      {edibles.map((ed, i) => (
        <FadeIn key={ed.name + i} delay={delayStart + i * 200}>
          <div style={st.resultCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={st.matchBadge(ed.match)}>👤 {ed.match}% of people like you loved this</div>
                <div style={st.strainName}>{ed.icon} {ed.name}</div>
                <div style={st.strainType}>{ed.leaning} · {ed.ratio}</div>
              </div>
              {i === 0 && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,138,92,0.1))",
                  border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "6px 12px",
                  fontSize: 11, fontWeight: 700, color: "#FF8A7A", letterSpacing: "0.05em", whiteSpace: "nowrap",
                }}>TOP PICK</div>
              )}
            </div>
            <div style={st.strainVibe}>"{ed.vibe}"</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)", borderRadius: 10, padding: "8px 14px", flex: "1 1 auto", minWidth: 140 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4ECDC4", fontWeight: 700, marginBottom: 4 }}>Onset</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ECE6F0" }}>{ed.onset}</div>
              </div>
              <div style={{ background: "rgba(196,113,237,0.1)", border: "1px solid rgba(196,113,237,0.25)", borderRadius: 10, padding: "8px 14px", flex: "1 1 auto", minWidth: 140 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#C471ED", fontWeight: 700, marginBottom: 4 }}>Duration</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ECE6F0" }}>{ed.duration}</div>
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
      {dosage && (
        <FadeIn delay={delayStart + edibles.length * 200 + 100}>
          <div style={{ ...st.resultCard, background: "linear-gradient(135deg, rgba(255,209,102,0.06) 0%, rgba(255,138,92,0.04) 100%)", border: "1.5px solid rgba(255,209,102,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>⚖️</span>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #FFD166, #FF8A5C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Your Dosage Guide</div>
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, color: "#F0EAF5", marginBottom: 4 }}>{dosage.range}</div>
            <div style={{ fontSize: 13, color: "#7A7189", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>{dosage.label}</div>
            <div style={{ fontSize: 14, color: "#B0A6BC", lineHeight: 1.6, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "12px 16px", borderLeft: "3px solid rgba(255,209,102,0.4)" }}>{dosage.note}</div>
          </div>
        </FadeIn>
      )}
    </>
  );

  const renderStrainCards = (delayStart) => (
    <>
      {strains.map((strain, i) => (
        <FadeIn key={strain.name} delay={delayStart + i * 200}>
          <div style={st.resultCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={st.matchBadge(strain.match)}>👤 {strain.match}% of people like you loved this</div>
                <div style={st.strainName}>{strain.name}</div>
                <div style={st.strainType}>{strain.type} · THC {strain.thc}</div>
              </div>
              {i === 0 && !showBoth && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(255,107,107,0.15), rgba(255,138,92,0.1))",
                  border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "6px 12px",
                  fontSize: 11, fontWeight: 700, color: "#FF8A7A", letterSpacing: "0.05em", whiteSpace: "nowrap",
                }}>TOP PICK</div>
              )}
            </div>
            <div style={st.strainVibe}>"{strain.vibe}"</div>
            <div style={{ marginBottom: 6, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#5A5068", fontWeight: 700 }}>Terpene Profile</div>
            <div>
              {strain.terpenes.map(t => (
                <span key={t} style={st.terpTag(TERPENE_INFO[t]?.color || "#888")} title={TERPENE_INFO[t]?.note}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: TERPENE_INFO[t]?.color || "#888", flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      ))}
    </>
  );

  const budtenderDelay = showBoth ? 1600 : 900;
  const budtenderScript = showEdibles
    ? `I'm looking for ${edibleBudtenderScript}. I'd like something around ${dosage?.range} THC.${avoid.includes("munchies") ? " Preferably something that doesn't spike my appetite." : ""}${avoid.includes("anxiety") ? " Nothing too racy — I want to avoid anxiety." : ""}${avoid.includes("couch") ? " I still want to be functional, not glued to the couch." : ""}${avoid.includes("dry") ? " Bonus if it's not too drying." : ""}${level === "new" ? " I'm newer to edibles, so something gentle with a clear onset window." : level === "casual" ? " I'm not a daily user, so moderate potency is good." : ""}`
    : `I'm looking for ${selectedVibe?.id === "unwind" ? "something relaxing — indica-leaning, myrcene-heavy, smooth body high without total sedation" : selectedVibe?.id === "social" ? "something upbeat and social — balanced hybrid, limonene-forward, euphoric without getting too heady" : selectedVibe?.id === "creative" ? "something creative and energizing — sativa-dominant, pinene and limonene, clear-headed but inspired" : selectedVibe?.id === "focused" ? "something functional and focused — clean sativa, pinene-forward, clear energy without the jitters" : selectedVibe?.id === "explore" ? "something introspective and expansive — hybrid leaning indica, layered terpene profile, good for going inward" : "something uplifting and euphoric — balanced hybrid, limonene-heavy, pure mood lift"}.${avoid.includes("munchies") ? " Preferably something that doesn't spike my appetite." : ""}${avoid.includes("anxiety") ? " Nothing too racy — I want to avoid anxiety." : ""}${avoid.includes("couch") ? " I still want to be functional, not glued to the couch." : ""}${avoid.includes("dry") ? " Bonus if it's not too drying." : ""}${level === "new" ? " I'm newer to cannabis, so something gentle." : level === "casual" ? " I'm not a daily user, so moderate potency is good." : ""}`;

  // ── RENDER STEPS ──
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <FadeIn delay={100}><div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#7A7189", fontWeight: 600 }}>Cannabis Explorer</div></FadeIn>
              <FadeIn delay={200}><div style={{ fontFamily: "'Fraunces', serif", fontSize: 40, fontWeight: 800, lineHeight: 1.05, marginTop: 8, background: "linear-gradient(135deg, #FF6B6B 0%, #FF8A5C 40%, #FFD166 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Find Your Vibe</div></FadeIn>
              <FadeIn delay={350}><div style={{ fontSize: 16, color: "#9B90A8", marginTop: 12, lineHeight: 1.55 }}>Tell us what you're looking for and we'll match you with something you'll love.</div></FadeIn>
            </div>
            <FadeIn delay={450}>
              <div style={st.sectionQ}>What sounds good right now?</div>
              <div style={st.sectionHint}>Pick the vibe that fits your mood.</div>
            </FadeIn>
            <div style={st.vibeGrid}>
              {EXPERIENCE_VIBES.map((v, i) => (
                <FadeIn key={v.id} delay={500 + i * 80}>
                  <div style={st.vibeCard(vibe === v.id, v.color)} onClick={() => setVibe(v.id)}>
                    <div style={{ fontSize: 30, marginBottom: 10 }}>{v.emoji}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#F0EAF5", marginBottom: 4 }}>{v.label}</div>
                    <div style={{ fontSize: 12, color: "#7A7189", lineHeight: 1.4 }}>{v.desc}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={1000}>
              <button style={st.nextBtn(!!vibe)} onClick={() => vibe && goNext(1)}>
                {vibe ? "Let's go →" : "Pick a vibe to continue"}
              </button>
            </FadeIn>
          </>
        );

      case 1:
        return (
          <>
            <button style={st.backBtn} onClick={() => goNext(0)}>← Back</button>
            <div style={st.stepIndicator}>{[0,1,2,3].map(i => <div key={i} style={st.stepDot(i===0, false)} />)}</div>
            <FadeIn delay={100}>
              <div style={st.sectionQ}>How well do you know your way around cannabis?</div>
              <div style={st.sectionHint}>No judgment — this helps us dial in the right recommendations.</div>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EXPERIENCE_LEVELS.map((l, i) => (
                <FadeIn key={l.id} delay={200 + i * 100}>
                  <div style={st.optionBtn(level === l.id)} onClick={() => setLevel(l.id)}>
                    <span style={{ fontSize: 22 }}>{l.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "#ECE6F0" }}>{l.label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={650}><button style={st.nextBtn(!!level)} onClick={() => level && goNext(2)}>{level ? "Next →" : "Select one to continue"}</button></FadeIn>
          </>
        );

      case 2:
        return (
          <>
            <button style={st.backBtn} onClick={() => goNext(1)}>← Back</button>
            <div style={st.stepIndicator}>{[0,1,2,3].map(i => <div key={i} style={st.stepDot(i===1, i<1)} />)}</div>
            <FadeIn delay={100}>
              <div style={st.sectionQ}>How do you like to consume?</div>
              <div style={st.sectionHint}>Different methods, different experience. Pick your style.</div>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {METHODS.map((m, i) => (
                <FadeIn key={m.id} delay={200 + i * 100}>
                  <div style={st.optionBtn(method === m.id)} onClick={() => setMethod(m.id)}>
                    <span style={{ fontSize: 22 }}>{m.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "#ECE6F0" }}>{m.label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={650}><button style={st.nextBtn(!!method)} onClick={() => method && goNext(3)}>{method ? "Next →" : "Select one to continue"}</button></FadeIn>
          </>
        );

      case 3:
        return (
          <>
            <button style={st.backBtn} onClick={() => goNext(2)}>← Back</button>
            <div style={st.stepIndicator}>{[0,1,2,3].map(i => <div key={i} style={st.stepDot(i===2, i<2)} />)}</div>
            <FadeIn delay={100}>
              <div style={st.sectionQ}>When are you partaking?</div>
              <div style={st.sectionHint}>Time of day changes the game.</div>
            </FadeIn>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {TIMING.map((t, i) => (
                <FadeIn key={t.id} delay={200 + i * 100}>
                  <div style={st.optionBtn(timing === t.id)} onClick={() => setTiming(t.id)}>
                    <span style={{ fontSize: 22 }}>{t.icon}</span>
                    <span style={{ fontSize: 15, fontWeight: 500, color: "#ECE6F0" }}>{t.label}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={650}><button style={st.nextBtn(!!timing)} onClick={() => timing && goNext(4)}>{timing ? "Next →" : "Select one to continue"}</button></FadeIn>
          </>
        );

      case 4:
        return (
          <>
            <button style={st.backBtn} onClick={() => goNext(3)}>← Back</button>
            <div style={st.stepIndicator}>{[0,1,2,3].map(i => <div key={i} style={st.stepDot(i===3, i<3)} />)}</div>
            <FadeIn delay={100}>
              <div style={st.sectionQ}>Anything you want to avoid?</div>
              <div style={st.sectionHint}>We'll steer you away from strains known for these.</div>
            </FadeIn>
            <FadeIn delay={250}>
              <div style={st.chipRow}>
                {AVOID.map(a => (
                  <div key={a.id} style={st.chip(avoid.includes(a.id))} onClick={() => toggleAvoid(a.id)}>{a.label}</div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={450}><button style={st.nextBtn(avoid.length > 0)} onClick={() => avoid.length > 0 && goNext(5)}>{avoid.length > 0 ? "Show me what you've got →" : "Select at least one"}</button></FadeIn>
          </>
        );

      case 5:
        return (
          <>
            <button style={st.backBtn} onClick={reset}>← Start over</button>

            <FadeIn delay={100}>
              <div style={{ textAlign: "center", marginBottom: 36 }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>{selectedVibe?.emoji}</div>
                <div style={st.sectionQ}>Here's what we'd reach for</div>
                <div style={st.sectionHint}>
                  Based on your {selectedVibe?.label.toLowerCase()} vibe · {EXPERIENCE_LEVELS.find(l => l.id === level)?.label} · {METHODS.find(m => m.id === method)?.label} · {TIMING.find(t => t.id === timing)?.label}
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 100, padding: "5px 14px", fontSize: 11, color: "#7A7189", fontWeight: 500 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ECDC4" }} />
                  Powered by Apiverde Health and UFCW 1189
                </div>
              </div>
            </FadeIn>

            {showBoth && <FadeIn delay={250}><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A7189", marginBottom: 16, paddingLeft: 4 }}>🌸 Flower</div></FadeIn>}
            {!showEdibles && renderStrainCards(300)}
            {showBoth && (
              <>
                <FadeIn delay={950}><div style={{ ...st.divider, margin: "28px 0" }} /><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A7189", marginBottom: 16, paddingLeft: 4 }}>🍫 Edibles</div></FadeIn>
                {renderEdibleCards(1000)}
              </>
            )}
            {showEdibles && renderEdibleCards(300)}

            {/* Budtender Cheat Sheet */}
            <FadeIn delay={budtenderDelay}>
              <div style={{ ...st.resultCard, background: "linear-gradient(135deg, rgba(255,107,107,0.06) 0%, rgba(196,113,237,0.04) 50%, rgba(78,205,196,0.04) 100%)", border: "1.5px solid rgba(255,107,107,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>🗣️</span>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", background: "linear-gradient(135deg, #FF6B6B, #FF8A5C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Your Budtender Cheat Sheet</div>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#F0EAF5", marginBottom: 12, lineHeight: 1.3 }}>
                  {showEdibles ? "Not sure what's in stock? Show this to your budtender." : "Can't find these strains? Show this to your budtender."}
                </div>
                <div style={{ fontSize: 14, color: "#B0A6BC", lineHeight: 1.7, marginBottom: 18, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "16px 18px", borderLeft: "3px solid rgba(255,107,107,0.4)" }}>
                  "{budtenderScript}"
                </div>
                {!showEdibles && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#5A5068", fontWeight: 700, marginBottom: 8 }}>Look for these terpenes</div>
                    <div>
                      {(selectedVibe?.id === "unwind" ? ["Myrcene", "Caryophyllene", "Linalool"] :
                        selectedVibe?.id === "social" ? ["Limonene", "Caryophyllene", "Myrcene"] :
                        selectedVibe?.id === "creative" ? ["Pinene", "Limonene", "Terpinolene"] :
                        selectedVibe?.id === "focused" ? ["Pinene", "Limonene", "Caryophyllene"] :
                        selectedVibe?.id === "explore" ? ["Caryophyllene", "Linalool", "Myrcene"] :
                        ["Limonene", "Caryophyllene", "Humulene"]).map(t => (
                        <span key={t} style={st.terpTag(TERPENE_INFO[t]?.color || "#888")}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: TERPENE_INFO[t]?.color || "#888", flexShrink: 0 }} />
                          {t} — {TERPENE_INFO[t]?.note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={st.divider} />
                <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => {}}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, rgba(78,205,196,0.12), rgba(69,230,160,0.08))", border: "1px solid rgba(78,205,196,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🏪</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#F0EAF5" }}>Visit your local Green Goods</div>
                    <div style={{ fontSize: 13, color: "#7A7189" }}>Union workers who know their craft</div>
                  </div>
                  <div style={{ fontSize: 18, color: "#5A5068" }}>→</div>
                </div>
              </div>
            </FadeIn>

            {/* Check-in */}
            <FadeIn delay={budtenderDelay + 200}>
              <div style={{ ...st.resultCard, background: "linear-gradient(135deg, rgba(78,205,196,0.06) 0%, rgba(69,230,160,0.03) 100%)", border: "1.5px solid rgba(78,205,196,0.18)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 24 }}>🔄</span>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4ECDC4" }}>Help Us Get Smarter</div>
                </div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 800, color: "#F0EAF5", marginBottom: 10, lineHeight: 1.3 }}>Can we check in after you try it?</div>
                <div style={{ fontSize: 14, color: "#B0A6BC", lineHeight: 1.65, marginBottom: 20 }}>A quick follow-up helps us learn what's actually working for people like you — so the next recommendation is even better. No spam, just one quick check-in.</div>
                {!checkinResponse ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setCheckinResponse("yes")} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, rgba(78,205,196,0.2), rgba(69,230,160,0.12))", color: "#4ECDC4", fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Yeah, check in with me</button>
                    <button onClick={() => setCheckinResponse("no")} style={{ flex: 1, padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.08)", cursor: "pointer", background: "transparent", color: "#7A7189", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Maybe next time</button>
                  </div>
                ) : checkinResponse === "yes" ? (
                  <div style={{ background: "rgba(78,205,196,0.08)", borderRadius: 12, padding: "16px 18px", borderLeft: "3px solid rgba(78,205,196,0.4)" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#4ECDC4", marginBottom: 4 }}>You're in 🙌</div>
                    <div style={{ fontSize: 13, color: "#9B90A8", lineHeight: 1.5 }}>We'll send a quick check-in after you've had a chance to try your pick. Your feedback makes the recommendations better for everyone.</div>
                  </div>
                ) : (
                  <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 13, color: "#7A7189", lineHeight: 1.5 }}>No worries — you can always come back and share your experience later. Enjoy! ✌️</div>
                  </div>
                )}
              </div>
            </FadeIn>

            {/* Share + Start Over */}
            <FadeIn delay={budtenderDelay + 400}>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <button onClick={handleShare} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 16px", borderRadius: 14, border: "1.5px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.06)", color: "#FF8A7A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease" }}>
                  {shared ? "✓ Copied!" : "📤 Share my picks"}
                </button>
                <button onClick={reset} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 16px", borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#9B90A8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s ease" }}>
                  🔄 New vibe
                </button>
              </div>
            </FadeIn>

            <FadeIn delay={budtenderDelay + 500}>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#4A4358", lineHeight: 1.6 }}>
                Recommendations are personalized suggestions, not medical advice.<br />
                Always start low and go slow{showEdibles || showBoth ? " — edibles take longer to kick in than you expect" : ", especially with new strains"}.
              </div>
            </FadeIn>
          </>
        );

      default: return null;
    }
  };

  return (
    <div style={st.app} ref={containerRef}>
      <div style={st.noise} />
      <div style={st.ambientOrb1} />
      <div style={st.ambientOrb2} />
      <div style={st.container}>
        {renderStep()}
      </div>
    </div>
  );
}
