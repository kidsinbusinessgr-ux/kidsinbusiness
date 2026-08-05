import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────
type Screen = "hub" | "m1" | "m2" | "m3" | "m4";

// ── Characters ─────────────────────────────────────────────────────────────────
const CHARS = [
  { trait:"Δημιουργικός", emoji:"🎨", color:"bg-rose-500",   grad:"from-rose-400 to-pink-600",    desc:"Βλέπει ευκαιρίες παντού!" },
  { trait:"Καινοτόμος",   emoji:"💡", color:"bg-sky-600",    grad:"from-sky-400 to-blue-600",     desc:"Σκέφτεται πέρα από τα όρια!" },
  { trait:"Οραματιστής",  emoji:"🌟", color:"bg-violet-600", grad:"from-violet-500 to-purple-700", desc:"Χτίζει το μέλλον σήμερα!" },
];

// ── Businesses ─────────────────────────────────────────────────────────────────
const BIZ = [
  { id:"bakery",  name:"Φούρνος",        emoji:"🥖", buy:1800, profit:280, expense:100, desc:"Φρέσκα ψωμιά κάθε πρωί!" },
  { id:"petshop", name:"Pet Shop",       emoji:"🐕", buy:2000, profit:260, expense:90,  desc:"Χαρά για τα ζωάκια!"      },
  { id:"hair",    name:"Κομμωτήριο",     emoji:"💈", buy:1500, profit:210, expense:75,  desc:"Στυλ για όλους!"           },
  { id:"gym",     name:"Γυμναστήριο",    emoji:"💪", buy:2500, profit:340, expense:120, desc:"Υγεία και δύναμη!"         },
  { id:"spa",     name:"Spa Center",     emoji:"🧖", buy:2200, profit:270, expense:95,  desc:"Χαλάρωση και ομορφιά!"    },
  { id:"toys",    name:"Μαγαζί με Παιχνίδια",emoji:"🎮", buy:1700, profit:240, expense:80,  desc:"Παιχνίδια για όλες τις ηλικίες!" },
];

// ── Module 2 Scenarios ─────────────────────────────────────────────────────────
const M2 = [
  { biz:"🥖 Φούρνος",         income:450, expense:150, fact:"Ο φούρνος πουλάει καλά αλλά πρέπει να αγοράζει αλεύρι!" },
  { biz:"🐕 Pet Shop",         income:300, expense:320, fact:"Τα φάρμακα για ζώα κόστισαν πολύ αυτόν τον μήνα." },
  { biz:"💪 Γυμναστήριο",      income:500, expense:200, fact:"Πολλά νέα μέλη εγγράφηκαν τον Ιανουάριο!" },
  { biz:"💈 Κομμωτήριο",       income:210, expense:240, fact:"Αγοράστηκαν νέα προϊόντα ομορφιάς." },
  { biz:"🧖 Spa Center",       income:380, expense:170, fact:"Οι πελάτες αγαπούν τα νέα θεραπευτικά πακέτα." },
  { biz:"🎮 Μαγαζί με Παιχνίδια",   income:290, expense:290, fact:"Εσοδα και έξοδα ισοφαρίστηκαν αυτόν τον μήνα." },
  { biz:"🏪 Super Market",     income:600, expense:250, fact:"Σεζόν διακοπών — πολύ κόσμος!" },
  { biz:"🚙 Rent a Car",       income:420, expense:500, fact:"Επισκευές σε αυτοκίνητα ανέβασαν τα έξοδα." },
];

// ── Module 3 Risk Cards ────────────────────────────────────────────────────────
const M3 = [
  {
    emoji:"🔥", title:"Ευκαιρία Χορηγίας!",
    story:"Μια μεγάλη εταιρεία θέλει να χορηγήσει την επιχείρησή σου. Ζητά να βάλει το λογότυπό της στην πρόσοψη.",
    a:{ text:"Δέχομαι! 🤝", delta:+600, explain:"Τέλεια! Η χρηματοδότηση βοηθάει στην ανάπτυξη!" },
    b:{ text:"Ευχαριστώ αλλά όχι", delta:+0, explain:"Διατηρείς ανεξαρτησία — αλλά χάνεις χρήματα." },
  },
  {
    emoji:"⛈️", title:"Κακός Καιρός!",
    story:"Μια μεγάλη καταιγίδα χτύπησε την περιοχή. Λίγοι πελάτες ήρθαν σήμερα.",
    a:{ text:"Κλείνω προσωρινά 🚪", delta:-100, explain:"Σωστή απόφαση! Λιγότερη ζημιά από τη λειτουργία χωρίς πελάτες." },
    b:{ text:"Μένω ανοιχτός 💪",    delta:-300, explain:"Ατυχία! Τα έξοδα τρέχουν χωρίς έσοδα." },
  },
  {
    emoji:"🏆", title:"Βραβείο Επιχείρησης!",
    story:"Σε ψήφισαν για το βραβείο 'Καλύτερη Επιχείρηση της Χρονιάς'! Χρειάζεται λίγος χρόνος για συμμετοχή.",
    a:{ text:"Συμμετέχω! 🏆",       delta:+500, explain:"Μπράβο! Η αναγνωρισιμότητα φέρνει νέους πελάτες!" },
    b:{ text:"Είμαι πολυάσχολος 😅", delta:+50, explain:"Εντάξει, αλλά χάνεις μια μεγάλη ευκαιρία!" },
  },
  {
    emoji:"💡", title:"Νέα Ιδέα!",
    story:"Σκέφτεσαι να ανανεώσεις τον κατάλογο προϊόντων. Χρειάζεται επένδυση 300€ αλλά μπορεί να φέρει περισσότερους πελάτες.",
    a:{ text:"Επενδύω 300€ 🚀",   delta:+500, explain:"Η καινοτομία πληρώνει! Κέρδισες 200€ καθαρό κέρδος." },
    b:{ text:"Μένω ως έχω 😴",    delta:+0,   explain:"Ασφαλής επιλογή, αλλά χάνεις ευκαιρία ανάπτυξης." },
  },
  {
    emoji:"📉", title:"Λίγοι Πελάτες...",
    story:"Αυτόν τον μήνα ήρθαν λιγότεροι πελάτες. Τι κάνεις για να τους προσελκύσεις;",
    a:{ text:"Κάνω προσφορές 🎁",    delta:-100, explain:"Εξυπνάδα! Μικρότερο κέρδος τώρα, αλλά περισσότεροι πελάτες μακροπρόθεσμα!" },
    b:{ text:"Διαφημίζομαι 📢",       delta:-150, explain:"Η διαφήμιση κοστίζει αλλά χτίζει την επιχείρηση!" },
  },
];

// ── Module 4 Events ────────────────────────────────────────────────────────────
const M4_EVENTS = [
  { emoji:"🔥", title:"Χορηγία!",      a:{ text:"Δέχομαι",  delta:+400 }, b:{ text:"Αρνούμαι",  delta:+0   } },
  { emoji:"⛈️", title:"Κακός Καιρός", a:{ text:"Κλείνω",   delta:-100 }, b:{ text:"Ανοιχτός",  delta:-280 } },
  { emoji:"🏆", title:"Βραβείο!",      a:{ text:"Συμμετέχω",delta:+350 }, b:{ text:"Αρνούμαι",  delta:+0   } },
  { emoji:"💡", title:"Νέα Ιδέα!",     a:{ text:"Επενδύω",  delta:+300 }, b:{ text:"Μένω",       delta:+0   } },
  { emoji:"💰", title:"Επιδότηση!",    a:{ text:"Αποδέχομαι",delta:+300},b:{ text:"Αρνούμαι",  delta:+0   } },
  { emoji:"🎉", title:"Γιορτές!",      a:{ text:"Εκπτώσεις",delta:-80  }, b:{ text:"Κανονικά",   delta:+200 } },
];


// ── Module 1 — Αποταμίευση & Στόχος ──────────────────────────────────────────
const M1_GOALS = [
  { emoji:"🚲", name:"Ποδήλατο",     price:45, grad:"from-emerald-400 to-teal-600"   },
  { emoji:"🎮", name:"Βιντεοπαιχνίδι", price:30, grad:"from-blue-400 to-indigo-600"  },
  { emoji:"🎒", name:"Νέο Σακίδιο",  price:20, grad:"from-violet-500 to-purple-700"  },
];
const WEEKLY_INCOME = 10;
type M1Item = { emoji:string; name:string; price:number; type:"need"|"want" };
const M1_WEEKS: { items:M1Item[]; bonus?:number; bonusText?:string }[] = [
  { items:[
    { emoji:"🥗", name:"Σχολικό γεύμα",    price:2, type:"need" },
    { emoji:"🎬", name:"Κινηματογράφος",   price:5, type:"want" },
    { emoji:"🍦", name:"Παγωτό",           price:1, type:"want" },
    { emoji:"📚", name:"Βιβλίο ιστοριών", price:3, type:"want" },
  ]},
  { items:[
    { emoji:"✏️", name:"Σχολικά είδη",     price:3, type:"need" },
    { emoji:"🎮", name:"Αγαπημένο σνακ",  price:2, type:"want" },
    { emoji:"☕", name:"Smoothie",          price:2, type:"want" },
    { emoji:"🃏", name:"Κάρτες συλλογής", price:4, type:"want" },
  ]},
  { items:[
    { emoji:"🥗", name:"Σχολικό γεύμα",   price:2, type:"need" },
    { emoji:"🍕", name:"Πίτσα με παρέα",  price:4, type:"want" },
    { emoji:"🎵", name:"Τραγούδι online", price:1, type:"want" },
    { emoji:"🎨", name:"Χρώματα",         price:3, type:"want" },
  ]},
  { bonus:5, bonusText:"🎂 Γενέθλια! Δώρο +5€",
    items:[
    { emoji:"🚌", name:"Εκδρομή σχολείου", price:3, type:"need" },
    { emoji:"🎲", name:"Επιτραπέζιο",      price:5, type:"want" },
    { emoji:"🧋", name:"Bubble tea",       price:2, type:"want" },
  ]},
  { items:[
    { emoji:"🚌", name:"Μεταφορές",        price:2, type:"need" },
    { emoji:"🍟", name:"Fast food",        price:3, type:"want" },
    { emoji:"🎠", name:"Λούνα παρκ",      price:5, type:"want" },
    { emoji:"🪀", name:"Μικρό παιχνίδι",  price:2, type:"want" },
  ]},
  { items:[
    { emoji:"🥗", name:"Σχολικό γεύμα",   price:2, type:"need" },
    { emoji:"🎁", name:"Δώρο για φίλο",   price:4, type:"want" },
    { emoji:"📱", name:"Θήκη κινητού",    price:3, type:"want" },
    { emoji:"🍰", name:"Γλυκό",           price:2, type:"want" },
  ]},
];

// ── Audio helper ──────────────────────────────────────────────────────────────
let _muted = false;
let _currentAudio: HTMLAudioElement | null = null;

const playClip = (clip: string) => {
  if (_muted) return;
  if (_currentAudio) { _currentAudio.pause(); _currentAudio.currentTime = 0; }
  _currentAudio = new Audio(`/audio/${clip}.m4a`);
  _currentAudio.play().catch(() => {});
};

// speak() used only for dynamic M4 event narration (variable text)
const speak = (text: string) => {
  if (_muted) return;
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "el-GR"; u.rate = 0.80; u.pitch = 1.7;
  window.speechSynthesis.speak(u);
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const net = (profit: number, expense: number) => profit - expense;
const fmt = (n: number) => n.toLocaleString("el-GR");

// ── Sub-components ─────────────────────────────────────────────────────────────
const BackBtn = ({ onBack }: { onBack: () => void }) => (
  <button onClick={onBack}
    className="absolute top-3 left-3 bg-white/20 hover:bg-white/30 text-white rounded-full px-3 py-1.5 text-sm font-bold border border-white/30">
    ← Πίσω
  </button>
);

const ProgressBar = ({ step, total, color="bg-white" }: { step:number; total:number; color?:string }) => (
  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
    <div className={`h-full ${color} rounded-full transition-all duration-500`}
      style={{ width: `${(step/total)*100}%` }} />
  </div>
);

const CharCard = ({ char, selected, onSelect }: { char:typeof CHARS[0]; selected:boolean; onSelect:()=>void }) => (
  <button onClick={onSelect}
    className={`rounded-2xl p-2 text-center transition-all duration-200 border-4 w-full ${
      selected ? "border-white shadow-2xl bg-white/30" : "border-white/30 bg-white/10 hover:bg-white/20"
    }`}>
    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.grad} flex items-center justify-center text-xl mx-auto mb-1 shadow-lg ring-2 ring-white/50`}>
      {char.emoji}
    </div>
    <div className="font-black text-white text-[10px] leading-tight break-words">{char.trait}</div>
    <div className="text-white/70 text-[8px] mt-0.5 leading-tight">{char.desc}</div>
    {selected && <div className="mt-1 bg-white text-purple-700 rounded-full text-[7px] font-black px-1 py-0.5">✓ Επιλεγμένο</div>}
  </button>
);

const BizCard = ({ biz, cash, selected, onSelect }: { biz:typeof BIZ[0]; cash:number; selected:boolean; onSelect:()=>void }) => {
  const canAfford = cash >= biz.buy;
  const netP = net(biz.profit, biz.expense);
  return (
    <button onClick={canAfford ? onSelect : undefined}
      className={`rounded-2xl p-3 text-left transition-all duration-200 border-2 ${
        selected ? "border-teal-400 bg-teal-50 scale-102 shadow-lg" :
        canAfford ? "border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 bg-white" :
        "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
      }`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">{biz.emoji}</span>
        <div>
          <div className="font-black text-gray-800 text-sm">{biz.name}</div>
          <div className="text-xs text-gray-500">{biz.desc}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 text-center text-xs">
        <div className="bg-gray-100 rounded-lg p-1.5">
          <div className="text-gray-500">Κόστος</div>
          <div className="font-black text-gray-800">{fmt(biz.buy)}€</div>
        </div>
        <div className="bg-emerald-100 rounded-lg p-1.5">
          <div className="text-gray-500">Έσοδα</div>
          <div className="font-black text-emerald-700">+{biz.profit}€</div>
        </div>
        <div className={`rounded-lg p-1.5 ${netP>0?"bg-blue-100":"bg-red-100"}`}>
          <div className="text-gray-500">Κέρδος</div>
          <div className={`font-black ${netP>0?"text-blue-700":"text-red-600"}`}>{netP>0?"+":""}{netP}€</div>
        </div>
      </div>
      {!canAfford && <div className="text-[10px] text-red-500 font-bold mt-1 text-center">Δεν φτάνουν τα χρήματα</div>}
    </button>
  );
};

const ResultBadge = ({ correct }: { correct: boolean }) => (
  <div className={`text-center rounded-2xl py-3 px-4 font-black text-white text-lg ${correct ? "bg-emerald-500" : "bg-rose-500"}`}>
    {correct ? "✅ Σωστά!" : "❌ Λάθος!"}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MarketGame() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("hub");

  // ── Module 1 state (Αποταμίευση & Στόχος)
  const [m1Phase,   setM1Phase]   = useState<"goal"|"week"|"done">("goal");
  const [m1GoalIdx, setM1GoalIdx] = useState(0);
  const [m1Savings, setM1Savings] = useState(0);
  const [m1Week,    setM1Week]    = useState(0);
  const [m1Bought,  setM1Bought]  = useState<boolean[]>([]);
  const [m1WeekLog, setM1WeekLog] = useState<number[]>([]);
  const [muted,     setMuted]     = useState(false);

  // ── Module 2 state
  const [m2Step,   setM2Step]   = useState(0);
  const [m2Answer, setM2Answer] = useState<"profit"|"loss"|"zero"|null>(null);
  const [m2Score,  setM2Score]  = useState(0);
  const [m2Order,  setM2Order]  = useState<typeof M2>(M2);

  // ── Module 3 state
  const [m3Step,   setM3Step]   = useState(0);
  const [m3Cash,   setM3Cash]   = useState(2000);
  const [m3Result, setM3Result] = useState<{ delta:number; explain:string }|null>(null);

  // ── Module 4 state
  const [m4Phase,  setM4Phase]  = useState<"char"|"biz"|"day"|"event"|"eventResult"|"done">("char");
  const [m4Char,   setM4Char]   = useState(0);
  const [m4Biz,    setM4Biz]    = useState<typeof BIZ[0]|null>(null);
  const [m4BotBiz, setM4BotBiz] = useState<typeof BIZ[0]>(BIZ[1]);
  const [m4Player, setM4Player] = useState(3500);
  const [m4Bot,    setM4Bot]    = useState(3500);
  const [m4Round,  setM4Round]  = useState(1);
  const [m4Event,  setM4Event]  = useState<typeof M4_EVENTS[0]|null>(null);
  const [m4EvRes,  setM4EvRes]  = useState<{pDelta:number; bDelta:number}|null>(null);

  // sync muted flag to module-level var for speak()
  useEffect(() => { _muted = muted; }, [muted]);

  // auto-narrate when entering each module
  useEffect(() => {
    if (screen === "hub")  { setTimeout(()=>playClip("hub"), 300); return; }
    if (screen === "m2")   { setTimeout(()=>playClip("m2-start"), 300); return; }
    if (screen === "m3")   { setTimeout(()=>playClip("m3-start"), 300); return; }
    if (screen === "m4")   { setTimeout(()=>playClip("m4-start"), 300); return; }
  }, [screen]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  const goHub = () => {
    window.speechSynthesis?.cancel();
    setScreen("hub");
    setM1Phase("goal"); setM1GoalIdx(0); setM1Savings(0); setM1Week(0); setM1Bought([]); setM1WeekLog([]);
    setM2Step(0); setM2Answer(null); setM2Score(0); setM2Order(shuffle(M2));
    setM3Step(0); setM3Cash(2000); setM3Result(null);
    setM4Phase("char"); setM4Biz(null); setM4Player(3500); setM4Bot(3500); setM4Round(1); setM4Event(null); setM4EvRes(null);
    setM4BotBiz(BIZ[Math.floor(Math.random()*BIZ.length)]);
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // HUB
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "hub") {
    const modules = [
      { id:"m1" as Screen, emoji:"🐷", title:"Ο Κουμπαράς μου", desc:"Αποτάμιευσε χρήματα και φτάσε τον στόχο σου!", color:"from-emerald-400 to-teal-600", bg:"bg-emerald-500" },
      { id:"m2" as Screen, emoji:"📊", title:"Κέρδος ή Ζημιά;",    desc:"Ξέρεις να υπολογίζεις αν η επιχείρηση κερδίζει;", color:"from-blue-400 to-indigo-600",  bg:"bg-blue-500"   },
      { id:"m3" as Screen, emoji:"⚠️", title:"Κάρτες Ρίσκου",     desc:"Αντιμετώπισε εκπλήξεις και πάρε αποφάσεις!",    color:"from-orange-400 to-rose-500",  bg:"bg-orange-500" },
      { id:"m4" as Screen, emoji:"🏆", title:"Μεγάλος Επιχειρηματίας", desc:"Παίξε εναντίον ενός αντιπάλου για 6 μέρες!", color:"from-violet-500 to-purple-700", bg:"bg-violet-600" },
    ];
    return (
      <div className="min-h-screen flex flex-col items-center game-font"
        style={{ background: "linear-gradient(160deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)" }}>
        {/* Header */}
        <div className="text-center pt-10 pb-6 px-4">
          <div className="text-5xl mb-2" style={{ filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}>🚀</div>
          <h1 className="text-4xl font-black text-white leading-none" style={{ textShadow:"3px 3px 0 rgba(0,0,0,0.3)" }}>START-UP</h1>
          <h2 className="text-3xl font-black text-amber-300 leading-none" style={{ textShadow:"2px 2px 0 rgba(0,0,0,0.3)" }}>ADVENTURE</h2>
          <p className="text-white/60 text-sm mt-2 font-semibold">Διάλεξε ενότητα για να παίξεις!</p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-2 gap-3 px-4 w-full max-w-sm">
          {modules.map(m => (
            <button key={m.id} onClick={() => { setScreen(m.id); playClip(m.id + "-start"); }}
              className="rounded-3xl overflow-hidden shadow-xl active:scale-95 transition-transform text-left">
              <div className={`bg-gradient-to-br ${m.color} p-4 pb-3`}>
                <div className="text-4xl mb-2">{m.emoji}</div>
                <div className="font-black text-white text-sm leading-tight">{m.title}</div>
              </div>
              <div className="bg-white px-3 py-2">
                <p className="text-gray-600 text-[11px] leading-snug">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button onClick={() => navigate("/book")} className="text-white/40 text-xs hover:text-white/60">← Πίσω στο βιβλίο</button>
          <button onClick={() => setMuted(m => !m)}
            className="text-white/40 text-xs hover:text-white/60 border border-white/20 rounded-full px-3 py-1">
            {muted ? "🔇 Ήχος OFF" : "🔊 Ήχος ON"}
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODULE 1 — Αποταμίευση & Στόχος
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m1") {
    const WEEKS = 6;
    const goal = M1_GOALS[m1GoalIdx];
    const weekData = M1_WEEKS[m1Week] ?? M1_WEEKS[0];
    const weekIncome = WEEKLY_INCOME + (weekData.bonus ?? 0);
    const needsCost = weekData.items.filter(i=>i.type==="need").reduce((s,i)=>s+i.price,0);
    const wantItems = weekData.items.filter(i=>i.type==="want");
    const selectedWantsCost = wantItems.reduce((s,item,idx)=> s+(m1Bought[idx]?item.price:0), 0);
    const weekSaved = weekIncome - needsCost - selectedWantsCost;
    const projectedTotal = m1Savings + weekSaved;
    const resetWeekBought = () => setM1Bought(Array(wantItems.length).fill(false));

    return (
      <div className="min-h-screen flex flex-col game-font" style={{ background:"linear-gradient(160deg,#d1fae5 0%,#a7f3d0 50%,#6ee7b7 100%)" }}>
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 px-4 pt-10 pb-4 text-white">
          <BackBtn onBack={goHub} />
          <div className="text-center">
            <div className="text-lg font-black">🏦 Αποταμίευση & Στόχος</div>
            {m1Phase === "week" && (
              <>
                <ProgressBar step={m1Week} total={WEEKS} />
                <div className="text-xs mt-1 opacity-80">Εβδομάδα {m1Week+1} από {WEEKS} · Αποταμιεύτηκαν: {m1Savings}€</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 gap-3 items-center justify-center">

          {/* PHASE: goal select */}
          {m1Phase === "goal" && (
            <>
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-sm w-full text-center">
                <div className="text-5xl mb-2">🐷</div>
                <h2 className="text-2xl font-black text-emerald-700 mb-1">Ο Κουμπαράς μου!</h2>
                <p className="text-gray-600 text-sm mb-4">Κάθε εβδομάδα κερδίζεις <strong className="text-emerald-700">{WEEKLY_INCOME}€</strong> χαρτζιλίκι. Επίλεξε τι θέλεις να αγοράσεις και αποφάσισε τι αξίζει να ξοδέψεις!</p>
                <p className="font-black text-gray-700 mb-3">Ποιος είναι ο στόχος σου;</p>
                <div className="flex flex-col gap-2">
                  {M1_GOALS.map((g, i) => (
                    <button key={i} onClick={() => setM1GoalIdx(i)}
                      className={`rounded-2xl p-3 flex items-center gap-3 border-4 transition-all ${m1GoalIdx===i?"border-emerald-500 bg-emerald-50 shadow-lg":"border-gray-200 bg-white hover:border-emerald-300"}`}>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${g.grad} flex items-center justify-center text-2xl shadow-md`}>{g.emoji}</div>
                      <div className="text-left flex-1">
                        <div className="font-black text-gray-800">{g.name}</div>
                        <div className="text-sm text-gray-500">Κόστος: <strong className="text-emerald-700">{g.price}€</strong></div>
                      </div>
                      {m1GoalIdx===i && <div className="text-emerald-600 font-black text-xl">✓</div>}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => {
                  playClip("m1-start");
                  setM1Phase("week"); setM1Week(0); setM1Savings(0); setM1WeekLog([]); resetWeekBought();
                }}
                className="w-full max-w-sm py-4 rounded-2xl font-black text-white text-lg shadow-xl active:scale-95"
                style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 6px 0 #047857" }}>
                Ξεκινάω! 🚀
              </button>
            </>
          )}

          {/* PHASE: week */}
          {m1Phase === "week" && (
            <>
              {/* Goal progress */}
              <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${goal.grad} flex items-center justify-center text-2xl shadow`}>{goal.emoji}</div>
                  <div className="flex-1">
                    <div className="font-black text-gray-800">{goal.name}</div>
                    <div className="text-xs text-gray-500">Στόχος: <strong>{goal.price}€</strong></div>
                    <div className="mt-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                        style={{ width:`${Math.min(100,(m1Savings/goal.price)*100)}%` }} />
                    </div>
                    <div className="text-xs text-emerald-700 font-black mt-0.5">{m1Savings}€ / {goal.price}€</div>
                  </div>
                </div>
              </div>

              {/* Week card */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-sm">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white text-center">
                  <div className="font-black text-lg">📅 Εβδομάδα {m1Week+1}</div>
                  <div className="text-sm opacity-80">Κέρδισες: <strong>{weekIncome}€</strong>
                    {weekData.bonus ? <span className="ml-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">{weekData.bonusText}</span> : null}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {/* Needs (mandatory) */}
                  {weekData.items.filter(i=>i.type==="need").map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl p-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1">
                        <div className="font-black text-sm text-gray-800">{item.name}</div>
                        <div className="text-[10px] bg-rose-200 text-rose-700 rounded-full px-2 py-0.5 inline-block font-bold">ΑΝΑΓΚΗ</div>
                      </div>
                      <div className="font-black text-rose-600">−{item.price}€</div>
                      <div className="text-rose-400 text-lg">✓</div>
                    </div>
                  ))}
                  {/* Wants (toggleable) */}
                  {wantItems.map((item, idx) => {
                    const sel = m1Bought[idx] ?? false;
                    return (
                      <button key={idx} onClick={() => setM1Bought(prev => { const n=[...prev]; n[idx]=!n[idx]; return n; })}
                        className={`w-full flex items-center gap-3 rounded-xl p-3 border-2 transition-all ${sel?"border-amber-400 bg-amber-50":"border-gray-200 bg-gray-50 hover:border-amber-300"}`}>
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="flex-1 text-left">
                          <div className="font-black text-sm text-gray-800">{item.name}</div>
                          <div className="text-[10px] bg-amber-200 text-amber-700 rounded-full px-2 py-0.5 inline-block font-bold">ΕΠΙΘΥΜΙΑ</div>
                        </div>
                        <div className={`font-black ${sel?"text-amber-600":"text-gray-400"}`}>−{item.price}€</div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${sel?"bg-amber-400 border-amber-400 text-white":"border-gray-300"}`}>
                          {sel ? "✓" : ""}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="px-4 pb-4">
                  <div className={`rounded-2xl p-3 text-center border-2 ${weekSaved>=0?"border-emerald-300 bg-emerald-50":"border-rose-300 bg-rose-50"}`}>
                    <div className="text-xs text-gray-500 mb-0.5">Αποταμίευση αυτής της εβδομάδας</div>
                    <div className={`font-black text-2xl ${weekSaved>=0?"text-emerald-700":"text-rose-600"}`}>{weekSaved>=0?"+":""}{weekSaved}€</div>
                    <div className="text-xs text-gray-400">{weekIncome}€ − {needsCost+selectedWantsCost}€ έξοδα</div>
                  </div>
                </div>
              </div>

              <button onClick={() => {
                  const newSavings = m1Savings + Math.max(0, weekSaved);
                  const newLog = [...m1WeekLog, Math.max(0, weekSaved)];
                  const nextWeek = m1Week + 1;
                  setM1Savings(newSavings);
                  setM1WeekLog(newLog);
                  if (nextWeek >= WEEKS) {
                    setM1Phase("done");
                    if (newSavings >= goal.price) playClip("m1-win");
                    else speak("Δεν έφτασες τον στόχο αυτή τη φορά. Ξαναπροσπάθησε! Ξόδεψες πολλά χρήματα σε επιθυμίες.");
                  } else {
                    setM1Week(nextWeek);
                    resetWeekBought();
                    playClip("m1-week");
                  }
                }}
                className="w-full max-w-sm py-4 rounded-2xl font-black text-white text-lg shadow-xl active:scale-95"
                style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 5px 0 #047857" }}>
                {m1Week+1 < WEEKS ? `Επόμενη Εβδομάδα →` : "Τελικό Αποτέλεσμα! 🏁"}
              </button>
            </>
          )}

          {/* PHASE: done */}
          {m1Phase === "done" && (
            <>
              <div className="text-6xl animate-bounce">{m1Savings >= goal.price ? "🏆" : "💪"}</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-sm text-center">
                <h2 className={`text-2xl font-black mb-1 ${m1Savings>=goal.price?"text-emerald-700":"text-amber-600"}`}>
                  {m1Savings >= goal.price ? "Τα κατάφερες! 🎉" : "Συνέχισε να προσπαθείς!"}
                </h2>
                <div className="text-4xl my-2">{goal.emoji}</div>
                <p className="text-gray-500 text-sm mb-3">
                  {m1Savings >= goal.price
                    ? `Αποτάμιευσες ${m1Savings}€ και αγόρασες το ${goal.name}!`
                    : `Αποτάμιευσες ${m1Savings}€ από τα ${goal.price}€ που χρειαζόσουν.`}
                </p>
                <div className="space-y-1.5 mb-3">
                  {m1WeekLog.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                      <span className="text-gray-500">📅 Εβδομάδα {i+1}</span>
                      <span className="font-black text-emerald-600">+{s}€</span>
                    </div>
                  ))}
                </div>
                <div className={`rounded-2xl py-3 px-4 ${m1Savings>=goal.price?"bg-emerald-500":"bg-amber-400"} text-white`}>
                  <div className="text-xs opacity-80">Σύνολο αποταμίευσης</div>
                  <div className="text-3xl font-black">{m1Savings}€</div>
                </div>
                <div className="mt-3 bg-blue-50 rounded-2xl p-3 text-xs text-blue-800 font-semibold">
                  💡 {m1Savings>=goal.price ? "Η αποταμίευση σε βοηθά να αγοράσεις αυτό που πραγματικά θέλεις!" : "Κάθε φορά που αρνείσαι μια επιθυμία, έρχεσαι πιο κοντά στον στόχο σου!"}
                </div>
              </div>
              <div className="flex gap-2 w-full max-w-sm">
                <button onClick={() => { setM1Phase("goal"); setM1Savings(0); setM1Week(0); setM1Bought([]); setM1WeekLog([]); }}
                  className="flex-1 py-3 rounded-2xl font-black text-emerald-700 bg-white border-2 border-emerald-300 text-sm">
                  🔄 Ξανά
                </button>
                <button onClick={goHub}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm shadow-lg"
                  style={{ background:"linear-gradient(90deg,#10b981,#059669)" }}>
                  Κεντρική →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODULE 2 — Κέρδος ή Ζημιά;
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m2") {
    const scenario = m2Order[m2Step] ?? null;
    const result = scenario ? (scenario.income > scenario.expense ? "profit" : scenario.income < scenario.expense ? "loss" : "zero") : "profit";
    const diff = scenario ? scenario.income - scenario.expense : 0;
    const answered = m2Answer !== null;
    const correct = m2Answer === result;

    return (
      <div className="min-h-screen flex flex-col game-font" style={{ background:"linear-gradient(160deg,#dbeafe 0%,#bfdbfe 50%,#93c5fd 100%)" }}>
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 px-4 pt-10 pb-4 text-white">
          <BackBtn onBack={goHub} />
          <div className="text-center">
            <div className="font-black text-lg">📊 Κέρδος ή Ζημιά;</div>
            {m2Step < M2.length && (
              <>
                <ProgressBar step={m2Step} total={M2.length} />
                <div className="text-xs mt-1 opacity-80">Ερώτηση {m2Step+1} από {M2.length}</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 gap-3 items-center justify-center">

          {m2Step === 0 && !answered && (
            <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
              <div className="text-5xl mb-3">📊</div>
              <h2 className="text-xl font-black text-blue-700 mb-2">Κέρδος ή Ζημιά;</h2>
              <p className="text-gray-600 text-sm mb-3">Θα σου δείξω μια επιχείρηση με <strong>Έσοδα</strong> και <strong>Έξοδα</strong>. Βρες αν έχει κέρδος ή ζημιά!</p>
              <div className="bg-blue-50 rounded-2xl p-3 text-sm text-left space-y-1 text-gray-700">
                <div>✅ <strong>Κέρδος</strong> = Έσοδα &gt; Έξοδα</div>
                <div>❌ <strong>Ζημιά</strong> = Έξοδα &gt; Έσοδα</div>
                <div>⚖️ <strong>Μηδέν</strong> = Έσοδα = Έξοδα</div>
              </div>
            </div>
          )}

          {m2Step < M2.length && scenario && (
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-xs w-full">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 text-white text-center">
                <div className="text-3xl mb-1">{scenario.biz.split(" ")[0]}</div>
                <div className="font-black text-base">{scenario.biz}</div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between bg-emerald-50 rounded-xl p-3">
                  <span className="font-semibold text-gray-600">💰 Έσοδα</span>
                  <span className="font-black text-emerald-700">{scenario.income}€</span>
                </div>
                <div className="flex justify-between bg-rose-50 rounded-xl p-3">
                  <span className="font-semibold text-gray-600">💸 Έξοδα</span>
                  <span className="font-black text-rose-600">{scenario.expense}€</span>
                </div>
                <div className="bg-gray-100 rounded-xl p-3 text-center text-sm text-gray-500 italic">{scenario.fact}</div>
              </div>

              {!answered ? (
                <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                  <button onClick={() => { const ok=result==="profit"; setM2Answer("profit"); if(ok){setM2Score(s=>s+1);playClip("m2-correct");}else playClip("m2-wrong"); }}
                    className="py-3 rounded-2xl font-black text-white text-sm shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#10b981,#059669)" }}>
                    ✅ Κέρδος!
                  </button>
                  <button onClick={() => { const ok=result==="zero"; setM2Answer("zero"); if(ok){setM2Score(s=>s+1);playClip("m2-correct");}else playClip("m2-wrong"); }}
                    className="py-3 rounded-2xl font-black text-white text-sm shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#f59e0b,#d97706)" }}>
                    ⚖️ Μηδέν!
                  </button>
                  <button onClick={() => { const ok=result==="loss"; setM2Answer("loss"); if(ok){setM2Score(s=>s+1);playClip("m2-correct");}else playClip("m2-wrong"); }}
                    className="py-3 rounded-2xl font-black text-white text-sm shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#f43f5e,#e11d48)" }}>
                    ❌ Ζημιά!
                  </button>
                </div>
              ) : (
                <div className="px-4 pb-4 space-y-3">
                  <ResultBadge correct={correct} />
                  <div className={`rounded-2xl p-3 text-sm font-semibold text-center ${correct?"bg-emerald-50 text-emerald-800":"bg-rose-50 text-rose-800"}`}>
                    {scenario.income} − {scenario.expense} = <strong className={diff>0?"text-emerald-700":diff<0?"text-rose-700":"text-gray-700"}>{diff>0?"+":""}{diff}€</strong>
                    {" → "}{diff>0?"Κέρδος! 🎉":diff<0?"Ζημιά! 😬":"Μηδενικό 😐"}
                  </div>
                  <button onClick={() => {
                    setM2Answer(null);
                    setM2Step(s => s+1);
                  }}
                    className="w-full py-3 rounded-2xl font-black text-white shadow-md"
                    style={{ background:"linear-gradient(90deg,#6366f1,#4f46e5)" }}>
                    {m2Step+1 < M2.length ? "Επόμενη →" : "Τελικό Αποτέλεσμα! 🏁"}
                  </button>
                </div>
              )}
            </div>
          )}

          {m2Step >= M2.length && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl">{m2Score >= 6 ? "🏆" : m2Score >= 4 ? "⭐" : "💪"}</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
                <h2 className="text-2xl font-black text-blue-700 mb-1">{m2Score >= 6 ? "Άριστα!" : m2Score >= 4 ? "Πολύ καλά!" : "Συνέχισε!"}</h2>
                <p className="text-gray-500 text-sm mb-3">Απάντησες σωστά {m2Score}/{M2.length} ερωτήσεις</p>
                <div className="grid grid-cols-4 gap-1 mb-3">
                  {Array.from({length:M2.length},(_,i) => (
                    <div key={i} className={`h-3 rounded-full ${i < m2Score ? "bg-emerald-500" : "bg-gray-200"}`} />
                  ))}
                </div>
                <div className="bg-amber-50 rounded-2xl p-3 text-xs text-amber-800 font-semibold">
                  💡 Κέρδος = Έσοδα − Έξοδα. Όταν τα έξοδα είναι πιο πολλά από τα έσοδα, έχεις ζημιά!
                </div>
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <button onClick={() => { setM2Step(0); setM2Score(0); setM2Answer(null); setM2Order(shuffle(M2)); }}
                  className="flex-1 py-3 rounded-2xl font-black text-blue-700 bg-white border-2 border-blue-300 text-sm">🔄 Ξανά</button>
                <button onClick={goHub}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm"
                  style={{ background:"linear-gradient(90deg,#6366f1,#4f46e5)" }}>
                  Κεντρική →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODULE 3 — Κάρτες Ρίσκου
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m3") {
    const card = M3[m3Step] ?? null;
    const done = m3Step >= M3.length;

    return (
      <div className="min-h-screen flex flex-col game-font" style={{ background:"linear-gradient(160deg,#fff7ed 0%,#fed7aa 50%,#fca5a5 100%)" }}>
        <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 px-4 pt-10 pb-4 text-white">
          <BackBtn onBack={goHub} />
          <div className="text-center">
            <div className="font-black text-lg">⚠️ Κάρτες Ρίσκου</div>
            {!done && (
              <>
                <ProgressBar step={m3Step} total={M3.length} />
                <div className="text-xs mt-1 opacity-80">Κάρτα {m3Step+1} από {M3.length} · Μετρητά: {fmt(m3Cash)}€</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 items-center justify-center gap-4">

          {m3Step === 0 && !m3Result && (
            <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <h2 className="text-xl font-black text-orange-700 mb-2">Κάρτες Ρίσκου!</h2>
              <p className="text-gray-600 text-sm mb-3">Ο επιχειρηματίας αντιμετωπίζει εκπλήξεις κάθε μέρα. Ξεκινάς με <strong className="text-orange-700">2.000€</strong>. Πάρε τις καλύτερες αποφάσεις!</p>
              <div className="bg-orange-50 rounded-2xl p-3 text-xs text-gray-600 text-left space-y-1">
                <div>🃏 Θα εμφανιστούν {M3.length} κάρτες</div>
                <div>🅰️ ή 🅱️ Διάλεξε μια από τις 2 επιλογές</div>
                <div>💡 Κάθε επιλογή έχει συνέπειες!</div>
              </div>
            </div>
          )}

          {!done && card && (
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-xs w-full">
              <div className="p-5 text-center" style={{ background:"linear-gradient(135deg,#f97316,#ef4444)" }}>
                <div className="text-5xl mb-2">{card.emoji}</div>
                <div className="font-black text-white text-xl">{card.title}</div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 text-sm font-semibold text-center mb-4 bg-orange-50 rounded-2xl p-3">{card.story}</p>

                {!m3Result ? (
                  <div className="space-y-2">
                    <button onClick={() => { const r=card.a; setM3Cash(c=>c+r.delta); setM3Result(r); playClip(r.delta>=0?'m3-good':'m3-bad'); }}
                      className="w-full py-3.5 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                      style={{ background:"linear-gradient(90deg,#f97316,#ea580c)" }}>
                      🅰️ {card.a.text}
                    </button>
                    <button onClick={() => { const r=card.b; setM3Cash(c=>c+r.delta); setM3Result(r); playClip(r.delta>=0?'m3-good':'m3-bad'); }}
                      className="w-full py-3.5 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                      style={{ background:"linear-gradient(90deg,#6366f1,#4f46e5)" }}>
                      🅱️ {card.b.text}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`text-center rounded-2xl py-3 px-4 font-black text-white text-xl ${m3Result.delta >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}>
                      {m3Result.delta > 0 ? `+${m3Result.delta}€ 🎉` : m3Result.delta < 0 ? `${m3Result.delta}€ 😬` : "Ουδέτερο ⚖️"}
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-3 text-sm text-gray-700 font-semibold text-center">{m3Result.explain}</div>
                    <div className="bg-indigo-50 rounded-xl p-2 text-center text-sm">
                      Μετρητά: <strong className="text-indigo-700">{fmt(m3Cash)}€</strong>
                    </div>
                    <button onClick={() => { setM3Result(null); setM3Step(s=>s+1); }}
                      className="w-full py-3 rounded-2xl font-black text-white shadow-md"
                      style={{ background:"linear-gradient(90deg,#f97316,#ef4444)" }}>
                      {m3Step+1 < M3.length ? "Επόμενη κάρτα →" : "Αποτέλεσμα! 🏁"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {done && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl">{m3Cash >= 2500 ? "🏆" : m3Cash >= 1500 ? "⭐" : "💪"}</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
                <h2 className="text-2xl font-black text-orange-700 mb-1">
                  {m3Cash >= 2500 ? "Εξαιρετικά!" : m3Cash >= 1500 ? "Καλή δουλειά!" : "Συνέχισε!"}
                </h2>
                <p className="text-gray-500 text-sm mb-3">Αντιμετώπισες {M3.length} κάρτες ρίσκου</p>
                <div className="bg-orange-500 text-white rounded-2xl py-3 px-4 mb-3">
                  <div className="text-sm opacity-80">Τελικά μετρητά</div>
                  <div className="text-3xl font-black">{fmt(m3Cash)}€</div>
                  <div className="text-sm opacity-80">{m3Cash > 2000 ? `+${m3Cash-2000}€ από την αρχή!` : `${m3Cash-2000}€ από την αρχή`}</div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-3 text-xs text-amber-800 font-semibold">
                  💡 Οι καλές αποφάσεις σε καιρό κρίσης κάνουν τη διαφορά!
                </div>
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <button onClick={() => { setM3Step(0); setM3Cash(2000); setM3Result(null); }}
                  className="flex-1 py-3 rounded-2xl font-black text-orange-700 bg-white border-2 border-orange-300 text-sm">🔄 Ξανά</button>
                <button onClick={goHub}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm"
                  style={{ background:"linear-gradient(90deg,#f97316,#ef4444)" }}>
                  Κεντρική →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODULE 4 — Μεγάλος Επιχειρηματίας
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m4") {
    const ROUNDS = 6;
    const char = CHARS[m4Char];
    const randEvent = () => M4_EVENTS[Math.floor(Math.random()*M4_EVENTS.length)];

    const startRound = () => {
      if (!m4Biz) return;
      const playerNet = net(m4Biz.profit, m4Biz.expense);
      const botNet    = net(m4BotBiz.profit, m4BotBiz.expense);
      setM4Player(p => p + playerNet);
      setM4Bot(b => b + botNet);
      const ev = randEvent();
      setM4Event(ev);
      setM4Phase("event");
      setTimeout(()=>speak("Νέο γεγονός! " + ev.title + ". Επίλεξε: " + ev.a.text + " ή " + ev.b.text), 400);
    };

    const pickEvent = (choice: "a"|"b") => {
      if (!m4Event) return;
      const pDelta = m4Event[choice].delta;
      const botChoice: "a"|"b" = "b"; // bot always picks the "safe/wrong" choice
      const bDelta = m4Event[botChoice].delta;
      setM4Player(p => Math.max(0, p + pDelta));
      setM4Bot(b => Math.max(0, b + bDelta));
      setM4EvRes({ pDelta, bDelta });
      setM4Phase("eventResult");
    };

    const nextRound = () => {
      setM4EvRes(null); setM4Event(null);
      if (m4Round >= ROUNDS) {
        setM4Phase("done");
        setTimeout(() => {
          if (m4Player > m4Bot) playClip("m4-win");
          else if (m4Player < m4Bot) playClip("m4-lose");
          else playClip("m4-tie");
        }, 400);
        return;
      }
      setM4Round(r => r+1);
      setM4Phase("day");
    };

    return (
      <div className="min-h-screen flex flex-col game-font" style={{ background:"linear-gradient(160deg,#f5f3ff 0%,#ede9fe 50%,#ddd6fe 100%)" }}>
        <div className="relative bg-gradient-to-r from-violet-600 to-purple-700 px-4 pt-10 pb-4 text-white">
          <BackBtn onBack={goHub} />
          <div className="text-center">
            <div className="font-black text-lg">🏆 Μεγάλος Επιχειρηματίας</div>
            {m4Phase !== "char" && m4Phase !== "biz" && m4Phase !== "done" && (
              <>
                <ProgressBar step={m4Round-1} total={ROUNDS} />
                <div className="text-xs mt-1 opacity-80">Μέρα {m4Round} από {ROUNDS}</div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 items-center justify-center gap-3">

          {/* CHAR SELECT */}
          {m4Phase === "char" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-black text-center text-violet-700 mb-1">Επέλεξε το πιόνι σου!</h2>
                <p className="text-gray-500 text-xs text-center mb-3">Ξεκινάς με <strong>3.500€</strong> — ο αντίπαλός σου επίσης!</p>
                <div className="grid grid-cols-3 gap-2" style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)",borderRadius:"1rem",padding:"0.75rem"}}>
                  {CHARS.map((c,i) => <CharCard key={i} char={c} selected={m4Char===i} onSelect={()=>setM4Char(i)} />)}
                </div>
              </div>
              <button onClick={() => setM4Phase("biz")}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)", boxShadow:"0 5px 0 #5b21b6" }}>
                Επιλέγω: {CHARS[m4Char].trait}! →
              </button>
            </div>
          )}

          {/* BIZ SELECT */}
          {m4Phase === "biz" && (
            <div className="flex flex-col gap-3 w-full">
              <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
                <span className={`${char.color} text-white rounded-full px-3 py-1 text-sm font-black`}>{char.emoji} {char.trait}</span>
                <span className="text-gray-600 text-sm ml-2">Έχεις <strong className="text-violet-700">3.500€</strong></span>
              </div>
              <p className="text-center font-black text-violet-800">Διάλεξε επιχείρηση:</p>
              <div className="grid grid-cols-1 gap-2">
                {BIZ.map(b => (
                  <BizCard key={b.id} biz={b} cash={3500}
                    selected={m4Biz?.id===b.id}
                    onSelect={() => setM4Biz(b)} />
                ))}
              </div>
              {m4Biz && (
                <button onClick={() => {
                    const botBiz = BIZ.find(b => b.id !== m4Biz!.id) ?? BIZ[0];
                    setM4BotBiz(botBiz);
                    setM4Player(3500-m4Biz!.buy);
                    setM4Bot(3500-botBiz.buy);
                    setM4Phase("day");
                  }}
                  className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl sticky bottom-4"
                  style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)", boxShadow:"0 5px 0 #5b21b6" }}>
                  Αγοράζω {m4Biz.emoji} {m4Biz.name}!
                </button>
              )}
            </div>
          )}

          {/* DAY START */}
          {m4Phase === "day" && m4Biz && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
                <div className="text-4xl mb-2">📅</div>
                <h2 className="text-2xl font-black text-violet-700">Μέρα {m4Round}</h2>
                <p className="text-gray-500 text-sm mb-3">Μαζεύω κέρδη για τις επιχειρήσεις μου!</p>
                <div className="space-y-2">
                  <div className="flex justify-between bg-violet-50 rounded-xl p-2.5">
                    <span className="font-semibold text-sm text-gray-600">{char.emoji} {char.trait} ({m4Biz.emoji})</span>
                    <span className="font-black text-violet-700">+{net(m4Biz.profit,m4Biz.expense)}€</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 rounded-xl p-2.5">
                    <span className="font-semibold text-sm text-gray-600">👦 Άλεξ ({m4BotBiz.emoji})</span>
                    <span className="font-black text-gray-600">+{net(m4BotBiz.profit,m4BotBiz.expense)}€</span>
                  </div>
                </div>
              </div>
              <button onClick={startRound}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)", boxShadow:"0 5px 0 #5b21b6" }}>
                Μαζεύω κέρδη → ⚡
              </button>
            </div>
          )}

          {/* EVENT */}
          {m4Phase === "event" && m4Event && m4Biz && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="bg-white/80 rounded-2xl px-4 py-2 text-center text-sm font-black text-violet-700">
                {char.emoji} {fmt(m4Player)}€ vs 👦 {fmt(m4Bot)}€
              </div>
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-xs w-full">
                <div className="p-4 text-center" style={{background:"linear-gradient(135deg,#7c3aed,#6d28d9)"}}>
                  <div className="text-5xl mb-2">{m4Event.emoji}</div>
                  <div className="font-black text-white text-xl">{m4Event.title}</div>
                  <div className="text-white/70 text-xs mt-1">Πάρε την απόφασή σου!</div>
                </div>
                <div className="p-4 space-y-2">
                  <button onClick={() => pickEvent("a")}
                    className="w-full py-4 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)" }}>
                    🅰️ {m4Event.a.text}
                    <span className={`ml-2 text-sm ${m4Event.a.delta>=0?"text-green-300":"text-red-300"}`}>
                      ({m4Event.a.delta>0?"+":""}{m4Event.a.delta}€)
                    </span>
                  </button>
                  <button onClick={() => pickEvent("b")}
                    className="w-full py-4 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#f97316,#ea580c)" }}>
                    🅱️ {m4Event.b.text}
                    <span className={`ml-2 text-sm ${m4Event.b.delta>=0?"text-green-300":"text-red-300"}`}>
                      ({m4Event.b.delta>0?"+":""}{m4Event.b.delta}€)
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EVENT RESULT */}
          {m4Phase === "eventResult" && m4EvRes && m4Biz && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full">
                <div className="text-center font-black text-violet-700 text-base mb-3">Αποτέλεσμα Μέρας {m4Round}</div>
                <div className="space-y-2">
                  <div className={`flex justify-between rounded-2xl p-3 ${m4EvRes.pDelta>=0?"bg-emerald-50":"bg-rose-50"}`}>
                    <span className="font-semibold text-sm">{char.emoji} {char.trait}</span>
                    <span className={`font-black ${m4EvRes.pDelta>=0?"text-emerald-700":"text-rose-600"}`}>
                      {m4EvRes.pDelta>=0?"+":""}{m4EvRes.pDelta}€ → {fmt(m4Player)}€
                    </span>
                  </div>
                  <div className={`flex justify-between rounded-2xl p-3 ${m4EvRes.bDelta>=0?"bg-blue-50":"bg-gray-50"}`}>
                    <span className="font-semibold text-sm">👦 Άλεξ</span>
                    <span className="font-black text-gray-600">
                      {m4EvRes.bDelta>=0?"+":""}{m4EvRes.bDelta}€ → {fmt(m4Bot)}€
                    </span>
                  </div>
                </div>
                <div className={`mt-3 text-center rounded-xl p-2 text-sm font-bold ${m4Player>m4Bot?"bg-emerald-100 text-emerald-800":"m4Player<m4Bot"?"bg-rose-100 text-rose-800":"bg-gray-100 text-gray-700"}`}>
                  {m4Player > m4Bot ? "🥇 Προηγείσαι!" : m4Player < m4Bot ? "😤 Πίσω! Ανέβα!" : "🤝 Ισοπαλία!"}
                </div>
              </div>
              <button onClick={nextRound}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)", boxShadow:"0 5px 0 #5b21b6" }}>
                {m4Round < ROUNDS ? `Μέρα ${m4Round+1} →` : "Τελικό Αποτέλεσμα! 🏁"}
              </button>
            </div>
          )}

          {/* DONE */}
          {m4Phase === "done" && m4Biz && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl animate-bounce">{m4Player > m4Bot ? "🏆" : m4Player < m4Bot ? "😤" : "🤝"}</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full text-center">
                <h2 className="text-2xl font-black text-violet-700 mb-3">
                  {m4Player > m4Bot ? "Κέρδισες!" : m4Player < m4Bot ? "Ο Άλεξ κέρδισε..." : "Ισοπαλία!"}
                </h2>
                <div className="space-y-2 mb-3">
                  <div className={`flex justify-between rounded-2xl p-3 border-2 ${m4Player>m4Bot?"border-violet-400 bg-violet-50":"border-gray-200 bg-gray-50"}`}>
                    <span className="font-black">{char.emoji} {char.trait}</span>
                    <span className={`font-black text-lg ${m4Player>m4Bot?"text-violet-700":"text-gray-600"}`}>{fmt(m4Player)}€</span>
                  </div>
                  <div className={`flex justify-between rounded-2xl p-3 border-2 ${m4Bot>m4Player?"border-violet-400 bg-violet-50":"border-gray-200 bg-gray-50"}`}>
                    <span className="font-black">👦 Άλεξ</span>
                    <span className={`font-black text-lg ${m4Bot>m4Player?"text-violet-700":"text-gray-600"}`}>{fmt(m4Bot)}€</span>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-3 text-xs text-amber-800 font-semibold">
                  💡 Επιτυχημένος επιχειρηματίας = σωστές αποφάσεις + καλή επένδυση + διαχείριση ρίσκου!
                </div>
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <button onClick={() => { setM4Phase("char"); setM4Player(3500); setM4Bot(3500); setM4Round(1); setM4Biz(null); setM4Event(null); setM4EvRes(null); setM4BotBiz(BIZ[Math.floor(Math.random()*BIZ.length)]); }}
                  className="flex-1 py-3 rounded-2xl font-black text-violet-700 bg-white border-2 border-violet-300 text-sm">🔄 Ξανά</button>
                <button onClick={goHub}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm"
                  style={{ background:"linear-gradient(90deg,#7c3aed,#6d28d9)" }}>
                  Κεντρική →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
