import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────
type GamePhase = "intro" | "shop" | "stocks" | "event" | "summary" | "results";
type StockId = "lego" | "techkids" | "foodco";

interface Product { id: string; name: string; emoji: string; type: "need" | "want"; price: number; }
interface StockDef { id: StockId; name: string; emoji: string; desc: string; volatile: boolean; }
interface GameEvent { emoji: string; title: string; body: string; coins: number; stock?: { id: StockId; delta: number }; }

// ─── Static data ──────────────────────────────────────────────────────────────
const ALLOWANCE = 30;
const TOTAL_WEEKS = 6;

const STOCK_DEFS: StockDef[] = [
  { id: "lego",     name: "LEGO Corp", emoji: "🧱", desc: "Σταθερή εταιρεία παιχνιδιών",   volatile: false },
  { id: "techkids", name: "TechKids",  emoji: "💻", desc: "Τεχνολογία — ανεβοκατεβαίνει!", volatile: true  },
  { id: "foodco",   name: "FoodCo",    emoji: "🥗", desc: "Τρόφιμα — αργά αλλά σταθερά",   volatile: false },
];

const BASE_PRICES: Record<StockId, number[]> = {
  lego:     [10, 11, 10, 12, 11, 13],
  techkids: [15, 18, 13, 20, 16, 22],
  foodco:   [ 8,  8,  9,  9, 10, 10],
};

const WEEKLY_PRODUCTS: Product[][] = [
  [
    { id:"f1", name:"Φαγητό",          emoji:"🍕", type:"need", price:5  },
    { id:"s1", name:"Σχολικά",         emoji:"📚", type:"need", price:8  },
    { id:"m1", name:"Φάρμακο",         emoji:"💊", type:"need", price:6  },
    { id:"i1", name:"Παγωτό",          emoji:"🍦", type:"want", price:3  },
    { id:"g1", name:"Βιντεοπαιχνίδι",  emoji:"🎮", type:"want", price:20 },
  ],
  [
    { id:"f2", name:"Φαγητό",          emoji:"🍕", type:"need", price:6  },
    { id:"c2", name:"Ρούχα",           emoji:"👕", type:"need", price:12 },
    { id:"m2", name:"Φάρμακο",         emoji:"💊", type:"need", price:6  },
    { id:"k2", name:"Κινηματογράφος",  emoji:"🎬", type:"want", price:7  },
    { id:"w2", name:"Γλυκά",           emoji:"🍬", type:"want", price:4  },
  ],
  [
    { id:"f3", name:"Φαγητό",          emoji:"🍕", type:"need", price:6  },
    { id:"b3", name:"Τσάντα σχολείου", emoji:"🎒", type:"need", price:15 },
    { id:"m3", name:"Φάρμακο",         emoji:"💊", type:"need", price:7  },
    { id:"o3", name:"Μπάλα",           emoji:"⚽", type:"want", price:10 },
    { id:"i3", name:"Παγωτό",          emoji:"🍦", type:"want", price:4  },
  ],
  [
    { id:"f4", name:"Φαγητό",          emoji:"🍕", type:"need", price:7  },
    { id:"s4", name:"Σχολικά",         emoji:"📚", type:"need", price:9  },
    { id:"c4", name:"Ρούχα",           emoji:"👕", type:"need", price:13 },
    { id:"g4", name:"Βιντεοπαιχνίδι",  emoji:"🎮", type:"want", price:22 },
    { id:"w4", name:"Γλυκά",           emoji:"🍬", type:"want", price:4  },
  ],
  [
    { id:"f5", name:"Φαγητό",          emoji:"🍕", type:"need", price:7  },
    { id:"m5", name:"Φάρμακο",         emoji:"💊", type:"need", price:8  },
    { id:"r5", name:"Χρώματα",         emoji:"🎨", type:"need", price:8  },
    { id:"k5", name:"Κινηματογράφος",  emoji:"🎬", type:"want", price:8  },
    { id:"o5", name:"Μπάλα",           emoji:"⚽", type:"want", price:11 },
  ],
  [
    { id:"f6", name:"Φαγητό",          emoji:"🍕", type:"need", price:8  },
    { id:"s6", name:"Σχολικά",         emoji:"📚", type:"need", price:10 },
    { id:"c6", name:"Ρούχα",           emoji:"👕", type:"need", price:14 },
    { id:"g6", name:"Βιντεοπαιχνίδι",  emoji:"🎮", type:"want", price:23 },
    { id:"i6", name:"Παγωτό",          emoji:"🍦", type:"want", price:5  },
  ],
];

const EVENTS: GameEvent[] = [
  { emoji:"🎂", title:"Γενέθλια!",           body:"Η γιαγιά σου σου έδωσε χαρτζιλίκι!",                              coins:15  },
  { emoji:"🚲", title:"Ατύχημα!",            body:"Το ποδήλατό σου χάλασε και χρειάστηκε επισκευή.",                 coins:-10 },
  { emoji:"📈", title:"Νέο Gadget!",         body:"Η TechKids ανακοίνωσε νέο προϊόν. Οι μετοχές εκτινάχθηκαν!",    coins:0,  stock:{ id:"techkids", delta:4  } },
  { emoji:"📉", title:"Σκάνδαλο LEGO!",      body:"Ανάκληση προϊόντων. Η τιμή της LEGO έπεσε.",                     coins:0,  stock:{ id:"lego",     delta:-3 } },
  { emoji:"🌧️", title:"Κακοκαιρία!",        body:"Πλημμύρες στις αποθήκες τροφίμων. Η FoodCo ανεβαίνει.",          coins:0,  stock:{ id:"foodco",   delta:2  } },
  { emoji:"🎓", title:"Διαγωνισμός!",        body:"Κέρδισες μαθηματικό διαγωνισμό! Μικρό έπαθλο!",                 coins:20  },
  { emoji:"💸", title:"Χάθηκε πορτοφόλι!",  body:"Άουτς! Το πορτοφόλι σου χάθηκε στο λεωφορείο.",                  coins:-8  },
  { emoji:"🚀", title:"TechKids — Boom!",    body:"Εκπληκτικές πωλήσεις αυτή την εβδομάδα για την TechKids!",       coins:0,  stock:{ id:"techkids", delta:5  } },
  { emoji:"⭐", title:"Ήσυχη εβδομάδα",     body:"Τίποτα ιδιαίτερο. Ούτε καλό ούτε κακό αυτή την εβδομάδα!",      coins:0   },
  { emoji:"🎪", title:"Φεστιβάλ πόλης!",    body:"Βοήθησες εθελοντικά στο φεστιβάλ και σε πλήρωσαν!",              coins:12  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MarketGame() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  const [phase,     setPhase]     = useState<GamePhase>("intro");
  const [week,      setWeek]      = useState(1);
  const [coins,     setCoins]     = useState(0);
  const [debt,      setDebt]      = useState(0);
  const [owned,     setOwned]     = useState<Record<StockId, number>>({ lego:0, techkids:0, foodco:0 });
  const [overrides, setOverrides] = useState<Record<StockId, number>>({ lego:0, techkids:0, foodco:0 });
  const [bought,    setBought]    = useState<Set<string>>(new Set());
  const [wisdom,    setWisdom]    = useState(0);
  const [event,     setEvent]     = useState<GameEvent | null>(null);
  const [usedEvts,  setUsedEvts]  = useState<number[]>([]);
  const [newWeekMsg, setNewWeekMsg] = useState(false);

  // ─── Derived ─────────────────────────────────────────────────────────────
  const getPrice = (w: number, id: StockId) =>
    Math.max(1, BASE_PRICES[id][w - 1] + overrides[id]);

  const portfolio = () =>
    owned.lego * getPrice(week, "lego") +
    owned.techkids * getPrice(week, "techkids") +
    owned.foodco * getPrice(week, "foodco");

  const netWorth = () => coins + portfolio() - Math.round(debt * 1.5);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const resetGame = () => {
    setPhase("shop"); setWeek(1); setCoins(ALLOWANCE); setDebt(0);
    setOwned({ lego:0, techkids:0, foodco:0 });
    setOverrides({ lego:0, techkids:0, foodco:0 });
    setBought(new Set()); setWisdom(0); setEvent(null); setUsedEvts([]);
    setNewWeekMsg(true); setTimeout(() => setNewWeekMsg(false), 2500);
  };

  const spend = (amount: number) => {
    setCoins(c => {
      const next = c - amount;
      if (next < 0) { setDebt(d => d + Math.abs(next)); return 0; }
      return next;
    });
  };

  const buyProduct = (prod: Product) => {
    if (bought.has(prod.id)) return;
    spend(prod.price);
    setBought(prev => new Set([...prev, prod.id]));
    if (prod.type === "need") setWisdom(w => w + 2);
  };

  const buyStock = (id: StockId) => {
    spend(getPrice(week, id));
    setOwned(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const sellStock = (id: StockId) => {
    if (owned[id] <= 0) return;
    setCoins(c => c + getPrice(week, id));
    setOwned(prev => ({ ...prev, [id]: prev[id] - 1 }));
  };

  const goToEvent = () => {
    const avail = EVENTS.map((_, i) => i).filter(i => !usedEvts.includes(i));
    const idx = avail[Math.floor(Math.random() * avail.length)];
    setEvent(EVENTS[idx]);
    setUsedEvts(prev => [...prev, idx]);
    setPhase("event");
  };

  const applyEvent = () => {
    if (!event) return;
    if (event.coins > 0) setCoins(c => c + event.coins);
    else if (event.coins < 0) spend(Math.abs(event.coins));
    if (event.stock) {
      setOverrides(prev => ({ ...prev, [event.stock!.id]: prev[event.stock!.id] + event.stock!.delta }));
    }
    setPhase("summary");
  };

  const nextWeek = () => {
    if (week >= TOTAL_WEEKS) { setPhase("results"); return; }
    const nw = week + 1;
    setWeek(nw);
    setCoins(c => c + ALLOWANCE);
    setBought(new Set());
    setEvent(null);
    setPhase("shop");
    setNewWeekMsg(true);
    setTimeout(() => setNewWeekMsg(false), 2500);
  };

  // ─── Grade ───────────────────────────────────────────────────────────────
  const getGrade = () => {
    const score = netWorth() + wisdom;
    if (score >= 100) return { grade:"Άριστος Επενδυτής",    stars:"⭐⭐⭐", color:"text-yellow-600", msg:"Εξαιρετική διαχείριση! Η πόλη σου λάμπει!" };
    if (score >= 60)  return { grade:"Καλός Επενδυτής",      stars:"⭐⭐",   color:"text-blue-600",   msg:"Πολύ καλή δουλειά! Μάθες πολλά αυτές τις 6 εβδομάδες." };
    if (score >= 25)  return { grade:"Μαθητευόμενος Επενδυτής", stars:"⭐",   color:"text-green-600",  msg:"Καλή αρχή! Την επόμενη φορά θα τα πας ακόμα καλύτερα." };
    return              { grade:"Αρχάριος Επενδυτής",    stars:"🌱",   color:"text-gray-600",   msg:"Κάθε εμπειρία είναι μάθηση! Ξαναπαίξε και δες τη διαφορά." };
  };

  // ─── Shared UI ───────────────────────────────────────────────────────────
  const products = WEEKLY_PRODUCTS[week - 1];

  const StatusBar = () => (
    <div className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">Εβδ. {week}/{TOTAL_WEEKS}</span>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
            <div key={i} className={`h-2 w-5 rounded-full ${i < week ? "bg-green-500" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {debt > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">⚠️ -{debt}</span>}
        <span className="font-bold text-green-700">💰 {coins}</span>
        {portfolio() > 0 && <span className="text-blue-600">📊 {portfolio()}</span>}
      </div>
    </div>
  );

  const NewWeekBanner = () => newWeekMsg ? (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-20 font-bold text-sm animate-pulse">
      💰 +{ALLOWANCE} νομίσματα! Νέα εβδομάδα!
    </div>
  ) : null;

  // ─── INTRO ───────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🏙️</div>
        <h1 className="text-3xl font-bold text-green-800 mb-2">Η Δική μου Πόλη</h1>
        <p className="text-gray-500 mb-1 text-sm">από KidsInBusiness.gr</p>
        <p className="text-gray-600 mb-6">Διαχειρίσου τα χρήματά σου για 6 εβδομάδες!</p>
        <div className="bg-green-50 rounded-xl p-4 text-left mb-6 text-sm space-y-2">
          <div className="flex gap-2"><span>💰</span><span>Παίρνεις <strong>30 νομίσματα</strong> κάθε εβδομάδα</span></div>
          <div className="flex gap-2"><span>🛒</span><span>Αγόραζε <strong>ανάγκες</strong> (πράσινο) και <strong>επιθυμίες</strong> (κίτρινο)</span></div>
          <div className="flex gap-2"><span>📈</span><span>Επένδυε στο <strong>χρηματιστήριο</strong> — οι τιμές αλλάζουν!</span></div>
          <div className="flex gap-2"><span>🎲</span><span>Κάθε εβδομάδα υπάρχει μια <strong>έκπληξη</strong>!</span></div>
          <div className="flex gap-2"><span>⚠️</span><span>Αν ξοδέψεις παραπάνω, μπαίνεις σε <strong>χρέος</strong> — ποινή στο τέλος!</span></div>
        </div>
        <Button onClick={resetGame} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
          Ξεκινάμε! 🚀
        </Button>
        <button onClick={() => navigate("/book")} className="mt-4 text-sm text-gray-400 hover:text-gray-600 block w-full">
          ← Πίσω στο βιβλίο
        </button>
      </div>
    </div>
  );

  // ─── SHOP ────────────────────────────────────────────────────────────────
  if (phase === "shop") return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      <NewWeekBanner />
      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">🛒 Αγορά — Εβδομάδα {week}</h2>
        <p className="text-sm text-gray-500 mb-4">Τι χρειάζεσαι αυτή την εβδομάδα; Έχεις 💰 {coins} νομίσματα.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {products.map(prod => {
            const isBought = bought.has(prod.id);
            const isNeed = prod.type === "need";
            return (
              <div key={prod.id}
                className={`border-2 rounded-xl p-4 bg-white shadow-sm transition-opacity ${
                  isNeed ? "border-green-400" : "border-yellow-400"
                } ${isBought ? "opacity-50" : ""}`}
              >
                <div className="text-3xl text-center mb-2">{prod.emoji}</div>
                <div className="font-bold text-center text-gray-800 text-sm mb-1">{prod.name}</div>
                <div className={`text-xs text-center px-2 py-0.5 rounded-full mb-2 ${
                  isNeed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {isNeed ? "ΑΝΑΓΚΗ" : "ΕΠΙΘΥΜΙΑ"}
                </div>
                <div className="text-center font-bold text-green-700 mb-3">💰 {prod.price}</div>
                <Button size="sm" onClick={() => buyProduct(prod)} disabled={isBought}
                  className={`w-full text-xs ${isBought
                    ? "bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-default"
                    : "bg-green-600 hover:bg-green-700 text-white"}`}>
                  {isBought ? "✓ Αγοράστηκε" : "Αγορά"}
                </Button>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 mb-4">
          💡 <strong>Συμβουλή:</strong> Αγόρασε πρώτα τις <strong>ΑΝΑΓΚΕΣ</strong> (πράσινο πλαίσιο). Οι επιθυμίες μπορούν να περιμένουν!
        </div>

        <Button onClick={() => setPhase("stocks")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Πάμε στο Χρηματιστήριο →
        </Button>
      </div>
    </div>
  );

  // ─── STOCKS ──────────────────────────────────────────────────────────────
  if (phase === "stocks") {
    const prevWeekPrices = week > 1
      ? { lego: getPrice(week - 1, "lego"), techkids: getPrice(week - 1, "techkids"), foodco: getPrice(week - 1, "foodco") }
      : null;
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">📈 Χρηματιστήριο — Εβδομάδα {week}</h2>
          <p className="text-sm text-gray-500 mb-4">Θέλεις να επενδύσεις; Οι τιμές αλλάζουν κάθε εβδομάδα!</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {STOCK_DEFS.map(def => {
              const price = getPrice(week, def.id);
              const prev = prevWeekPrices ? prevWeekPrices[def.id] : price;
              const diff = price - prev;
              const trend = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
              const trendColor = diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-400";
              return (
                <div key={def.id} className="border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{def.emoji}</span>
                    <span className={`text-xl font-bold ${trendColor}`}>{trend}</span>
                  </div>
                  <div className="font-bold text-gray-800 text-sm">{def.name}</div>
                  <div className="text-xs text-gray-400 mb-1">{def.desc}</div>
                  {diff !== 0 && week > 1 && (
                    <div className={`text-xs mb-1 ${trendColor}`}>
                      {diff > 0 ? `+${diff}` : diff} από περασμένη εβδ.
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-700">💰 {price}</span>
                    <span className="text-xs text-gray-500">Έχεις: {owned[def.id]} μτχ.</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => buyStock(def.id)} disabled={coins < price}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs">
                      Αγορά
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => sellStock(def.id)} disabled={owned[def.id] === 0}
                      className="flex-1 text-xs">
                      Πώληση
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {portfolio() > 0 && (
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 mb-3">
              📊 Portfolio σου: <strong>{portfolio()} νομίσματα</strong>
              {" "}(LEGO ×{owned.lego} · TechKids ×{owned.techkids} · FoodCo ×{owned.foodco})
            </div>
          )}
          {coins === 0 && (
            <div className="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700 mb-3">
              💡 Δεν έχεις νομίσματα για αγορά μετοχών. Μπορείς να πουλήσεις αν θέλεις!
            </div>
          )}

          <Button onClick={goToEvent} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Δες τι έγινε αυτή την εβδομάδα →
          </Button>
        </div>
      </div>
    );
  }

  // ─── EVENT ───────────────────────────────────────────────────────────────
  if (phase === "event") return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      <div className="max-w-sm mx-auto p-4 pt-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-7xl mb-4" style={{ animation: "bounce 1s infinite" }}>{event?.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{event?.title}</h2>
          <p className="text-gray-600 mb-6">{event?.body}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            {event && event.coins !== 0 && (
              <div className={`text-xl font-bold ${event.coins > 0 ? "text-green-600" : "text-red-600"}`}>
                {event.coins > 0 ? `+${event.coins}` : event.coins} 💰 νομίσματα
              </div>
            )}
            {event?.stock && (
              <div className={`text-lg font-bold ${event.stock.delta > 0 ? "text-green-600" : "text-red-600"}`}>
                {STOCK_DEFS.find(s => s.id === event.stock!.id)?.name}:{" "}
                {event.stock.delta > 0 ? `+${event.stock.delta}` : event.stock.delta} 💰/μετοχή
              </div>
            )}
            {event?.coins === 0 && !event?.stock && (
              <div className="text-gray-500 text-sm">Καμία επίπτωση αυτή την εβδομάδα.</div>
            )}
          </div>
          <Button onClick={applyEvent} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Κατάλαβα! →
          </Button>
        </div>
      </div>
    </div>
  );

  // ─── SUMMARY ─────────────────────────────────────────────────────────────
  if (phase === "summary") {
    const isLastWeek = week >= TOTAL_WEEKS;
    const boughtNeeds = products.filter(p => p.type === "need" && bought.has(p.id));
    const boughtWants = products.filter(p => p.type === "want" && bought.has(p.id));
    const skippedNeeds = products.filter(p => p.type === "need" && !bought.has(p.id));
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="max-w-2xl mx-auto p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Σύνοψη — Εβδομάδα {week}</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">💰</div>
              <div className="text-2xl font-bold text-green-700">{coins}</div>
              <div className="text-xs text-gray-500">νομίσματα</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-2xl font-bold text-blue-700">{portfolio()}</div>
              <div className="text-xs text-gray-500">portfolio</div>
            </div>
            {debt > 0 && (
              <div className="col-span-2 bg-red-50 rounded-xl p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-red-700">⚠️ Χρέος: {debt}</div>
                <div className="text-xs text-red-400">ποινή × 1.5 στο τελικό σκορ</div>
              </div>
            )}
          </div>

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
            </div>
          )}
          {skippedNeeds.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-3 mb-2 text-sm">
              <span className="font-semibold text-orange-700">⚠️ Παρέλειψες: </span>
              {skippedNeeds.map(p => `${p.emoji} ${p.name}`).join(" · ")}
              <span className="text-orange-500"> — προσπάθησε να καλύπτεις τις ανάγκες σου!</span>
            </div>
          )}
          {event && (
            <div className="bg-purple-50 rounded-xl p-3 mb-4 text-sm">
              <span className="font-semibold text-purple-800">{event.emoji} Γεγονός: </span>
              {event.title}
            </div>
          )}

          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border-2 border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Συνολική αξία τώρα</div>
            <div className="text-3xl font-bold text-green-700">{netWorth()} 💰</div>
            <div className="text-xs text-gray-400">νομίσματα + portfolio{debt > 0 ? " − χρέος×1.5" : ""}</div>
          </div>

          <Button onClick={nextWeek} className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6">
            {isLastWeek ? "🏁 Δες τα Αποτελέσματα!" : `Εβδομάδα ${week + 1} →`}
          </Button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────────────────────────
  if (phase === "results") {
    const g = getGrade();
    const score = netWorth() + wisdom;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{g.stars}</div>
            <h2 className="text-2xl font-bold text-gray-800">{g.grade}</h2>
            <p className={`text-sm mt-2 ${g.color} font-medium`}>{g.msg}</p>
          </div>
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between p-3 bg-green-50 rounded-xl">
              <span>💰 Νομίσματα</span><span className="font-bold text-green-700">{coins}</span>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-xl">
              <span>📊 Portfolio</span><span className="font-bold text-blue-700">{portfolio()}</span>
            </div>
            {debt > 0 && (
              <div className="flex justify-between p-3 bg-red-50 rounded-xl">
                <span>⚠️ Χρέος (×1.5 ποινή)</span><span className="font-bold text-red-700">-{Math.round(debt * 1.5)}</span>
              </div>
            )}
            <div className="flex justify-between p-3 bg-purple-50 rounded-xl">
              <span>🧠 Σωστές αποφάσεις</span><span className="font-bold text-purple-700">+{wisdom} pts</span>
            </div>
            <div className="flex justify-between p-4 bg-gray-100 rounded-xl border-2 border-gray-200">
              <span className="font-bold">Τελικό Σκορ</span>
              <span className="text-xl font-bold">{score}</span>
            </div>
          </div>
          <Button onClick={() => { setPhase("intro"); }} className="w-full bg-green-600 hover:bg-green-700 text-white mb-3">
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
