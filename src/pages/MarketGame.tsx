import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// ─── Τύποι ───────────────────────────────────────────────────────────────────
type GamePhase = "intro" | "weekstart" | "shop" | "stocks" | "event" | "summary" | "results";
type StockId = "lego" | "techkids" | "foodco";

interface Dream         { id: string; name: string; emoji: string; cost: number; desc: string; }
interface BizDef        { id: string; name: string; emoji: string; cost: number; income: number; desc: string; }
interface RecurringCost { name: string; emoji: string; cost: number; }
interface Product       { id: string; name: string; emoji: string; type: "need" | "want"; price: number; recurringCost?: number; recurringLabel?: string; }
interface StockDef      { id: StockId; name: string; emoji: string; desc: string; }
interface WeekChallenge { id: string; emoji: string; title: string; desc: string; type: "needs_only" | "no_buy" | "double_stocks" | "save_half"; }
interface MiniQuiz      { question: string; options: string[]; correct: number; reward: number; }
interface MilestoneItem { id: string; emoji: string; title: string; coins: number; }

interface PassiveEvent     { kind: "passive"; emoji: string; title: string; body: string; coins: number; stock?: { id: StockId; delta: number }; }
interface OpportunityEvent { kind: "opportunity"; emoji: string; title: string; body: string; cost: number; gainIfSuccess: number; gainIfFail: number; successRate: number; }
interface CrashEvent       { kind: "crash"; }
type GameEvent = PassiveEvent | OpportunityEvent | CrashEvent;

// ─── Δεδομένα ─────────────────────────────────────────────────────────────────
const ALLOWANCE   = 30;
const TOTAL_WEEKS = 6;

const DREAMS: Dream[] = [
  { id:"bike",  name:"Ποδήλατο",           emoji:"🚲", cost:50, desc:"Ένα καινούριο ποδήλατο για βόλτες!" },
  { id:"trip",  name:"Ταξίδι στη θάλασσα", emoji:"🏖️", cost:70, desc:"Ένα ταξίδι με την οικογένεια!" },
  { id:"puppy", name:"Υιοθεσία κουταβιού", emoji:"🐶", cost:60, desc:"Υιοθετείς ένα κουτάβι — τα νομίσματα καλύπτουν τροφή & κτηνιατρική φροντίδα!" },
];

const BUSINESSES: BizDef[] = [
  { id:"lemonade", name:"Στάντ λεμονάδας",      emoji:"🍋", cost:20, income:6, desc:"Πουλάς λεμονάδα στη γειτονιά σου" },
  { id:"drawings", name:"Ζωγραφιές προς πώληση", emoji:"🎨", cost:15, income:4, desc:"Πουλάς τις ζωγραφιές σου στο σχολείο" },
  { id:"tutoring", name:"Ιδιαίτερα Μαθήματα",   emoji:"📖", cost:25, income:8, desc:"Βοηθάς μικρότερους μαθητές" },
];

const STOCK_DEFS: StockDef[] = [
  { id:"lego",     name:"LEGO Α.Ε.",   emoji:"🧱", desc:"Σταθερή εταιρεία παιχνιδιών"    },
  { id:"techkids", name:"ΤεχνοΠαιδιά", emoji:"💻", desc:"Τεχνολογία — ανεβοκατεβαίνει!" },
  { id:"foodco",   name:"ΤροφίμαΑΕ",   emoji:"🥗", desc:"Τρόφιμα — αργά αλλά σταθερά"   },
];

const BASE_PRICES: Record<StockId, number[]> = {
  lego:     [10, 11, 10, 12, 11, 13],
  techkids: [15, 18, 13, 20, 16, 22],
  foodco:   [ 8,  8,  9,  9, 10, 10],
};

const WEEKLY_PRODUCTS: Product[][] = [
  [
    { id:"f1", name:"Φαγητό",               emoji:"🍕", type:"need", price:5  },
    { id:"s1", name:"Σχολικά",               emoji:"📚", type:"need", price:8  },
    { id:"m1", name:"Φάρμακο",               emoji:"💊", type:"need", price:6  },
    { id:"i1", name:"Παγωτό",                emoji:"🍦", type:"want", price:3  },
    { id:"g1", name:"Επιτραπέζιο παιχνίδι",  emoji:"🎲", type:"want", price:12 },
  ],
  [
    { id:"f2",  name:"Φαγητό",          emoji:"🍕", type:"need", price:6 },
    { id:"c2",  name:"Ρούχα",           emoji:"👕", type:"need", price:12 },
    { id:"m2",  name:"Φάρμακο",         emoji:"💊", type:"need", price:6 },
    { id:"ph2", name:"Κινητό τηλέφωνο", emoji:"📱", type:"want", price:18, recurringCost:3, recurringLabel:"πρόγραμμα κινητού" },
    { id:"w2",  name:"Γλυκά",           emoji:"🍬", type:"want", price:4 },
  ],
  [
    { id:"f3",   name:"Φαγητό",          emoji:"🍕", type:"need", price:6  },
    { id:"b3",   name:"Τσάντα σχολείου", emoji:"🎒", type:"need", price:15 },
    { id:"m3",   name:"Φάρμακο",         emoji:"💊", type:"need", price:7  },
    { id:"cat3", name:"Γατάκι",          emoji:"🐱", type:"want", price:12, recurringCost:5, recurringLabel:"τροφή γατάκιου" },
    { id:"i3",   name:"Παγωτό",          emoji:"🍦", type:"want", price:4  },
  ],
  [
    { id:"f4", name:"Φαγητό",         emoji:"🍕", type:"need", price:7 },
    { id:"s4", name:"Σχολικά",        emoji:"📚", type:"need", price:9 },
    { id:"c4", name:"Ρούχα",          emoji:"👕", type:"need", price:13 },
    { id:"w4", name:"Γλυκά",          emoji:"🍬", type:"want", price:4 },
    { id:"k4", name:"Κινηματογράφος", emoji:"🎬", type:"want", price:7 },
  ],
  [
    { id:"f5",   name:"Φαγητό",            emoji:"🍕", type:"need", price:7  },
    { id:"m5",   name:"Φάρμακο",           emoji:"💊", type:"need", price:8  },
    { id:"r5",   name:"Χρώματα & μολύβια", emoji:"🖍️", type:"need", price:8  },
    { id:"con5", name:"Κονσόλα παιχνιδιών",emoji:"🕹️", type:"want", price:22, recurringCost:4, recurringLabel:"διαδικτυακή συνδρομή" },
    { id:"o5",   name:"Μπάλα ποδοσφαίρου", emoji:"⚽", type:"want", price:10 },
  ],
  [
    { id:"f6", name:"Φαγητό",               emoji:"🍕", type:"need", price:8  },
    { id:"s6", name:"Σχολικά",              emoji:"📚", type:"need", price:10 },
    { id:"c6", name:"Ρούχα",               emoji:"👕", type:"need", price:14 },
    { id:"i6", name:"Παγωτό",              emoji:"🍦", type:"want", price:5  },
    { id:"g6", name:"Επιτραπέζιο παιχνίδι",emoji:"🎲", type:"want", price:13 },
  ],
];

const PASSIVE_EVENTS: PassiveEvent[] = [
  { kind:"passive", emoji:"🎂", title:"Γενέθλια!",              body:"Η γιαγιά σου σου έδωσε χαρτζιλίκι!",                                 coins:15  },
  { kind:"passive", emoji:"📈", title:"Νέο προϊόν!",            body:"Η ΤεχνοΠαιδιά ανακοίνωσε νέα τεχνολογία. Οι μετοχές εκτινάχθηκαν!", coins:0, stock:{ id:"techkids", delta:4  } },
  { kind:"passive", emoji:"📉", title:"Σκάνδαλο!",              body:"Ανάκληση προϊόντων από τη LEGO Α.Ε. Η τιμή της έπεσε.",               coins:0, stock:{ id:"lego",     delta:-3 } },
  { kind:"passive", emoji:"🌧️", title:"Κακοκαιρία!",           body:"Πλημμύρες στις αποθήκες τροφίμων. Η ΤροφίμαΑΕ ανεβαίνει.",           coins:0, stock:{ id:"foodco",   delta:2  } },
  { kind:"passive", emoji:"🎓", title:"Διαγωνισμός!",           body:"Κέρδισες μαθηματικό διαγωνισμό! Μικρό χρηματικό έπαθλο!",             coins:20 },
  { kind:"passive", emoji:"💸", title:"Χάθηκε το πορτοφόλι!", body:"Άουτς! Το πορτοφόλι σου χάθηκε στο λεωφορείο.",                       coins:-8 },
  { kind:"passive", emoji:"⭐", title:"Ήσυχη εβδομάδα",         body:"Τίποτα ιδιαίτερο αυτή την εβδομάδα. Ούτε καλό ούτε κακό!",            coins:0  },
  { kind:"passive", emoji:"🎪", title:"Φεστιβάλ γειτονιάς!",   body:"Βοήθησες εθελοντικά στο φεστιβάλ και σε πλήρωσαν!",                   coins:12 },
  { kind:"passive", emoji:"🚀", title:"ΤεχνοΠαιδιά — Άλμα!",   body:"Εκπληκτικές πωλήσεις αυτή την εβδομάδα για την ΤεχνοΠαιδιά!",         coins:0, stock:{ id:"techkids", delta:5 } },
  { kind:"passive", emoji:"🦷", title:"Πόνος δοντιού!",         body:"Έπρεπε να πας επειγόντως στον οδοντίατρο. Απρόβλεπτο έξοδο!",         coins:-12 },
  { kind:"passive", emoji:"🎂", title:"Γενέθλια φίλου!",        body:"Θέλεις να αγοράσεις δώρο στον φίλο σου. Έξτρα έξοδο αυτή την εβδομάδα.", coins:-10 },
  { kind:"passive", emoji:"☀️", title:"Καλοκαιρινή δουλειά!",  body:"Βοήθησες τον γείτονα στον κήπο και σε αμοίβει γενναιόδωρα!",          coins:18 },
];

const OPPORTUNITIES: OpportunityEvent[] = [
  {
    kind:"opportunity", emoji:"🤝", title:"Πρόταση συνεργασίας",
    body:"Ο φίλος σου ο Νίκος ξεκινά μικρή επιχείρηση και σε καλεί να μπεις μέτοχος. Δίνεις 20 νομίσματα τώρα — αν πάει καλά, παίρνεις 38. Αν όχι, μόνο 8.",
    cost:20, gainIfSuccess:38, gainIfFail:8, successRate:0.65,
  },
  {
    kind:"opportunity", emoji:"🚲", title:"Ευκαιρία αγοράς",
    body:"Βρήκες μεταχειρισμένο ποδήλατο σε καλή κατάσταση για 10 νομίσματα. Μπορείς να το πουλήσεις για 22, αλλά δεν είναι σίγουρο ότι θα βρεις αγοραστή γρήγορα.",
    cost:10, gainIfSuccess:22, gainIfFail:5, successRate:0.70,
  },
  {
    kind:"opportunity", emoji:"💰", title:"Λογαριασμός αποταμίευσης",
    body:"Η γιαγιά σου σε συμβουλεύει να βάλεις χρήματα σε αποταμιευτικό λογαριασμό. Βάζεις 15 νομίσματα και μετά από λίγο καιρό παίρνεις 22 — σχεδόν σίγουρα.",
    cost:15, gainIfSuccess:22, gainIfFail:13, successRate:0.90,
  },
  {
    kind:"opportunity", emoji:"🎨", title:"Έκθεση τέχνης",
    body:"Η γειτονιά σου οργανώνει έκθεση. Αν ξοδέψεις 8 νομίσματα για υλικά και κερδίσεις το πρώτο βραβείο, παίρνεις 30. Αλλά ο ανταγωνισμός είναι μεγάλος!",
    cost:8, gainIfSuccess:30, gainIfFail:0, successRate:0.50,
  },
  {
    kind:"opportunity", emoji:"🍪", title:"Φτιάξε κέικ για πώληση",
    body:"Η μαμά σου σε βοηθά να φτιάξεις κέικ. Ξοδεύεις 12 νομίσματα για υλικά. Αν τα πουλήσεις όλα, παίρνεις 25!",
    cost:12, gainIfSuccess:25, gainIfFail:4, successRate:0.75,
  },
  {
    kind:"opportunity", emoji:"🎮", title:"Διαγωνισμός gaming",
    body:"Διαγωνισμός στο σχολείο! Πλήρωσε 5 νομίσματα συμμετοχή. Αν κερδίσεις, παίρνεις 20 νομίσματα έπαθλο!",
    cost:5, gainIfSuccess:20, gainIfFail:0, successRate:0.45,
  },
];

const WEEK_CHALLENGES: WeekChallenge[] = [
  { id:"needs_only",    emoji:"🥦", title:"Εβδομάδα Αναγκών",     desc:"Αγόρασε ΜΟΝΟ ανάγκες αυτή την εβδομάδα! Bonus: +15 νομίσματα",     type:"needs_only"    },
  { id:"no_buy",        emoji:"🐷", title:"Εβδομάδα Κουμπαρά",   desc:"Μην αγοράσεις τίποτα — κράτα τα νομίσματά σου! Bonus: +15 νομίσματα", type:"no_buy"        },
  { id:"double_stocks", emoji:"📈", title:"Εβδομάδα Επένδυσης",   desc:"Αγόρασε τουλάχιστον 2 μετοχές αυτή την εβδομάδα! Bonus: +15 νομίσματα", type:"double_stocks" },
  { id:"save_half",     emoji:"💰", title:"Εβδομάδα Αποταμίευσης",desc:"Κράτα τουλάχιστον 15 νομίσματα στο τέλος της εβδομάδας! Bonus: +15 νομίσματα", type:"save_half" },
];

const MINI_QUIZZES: MiniQuiz[] = [
  { question:"Τι είναι η αποταμίευση;", options:["Ξόδεμα τώρα","Φύλαξη χρημάτων για αργότερα","Δανεισμός","Επένδυση"], correct:1, reward:8 },
  { question:"Ποιο είναι 'ανάγκη';", options:["Παιχνίδι","Γλυκό","Φαγητό","Κινηματογράφος"], correct:2, reward:8 },
  { question:"Τι είναι το κέρδος;", options:["Μόνο τα έσοδα","Έσοδα μείον έξοδα","Το χρέος","Ο φόρος"], correct:1, reward:8 },
  { question:"Γιατί είναι χρήσιμες οι επιχειρήσεις;", options:["Μόνο για φόρο","Φέρνουν εισόδημα κάθε εβδομάδα","Είναι επικίνδυνες","Κοστίζουν πολύ"], correct:1, reward:8 },
  { question:"Τι σημαίνει επένδυση;", options:["Ξόδεμα για διασκέδαση","Βάζεις χρήματα για να κερδίσεις περισσότερα","Δανεισμός","Φύλαξη σε συρτάρι"], correct:1, reward:8 },
  { question:"Ποιο είναι το πλεονέκτημα των μετοχών;", options:["Είναι πάντα ασφαλείς","Μπορεί να ανεβούν σε αξία","Δεν έχουν ρίσκο","Αγοράζεις μόνο μία φορά"], correct:1, reward:8 },
];

const MILESTONES_DEF: MilestoneItem[] = [
  { id:"first_biz",   emoji:"🏪", title:"Πρώτη Επιχείρηση!",    coins:5  },
  { id:"first_stock", emoji:"📊", title:"Πρώτη Μετοχή!",        coins:5  },
  { id:"no_debt",     emoji:"✅", title:"Χωρίς Χρέος!",          coins:8  },
  { id:"dream_50",    emoji:"🌟", title:"Μισή Διαδρομή!",        coins:5  },
  { id:"all_needs",   emoji:"🥦", title:"Κάλυψα Τις Ανάγκες μου!", coins:5 },
  { id:"triple_biz",  emoji:"🏆", title:"Επιχειρηματίας!",       coins:10 },
];

// ─── Κύριο Component ──────────────────────────────────────────────────────────
export default function MarketGame() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  // Κατάσταση παιχνιδιού
  const [phase,         setPhase]         = useState<GamePhase>("intro");
  const [dream,         setDream]         = useState<Dream | null>(null);
  const [week,          setWeek]          = useState(1);
  const [coins,         setCoins]         = useState(0);
  const [debt,          setDebt]          = useState(0);
  const [owned,         setOwned]         = useState<Record<StockId, number>>({ lego:0, techkids:0, foodco:0 });
  const [overrides,     setOverrides]     = useState<Record<StockId, number>>({ lego:0, techkids:0, foodco:0 });
  const [bought,        setBought]        = useState<Set<string>>(new Set());
  const [ownedBiz,      setOwnedBiz]      = useState<Set<string>>(new Set());
  const [recurring,     setRecurring]     = useState<RecurringCost[]>([]);
  const [wisdom,        setWisdom]        = useState(0);
  const [event,         setEvent]         = useState<GameEvent | null>(null);
  const [usedEvts,      setUsedEvts]      = useState<number[]>([]);
  const [usedOpp,       setUsedOpp]       = useState<number[]>([]);
  const [oppResult,     setOppResult]     = useState<{ success: boolean; gain: number } | null>(null);
  const [weekReport,    setWeekReport]    = useState<{ biz: number; rec: number } | null>(null);
  const [bookBonus,     setBookBonus]     = useState(0);
  const [weekChallenge, setWeekChallenge] = useState<WeekChallenge | null>(null);
  const [challengeWon,  setChallengeWon]  = useState<boolean | null>(null);
  const [miniQuiz,      setMiniQuiz]      = useState<MiniQuiz | null>(null);
  const [miniQuizResult,setMiniQuizResult]= useState<boolean | null>(null);
  const [milestones,    setMilestones]    = useState<Set<string>>(new Set());
  const [pendingMs,     setPendingMs]     = useState<MilestoneItem | null>(null);
  const [weekStocks,    setWeekStocks]    = useState(0);
  const [crashDone,     setCrashDone]     = useState(false);
  const [usedQuizIdx,   setUsedQuizIdx]   = useState<number[]>([]);

  // Φόρτωση bonus από βιβλίο
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("book_progress" as any)
        .select("coins_earned")
        .eq("user_id", user.id);
      if (data) {
        const total = (data as any[]).reduce((s: number, r: any) => s + (r.coins_earned || 0), 0);
        const bonus = Math.min(50, Math.floor(total / 100) * 10);
        setBookBonus(bonus);
      }
    });
  }, []);

  // Παράγωγα μεγέθη
  const getPrice = (w: number, id: StockId) =>
    Math.max(1, BASE_PRICES[id][w - 1] + overrides[id]);

  const portfolio = () =>
    (["lego","techkids","foodco"] as StockId[]).reduce(
      (s, id) => s + owned[id] * getPrice(week, id), 0
    );

  const netWorth = () => coins + portfolio() - Math.round(debt * 1.5);
  const bizIncome = () => [...ownedBiz].reduce((s, id) => s + (BUSINESSES.find(b => b.id === id)?.income ?? 0), 0);
  const recurringTotal = () => recurring.reduce((s, r) => s + r.cost, 0);
  const dreamPct = () => dream ? Math.min(100, Math.round((Math.max(0, netWorth()) / dream.cost) * 100)) : 0;

  const spend = (amount: number) => {
    setCoins(c => {
      const next = c - amount;
      if (next < 0) { setDebt(d => d + Math.abs(next)); return 0; }
      return next;
    });
  };
  const earn = (amount: number) => setCoins(c => c + amount);

  // Milestone check
  const checkMilestone = (id: string, coins_reward: number) => {
    if (milestones.has(id)) return;
    const def = MILESTONES_DEF.find(m => m.id === id);
    if (!def) return;
    setMilestones(prev => new Set([...prev, id]));
    earn(coins_reward);
    setPendingMs(def);
  };

  // Ξεκίνημα παιχνιδιού
  const startGame = (selectedDream: Dream) => {
    setDream(selectedDream);
    setPhase("shop");
    setWeek(1);
    setCoins(100 + bookBonus);
    setDebt(0);
    setOwned({ lego:0, techkids:0, foodco:0 });
    setOverrides({ lego:0, techkids:0, foodco:0 });
    setBought(new Set());
    setOwnedBiz(new Set());
    setRecurring([]);
    setWisdom(0);
    setEvent(null);
    setUsedEvts([]);
    setUsedOpp([]);
    setOppResult(null);
    setWeekReport(null);
    setWeekChallenge(WEEK_CHALLENGES[Math.floor(Math.random() * WEEK_CHALLENGES.length)]);
    setChallengeWon(null);
    setMiniQuiz(null);
    setMiniQuizResult(null);
    setMilestones(new Set());
    setPendingMs(null);
    setWeekStocks(0);
    setCrashDone(false);
    setUsedQuizIdx([]);
  };

  const buyProduct = (prod: Product) => {
    if (bought.has(prod.id)) return;
    spend(prod.price);
    setBought(prev => new Set([...prev, prod.id]));
    if (prod.type === "need") setWisdom(w => w + 2);
    if (prod.recurringCost) setRecurring(prev => [...prev, { name: prod.recurringLabel!, emoji: prod.emoji, cost: prod.recurringCost! }]);
  };

  const undoProduct = (prod: Product) => {
    if (!bought.has(prod.id)) return;
    setBought(prev => { const n = new Set(prev); n.delete(prod.id); return n; });
    earn(prod.price);
    if (prod.type === "need") setWisdom(w => Math.max(0, w - 2));
    if (prod.recurringCost) setRecurring(prev => { const idx = prev.findIndex(r => r.name === prod.recurringLabel); return idx === -1 ? prev : [...prev.slice(0, idx), ...prev.slice(idx + 1)]; });
  };

  const buyBusiness = (biz: BizDef) => {
    if (ownedBiz.has(biz.id) || coins < biz.cost) return;
    spend(biz.cost);
    setOwnedBiz(prev => {
      const next = new Set([...prev, biz.id]);
      if (!milestones.has("first_biz")) setTimeout(() => checkMilestone("first_biz", 5), 100);
      if (next.size >= 3 && !milestones.has("triple_biz")) setTimeout(() => checkMilestone("triple_biz", 10), 100);
      return next;
    });
    setWisdom(w => w + 3);
  };

  const buyStock = (id: StockId) => {
    spend(getPrice(week, id));
    setOwned(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setWeekStocks(s => {
      if (s === 0 && !milestones.has("first_stock")) setTimeout(() => checkMilestone("first_stock", 5), 100);
      return s + 1;
    });
  };
  const sellStock = (id: StockId) => {
    if (owned[id] <= 0) return;
    earn(getPrice(week, id));
    setOwned(prev => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const goToEvent = () => {
    // Εβδομάδα 4: Κρίση αγοράς (μία φορά)
    if (week === 4 && !crashDone) {
      setCrashDone(true);
      setEvent({ kind: "crash" });
      setOppResult(null);
      setPhase("event");
      return;
    }

    const availOpp = OPPORTUNITIES.map((_,i) => i).filter(i => !usedOpp.includes(i));
    const availPas = PASSIVE_EVENTS.map((_,i) => i).filter(i => !usedEvts.includes(i));
    const showOpp  = availOpp.length > 0 && Math.random() < 0.40;

    if (showOpp) {
      const idx = availOpp[Math.floor(Math.random() * availOpp.length)];
      setEvent(OPPORTUNITIES[idx]);
      setUsedOpp(prev => [...prev, idx]);
    } else {
      const pool = availPas.length > 0 ? availPas : PASSIVE_EVENTS.map((_,i) => i);
      const idx  = pool[Math.floor(Math.random() * pool.length)];
      setEvent(PASSIVE_EVENTS[idx]);
      setUsedEvts(prev => [...prev, idx]);
    }
    setOppResult(null);
    setPhase("event");
  };

  const applyCrash = () => {
    setOverrides(prev => ({
      lego:     prev.lego - 4,
      techkids: prev.techkids - 6,
      foodco:   prev.foodco - 2,
    }));
    setPhase("summary");
  };

  const applyPassiveEvent = (ev: PassiveEvent) => {
    if (ev.coins > 0) earn(ev.coins);
    else if (ev.coins < 0) spend(Math.abs(ev.coins));
    if (ev.stock) setOverrides(prev => ({ ...prev, [ev.stock!.id]: prev[ev.stock!.id] + ev.stock!.delta }));
    setPhase("summary");
  };

  const decideOpportunity = (yes: boolean) => {
    const opp = event as OpportunityEvent;
    if (!yes) { setOppResult(null); setPhase("summary"); return; }
    spend(opp.cost);
    const success = Math.random() < opp.successRate;
    earn(success ? opp.gainIfSuccess : opp.gainIfFail);
    setOppResult({ success, gain: success ? opp.gainIfSuccess : opp.gainIfFail });
  };

  // Επόμενη εβδομάδα
  const nextWeek = () => {
    // Έλεγχος challenge
    const products = WEEKLY_PRODUCTS[week - 1];
    const boughtWants = products.filter(p => p.type === "want" && bought.has(p.id));
    const boughtNeeds = products.filter(p => p.type === "need" && bought.has(p.id));
    let won = false;
    if (weekChallenge) {
      if (weekChallenge.type === "needs_only"    && boughtWants.length === 0) won = true;
      if (weekChallenge.type === "no_buy"        && bought.size === 0)        won = true;
      if (weekChallenge.type === "double_stocks" && weekStocks >= 2)          won = true;
      if (weekChallenge.type === "save_half"     && coins >= 15)              won = true;
    }
    setChallengeWon(won);
    if (won) { earn(15); setWisdom(w => w + 5); }

    // Έλεγχος milestones
    if (debt === 0) checkMilestone("no_debt", 8);
    if (boughtNeeds.length === products.filter(p => p.type === "need").length && boughtNeeds.length > 0)
      checkMilestone("all_needs", 5);

    if (week >= TOTAL_WEEKS) { setPhase("results"); return; }

    const biz = bizIncome();
    const rec = recurringTotal();
    setWeekReport({ biz, rec });
    earn(ALLOWANCE + biz);
    if (rec > 0) spend(rec);
    setWeek(w => w + 1);
    setBought(new Set());
    setEvent(null);
    setOppResult(null);
    setWeekStocks(0);

    // Νέο challenge για επόμενη εβδομάδα
    const nextCh = WEEK_CHALLENGES[Math.floor(Math.random() * WEEK_CHALLENGES.length)];
    setWeekChallenge(nextCh);
    setChallengeWon(null);

    // Mini quiz (40% πιθανότητα)
    const availQ = MINI_QUIZZES.map((_,i) => i).filter(i => !usedQuizIdx.includes(i));
    if (availQ.length > 0 && Math.random() < 0.40) {
      const qi = availQ[Math.floor(Math.random() * availQ.length)];
      setMiniQuiz(MINI_QUIZZES[qi]);
      setUsedQuizIdx(prev => [...prev, qi]);
      setMiniQuizResult(null);
    } else {
      setMiniQuiz(null);
    }

    // Dream 50% milestone
    setPhase("weekstart");
  };

  const answerMiniQuiz = (idx: number) => {
    if (miniQuizResult !== null || !miniQuiz) return;
    const correct = idx === miniQuiz.correct;
    setMiniQuizResult(correct);
    if (correct) { earn(miniQuiz.reward); setWisdom(w => w + 2); }
  };

  const products = WEEKLY_PRODUCTS[week - 1];

  // ─── Status Bar ──────────────────────────────────────────────────────────────
  const StatusBar = () => (
    <div className="bg-white border-b px-4 py-2 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Εβδ. {week}/{TOTAL_WEEKS}</span>
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
              <div key={i} className={`h-2 w-4 rounded-full ${i < week ? "bg-green-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {debt > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">⚠️ Χρέος {debt}</span>}
          <span className="font-bold text-green-700">💰 {coins}</span>
          {portfolio() > 0 && <span className="text-blue-600 text-xs">📊 {portfolio()}</span>}
          {bizIncome() > 0 && <span className="text-purple-600 text-xs">🏪 +{bizIncome()}/εβδ.</span>}
        </div>
      </div>
      {dream && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 shrink-0">{dream.emoji} {dream.name}</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width:`${dreamPct()}%` }} />
          </div>
          <span className="text-xs text-gray-500 shrink-0">{dreamPct()}%</span>
        </div>
      )}
      {weekChallenge && (
        <div className="mt-1 text-xs bg-amber-50 text-amber-700 rounded-lg px-2 py-1">
          {weekChallenge.emoji} <strong>Challenge:</strong> {weekChallenge.title}
        </div>
      )}
    </div>
  );

  // Milestone popup overlay
  const MilestonePopup = () => {
    if (!pendingMs) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 pointer-events-none">
        <div className="bg-white border-2 border-yellow-400 rounded-2xl shadow-2xl px-6 py-4 text-center max-w-xs animate-bounce pointer-events-auto"
          onClick={() => setPendingMs(null)}>
          <div className="text-3xl mb-1">{pendingMs.emoji}</div>
          <div className="font-bold text-gray-800">{pendingMs.title}</div>
          <div className="text-green-600 font-bold text-sm">+{pendingMs.coins} νομίσματα!</div>
          <div className="text-xs text-gray-400 mt-1">Πάτα για κλείσιμο</div>
        </div>
      </div>
    );
  };

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏙️</div>
          <h1 className="text-2xl font-bold text-green-800">Η Δική μου Πόλη</h1>
          <p className="text-gray-500 text-xs mb-2">από KidsInBusiness.gr</p>
          <p className="text-gray-600 text-sm">Διαχειρίσου τα χρήματά σου για 6 εβδομάδες. Αγόρασε επιχειρήσεις, επένδυε, πιάσε το όνειρό σου!</p>
        </div>

        {bookBonus > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 mb-4 text-center">
            <div className="text-xl">🎓</div>
            <div className="font-bold text-yellow-800 text-sm">Bonus από το βιβλίο!</div>
            <div className="text-yellow-700 text-sm">Ξεκινάς με <strong>+{bookBonus} extra νομίσματα</strong> λόγω των quiz που έλυσες!</div>
          </div>
        )}

        <div className="bg-amber-50 rounded-xl p-4 mb-4">
          <p className="font-semibold text-amber-800 text-sm mb-3">🎯 Ποιο είναι το Όνειρό σου;</p>
          <div className="space-y-2">
            {DREAMS.map(d => (
              <button key={d.id} onClick={() => startGame(d)}
                className="w-full text-left p-3 bg-white rounded-xl border-2 border-amber-200 hover:border-amber-500 hover:bg-amber-50 transition-all flex items-center gap-3">
                <span className="text-3xl">{d.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.desc} — χρειάζεσαι {d.cost} νομίσματα</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-3 text-xs text-gray-600 space-y-1 mb-4">
          <div>💰 <strong>30 νομίσματα</strong> χαρτζιλίκι κάθε εβδομάδα</div>
          <div>🏪 Αγόρασε επιχείρηση → <strong>παθητικό εισόδημα</strong> κάθε εβδομάδα</div>
          <div>🎯 Κάθε εβδομάδα έχει <strong>challenge</strong> — κέρδισε bonus νομίσματα!</div>
          <div>🧠 <strong>Mini quiz</strong> για bonus & κάρτες ευκαιρίας με μεγάλες αποφάσεις</div>
          <div>💥 Πρόσεχε: στην εβδομάδα 4 υπάρχει <strong>κρίση αγοράς!</strong></div>
        </div>

        <button onClick={() => navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-600">
          ← Πίσω στο βιβλίο
        </button>
      </div>
    </div>
  );

  // ─── WEEKSTART ───────────────────────────────────────────────────────────────
  if (phase === "weekstart") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <MilestonePopup />

      {/* Mini Quiz Overlay */}
      {miniQuiz && miniQuizResult === null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🧠</div>
              <div className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block mb-2">BONUS ΕΡΩΤΗΣΗ</div>
              <p className="text-xs text-gray-500">Απάντησε σωστά και κέρδισε {miniQuiz.reward} νομίσματα!</p>
            </div>
            <p className="font-bold text-gray-800 text-center mb-4">{miniQuiz.question}</p>
            <div className="space-y-2">
              {miniQuiz.options.map((opt, i) => (
                <button key={i} onClick={() => answerMiniQuiz(i)}
                  className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all text-sm">
                  {String.fromCharCode(65+i)}. {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mini Quiz Result */}
      {miniQuiz && miniQuizResult !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="text-5xl mb-3">{miniQuizResult ? "🎉" : "😅"}</div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">
              {miniQuizResult ? "Σωστό!" : "Λάθος..."}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {miniQuizResult
                ? `Κέρδισες ${miniQuiz.reward} νομίσματα! Συνέχισε έτσι!`
                : `Η σωστή απάντηση ήταν: "${miniQuiz.options[miniQuiz.correct]}"`}
            </p>
            <Button onClick={() => setMiniQuiz(null)} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Συνέχεια →
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1 text-center">📅 Εβδομάδα {week}</h2>
        <p className="text-xs text-gray-500 text-center mb-4">Να τι συνέβη στον λογαριασμό σου:</p>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between p-3 bg-green-50 rounded-xl">
            <span>💰 Εβδομαδιαίο χαρτζιλίκι</span>
            <span className="font-bold text-green-700">+{ALLOWANCE}</span>
          </div>
          {weekReport && weekReport.biz > 0 && (
            <div className="flex justify-between p-3 bg-blue-50 rounded-xl">
              <span>🏪 Έσοδα από επιχειρήσεις</span>
              <span className="font-bold text-blue-700">+{weekReport.biz}</span>
            </div>
          )}
          {weekReport && weekReport.rec > 0 && recurring.map((r, i) => (
            <div key={i} className="flex justify-between p-3 bg-orange-50 rounded-xl">
              <span>{r.emoji} {r.name}</span>
              <span className="font-bold text-orange-700">-{r.cost}</span>
            </div>
          ))}
          <div className="flex justify-between p-3 bg-gray-100 rounded-xl border-2 border-gray-200">
            <span className="font-bold">Καθαρό εισόδημα</span>
            <span className={`font-bold text-lg ${ALLOWANCE + (weekReport?.biz ?? 0) - (weekReport?.rec ?? 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
              {ALLOWANCE + (weekReport?.biz ?? 0) - (weekReport?.rec ?? 0) > 0 ? "+" : ""}
              {ALLOWANCE + (weekReport?.biz ?? 0) - (weekReport?.rec ?? 0)}
            </span>
          </div>
        </div>

        {/* Challenge εβδομάδας */}
        {weekChallenge && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{weekChallenge.emoji}</span>
              <span className="font-bold text-amber-800 text-sm">{weekChallenge.title}</span>
            </div>
            <p className="text-xs text-amber-700">{weekChallenge.desc}</p>
          </div>
        )}

        <Button onClick={() => setPhase("shop")} className="w-full bg-green-600 hover:bg-green-700 text-white">
          Πάμε στην αγορά! →
        </Button>
      </div>
    </div>
  );

  // ─── SHOP ────────────────────────────────────────────────────────────────────
  if (phase === "shop") return (
    <div className="min-h-screen bg-gray-50">
      <MilestonePopup />
      <StatusBar />
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">🛒 Αγορά — Εβδομάδα {week}</h2>
        <p className="text-sm text-gray-500 mb-4">Έχεις 💰 {coins} νομίσματα. Τι χρειάζεσαι αυτή την εβδομάδα;</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {products.map(prod => {
            const isBought = bought.has(prod.id);
            const isNeed   = prod.type === "need";
            return (
              <div key={prod.id}
                className={`border-2 rounded-xl p-3 bg-white shadow-sm transition-all ${isNeed ? "border-green-400" : "border-yellow-400"} ${isBought ? "bg-gray-50" : ""}`}>
                <div className="text-3xl text-center mb-1">{prod.emoji}</div>
                <div className="font-bold text-center text-gray-800 text-xs mb-1">{prod.name}</div>
                <div className={`text-xs text-center px-1 py-0.5 rounded-full mb-1 ${isNeed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {isNeed ? "ΑΝΑΓΚΗ" : "ΕΠΙΘΥΜΙΑ"}
                </div>
                <div className="text-center font-bold text-green-700 text-sm">💰 {prod.price}</div>
                {prod.recurringCost && <div className="text-center text-xs text-orange-600 mt-0.5 mb-1">⚠️ +{prod.recurringCost}/εβδ.</div>}
                <div className="mt-2">
                  {isBought ? (
                    <div className="space-y-1">
                      <div className="text-center text-xs text-green-600 font-semibold">✓ Αγοράστηκε</div>
                      <Button size="sm" onClick={() => undoProduct(prod)}
                        className="w-full text-xs bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200">
                        ↩ Αναίρεση
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => buyProduct(prod)}
                      className="w-full text-xs bg-green-600 hover:bg-green-700 text-white">
                      Αγορά
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Επιχειρήσεις */}
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <h3 className="font-bold text-blue-800 mb-1">🏪 Επιχειρήσεις</h3>
          <p className="text-xs text-blue-600 mb-3">Αγόρασε μία φορά → κερδίζεις νομίσματα αυτόματα κάθε εβδομάδα!</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {BUSINESSES.map(biz => {
              const isOwned = ownedBiz.has(biz.id);
              return (
                <div key={biz.id} className={`p-3 rounded-xl border-2 text-center ${isOwned ? "bg-blue-100 border-blue-400" : "bg-white border-blue-200"}`}>
                  <div className="text-2xl mb-1">{biz.emoji}</div>
                  <div className="font-bold text-gray-800 text-xs mb-0.5">{biz.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{biz.desc}</div>
                  <div className="text-xs text-blue-700 font-bold mb-2">+{biz.income} νομίσματα/εβδ.</div>
                  {isOwned ? (
                    <div className="text-xs text-blue-700 font-semibold">✓ Ενεργή!</div>
                  ) : (
                    <Button size="sm" onClick={() => buyBusiness(biz)} disabled={coins < biz.cost}
                      className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white">
                      Αγορά 💰 {biz.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700 mb-4">
          💡 Μια επιχείρηση αξίζει περισσότερο όσο νωρίτερα την αγοράσεις!
        </div>

        <Button onClick={() => setPhase("stocks")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Πάμε στο Χρηματιστήριο →
        </Button>
      </div>
    </div>
  );

  // ─── STOCKS ──────────────────────────────────────────────────────────────────
  if (phase === "stocks") {
    const prevP = week > 1
      ? { lego: getPrice(week-1,"lego"), techkids: getPrice(week-1,"techkids"), foodco: getPrice(week-1,"foodco") }
      : null;
    return (
      <div className="min-h-screen bg-gray-50">
        <MilestonePopup />
        <StatusBar />
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">📈 Χρηματιστήριο — Εβδομάδα {week}</h2>
          {week === 3 && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-3 mb-3 text-xs text-red-700">
              ⚠️ <strong>Προειδοποίηση:</strong> Την επόμενη εβδομάδα αναμένεται κρίση αγοράς! Σκέψου αν θέλεις να πουλήσεις μετοχές πριν.
            </div>
          )}
          <p className="text-sm text-gray-500 mb-4">Αγόρασε μετοχές τώρα, πούλα αργότερα ακριβότερα!</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {STOCK_DEFS.map(def => {
              const price = getPrice(week, def.id);
              const prev  = prevP ? prevP[def.id] : price;
              const diff  = price - prev;
              const trendColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-400";
              return (
                <div key={def.id} className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{def.emoji}</span>
                    <span className={`text-xl font-bold ${trendColor}`}>{diff > 0 ? "↑" : diff < 0 ? "↓" : "→"}</span>
                  </div>
                  <div className="font-bold text-gray-800 text-sm">{def.name}</div>
                  <div className="text-xs text-gray-400 mb-1">{def.desc}</div>
                  {prevP && diff !== 0 && <div className={`text-xs mb-1 ${trendColor}`}>{diff > 0 ? `+${diff}` : diff} από περ. εβδ.</div>}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-700">💰 {price}</span>
                    <span className="text-xs text-gray-500">{owned[def.id]} μτχ.</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => buyStock(def.id)} disabled={coins < price}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs">Αγορά</Button>
                    <Button size="sm" variant="outline" onClick={() => sellStock(def.id)} disabled={owned[def.id] === 0}
                      className="flex-1 text-xs">Πώληση</Button>
                  </div>
                </div>
              );
            })}
          </div>
          {portfolio() > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 mb-4">
              📊 Συνολική αξία μετοχών σου: <strong>{portfolio()} νομίσματα</strong>
            </div>
          )}
          <Button onClick={goToEvent} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Δες τι συνέβη αυτή την εβδομάδα →
          </Button>
        </div>
      </div>
    );
  }

  // ─── EVENT ───────────────────────────────────────────────────────────────────
  if (phase === "event") {
    // Κρίση αγοράς
    if (event?.kind === "crash") return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">💥</div>
          <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full mb-3 inline-block">ΚΡΙΣΗ ΑΓΟΡΑΣ</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-3">Μεγάλη Πτώση!</h2>
          <p className="text-gray-600 text-sm mb-5">
            Παγκόσμια οικονομική κρίση! Όλες οι μετοχές πέφτουν απότομα.
            Αυτή είναι η στιγμή που οι έξυπνοι επενδυτές <strong>κρατούν τα νεύρα τους</strong> και περιμένουν να ανακάμψει η αγορά.
          </p>
          <div className="bg-red-50 rounded-xl p-4 mb-5 text-sm space-y-1 text-left">
            <div className="flex justify-between"><span>🧱 LEGO Α.Ε.</span><span className="text-red-600 font-bold">-4 ανά μετοχή</span></div>
            <div className="flex justify-between"><span>💻 ΤεχνοΠαιδιά</span><span className="text-red-600 font-bold">-6 ανά μετοχή</span></div>
            <div className="flex justify-between"><span>🥗 ΤροφίμαΑΕ</span><span className="text-red-600 font-bold">-2 ανά μετοχή</span></div>
          </div>
          {portfolio() > 0 && (
            <div className="bg-amber-50 rounded-xl p-3 mb-4 text-xs text-amber-700">
              💡 Έχεις μετοχές! Μην πανικοβληθείς — οι τιμές μπορεί να ανακάμψουν στις επόμενες εβδομάδες.
            </div>
          )}
          <Button onClick={applyCrash} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Κατάλαβα — Συνέχεια →
          </Button>
        </div>
      </div>
    );

    // Αποτέλεσμα ευκαιρίας
    if (event?.kind === "opportunity" && oppResult !== null) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">{oppResult.success ? "🎉" : "😔"}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{oppResult.success ? "Τα κατάφερες!" : "Δεν πήγε καλά..."}</h2>
          <p className="text-gray-600 mb-4 text-sm">
            {oppResult.success
              ? "Μπράβο! Η απόφασή σου να ρισκάρεις ανταποδόθηκε."
              : "Δεν ήταν η τύχη σου αυτή τη φορά. Το ρίσκο δεν ανταποδόθηκε."}
          </p>
          <div className={`text-2xl font-bold mb-6 ${oppResult.success ? "text-green-600" : "text-orange-600"}`}>
            +{oppResult.gain} νομίσματα πίσω
          </div>
          <Button onClick={() => setPhase("summary")} className="w-full bg-purple-600 hover:bg-purple-700 text-white">Συνέχεια →</Button>
        </div>
      </div>
    );

    // Απόφαση ευκαιρίας
    if (event?.kind === "opportunity") {
      const opp = event as OpportunityEvent;
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-3">{opp.emoji}</div>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-3 inline-block">🎯 ΚΑΡΤΑ ΕΥΚΑΙΡΙΑΣ</span>
            <h2 className="text-xl font-bold text-gray-800 mt-3 mb-3">{opp.title}</h2>
            <p className="text-gray-600 text-sm mb-5">{opp.body}</p>
            <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm space-y-2 text-left">
              <div className="flex justify-between"><span className="text-gray-500">Κόστος τώρα:</span><span className="font-bold text-red-600">-{opp.cost} 💰</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Αν πάει καλά:</span><span className="font-bold text-green-600">+{opp.gainIfSuccess} 💰</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Αν δεν πάει καλά:</span><span className="font-bold text-orange-500">+{opp.gainIfFail} 💰</span></div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => decideOpportunity(true)} disabled={coins < opp.cost}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm">Ναι, ρισκάρω!</Button>
              <Button onClick={() => decideOpportunity(false)} variant="outline" className="flex-1 text-sm">Όχι, ευχαριστώ</Button>
            </div>
            {coins < opp.cost && <p className="text-xs text-red-500 mt-2">Δεν έχεις αρκετά νομίσματα.</p>}
          </div>
        </div>
      );
    }

    // Παθητικό γεγονός
    const pev = event as PassiveEvent;
    if (!pev) return null;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">{pev.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{pev.title}</h2>
          <p className="text-gray-600 mb-6 text-sm">{pev.body}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            {pev.coins !== 0 && (
              <div className={`text-xl font-bold ${pev.coins > 0 ? "text-green-600" : "text-red-600"}`}>
                {pev.coins > 0 ? `+${pev.coins}` : pev.coins} 💰 νομίσματα
              </div>
            )}
            {pev.stock && (
              <div className={`text-lg font-bold ${pev.stock.delta > 0 ? "text-green-600" : "text-red-600"}`}>
                {STOCK_DEFS.find(s => s.id === pev.stock!.id)?.name}: {pev.stock.delta > 0 ? `+${pev.stock.delta}` : pev.stock.delta} ανά μετοχή
              </div>
            )}
            {pev.coins === 0 && !pev.stock && <div className="text-gray-500 text-sm">Καμία άμεση επίπτωση.</div>}
          </div>
          <Button onClick={() => applyPassiveEvent(pev)} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Κατάλαβα! →
          </Button>
        </div>
      </div>
    );
  }

  // ─── SUMMARY ─────────────────────────────────────────────────────────────────
  if (phase === "summary") {
    const isLast      = week >= TOTAL_WEEKS;
    const boughtNeeds = products.filter(p => p.type === "need" && bought.has(p.id));
    const boughtWants = products.filter(p => p.type === "want" && bought.has(p.id));
    const skipped     = products.filter(p => p.type === "need" && !bought.has(p.id));
    return (
      <div className="min-h-screen bg-gray-50">
        <MilestonePopup />
        <StatusBar />
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Σύνοψη — Εβδομάδα {week}</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div>💰</div><div className="text-xl font-bold text-green-700">{coins}</div><div className="text-xs text-gray-500">νομίσματα</div></div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div>📊</div><div className="text-xl font-bold text-blue-700">{portfolio()}</div><div className="text-xs text-gray-500">μετοχές</div></div>
            <div className="bg-white rounded-xl p-3 text-center shadow-sm"><div>🏪</div><div className="text-xl font-bold text-purple-700">+{bizIncome()}</div><div className="text-xs text-gray-500">επόμ. εβδ.</div></div>
          </div>

          {/* Challenge result */}
          {weekChallenge && challengeWon !== null && (
            <div className={`rounded-xl p-3 mb-3 text-sm ${challengeWon ? "bg-green-100 border-2 border-green-400" : "bg-gray-100"}`}>
              <span className="font-bold">{weekChallenge.emoji} Challenge "{weekChallenge.title}": </span>
              {challengeWon
                ? <span className="text-green-700 font-bold">✓ Τα κατάφερες! +15 νομίσματα 🎉</span>
                : <span className="text-gray-500">Δεν το πέτυχες αυτή τη φορά — την επόμενη!</span>}
            </div>
          )}

          {debt > 0 && (
            <div className="bg-red-50 rounded-xl p-3 text-center mb-3">
              <span className="font-bold text-red-700">⚠️ Χρέος: {debt} νομίσματα</span>
              <span className="text-xs text-red-400 block">ποινή ×1,5 στο τελικό αποτέλεσμα</span>
            </div>
          )}
          {boughtNeeds.length > 0 && (
            <div className="bg-green-50 rounded-xl p-3 mb-2 text-sm">
              <span className="font-semibold text-green-800">✅ Ανάγκες: </span>
              {boughtNeeds.map(p => `${p.emoji} ${p.name}`).join(" · ")}
            </div>
          )}
          {boughtWants.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-3 mb-2 text-sm">
              <span className="font-semibold text-yellow-700">🛍️ Επιθυμίες: </span>
              {boughtWants.map(p => `${p.emoji} ${p.name}`).join(" · ")}
              {boughtWants.some(p => p.recurringCost) && (
                <span className="text-orange-500 text-xs block mt-1">
                  ⚠️ {boughtWants.filter(p => p.recurringCost).map(p => `${p.name}: -${p.recurringCost}/εβδ.`).join(", ")}
                </span>
              )}
            </div>
          )}
          {skipped.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-3 mb-2 text-sm">
              <span className="font-semibold text-orange-700">⚠️ Παρέλειψες: </span>
              {skipped.map(p => `${p.emoji} ${p.name}`).join(" · ")}
            </div>
          )}
          {event && (
            <div className="bg-purple-50 rounded-xl p-3 mb-4 text-sm">
              <span className="font-semibold text-purple-800">
                {event.kind === "crash" ? "💥" : (event as PassiveEvent | OpportunityEvent).emoji} Γεγονός:{" "}
              </span>
              {event.kind === "crash" ? "Κρίση Αγοράς — όλες οι μετοχές έπεσαν" : (event as PassiveEvent | OpportunityEvent).title}
              {event.kind === "opportunity" && oppResult && (
                <span className={`font-bold ml-1 ${oppResult.success ? "text-green-600" : "text-orange-600"}`}>
                  — {oppResult.success ? `Επιτυχία! +${oppResult.gain}` : `Πήρες πίσω ${oppResult.gain}`}
                </span>
              )}
            </div>
          )}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Συνολική αξία αυτή τη στιγμή</div>
            <div className="text-3xl font-bold text-green-700">{netWorth()} 💰</div>
            {dream && (
              <div className={`text-xs mt-1 ${netWorth() >= dream.cost ? "text-green-600 font-semibold" : "text-amber-600"}`}>
                {netWorth() >= dream.cost
                  ? `🎉 Έχεις αρκετά για ${dream.emoji} ${dream.name}!`
                  : `${dream.emoji} Χρειάζεσαι άλλα ${dream.cost - netWorth()} νομίσματα`}
              </div>
            )}
          </div>
          <Button onClick={nextWeek} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
            {isLast ? "🏁 Δες τα Αποτελέσματα!" : `Εβδομάδα ${week + 1} →`}
          </Button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const dreamAchieved = dream && netWorth() >= dream.cost;
    const score = netWorth() + wisdom + (dreamAchieved ? 30 : 0);
    const grade = score >= 130 ? { label:"Άριστος Επενδυτής",       stars:"⭐⭐⭐", msg:"Εξαιρετική διαχείριση! Η πόλη σου λάμπει!" }
      : score >= 80  ? { label:"Καλός Επενδυτής",         stars:"⭐⭐",   msg:"Πολύ καλή δουλειά! Μάθες πολλά αυτές τις 6 εβδομάδες." }
      : score >= 35  ? { label:"Μαθητευόμενος Επενδυτής", stars:"⭐",    msg:"Καλή αρχή! Την επόμενη φορά θα τα πας ακόμα καλύτερα." }
      :                { label:"Αρχάριος Επενδυτής",      stars:"🌱",    msg:"Κάθε εμπειρία είναι μάθηση! Ξαναπαίξε και δες τη διαφορά." };
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            {dreamAchieved && (
              <div className="bg-amber-100 text-amber-800 rounded-xl p-3 mb-4 font-bold text-sm">
                🎉 Κατάφερες να αγοράσεις {dream!.emoji} {dream!.name}!
              </div>
            )}
            <div className="text-5xl mb-2">{grade.stars}</div>
            <h2 className="text-2xl font-bold text-gray-800">{grade.label}</h2>
            <p className="text-sm text-gray-500 mt-1">{grade.msg}</p>
          </div>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between p-2 bg-green-50 rounded-lg"><span>💰 Νομίσματα</span><span className="font-bold">{coins}</span></div>
            <div className="flex justify-between p-2 bg-blue-50 rounded-lg"><span>📊 Μετοχές</span><span className="font-bold">{portfolio()}</span></div>
            <div className="flex justify-between p-2 bg-purple-50 rounded-lg">
              <span>🏪 Επιχειρήσεις</span>
              <span className="font-bold">{[...ownedBiz].length > 0 ? [...ownedBiz].map(id => BUSINESSES.find(b => b.id === id)?.emoji).join(" ") : "Καμία"}</span>
            </div>
            {milestones.size > 0 && (
              <div className="flex justify-between p-2 bg-yellow-50 rounded-lg">
                <span>🏅 Επιτεύγματα</span>
                <span className="font-bold text-yellow-700">{[...milestones].map(id => MILESTONES_DEF.find(m => m.id === id)?.emoji).join(" ")}</span>
              </div>
            )}
            {debt > 0 && <div className="flex justify-between p-2 bg-red-50 rounded-lg"><span>⚠️ Χρέος (ποινή ×1,5)</span><span className="font-bold text-red-600">-{Math.round(debt*1.5)}</span></div>}
            <div className="flex justify-between p-2 bg-amber-50 rounded-lg"><span>🧠 Σωστές αποφάσεις + challenges</span><span className="font-bold text-amber-700">+{wisdom}</span></div>
            {dreamAchieved && <div className="flex justify-between p-2 bg-yellow-50 rounded-lg"><span>{dream!.emoji} Bonus ονείρου</span><span className="font-bold text-yellow-700">+30</span></div>}
            {bookBonus > 0 && <div className="flex justify-between p-2 bg-indigo-50 rounded-lg"><span>🎓 Bonus από βιβλίο</span><span className="font-bold text-indigo-700">+{bookBonus} (εκκίνηση)</span></div>}
            <div className="flex justify-between p-3 bg-gray-100 rounded-xl border-2 border-gray-200">
              <span className="font-bold">Τελικό Σκορ</span><span className="text-xl font-bold">{score}</span>
            </div>
          </div>
          <Button onClick={() => setPhase("intro")} className="w-full bg-green-600 hover:bg-green-700 text-white mb-2">
            🔄 Παίξε ξανά!
          </Button>
          <button onClick={() => navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-700 py-2">
            ← Πίσω στο βιβλίο
          </button>
        </div>
      </div>
    );
  }

  return null;
}
