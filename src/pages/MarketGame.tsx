import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
type Phase = "intro"|"rolling"|"action"|"buy"|"upgrade_pick"|"airport_pick"|"meeting"|"profit"|"results";
type SquareType = "start"|"business"|"risk"|"bank"|"expenses"|"upgrade"|"airport"|"meeting";

interface Square   { id:number; type:SquareType; name:string; emoji:string; bizId?:string; }
interface Business { id:string; name:string; emoji:string; buy:number; profit:number; expense:number; upgCost:number; upgProfit:number; subsidy:number; sale:number; saleUpg:number; }
interface RiskCard  { id:string; emoji:string; title:string; body:string; delta:number; special?:"discount"|"lucky"|"half_risk"; }

// ─── Board (30 squares) ───────────────────────────────────────────────────────
const SQUARES: Square[] = [
  { id:0,  type:"start",    name:"Αφετηρία",                   emoji:"🏁" },
  { id:1,  type:"business", name:"Κατάστημα Αθλητικών",        emoji:"🏆", bizId:"athletic"   },
  { id:2,  type:"business", name:"Κομμωτήριο",                 emoji:"✂️", bizId:"hair"       },
  { id:3,  type:"business", name:"Εστιατόριο",                 emoji:"🍽️", bizId:"restaurant" },
  { id:4,  type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"🎴" },
  { id:5,  type:"business", name:"Φούρνος",                    emoji:"🥐", bizId:"bakery"     },
  { id:6,  type:"business", name:"Γυμναστήριο",                emoji:"🏋️", bizId:"gym"        },
  { id:7,  type:"business", name:"Water Sports",               emoji:"🌊", bizId:"watersports"},
  { id:8,  type:"business", name:"Πλυντήριο Ρούχων",           emoji:"🧺", bizId:"laundry"    },
  { id:9,  type:"business", name:"Εργοστάσιο Ανακύκλωσης",    emoji:"♻️", bizId:"recycling"  },
  { id:10, type:"business", name:"Κέντρο Σπα",                 emoji:"💆", bizId:"spa"        },
  { id:11, type:"business", name:"Pet Shop",                   emoji:"🐾", bizId:"petshop"    },
  { id:12, type:"business", name:"Super Market",               emoji:"🛒", bizId:"supermarket"},
  { id:13, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"🎴" },
  { id:14, type:"business", name:"Ξενοδοχείο",                 emoji:"🏨", bizId:"hotel"      },
  { id:15, type:"bank",     name:"Τράπεζα",                    emoji:"🏦" },
  { id:16, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"🎴" },
  { id:17, type:"expenses", name:"Έξοδα",                      emoji:"💸" },
  { id:18, type:"business", name:"Τουριστικό Πρακτορείο",      emoji:"✈️", bizId:"travel"     },
  { id:19, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"🎴" },
  { id:20, type:"upgrade",  name:"Αναβάθμιση Επιχείρησης",     emoji:"⬆️" },
  { id:21, type:"business", name:"Κατάστημα με Παιχνίδια",     emoji:"🧸", bizId:"toys"       },
  { id:22, type:"business", name:"Rent a Car",                 emoji:"🚖", bizId:"rentacar"   },
  { id:23, type:"business", name:"Κατάστημα Παπουτσιών",       emoji:"👟", bizId:"shoes"      },
  { id:24, type:"airport",  name:"Διεθνές Αεροδρόμιο",         emoji:"✈️" },
  { id:25, type:"meeting",  name:"Business Meeting",           emoji:"🤝" },
  { id:26, type:"business", name:"Αντιπροσωπεία Αυτοκινήτων",  emoji:"🚗", bizId:"cardealer"  },
  { id:27, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"🎴" },
  { id:28, type:"expenses", name:"Έξοδα",                      emoji:"💸" },
  { id:29, type:"business", name:"Κατάστημα Οπτικών",          emoji:"👓", bizId:"optical"    },
];

// ─── Businesses ───────────────────────────────────────────────────────────────
const BUSINESSES: Business[] = [
  { id:"athletic",   name:"Κατάστημα Αθλητικών",       emoji:"🏆", buy:4500, profit:300, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"restaurant", name:"Εστιατόριο",                emoji:"🍽️", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"spa",        name:"Κέντρο Σπα",                emoji:"💆", buy:4000, profit:250, expense:80,  upgCost:1500, upgProfit:100, subsidy:900,  sale:6000,  saleUpg:7500  },
  { id:"bakery",     name:"Φούρνος",                   emoji:"🥐", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:80,  subsidy:850,  sale:5500,  saleUpg:6500  },
  { id:"toys",       name:"Κατάστημα Παιχνίδια",       emoji:"🧸", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"hair",       name:"Κομμωτήριο",                emoji:"✂️", buy:3500, profit:210, expense:75,  upgCost:900,  upgProfit:90,  subsidy:800,  sale:5200,  saleUpg:6200  },
  { id:"petshop",    name:"Pet Shop",                  emoji:"🐾", buy:3700, profit:230, expense:80,  upgCost:1000, upgProfit:100, subsidy:850,  sale:5500,  saleUpg:6800  },
  { id:"supermarket",name:"Super Market",              emoji:"🛒", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"gym",        name:"Γυμναστήριο",               emoji:"🏋️", buy:4500, profit:320, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"cardealer",  name:"Αντιπροσωπεία Αυτοκινήτων",emoji:"🚗", buy:5000, profit:450, expense:170, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"laundry",    name:"Πλυντήριο Ρούχων",          emoji:"🧺", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:100, subsidy:900,  sale:5500,  saleUpg:6800  },
  { id:"optical",    name:"Κατάστημα Οπτικών",         emoji:"👓", buy:4200, profit:250, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"shoes",      name:"Κατάστημα Παπουτσιών",      emoji:"👟", buy:4000, profit:280, expense:90,  upgCost:1500, upgProfit:120, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"cinema",     name:"Αίθουσα Κινηματογράφου",   emoji:"🎬", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"hotel",      name:"Ξενοδοχείο",                emoji:"🏨", buy:5000, profit:500, expense:200, upgCost:2500, upgProfit:300, subsidy:1800, sale:8500,  saleUpg:11000 },
  { id:"watersports",name:"Water Sports",              emoji:"🌊", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
  { id:"travel",     name:"Τουριστικό Πρακτορείο",     emoji:"✈️", buy:4500, profit:320, expense:110, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"recycling",  name:"Εργοστάσιο Ανακύκλωσης",   emoji:"♻️", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"carwash",    name:"Πλυντήριο Αυτοκινήτων",    emoji:"🚘", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"rentacar",   name:"Rent a Car",                emoji:"🚖", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
];

// ─── Risk Cards ───────────────────────────────────────────────────────────────
const RISK_CARDS: RiskCard[] = [
  { id:"r1",  emoji:"🔥", title:"Ευκαιρία Χορηγίας!",         body:"Ένας μεγάλος χορηγός ενδιαφέρεται για την επιχείρησή σου.",           delta:500  },
  { id:"r2",  emoji:"💰", title:"Κρατική Επιδότηση!",          body:"Η κυβέρνηση υποστηρίζει μικρές επιχειρήσεις.",                        delta:300  },
  { id:"r3",  emoji:"⭐", title:"Εξαιρετικές Κριτικές!",       body:"Οι πελάτες αγαπούν την επιχείρησή σου!",                              delta:250  },
  { id:"r4",  emoji:"🏆", title:"Βραβείο Επιχειρηματικότητας!",body:"Κέρδισες βραβείο και έλαβες έπαθλο!",                                 delta:600  },
  { id:"r5",  emoji:"🤝", title:"Νέος Επιχειρηματικός Συνεργάτης!", body:"Κάποιος επενδύει στην επιχείρησή σου.",                          delta:350  },
  { id:"r6",  emoji:"💡", title:"Έξυπνη Ιδέα!",               body:"Έκανες καινοτομία και προσέλκυσες πελάτες.",                           delta:400  },
  { id:"r7",  emoji:"🌍", title:"Πράσινη Πρωτοβουλία!",        body:"Οι πελάτες εκτιμούν την οικολογική σου δράση.",                       delta:350  },
  { id:"r8",  emoji:"🎉", title:"Γιορτινή Περίοδος!",          body:"Οι πωλήσεις εκτοξεύονται!",                                           delta:400  },
  { id:"r9",  emoji:"💎", title:"Big Bonus!",                  body:"Κερδίζεις bonus για την κοινωνική σου συνεισφορά!",                    delta:400  },
  { id:"r10", emoji:"🚀", title:"Νέα Επιχειρηματική Ευκαιρία!",body:"Μπορείς να αγοράσεις την επόμενη επιχείρηση με 20% έκπτωση!",         delta:0, special:"discount" },
  { id:"r11", emoji:"🍀", title:"Η Τυχερή σου Μέρα!",          body:"Κράτα αυτή την κάρτα — πλήρωσε τα μισά στην επόμενη αρνητική κάρτα!", delta:0, special:"lucky" },
  { id:"r12", emoji:"🔧", title:"Έκτακτη Συντήρηση!",          body:"Απρόβλεπτη επισκευή εξοπλισμού.",                                     delta:-350 },
  { id:"r13", emoji:"📉", title:"Οικονομική Κρίση!",            body:"Η αγορά πέφτει — μειώνεται η αξία των επιχειρήσεων.",                  delta:-500 },
  { id:"r14", emoji:"⚠️", title:"Ανταγωνιστής!",              body:"Ένας ανταγωνιστής μπαίνει στην αγορά και παίρνει πελάτες.",             delta:-300 },
  { id:"r15", emoji:"💳", title:"Χρέος Τράπεζας!",             body:"Ένα παλιό χρέος επιστρέφει.",                                         delta:-500 },
  { id:"r16", emoji:"🛠️", title:"Ανακαίνιση Καταστήματος!",   body:"Χρειάζεσαι νέα διακόσμηση.",                                          delta:-300 },
  { id:"r17", emoji:"💼", title:"Απεργία Προσωπικού!",         body:"Οι εργαζόμενοι απεργούν.",                                             delta:-250 },
  { id:"r18", emoji:"⛈️", title:"Κακές Καιρικές Συνθήκες!",   body:"Καταιγίδα — οι επιχειρήσεις μένουν κλειστές για μία μέρα.",            delta:-250 },
  { id:"r19", emoji:"🛑", title:"Νομικό Πρόβλημα!",            body:"Νομικό ζήτημα προκύπτει στην επιχείρησή σου.",                        delta:-400 },
  { id:"r20", emoji:"🎭", title:"Προβλήματα Παράδοσης!",       body:"Το κόστος παράδοσης αυξάνεται.",                                      delta:-200 },
  { id:"r21", emoji:"⚡", title:"Διακοπή Ρεύματος!",           body:"Όλες οι επιχειρήσεις κλείνουν για μία μέρα.",                         delta:-150 },
  { id:"r22", emoji:"🤕", title:"Εργατικό Ατύχημα!",           body:"Υπάλληλος τραυματίστηκε — αποζημίωση.",                               delta:-600 },
  { id:"r23", emoji:"📈", title:"Πληθωρισμός!",                body:"Λόγω αύξησης πληθωρισμού, αυξάνονται τα έξοδα.",                      delta:-200 },
];

const TOTAL_ROUNDS  = 10;
const BANK_AMOUNT   = 1000;
const AIRPORT_COST  = 200;

export default function MarketGame() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  const [phase,       setPhase]       = useState<Phase>("intro");
  const [cash,        setCash]        = useState(5000);
  const [position,    setPosition]    = useState(0);
  const [round,       setRound]       = useState(1);
  const [dice,        setDice]        = useState<number|null>(null);
  const [owned,       setOwned]       = useState<Record<string,boolean>>({});
  const [upgraded,    setUpgraded]    = useState<Record<string,boolean>>({});
  const [currentCard, setCurrentCard] = useState<RiskCard|null>(null);
  const [usedRisk,    setUsedRisk]    = useState<string[]>([]);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [hasLucky,    setHasLucky]    = useState(false);
  const [bookBonus,   setBookBonus]   = useState(0);
  const [log,         setLog]         = useState<string[]>([]);
  const [roundProfit, setRoundProfit] = useState(0);
  const [meetingBiz,  setMeetingBiz]  = useState<Business|null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("book_progress" as any).select("coins_earned").eq("user_id", user.id);
      if (data) {
        const total = (data as any[]).reduce((s:number, r:any) => s+(r.coins_earned||0), 0);
        const bonus = Math.min(500, Math.floor(total/100)*10);
        setBookBonus(bonus);
      }
    });
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getBiz = (id:string) => BUSINESSES.find(b=>b.id===id)!;
  const ownedBizList = () => BUSINESSES.filter(b => owned[b.id]);
  const netProfit = (b:Business) => b.profit + (upgraded[b.id] ? b.upgProfit : 0) - b.expense;
  const totalNetPerRound = () => ownedBizList().reduce((s,b) => s+netProfit(b), 0);
  const totalAssets = () => ownedBizList().reduce((s,b) => s+(upgraded[b.id]?b.saleUpg:b.sale), 0);
  const totalWealth = () => cash + totalAssets();
  const addLog = (msg:string) => setLog(prev => [msg, ...prev.slice(0,19)]);

  const startGame = () => {
    setCash(5000 + bookBonus);
    setPosition(0);
    setRound(1);
    setDice(null);
    setOwned({});
    setUpgraded({});
    setCurrentCard(null);
    setUsedRisk([]);
    setHasDiscount(false);
    setHasLucky(false);
    setLog([]);
    setRoundProfit(0);
    setMeetingBiz(null);
    setPhase("rolling");
  };

  const rollDice = () => {
    const d = Math.floor(Math.random()*6)+1;
    setDice(d);
    const newPos = (position + d) % SQUARES.length;
    setPosition(newPos);
    // Check if passed START
    if (newPos <= d - 1 && position !== 0) {
      setCash(c => c + BANK_AMOUNT);
      addLog(`🏁 Πέρασες από την Αφετηρία! +${BANK_AMOUNT}€`);
    }
    handleSquare(newPos);
  };

  const handleSquare = (pos:number) => {
    const sq = SQUARES[pos];
    addLog(`🎲 Έπεσες στο: ${sq.emoji} ${sq.name}`);

    if (sq.type === "start") {
      setCash(c => c + BANK_AMOUNT);
      addLog(`🏁 Αφετηρία! +${BANK_AMOUNT}€`);
      nextRound();
    } else if (sq.type === "bank") {
      setCash(c => c + BANK_AMOUNT);
      addLog(`🏦 Τράπεζα! +${BANK_AMOUNT}€`);
      nextRound();
    } else if (sq.type === "risk") {
      drawRisk();
    } else if (sq.type === "business") {
      setPhase("action");
    } else if (sq.type === "expenses") {
      const total = ownedBizList().reduce((s,b) => s+b.expense, 0);
      if (total > 0) {
        setCash(c => c - total);
        addLog(`💸 Έξοδα! -${total}€`);
      } else {
        addLog(`💸 Έξοδα — δεν έχεις επιχειρήσεις ακόμα!`);
      }
      nextRound();
    } else if (sq.type === "upgrade") {
      if (ownedBizList().filter(b => !upgraded[b.id]).length > 0) {
        setPhase("upgrade_pick");
      } else {
        addLog("⬆️ Δεν έχεις επιχείρηση για αναβάθμιση.");
        nextRound();
      }
    } else if (sq.type === "airport") {
      setPhase("airport_pick");
    } else if (sq.type === "meeting") {
      setPhase("meeting");
    }
  };

  const drawRisk = () => {
    const available = RISK_CARDS.filter(r => !usedRisk.includes(r.id));
    const pool = available.length > 0 ? available : RISK_CARDS;
    const card = pool[Math.floor(Math.random()*pool.length)];
    setUsedRisk(prev => [...prev, card.id]);

    if (card.special === "discount") {
      setHasDiscount(true);
      setCurrentCard(card);
      setPhase("action");
      return;
    }
    if (card.special === "lucky") {
      setHasLucky(true);
      setCurrentCard(card);
      setPhase("action");
      return;
    }

    let delta = card.delta;
    if (delta < 0 && hasLucky) {
      delta = Math.floor(delta / 2);
      setHasLucky(false);
      addLog(`🍀 Χρησιμοποίησες την τυχερή κάρτα! Μισά έξοδα.`);
    }
    setCash(c => c + delta);
    setCurrentCard(card);
    setPhase("action");
  };

  const buyBiz = (biz:Business) => {
    let price = biz.buy - biz.subsidy;
    if (hasDiscount) { price = Math.round(price * 0.8); setHasDiscount(false); }
    if (cash < price) return;
    setCash(c => c - price);
    setOwned(prev => ({...prev, [biz.id]: true}));
    addLog(`🏪 Αγόρασες: ${biz.emoji} ${biz.name} για ${price}€ (επιδότηση ${biz.subsidy}€)`);
    nextRound();
  };

  const sellBiz = (biz:Business) => {
    const price = upgraded[biz.id] ? biz.saleUpg : biz.sale;
    setCash(c => c + price);
    setOwned(prev => {const n={...prev}; delete n[biz.id]; return n;});
    setUpgraded(prev => {const n={...prev}; delete n[biz.id]; return n;});
    addLog(`💼 Πούλησες: ${biz.emoji} ${biz.name} για ${price}€`);
    nextRound();
  };

  const upgradeBiz = (biz:Business) => {
    if (cash < biz.upgCost) return;
    setCash(c => c - biz.upgCost);
    setUpgraded(prev => ({...prev, [biz.id]: true}));
    addLog(`⬆️ Αναβάθμισες: ${biz.emoji} ${biz.name}! +${biz.upgProfit}€/γύρο`);
    nextRound();
  };

  const teleport = (pos:number) => {
    if (cash < AIRPORT_COST) return;
    setCash(c => c - AIRPORT_COST);
    setPosition(pos);
    addLog(`✈️ Αεροδρόμιο! Μεταφέρθηκες στο ${SQUARES[pos].emoji} ${SQUARES[pos].name}`);
    handleSquare(pos);
  };

  const nextRound = () => {
    // Collect net profit from all businesses
    const profit = totalNetPerRound();
    if (profit !== 0) {
      setCash(c => c + profit);
      setRoundProfit(profit);
    }
    if (round >= TOTAL_ROUNDS) {
      setPhase("results");
      return;
    }
    setRound(r => r+1);
    setDice(null);
    setCurrentCard(null);
    setMeetingBiz(null);
    setPhase(profit !== 0 ? "profit" : "rolling");
  };

  const sq        = SQUARES[position];
  const sqBiz     = sq.bizId ? getBiz(sq.bizId) : null;
  const isOwned   = sqBiz ? !!owned[sqBiz.id] : false;
  const isUpg     = sqBiz ? !!upgraded[sqBiz.id] : false;
  const netCost   = sqBiz ? Math.round((sqBiz.buy - sqBiz.subsidy) * (hasDiscount ? 0.8 : 1)) : 0;

  // ─── Board Visual ─────────────────────────────────────────────────────────────
  const BoardView = () => {
    const typeColor: Record<SquareType, string> = {
      start:"bg-green-500", business:"bg-blue-400", risk:"bg-red-400",
      bank:"bg-yellow-500", expenses:"bg-orange-500", upgrade:"bg-purple-500",
      airport:"bg-cyan-500", meeting:"bg-indigo-500",
    };
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[320px] p-2">
          {/* Top row (sq 25→15) */}
          <div className="flex justify-between mb-0.5">
            {[25,24,23,22,21,20,19,18,17,16,15].map(i => (
              <div key={i}
                className={`w-8 h-8 rounded text-center text-xs flex flex-col items-center justify-center cursor-default ${typeColor[SQUARES[i].type]} ${position===i?"ring-2 ring-white ring-offset-1 scale-110 z-10":""} ${owned[SQUARES[i].bizId||""]?"ring-1 ring-yellow-300":""}`}
                title={SQUARES[i].name}>
                <span className="text-xs leading-none">{position===i?"🧍":SQUARES[i].emoji}</span>
              </div>
            ))}
          </div>
          {/* Middle rows (left/right columns) */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-0.5">
              {[26,27,28,29].map(i => (
                <div key={i}
                  className={`w-8 h-8 rounded text-center text-xs flex items-center justify-center ${typeColor[SQUARES[i].type]} ${position===i?"ring-2 ring-white scale-110":""}`}
                  title={SQUARES[i].name}>
                  {position===i?"🧍":SQUARES[i].emoji}
                </div>
              ))}
            </div>
            {/* Center info */}
            <div className="flex-1 mx-2 bg-teal-50 rounded-xl flex flex-col items-center justify-center p-2 text-center border-2 border-teal-200">
              <div className="text-lg font-bold text-teal-800">START-UP</div>
              <div className="text-xs font-bold text-teal-600">ADVENTURE</div>
              <div className="text-xs text-gray-500 mt-1">Γύρος {round}/{TOTAL_ROUNDS}</div>
              <div className="text-sm font-bold text-green-700">💶 {cash.toLocaleString()}€</div>
              {ownedBizList().length > 0 && (
                <div className="text-xs text-blue-600">🏪 {ownedBizList().map(b=>b.emoji).join("")}</div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {[14,13,12,11].map(i => (
                <div key={i}
                  className={`w-8 h-8 rounded text-center text-xs flex items-center justify-center ${typeColor[SQUARES[i].type]} ${position===i?"ring-2 ring-white scale-110":""}`}
                  title={SQUARES[i].name}>
                  {position===i?"🧍":SQUARES[i].emoji}
                </div>
              ))}
            </div>
          </div>
          {/* Bottom row (sq 0→10) */}
          <div className="flex justify-between mt-0.5">
            {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i}
                className={`w-8 h-8 rounded text-center text-xs flex flex-col items-center justify-center ${typeColor[SQUARES[i].type]} ${position===i?"ring-2 ring-white ring-offset-1 scale-110 z-10":""} ${owned[SQUARES[i].bizId||""]?"ring-1 ring-yellow-300":""}`}
                title={SQUARES[i].name}>
                <span className="text-xs leading-none">{position===i?"🧍":SQUARES[i].emoji}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🚀</div>
          <h1 className="text-3xl font-black text-teal-700">START-UP</h1>
          <h2 className="text-2xl font-black text-orange-500">ADVENTURE</h2>
          <p className="text-xs text-gray-400 mt-1">by KidsInBusiness.gr</p>
        </div>
        <div className="bg-teal-50 rounded-2xl p-4 mb-4 text-sm space-y-2">
          <div>🎲 Ρίξε ζάρι και κάνε τον γύρο του ταμπλό</div>
          <div>🏪 Αγόρασε επιχειρήσεις και μάζεψε κέρδη</div>
          <div>🎴 Τράβα κάρτες ρίσκου — καλές ή κακές!</div>
          <div>⬆️ Αναβάθμισε επιχειρήσεις για μεγαλύτερα κέρδη</div>
          <div>🏆 Σε <strong>{TOTAL_ROUNDS} γύρους</strong> ο πλουσιότερος κερδίζει!</div>
        </div>
        {bookBonus > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 mb-4 text-center text-sm">
            🎓 <strong>Bonus από quiz!</strong> Ξεκινάς με 5.000€ + {bookBonus}€ extra = <strong>{(5000+bookBonus).toLocaleString()}€</strong>
          </div>
        )}
        <Button onClick={startGame} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-lg py-6 rounded-2xl font-bold">
          Ξεκινάω! 🚀
        </Button>
        <button onClick={() => navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-600 mt-3">
          ← Πίσω στο βιβλίο
        </button>
      </div>
    </div>
  );

  // ─── ROLLING ─────────────────────────────────────────────────────────────────
  if (phase === "rolling") return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-teal-600 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="font-bold">Γύρος {round}/{TOTAL_ROUNDS}</div>
          <div className="text-xs text-teal-200">Θέση: {sq.emoji} {sq.name}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black">💶 {cash.toLocaleString()}€</div>
          <div className="text-xs text-teal-200">Αξία: {totalWealth().toLocaleString()}€</div>
        </div>
      </div>

      <div className="p-3">
        <BoardView />
      </div>

      {/* Status chips */}
      <div className="px-4 flex gap-2 flex-wrap mb-3">
        {hasDiscount && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">🚀 20% έκπτωση ενεργή</span>}
        {hasLucky    && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">🍀 Τυχερή κάρτα ενεργή</span>}
        {totalNetPerRound() > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">🏪 +{totalNetPerRound()}€/γύρο</span>}
      </div>

      <div className="px-4 flex-1 flex flex-col justify-end pb-6">
        <Button onClick={rollDice} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xl py-8 rounded-2xl font-black shadow-lg">
          🎲 Ρίξε Ζάρι!
        </Button>
        {dice && (
          <div className="text-center mt-3 text-2xl font-black text-teal-700">
            Έριξες: {"⚀⚁⚂⚃⚄⚅"[dice-1]} ({dice})
          </div>
        )}

        {/* Recent log */}
        {log.length > 0 && (
          <div className="mt-4 bg-white rounded-xl p-3 max-h-28 overflow-y-auto shadow-sm">
            {log.slice(0,5).map((l,i) => (
              <div key={i} className="text-xs text-gray-600 py-0.5 border-b border-gray-100 last:border-0">{l}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── ACTION (business / risk / special) ──────────────────────────────────────
  if (phase === "action") {
    // Risk card result
    if (currentCard && !sqBiz) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div className="text-6xl mb-3">{currentCard.emoji}</div>
          <div className="text-xs font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-full inline-block mb-3">🎴 ΚΑΡΤΑ ΡΙΣΚΟΥ</div>
          <h2 className="text-xl font-black text-gray-800 mb-3">{currentCard.title}</h2>
          <p className="text-gray-600 text-sm mb-5">{currentCard.body}</p>
          {currentCard.delta !== 0 && (
            <div className={`text-3xl font-black mb-5 ${currentCard.delta>0?"text-green-600":"text-red-600"}`}>
              {currentCard.delta>0?"+":""}{currentCard.delta}€
            </div>
          )}
          {currentCard.special === "discount" && <div className="bg-green-100 text-green-700 rounded-xl p-3 mb-5 text-sm font-bold">✅ Έκπτωση 20% αποθηκεύτηκε!</div>}
          {currentCard.special === "lucky"    && <div className="bg-yellow-100 text-yellow-700 rounded-xl p-3 mb-5 text-sm font-bold">🍀 Τυχερή κάρτα αποθηκεύτηκε!</div>}
          <Button onClick={nextRound} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold">
            Συνέχεια →
          </Button>
        </div>
      </div>
    );

    // Business square
    if (sqBiz) return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">{sqBiz.emoji}</div>
            <h2 className="text-xl font-black text-gray-800">{sqBiz.name}</h2>
            {isOwned && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Δική σου{isUpg?" · ⬆️ Αναβαθμισμένη":""}</span>}
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Κόστος αγοράς</span><span className="font-bold">{sqBiz.buy.toLocaleString()}€</span></div>
            <div className="flex justify-between text-green-600"><span>Επιδότηση τράπεζας</span><span className="font-bold">-{sqBiz.subsidy.toLocaleString()}€</span></div>
            <div className="flex justify-between font-bold border-t pt-2"><span>Καθαρό κόστος</span><span className={hasDiscount?"line-through text-gray-400":""}>{(sqBiz.buy-sqBiz.subsidy).toLocaleString()}€</span></div>
            {hasDiscount && <div className="flex justify-between font-bold text-green-600"><span>Με έκπτωση 20%</span><span>{netCost.toLocaleString()}€</span></div>}
            <div className="border-t pt-2 flex justify-between text-blue-600"><span>Κέρδος/γύρο (καθαρό)</span><span className="font-bold">+{netProfit(sqBiz)}€</span></div>
            <div className="flex justify-between text-orange-500"><span>Έξοδα/γύρο</span><span>-{sqBiz.expense}€</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Τιμή αναβάθμισης</span><span>{sqBiz.upgCost.toLocaleString()}€ (+{sqBiz.upgProfit}€/γύρο)</span></div>
            <div className="flex justify-between text-purple-600"><span>Αποτίμηση πώλησης</span><span className="font-bold">{isUpg?sqBiz.saleUpg.toLocaleString():sqBiz.sale.toLocaleString()}€</span></div>
          </div>

          {!isOwned ? (
            <div className="space-y-2">
              <Button onClick={() => buyBiz(sqBiz)} disabled={cash < netCost}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold">
                🏪 Αγορά {netCost.toLocaleString()}€
              </Button>
              {cash < netCost && <p className="text-xs text-center text-red-500">Δεν έχεις αρκετά χρήματα (έχεις {cash.toLocaleString()}€)</p>}
              <Button onClick={nextRound} variant="outline" className="w-full rounded-2xl">Πέρασμα →</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {!isUpg && (
                <Button onClick={() => upgradeBiz(sqBiz)} disabled={cash < sqBiz.upgCost}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-2xl font-bold">
                  ⬆️ Αναβάθμιση {sqBiz.upgCost.toLocaleString()}€
                </Button>
              )}
              <Button onClick={() => sellBiz(sqBiz)} variant="outline" className="w-full rounded-2xl text-red-600 border-red-300">
                💼 Πούλα για {(isUpg?sqBiz.saleUpg:sqBiz.sale).toLocaleString()}€
              </Button>
              <Button onClick={nextRound} variant="outline" className="w-full rounded-2xl">Συνέχεια →</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── UPGRADE PICK ─────────────────────────────────────────────────────────────
  if (phase === "upgrade_pick") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">⬆️</div>
          <h2 className="text-xl font-black text-gray-800">Αναβάθμιση Επιχείρησης</h2>
          <p className="text-sm text-gray-500 mt-1">Επέλεξε ποια επιχείρηση να αναβαθμίσεις</p>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {ownedBizList().filter(b=>!upgraded[b.id]).map(biz => (
            <button key={biz.id} onClick={() => upgradeBiz(biz)} disabled={cash < biz.upgCost}
              className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${cash >= biz.upgCost ? "border-purple-300 hover:border-purple-500 hover:bg-purple-50" : "border-gray-200 opacity-50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{biz.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{biz.name}</div>
                    <div className="text-xs text-green-600">+{biz.upgProfit}€/γύρο extra</div>
                  </div>
                </div>
                <div className="font-bold text-purple-700">{biz.upgCost.toLocaleString()}€</div>
              </div>
            </button>
          ))}
        </div>
        <Button onClick={nextRound} variant="outline" className="w-full rounded-2xl mt-3">Παράλειψη →</Button>
      </div>
    </div>
  );

  // ─── AIRPORT PICK ─────────────────────────────────────────────────────────────
  if (phase === "airport_pick") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">✈️</div>
          <h2 className="text-xl font-black text-gray-800">Διεθνές Αεροδρόμιο</h2>
          <p className="text-sm text-gray-500">Πλήρωσε {AIRPORT_COST}€ και μεταφέρσου σε οποιοδήποτε τετράγωνο!</p>
          <div className="text-sm font-bold text-gray-700 mt-2">Έχεις: {cash.toLocaleString()}€</div>
        </div>
        {cash < AIRPORT_COST ? (
          <div>
            <div className="bg-red-50 rounded-xl p-3 text-center text-red-600 text-sm mb-3">Δεν έχεις αρκετά για εισιτήριο ({AIRPORT_COST}€)</div>
            <Button onClick={nextRound} className="w-full rounded-2xl">Συνέχεια →</Button>
          </div>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {SQUARES.filter(s=>s.id!==position&&s.type==="business"&&!owned[s.bizId||""]).map(s => (
              <button key={s.id} onClick={() => teleport(s.id)}
                className="w-full text-left p-2 rounded-xl border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-sm flex items-center gap-2 transition-all">
                <span>{s.emoji}</span>
                <span>{s.name}</span>
                <span className="ml-auto text-blue-600 font-bold">-{AIRPORT_COST}€</span>
              </button>
            ))}
            <Button onClick={nextRound} variant="outline" className="w-full rounded-2xl mt-2">Παράλειψη →</Button>
          </div>
        )}
      </div>
    </div>
  );

  // ─── BUSINESS MEETING ─────────────────────────────────────────────────────────
  if (phase === "meeting") {
    const unowned = BUSINESSES.filter(b => !owned[b.id]);
    const myBizzes = ownedBizList();
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🤝</div>
            <h2 className="text-xl font-black text-gray-800">Business Meeting</h2>
            <p className="text-sm text-gray-500">Αγόρασε ή πούλα επιχείρηση σε αποτίμηση</p>
          </div>

          {!meetingBiz ? (
            <>
              <p className="text-xs font-bold text-gray-600 mb-2">Αγορά σε αποτίμηση:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto mb-3">
                {unowned.slice(0,6).map(biz => {
                  const price = Math.round((biz.buy - biz.subsidy) * (hasDiscount ? 0.8 : 1));
                  return (
                    <button key={biz.id} onClick={() => { setMeetingBiz(biz); }} disabled={cash < price}
                      className={`w-full text-left p-2 rounded-xl border text-xs flex items-center gap-2 transition-all ${cash>=price?"border-teal-300 hover:bg-teal-50":"border-gray-200 opacity-50"}`}>
                      <span>{biz.emoji}</span>
                      <span>{biz.name}</span>
                      <span className="ml-auto font-bold text-teal-700">{price.toLocaleString()}€</span>
                    </button>
                  );
                })}
              </div>
              {myBizzes.length > 0 && (
                <>
                  <p className="text-xs font-bold text-gray-600 mb-2">Πώληση σε αποτίμηση:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto mb-3">
                    {myBizzes.map(biz => (
                      <button key={biz.id} onClick={() => sellBiz(biz)}
                        className="w-full text-left p-2 rounded-xl border border-orange-300 hover:bg-orange-50 text-xs flex items-center gap-2 transition-all">
                        <span>{biz.emoji}</span>
                        <span>{biz.name}</span>
                        <span className="ml-auto font-bold text-orange-600">{(upgraded[biz.id]?biz.saleUpg:biz.sale).toLocaleString()}€</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
              <Button onClick={nextRound} variant="outline" className="w-full rounded-2xl">Παράλειψη →</Button>
            </>
          ) : (
            <>
              <div className="bg-teal-50 rounded-2xl p-4 mb-4 text-center">
                <div className="text-4xl mb-1">{meetingBiz.emoji}</div>
                <div className="font-black text-gray-800">{meetingBiz.name}</div>
                <div className="text-2xl font-black text-teal-700 mt-2">{Math.round((meetingBiz.buy-meetingBiz.subsidy)*(hasDiscount?0.8:1)).toLocaleString()}€</div>
                <div className="text-xs text-green-600 mt-1">Καθαρό κέρδος: +{netProfit(meetingBiz)}€/γύρο</div>
              </div>
              <Button onClick={() => buyBiz(meetingBiz)} disabled={cash < Math.round((meetingBiz.buy-meetingBiz.subsidy)*(hasDiscount?0.8:1))}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold mb-2">
                🏪 Αγορά!
              </Button>
              <Button onClick={() => setMeetingBiz(null)} variant="outline" className="w-full rounded-2xl">← Πίσω</Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── PROFIT ──────────────────────────────────────────────────────────────────
  if (phase === "profit") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="text-5xl mb-3">💶</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">Κέρδη Γύρου {round-1}</h2>
        <div className="space-y-2 mb-5">
          {ownedBizList().map(b => (
            <div key={b.id} className="flex justify-between text-sm bg-green-50 rounded-xl p-2">
              <span>{b.emoji} {b.name}</span>
              <span className="font-bold text-green-700">+{netProfit(b)}€</span>
            </div>
          ))}
          <div className="flex justify-between font-black text-lg border-t pt-2">
            <span>Σύνολο</span>
            <span className={roundProfit>=0?"text-green-700":"text-red-600"}>
              {roundProfit>=0?"+":""}{roundProfit}€
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-5">
          <div className="text-sm text-gray-500">Συνολικό κεφάλαιο</div>
          <div className="text-2xl font-black text-gray-800">💶 {cash.toLocaleString()}€</div>
        </div>
        <Button onClick={() => setPhase("rolling")} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold">
          Γύρος {round} →
        </Button>
      </div>
    </div>
  );

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  if (phase === "results") {
    const wealth = totalWealth();
    const grade = wealth >= 25000 ? { label:"Επιχειρηματίας Θρύλος!", stars:"🏆🏆🏆", color:"text-yellow-600" }
      : wealth >= 15000            ? { label:"Έμπειρος Επενδυτής",     stars:"⭐⭐⭐",   color:"text-blue-600"   }
      : wealth >= 10000            ? { label:"Αναπτυσσόμενος CEO",     stars:"⭐⭐",     color:"text-green-600"  }
      :                              { label:"Νέος Επιχειρηματίας",    stars:"🌱",      color:"text-gray-600"   };
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">{grade.stars}</div>
            <h2 className={`text-2xl font-black ${grade.color}`}>{grade.label}</h2>
            <div className="text-4xl font-black text-gray-800 mt-3">💶 {wealth.toLocaleString()}€</div>
            <div className="text-sm text-gray-500 mt-1">Συνολική αξία (κεφάλαιο + επιχειρήσεις)</div>
          </div>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between p-2 bg-green-50 rounded-xl"><span>💶 Ρευστό κεφάλαιο</span><span className="font-bold">{cash.toLocaleString()}€</span></div>
            {ownedBizList().map(b => (
              <div key={b.id} className="flex justify-between p-2 bg-blue-50 rounded-xl">
                <span>{b.emoji} {b.name}{upgraded[b.id]?" ⬆️":""}</span>
                <span className="font-bold">{(upgraded[b.id]?b.saleUpg:b.sale).toLocaleString()}€</span>
              </div>
            ))}
            {bookBonus > 0 && (
              <div className="flex justify-between p-2 bg-yellow-50 rounded-xl"><span>🎓 Bonus βιβλίου</span><span className="font-bold text-yellow-700">+{bookBonus}€ (εκκίνηση)</span></div>
            )}
            <div className="flex justify-between p-3 bg-gray-100 rounded-xl border-2 font-black text-lg">
              <span>Σύνολο</span><span>{wealth.toLocaleString()}€</span>
            </div>
          </div>
          <Button onClick={startGame} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold mb-2">
            🔄 Παίξε ξανά!
          </Button>
          <button onClick={() => navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">
            ← Πίσω στο βιβλίο
          </button>
        </div>
      </div>
    );
  }

  return null;
}
