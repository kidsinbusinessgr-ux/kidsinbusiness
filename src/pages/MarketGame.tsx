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
  { id:"toys",    name:"Μαγαζί Παιχνίδια",emoji:"🎮", buy:1700, profit:240, expense:80,  desc:"Παιχνίδια για όλες τις ηλικίες!" },
];

// ── Module 2 Scenarios ─────────────────────────────────────────────────────────
const M2 = [
  { biz:"🥖 Φούρνος",         income:450, expense:150, fact:"Ο φούρνος πουλάει καλά αλλά πρέπει να αγοράζει αλεύρι!" },
  { biz:"🐕 Pet Shop",         income:300, expense:320, fact:"Τα φάρμακα για ζώα κόστισαν πολύ αυτόν τον μήνα." },
  { biz:"💪 Γυμναστήριο",      income:500, expense:200, fact:"Πολλά νέα μέλη εγγράφηκαν τον Ιανουάριο!" },
  { biz:"💈 Κομμωτήριο",       income:210, expense:240, fact:"Αγοράστηκαν νέα προϊόντα ομορφιάς." },
  { biz:"🧖 Spa Center",       income:380, expense:170, fact:"Οι πελάτες αγαπούν τα νέα θεραπευτικά πακέτα." },
  { biz:"🎮 Κατ. Παιχνίδια",   income:290, expense:290, fact:"Εσοδα και έξοδα ισοφαρίστηκαν αυτόν τον μήνα." },
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
    className={`rounded-2xl p-2.5 text-center transition-all duration-200 border-4 w-full ${
      selected ? "border-white shadow-2xl bg-white/30" : "border-white/30 bg-white/10 hover:bg-white/20"
    }`}>
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${char.grad} flex items-center justify-center text-2xl mx-auto mb-1.5 shadow-lg ring-2 ring-white/50`}>
      {char.emoji}
    </div>
    <div className="font-black text-white text-xs leading-tight">{char.trait}</div>
    <div className="text-white/70 text-[9px] mt-0.5 leading-tight">{char.desc}</div>
    {selected && <div className="mt-1.5 bg-white text-purple-700 rounded-full text-[8px] font-black px-1.5 py-0.5">✓ Επιλεγμένο</div>}
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

  // ── Module 1 state
  const [m1Step, setM1Step]   = useState(0); // 0=intro 1=char 2=biz 3=day 4=done
  const [m1Char, setM1Char]   = useState(0);
  const [m1Biz,  setM1Biz]    = useState<typeof BIZ[0]|null>(null);
  const [m1Cash, setM1Cash]   = useState(3500);
  const [m1Day,  setM1Day]    = useState(1);
  const [m1Log,  setM1Log]    = useState<number[]>([]);

  // ── Module 2 state
  const [m2Step,   setM2Step]   = useState(0);
  const [m2Answer, setM2Answer] = useState<"profit"|"loss"|null>(null);
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  const goHub = () => {
    setScreen("hub");
    // reset all modules
    setM1Step(0); setM1Char(0); setM1Biz(null); setM1Cash(3500); setM1Day(1); setM1Log([]);
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
      { id:"m1" as Screen, emoji:"🏪", title:"Ξεκίνα Επιχείρηση", desc:"Επέλεξε και αγόρασε την πρώτη σου επιχείρηση!", color:"from-emerald-400 to-teal-600",    bg:"bg-emerald-500" },
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
            <button key={m.id} onClick={() => setScreen(m.id)}
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

        <button onClick={() => navigate("/book")} className="text-white/40 text-xs mt-8 hover:text-white/60">← Πίσω στο βιβλίο</button>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // MODULE 1 — Ξεκίνα Επιχείρηση
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m1") {
    const DAYS = 5;
    const char = CHARS[m1Char];
    const totalEarned = m1Log.reduce((s, n) => s + n, 0);

    return (
      <div className="min-h-screen flex flex-col game-font" style={{ background:"linear-gradient(160deg,#d1fae5 0%,#a7f3d0 50%,#6ee7b7 100%)" }}>
        {/* Top bar */}
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 px-4 pt-10 pb-4 text-white">
          <BackBtn onBack={goHub} />
          <div className="text-center">
            <div className="text-lg font-black">🏪 Ξεκίνα Επιχείρηση</div>
            {m1Step >= 3 && m1Biz && (
              <div className="mt-1">
                <ProgressBar step={m1Log.length} total={DAYS} />
                <div className="text-xs mt-1 opacity-80">Μέρα {m1Log.length}/{DAYS}</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 gap-3">

          {/* STEP 0 — Intro */}
          {m1Step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl animate-bounce">🏪</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg text-center max-w-xs w-full">
                <h2 className="text-2xl font-black text-emerald-700 mb-2">Ξεκίνα την Επιχείρησή σου!</h2>
                <p className="text-gray-600 text-sm mb-3">Έχεις <strong className="text-emerald-700">3.500€</strong> για να επενδύσεις. Διάλεξε τον χαρακτήρα σου και αγόρασε μια επιχείρηση!</p>
                <div className="bg-emerald-50 rounded-2xl p-3 text-xs text-gray-600 space-y-1 text-left">
                  <div>📌 Κάθε επιχείρηση έχει <strong>κόστος αγοράς</strong></div>
                  <div>💰 Κάθε μέρα έχεις <strong>έσοδα</strong> (χρήματα που μπαίνουν)</div>
                  <div>💸 Και <strong>έξοδα</strong> (ενοίκιο, μισθοί, υλικά)</div>
                  <div>✅ Κέρδος = Έσοδα − Έξοδα</div>
                </div>
              </div>
              <button onClick={() => setM1Step(1)}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl active:scale-95"
                style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 6px 0 #047857" }}>
                Ξεκινάω! 🚀
              </button>
            </div>
          )}

          {/* STEP 1 — Character select */}
          {m1Step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full">
                <h2 className="text-xl font-black text-center text-emerald-700 mb-1">Επέλεξε το πιόνι σου!</h2>
                <p className="text-gray-500 text-xs text-center mb-3">Επέλεξε τον χαρακτήρα σου</p>
                <div className="grid grid-cols-3 gap-2" style={{background:"linear-gradient(135deg,#059669,#0d9488)",borderRadius:"1rem",padding:"0.75rem"}}>
                  {CHARS.map((c, i) => <CharCard key={i} char={c} selected={m1Char===i} onSelect={() => setM1Char(i)} />)}
                </div>
              </div>
              <button onClick={() => setM1Step(2)}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 5px 0 #047857" }}>
                Επιλέγω: {CHARS[m1Char].trait}! →
              </button>
            </div>
          )}

          {/* STEP 2 — Business select */}
          {m1Step === 2 && (
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
                <span className={`${char.color} text-white rounded-full px-3 py-1 text-sm font-black`}>{char.emoji} {char.trait}</span>
                <span className="text-gray-600 text-sm ml-2">Έχεις <strong className="text-emerald-700">{fmt(m1Cash)}€</strong></span>
              </div>
              <p className="text-center font-black text-emerald-800 text-base">Διάλεξε επιχείρηση:</p>
              <div className="grid grid-cols-1 gap-2">
                {BIZ.map(b => (
                  <BizCard key={b.id} biz={b} cash={m1Cash}
                    selected={m1Biz?.id === b.id}
                    onSelect={() => setM1Biz(b)} />
                ))}
              </div>
              {m1Biz && (
                <button onClick={() => {
                  setM1Cash(m1Cash - m1Biz.buy);
                  setM1Step(3);
                }}
                  className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl sticky bottom-4"
                  style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 5px 0 #047857" }}>
                  Αγοράζω {m1Biz.emoji} {m1Biz.name} ({fmt(m1Biz.buy)}€)!
                </button>
              )}
            </div>
          )}

          {/* STEP 3 — Playing (daily profit) */}
          {m1Step === 3 && m1Biz && m1Log.length < DAYS && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-5xl mb-1">{m1Biz.emoji}</div>
                <div className="font-black text-2xl text-emerald-800">{m1Biz.name}</div>
                <div className="text-sm text-emerald-600 font-semibold">Μέρα {m1Log.length + 1} από {DAYS}</div>
              </div>
              <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-xs">
                <div className="text-center font-black text-gray-700 text-base mb-3">Σήμερα:</div>
                <div className="space-y-2">
                  <div className="flex justify-between bg-emerald-50 rounded-xl p-2.5">
                    <span className="text-sm font-semibold text-gray-600">💰 Έσοδα</span>
                    <span className="font-black text-emerald-700">+{m1Biz.profit}€</span>
                  </div>
                  <div className="flex justify-between bg-rose-50 rounded-xl p-2.5">
                    <span className="text-sm font-semibold text-gray-600">💸 Έξοδα</span>
                    <span className="font-black text-rose-600">−{m1Biz.expense}€</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center">
                    <span className="font-black text-gray-700">= Καθαρό Κέρδος</span>
                    <span className={`font-black text-xl ${net(m1Biz.profit,m1Biz.expense)>0?"text-emerald-700":"text-rose-600"}`}>
                      {net(m1Biz.profit,m1Biz.expense)>0?"+":""}{net(m1Biz.profit,m1Biz.expense)}€
                    </span>
                  </div>
                </div>
                <div className="mt-3 bg-indigo-50 rounded-xl p-2.5 text-center">
                  <div className="text-xs text-gray-500">Σύνολο μετρητών</div>
                  <div className="font-black text-lg text-indigo-700">{fmt(m1Cash + m1Log.reduce((s,n)=>s+n,0))}€</div>
                </div>
              </div>
              <button onClick={() => {
                const dayNet = net(m1Biz.profit, m1Biz.expense);
                setM1Log(prev => [...prev, dayNet]);
                if (m1Log.length + 1 === DAYS) setM1Step(4);
              }}
                className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-lg shadow-xl"
                style={{ background:"linear-gradient(90deg,#10b981,#059669)", boxShadow:"0 5px 0 #047857" }}>
                {m1Log.length + 1 === DAYS ? "Τελευταία μέρα! 🎉" : `Επόμενη μέρα →`}
              </button>
            </div>
          )}

          {/* STEP 4 — Done */}
          {(m1Step === 4 || (m1Step===3 && m1Log.length===DAYS)) && m1Biz && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-xs text-center">
                <h2 className="text-2xl font-black text-emerald-700 mb-1">Μπράβο! Πιόνι: {CHARS[m1Char].trait}!</h2>
                <p className="text-gray-500 text-sm mb-3">Σε {DAYS} μέρες με το <strong>{m1Biz.emoji} {m1Biz.name}</strong></p>
                <div className="space-y-2 mb-3">
                  {m1Log.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                      <span className="text-gray-500">Μέρα {i+1}</span>
                      <span className={`font-black ${d>0?"text-emerald-600":"text-rose-600"}`}>{d>0?"+":""}{d}€</span>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-500 text-white rounded-2xl py-3 px-4">
                  <div className="text-sm opacity-80">Συνολικό κέρδος</div>
                  <div className="text-3xl font-black">{totalEarned>0?"+":""}{totalEarned}€</div>
                </div>
                <div className="mt-3 bg-amber-50 rounded-2xl p-3 text-xs text-amber-800 font-semibold">
                  💡 Θυμήσου: Κέρδος = Έσοδα − Έξοδα. Όσο πιο έξυπνα επενδύεις, τόσο πιο πολύ κερδίζεις!
                </div>
              </div>
              <div className="flex gap-2 w-full max-w-xs">
                <button onClick={() => { setM1Step(0); setM1Log([]); setM1Cash(3500); setM1Biz(null); setM1Day(1); }}
                  className="flex-1 py-3 rounded-2xl font-black text-emerald-700 bg-white border-2 border-emerald-300 text-sm">
                  🔄 Ξανά
                </button>
                <button onClick={goHub}
                  className="flex-1 py-3 rounded-2xl font-black text-white text-sm shadow-lg"
                  style={{ background:"linear-gradient(90deg,#10b981,#059669)" }}>
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
  // MODULE 2 — Κέρδος ή Ζημιά;
  // ══════════════════════════════════════════════════════════════════════════════
  if (screen === "m2") {
    const scenario = m2Order[m2Step] ?? null;
    const isProfit = scenario ? scenario.income > scenario.expense : false;
    const diff = scenario ? scenario.income - scenario.expense : 0;
    const answered = m2Answer !== null;
    const correct = m2Answer === (isProfit ? "profit" : "loss");

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
                <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                  <button onClick={() => { setM2Answer("profit"); if(isProfit) setM2Score(s=>s+1); }}
                    className="py-4 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                    style={{ background:"linear-gradient(90deg,#10b981,#059669)" }}>
                    ✅ Κέρδος!
                  </button>
                  <button onClick={() => { setM2Answer("loss"); if(!isProfit) setM2Score(s=>s+1); }}
                    className="py-4 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
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
                    <button onClick={() => { const r=card.a; setM3Cash(c=>c+r.delta); setM3Result(r); }}
                      className="w-full py-3.5 rounded-2xl font-black text-white text-base shadow-md active:scale-95"
                      style={{ background:"linear-gradient(90deg,#f97316,#ea580c)" }}>
                      🅰️ {card.a.text}
                    </button>
                    <button onClick={() => { const r=card.b; setM3Cash(c=>c+r.delta); setM3Result(r); }}
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
      setM4Event(randEvent());
      setM4Phase("event");
    };

    const pickEvent = (choice: "a"|"b") => {
      if (!m4Event) return;
      const pDelta = m4Event[choice].delta;
      const botChoice = Math.random() > 0.5 ? "a" : "b";
      const bDelta = m4Event[botChoice].delta;
      setM4Player(p => Math.max(0, p + pDelta));
      setM4Bot(b => Math.max(0, b + bDelta));
      setM4EvRes({ pDelta, bDelta });
      setM4Phase("eventResult");
    };

    const nextRound = () => {
      setM4EvRes(null); setM4Event(null);
      if (m4Round >= ROUNDS) { setM4Phase("done"); return; }
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
              <div className="bg-white rounded-3xl p-5 shadow-lg max-w-xs w-full">
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
                <button onClick={() => { setM4Player(3500-m4Biz.buy); setM4Bot(3500-m4BotBiz.buy); setM4Phase("day"); }}
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
                <p className="text-gray-500 text-sm mb-3">Μαζεύεις κέρδη από τις επιχειρήσεις σας...</p>
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
