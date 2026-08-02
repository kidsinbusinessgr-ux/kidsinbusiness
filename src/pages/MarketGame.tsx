import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────
type Phase = "intro"|"rolling"|"animating"|"action"|"buy"|"upgrade_pick"|"airport_pick"|"meeting"|"profit"|"results";
type SquareType = "start"|"business"|"risk"|"bank"|"expenses"|"upgrade"|"airport"|"meeting";
interface Square   { id:number; type:SquareType; name:string; emoji:string; bizId?:string; }
interface Business { id:string; name:string; emoji:string; buy:number; profit:number; expense:number; upgCost:number; upgProfit:number; subsidy:number; sale:number; saleUpg:number; }
interface RiskCard  { id:string; emoji:string; title:string; body:string; delta:number; special?:"discount"|"lucky"; }

// ─── Board (30 squares — exact layout from physical board) ───────────────────
// Bottom (L→R): 0-10, Right (↑): 11-14, Top (R→L): 15-25, Left (↓): 26-29
const SQUARES: Square[] = [
  { id:0,  type:"start",    name:"Αφετηρία",                   emoji:"🏁" },
  { id:1,  type:"business", name:"Αθλητικά",                   emoji:"🏅", bizId:"athletic"    },
  { id:2,  type:"business", name:"Κομμωτήριο",                 emoji:"💈", bizId:"hair"        },
  { id:3,  type:"business", name:"Εστιατόριο",                 emoji:"🍴", bizId:"restaurant"  },
  { id:4,  type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"⚠️" },
  { id:5,  type:"business", name:"Φούρνος",                    emoji:"🥖", bizId:"bakery"      },
  { id:6,  type:"business", name:"Γυμναστήριο",                emoji:"💪", bizId:"gym"         },
  { id:7,  type:"business", name:"Πλυντήριο Ρούχων",           emoji:"🫧", bizId:"laundry"     },
  { id:8,  type:"business", name:"Water Sports",               emoji:"🏄", bizId:"watersports" },
  { id:9,  type:"business", name:"Ανακύκλωση",                 emoji:"♻️", bizId:"recycling"   },
  { id:10, type:"business", name:"Spa Center",                 emoji:"🧖", bizId:"spa"         },
  { id:11, type:"business", name:"Pet Shop",                   emoji:"🐕", bizId:"petshop"     },
  { id:12, type:"business", name:"Super Market",               emoji:"🏪", bizId:"supermarket" },
  { id:13, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"⚠️" },
  { id:14, type:"business", name:"Ξενοδοχείο",                 emoji:"🏩", bizId:"hotel"       },
  { id:15, type:"bank",     name:"Τράπεζα",                    emoji:"🏦" },
  { id:16, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"⚠️" },
  { id:17, type:"expenses", name:"Έξοδα",                      emoji:"💸" },
  { id:18, type:"business", name:"Τουριστικό",                 emoji:"🗺️", bizId:"travel"      },
  { id:19, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"⚠️" },
  { id:20, type:"upgrade",  name:"Αναβάθμιση",                 emoji:"⬆️" },
  { id:21, type:"business", name:"Παιχνίδια",                  emoji:"🎮", bizId:"toys"        },
  { id:22, type:"business", name:"Rent a Car",                 emoji:"🚙", bizId:"rentacar"    },
  { id:23, type:"business", name:"Παπούτσια",                  emoji:"👠", bizId:"shoes"       },
  { id:24, type:"airport",  name:"Αεροδρόμιο",                 emoji:"🛫" },
  { id:25, type:"meeting",  name:"Biz Meeting",                emoji:"👔" },
  { id:26, type:"business", name:"Αντ/πεία Αυτ/νων",          emoji:"🚘", bizId:"cardealer"   },
  { id:27, type:"risk",     name:"Κάρτα Ρίσκου",               emoji:"⚠️" },
  { id:28, type:"expenses", name:"Έξοδα",                      emoji:"💸" },
  { id:29, type:"business", name:"Οπτικά",                     emoji:"🕶️", bizId:"optical"     },
];

// Grid position: 11 cols × 6 rows
const sqGrid = (id:number): React.CSSProperties => {
  if (id <= 10)  return { gridColumn:`${id+1}`, gridRow:'6' };          // bottom L→R
  if (id <= 14)  return { gridColumn:'11',       gridRow:`${16-id}` };  // right ↑
  if (id <= 25)  return { gridColumn:`${26-id}`, gridRow:'1' };         // top R→L
  return               { gridColumn:'1',         gridRow:`${id-24}` };  // left ↓
};

// ─── Businesses ───────────────────────────────────────────────────────────────
const BUSINESSES: Business[] = [
  { id:"athletic",   name:"Κατάστημα Αθλητικών",       emoji:"🏆", buy:4500, profit:300, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"restaurant", name:"Εστιατόριο",                emoji:"🍽️", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"spa",        name:"Spa Center",                emoji:"💆", buy:4000, profit:250, expense:80,  upgCost:1500, upgProfit:100, subsidy:900,  sale:6000,  saleUpg:7500  },
  { id:"bakery",     name:"Φούρνος",                   emoji:"🥐", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:80,  subsidy:850,  sale:5500,  saleUpg:6500  },
  { id:"toys",       name:"Κατ. Παιχνίδια",            emoji:"🧸", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"hair",       name:"Κομμωτήριο",                emoji:"✂️", buy:3500, profit:210, expense:75,  upgCost:900,  upgProfit:90,  subsidy:800,  sale:5200,  saleUpg:6200  },
  { id:"petshop",    name:"Pet Shop",                  emoji:"🐾", buy:3700, profit:230, expense:80,  upgCost:1000, upgProfit:100, subsidy:850,  sale:5500,  saleUpg:6800  },
  { id:"supermarket",name:"Super Market",              emoji:"🛒", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"gym",        name:"Γυμναστήριο",               emoji:"🏋️", buy:4500, profit:320, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"cardealer",  name:"Αντ/πεία Αυτ/νων",         emoji:"🚗", buy:5000, profit:450, expense:170, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"laundry",    name:"Πλυντήριο Ρούχων",          emoji:"🧺", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:100, subsidy:900,  sale:5500,  saleUpg:6800  },
  { id:"optical",    name:"Κατ. Οπτικών",              emoji:"👓", buy:4200, profit:250, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"shoes",      name:"Κατ. Παπουτσιών",           emoji:"👟", buy:4000, profit:280, expense:90,  upgCost:1500, upgProfit:120, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"hotel",      name:"Ξενοδοχείο",                emoji:"🏨", buy:5000, profit:500, expense:200, upgCost:2500, upgProfit:300, subsidy:1800, sale:8500,  saleUpg:11000 },
  { id:"watersports",name:"Water Sports",              emoji:"🌊", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
  { id:"travel",     name:"Τουριστικό Πρακτορείο",     emoji:"✈️", buy:4500, profit:320, expense:110, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"recycling",  name:"Εργοστάσιο Ανακύκλωσης",   emoji:"♻️", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"rentacar",   name:"Rent a Car",                emoji:"🚖", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
  { id:"cinema",     name:"Αίθουσα Κινηματογράφου",   emoji:"🎬", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"carwash",    name:"Πλυντήριο Αυτοκινήτων",    emoji:"🚘", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
];

// ─── Risk Cards ───────────────────────────────────────────────────────────────
const RISK_CARDS: RiskCard[] = [
  { id:"r1",  emoji:"🔥", title:"Ευκαιρία Χορηγίας!",          body:"Ένας χορηγός ενδιαφέρεται για την επιχείρησή σου.",           delta:500  },
  { id:"r2",  emoji:"💰", title:"Κρατική Επιδότηση!",           body:"Η κυβέρνηση υποστηρίζει μικρές επιχειρήσεις.",               delta:300  },
  { id:"r3",  emoji:"⭐", title:"Εξαιρετικές Κριτικές!",        body:"Οι πελάτες αγαπούν την επιχείρησή σου!",                     delta:250  },
  { id:"r4",  emoji:"🏆", title:"Βραβείο Επιχειρηματικότητας!", body:"Κέρδισες βραβείο και έλαβες έπαθλο!",                        delta:600  },
  { id:"r5",  emoji:"🤝", title:"Νέος Επιχειρηματικός Εταίρος!",body:"Κάποιος επενδύει στην επιχείρησή σου.",                      delta:350  },
  { id:"r6",  emoji:"💡", title:"Έξυπνη Ιδέα!",                body:"Καινοτομία — νέοι πελάτες έρχονται!",                        delta:400  },
  { id:"r7",  emoji:"🌍", title:"Πράσινη Πρωτοβουλία!",         body:"Οι πελάτες εκτιμούν την οικολογική σου δράση.",              delta:350  },
  { id:"r8",  emoji:"🎉", title:"Γιορτινή Περίοδος!",           body:"Οι πωλήσεις εκτοξεύονται!",                                  delta:400  },
  { id:"r9",  emoji:"💎", title:"Big Bonus!",                   body:"Κερδίζεις bonus για την κοινωνική σου συνεισφορά.",           delta:400  },
  { id:"r10", emoji:"🚀", title:"Νέα Επιχειρηματική Ευκαιρία!", body:"Μπορείς να αγοράσεις την επόμενη επιχείρηση με 20% έκπτωση!", delta:0, special:"discount" },
  { id:"r11", emoji:"🍀", title:"Η Τυχερή σου Μέρα!",           body:"Κράτα αυτή την κάρτα — πλήρωσε μισά στην επόμενη αρνητική κάρτα!", delta:0, special:"lucky" },
  { id:"r12", emoji:"🔧", title:"Έκτακτη Συντήρηση!",           body:"Απρόβλεπτη επισκευή εξοπλισμού.",                            delta:-350 },
  { id:"r13", emoji:"📉", title:"Οικονομική Κρίση!",             body:"Η αγορά πέφτει — μειώνεται η αξία επιχειρήσεων.",            delta:-500 },
  { id:"r14", emoji:"⚠️", title:"Ανταγωνιστής!",               body:"Νέος ανταγωνιστής μπαίνει στην αγορά.",                      delta:-300 },
  { id:"r15", emoji:"💳", title:"Χρέος Τράπεζας!",              body:"Ένα παλιό χρέος επιστρέφει.",                                delta:-500 },
  { id:"r16", emoji:"🛠️", title:"Ανακαίνιση Καταστήματος!",    body:"Χρειάζεσαι νέα διακόσμηση.",                                 delta:-300 },
  { id:"r17", emoji:"💼", title:"Απεργία Προσωπικού!",          body:"Οι εργαζόμενοι απεργούν μία μέρα.",                          delta:-250 },
  { id:"r18", emoji:"⛈️", title:"Κακές Καιρικές Συνθήκες!",    body:"Καταιγίδα — τα καταστήματα κλείνουν.",                       delta:-250 },
  { id:"r19", emoji:"🛑", title:"Νομικό Πρόβλημα!",             body:"Νομικό ζήτημα στην επιχείρησή σου.",                        delta:-400 },
  { id:"r20", emoji:"🎭", title:"Προβλήματα Παράδοσης!",        body:"Το κόστος παράδοσης αυξάνεται.",                             delta:-200 },
  { id:"r21", emoji:"⚡", title:"Διακοπή Ρεύματος!",            body:"Όλα τα καταστήματα κλείνουν για μία μέρα.",                  delta:-150 },
  { id:"r22", emoji:"🤕", title:"Εργατικό Ατύχημα!",            body:"Αποζημίωση στον τραυματισμένο υπάλληλο.",                    delta:-600 },
  { id:"r23", emoji:"📈", title:"Πληθωρισμός!",                 body:"Αυξάνονται τα έξοδα λόγω πληθωρισμού.",                     delta:-200 },
];

const TOTAL_ROUNDS = 10;
const BANK_AMOUNT  = 1000;
const AIRPORT_COST = 200;

const SQ_TYPE_STYLE: Record<SquareType,string> = {
  start:    "bg-green-500 text-white border-green-600",
  business: "bg-teal-500 text-white border-teal-600",
  risk:     "bg-red-500 text-white border-red-600",
  bank:     "bg-yellow-400 text-yellow-900 border-yellow-500",
  expenses: "bg-orange-500 text-white border-orange-600",
  upgrade:  "bg-purple-500 text-white border-purple-600",
  airport:  "bg-sky-500 text-white border-sky-600",
  meeting:  "bg-indigo-500 text-white border-indigo-600",
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function MarketGame() {
  const navigate   = useNavigate();
  const timerRef   = useRef<ReturnType<typeof setInterval>|null>(null);

  const [phase,       setPhase]       = useState<Phase>("intro");
  const [cash,        setCash]        = useState(5000);
  const [position,    setPosition]    = useState(0);
  const [animPos,     setAnimPos]     = useState(0);
  const [animating,   setAnimating]   = useState(false);
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
  const [showRules,   setShowRules]   = useState(false);
  const [tooltipSq,   setTooltipSq]   = useState<number|null>(null);
  const [pendingPos,  setPendingPos]  = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/book-login");
    });
  }, [navigate]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase.from("book_progress" as any).select("coins_earned").eq("user_id", user.id);
      if (data) {
        const total = (data as any[]).reduce((s:number,r:any) => s+(r.coins_earned||0), 0);
        setBookBonus(Math.min(500, Math.floor(total/100)*10));
      }
    });
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getBiz       = (id:string) => BUSINESSES.find(b=>b.id===id)!;
  const ownedBizList = () => BUSINESSES.filter(b => owned[b.id]);
  const netProfit    = (b:Business) => b.profit + (upgraded[b.id]?b.upgProfit:0) - b.expense;
  const totalNet     = () => ownedBizList().reduce((s,b) => s+netProfit(b), 0);
  const totalAssets  = () => ownedBizList().reduce((s,b) => s+(upgraded[b.id]?b.saleUpg:b.sale), 0);
  const totalWealth  = () => cash + totalAssets();
  const addLog       = (msg:string) => setLog(prev => [msg, ...prev.slice(0,14)]);

  const startGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCash(5000 + bookBonus);
    setPosition(0); setAnimPos(0); setAnimating(false);
    setRound(1); setDice(null);
    setOwned({}); setUpgraded({});
    setCurrentCard(null); setUsedRisk([]);
    setHasDiscount(false); setHasLucky(false);
    setLog([]); setRoundProfit(0); setMeetingBiz(null);
    setPendingPos(0);
    setPhase("rolling");
  };

  // ── Roll + animate ──────────────────────────────────────────────────────────
  const rollDice = () => {
    const d = Math.floor(Math.random()*6)+1;
    setDice(d);
    setPhase("animating");

    let step = 0;
    let curr = position;

    timerRef.current = setInterval(() => {
      step++;
      curr = (curr+1) % SQUARES.length;
      setAnimPos(curr);

      if (step === d) {
        if (timerRef.current) clearInterval(timerRef.current);
        setAnimating(false);
        // Passed start?
        if (curr < position || (position === 0 && step === d && curr !== 0)) {
          if (curr !== 0) {
            setCash(c => c + BANK_AMOUNT);
            addLog(`🏁 Πέρασες από την Αφετηρία! +${BANK_AMOUNT}€`);
          }
        }
        setPosition(curr);
        setPendingPos(curr);
        setTimeout(() => handleSquare(curr), 100);
      }
    }, 280);
  };

  // ── Square logic ─────────────────────────────────────────────────────────────
  const handleSquare = (pos:number) => {
    const sq = SQUARES[pos];
    addLog(`🎲 Έπεσες στο: ${sq.emoji} ${sq.name}`);

    if (sq.type==="start") {
      setCash(c=>c+BANK_AMOUNT);
      addLog(`🏁 Αφετηρία! +${BANK_AMOUNT}€`);
      doNextRound();
    } else if (sq.type==="bank") {
      setCash(c=>c+BANK_AMOUNT);
      addLog(`🏦 Τράπεζα! +${BANK_AMOUNT}€`);
      doNextRound();
    } else if (sq.type==="risk") {
      drawRisk();
    } else if (sq.type==="business") {
      setPhase("action");
    } else if (sq.type==="expenses") {
      const total = ownedBizList().reduce((s,b)=>s+b.expense,0);
      if (total>0) { setCash(c=>c-total); addLog(`💸 Έξοδα! -${total}€`); }
      else addLog("💸 Έξοδα — δεν έχεις επιχειρήσεις ακόμα.");
      doNextRound();
    } else if (sq.type==="upgrade") {
      const upgradeable = ownedBizList().filter(b=>!upgraded[b.id]);
      if (upgradeable.length>0) setPhase("upgrade_pick");
      else { addLog("⬆️ Δεν υπάρχει επιχείρηση για αναβάθμιση."); doNextRound(); }
    } else if (sq.type==="airport") {
      setPhase("airport_pick");
    } else if (sq.type==="meeting") {
      setPhase("meeting");
    }
  };

  const drawRisk = () => {
    const avail = RISK_CARDS.filter(r=>!usedRisk.includes(r.id));
    const pool  = avail.length>0 ? avail : RISK_CARDS;
    const card  = pool[Math.floor(Math.random()*pool.length)];
    setUsedRisk(prev=>[...prev,card.id]);

    if (card.special==="discount") { setHasDiscount(true); setCurrentCard(card); setPhase("action"); return; }
    if (card.special==="lucky")    { setHasLucky(true);    setCurrentCard(card); setPhase("action"); return; }

    let delta = card.delta;
    if (delta<0 && hasLucky) { delta=Math.floor(delta/2); setHasLucky(false); addLog("🍀 Τυχερή κάρτα! Μισά έξοδα."); }
    setCash(c=>c+delta);
    setCurrentCard(card);
    setPhase("action");
  };

  const buyBiz = (biz:Business) => {
    let price = biz.buy - biz.subsidy;
    if (hasDiscount) { price=Math.round(price*0.8); setHasDiscount(false); }
    if (cash<price) return;
    setCash(c=>c-price);
    setOwned(prev=>({...prev,[biz.id]:true}));
    addLog(`🏪 Αγόρασες: ${biz.emoji} ${biz.name} (${price}€ μετά επιδότηση ${biz.subsidy}€)`);
    doNextRound();
  };

  const sellBiz = (biz:Business) => {
    const price = upgraded[biz.id]?biz.saleUpg:biz.sale;
    setCash(c=>c+price);
    setOwned(prev=>{const n={...prev};delete n[biz.id];return n;});
    setUpgraded(prev=>{const n={...prev};delete n[biz.id];return n;});
    addLog(`💼 Πούλησες: ${biz.emoji} ${biz.name} (${price}€)`);
    doNextRound();
  };

  const upgradeBiz = (biz:Business) => {
    if (cash<biz.upgCost) return;
    setCash(c=>c-biz.upgCost);
    setUpgraded(prev=>({...prev,[biz.id]:true}));
    addLog(`⬆️ Αναβάθμισες: ${biz.emoji} ${biz.name} (+${biz.upgProfit}€/γύρο)`);
    doNextRound();
  };

  const teleport = (pos:number) => {
    if (cash<AIRPORT_COST) return;
    setCash(c=>c-AIRPORT_COST);
    setPosition(pos);
    addLog(`🛫 Αεροδρόμιο! Μεταφέρθηκες → ${SQUARES[pos].emoji} ${SQUARES[pos].name}`);
    handleSquare(pos);
  };

  const doNextRound = () => {
    const profit = totalNet();
    if (profit!==0) { setCash(c=>c+profit); setRoundProfit(profit); }
    if (round>=TOTAL_ROUNDS) { setPhase("results"); return; }
    setRound(r=>r+1);
    setDice(null); setCurrentCard(null); setMeetingBiz(null);
    if (profit!==0) setPhase("profit"); else setPhase("rolling");
  };

  // ── Board ────────────────────────────────────────────────────────────────────
  const displayPos = animating ? animPos : position;
  const sq         = SQUARES[position];
  const sqBiz      = sq.bizId ? getBiz(sq.bizId) : null;
  const isOwned    = sqBiz ? !!owned[sqBiz.id] : false;
  const isUpg      = sqBiz ? !!upgraded[sqBiz.id] : false;
  const netCost    = sqBiz ? Math.round((sqBiz.buy-sqBiz.subsidy)*(hasDiscount?0.8:1)) : 0;

  const Board = ({ airportMode=false }) => (
    <div className="w-full px-2">
      <div
        className="w-full border-2 border-teal-400 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 shadow-md"
        style={{ display:'grid', gridTemplateColumns:'repeat(11,1fr)', gridTemplateRows:'repeat(6, 50px)' }}
      >
        {/* Center panel */}
        <div style={{gridColumn:'2/11',gridRow:'2/6'}}
          className="flex flex-col items-center justify-center bg-gradient-to-br from-teal-400/10 to-cyan-400/10 p-1 text-center">
          <div className="text-sm font-black text-teal-700 leading-none">START-UP</div>
          <div className="text-[10px] font-black text-orange-500 leading-none">ADVENTURE</div>
          <div className="text-[9px] text-gray-500 mt-0.5">Γύρος {round}/{TOTAL_ROUNDS}</div>
          <div className="text-sm font-black text-green-700">💶{cash.toLocaleString()}€</div>
          {dice && !animating && <div className="text-[10px] font-bold text-teal-600 mt-0.5">🎲 {dice} βήματα</div>}
          {ownedBizList().length>0 && (
            <div className="text-base mt-0.5">{ownedBizList().map(b=>b.emoji).join("")}</div>
          )}
          {airportMode && <div className="text-[10px] text-blue-700 font-bold mt-1 animate-pulse">Πάτα τετράγωνο!</div>}
        </div>

        {/* All 30 squares */}
        {SQUARES.map(s => {
          const isHere    = s.id === displayPos;
          const hasOwnedBiz = s.bizId && owned[s.bizId];
          const isTarget  = airportMode && s.type==="business" && !owned[s.bizId||""] && s.id!==position;

          return (
            <div
              key={s.id}
              style={sqGrid(s.id)}
              className={[
                "border border-white/40 flex flex-col items-center justify-center overflow-hidden relative transition-all duration-150 select-none",
                SQ_TYPE_STYLE[s.type],
                isHere     ? "ring-[3px] ring-white z-10 scale-110 shadow-lg" : "",
                hasOwnedBiz? "ring-2 ring-yellow-300" : "",
                isTarget   ? "cursor-pointer opacity-90 hover:scale-110 hover:ring-2 hover:ring-white animate-pulse" : "",
              ].join(" ")}
              onClick={isTarget ? ()=>teleport(s.id) : undefined}
              onMouseEnter={()=>setTooltipSq(s.id)}
              onMouseLeave={()=>setTooltipSq(null)}
            >
              <span className="text-2xl leading-none">{isHere ? "🧍" : s.emoji}</span>
              <span className="text-[8px] leading-tight font-bold text-center px-0.5 w-full truncate opacity-95 mt-0.5">
                {s.name.length>6?s.name.slice(0,5)+"…":s.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltipSq!==null && (
        <div className="mt-1 mx-2 text-center text-xs bg-gray-800 text-white rounded-lg px-3 py-1">
          {SQUARES[tooltipSq].emoji} <strong>{SQUARES[tooltipSq].name}</strong>
          {SQUARES[tooltipSq].bizId && owned[SQUARES[tooltipSq].bizId!] && " ✅ Δική σου"}
          {SQUARES[tooltipSq].bizId && !owned[SQUARES[tooltipSq].bizId!] && (() => {
            const b = getBiz(SQUARES[tooltipSq].bizId!);
            return ` • Αγορά: ${(b.buy-b.subsidy).toLocaleString()}€`;
          })()}
        </div>
      )}
    </div>
  );

  // ── Rules modal ──────────────────────────────────────────────────────────────
  const RulesModal = () => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={()=>setShowRules(false)}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 max-h-[85vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-teal-700">📋 Οδηγίες Παιχνιδιού</h2>
          <button onClick={()=>setShowRules(false)} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="bg-teal-50 rounded-2xl p-3">
            <div className="font-bold text-teal-700 mb-1">🎯 Στόχος</div>
            <p>Σε {TOTAL_ROUNDS} γύρους, φτιάξε το μεγαλύτερο επιχειρηματικό αυτοκρατορία! Κερδίζει αυτός που έχει τα περισσότερα χρήματα + αξία επιχειρήσεων στο τέλος.</p>
          </div>
          <div className="bg-blue-50 rounded-2xl p-3">
            <div className="font-bold text-blue-700 mb-2">🎲 Κάθε Γύρος</div>
            <div className="space-y-1 text-xs">
              <div>1. Ρίχνεις ζάρι (1-6) και μετακινείσαι</div>
              <div>2. Κάνεις πράξη στο τετράγωνο που έπεσες</div>
              <div>3. Μαζεύεις τα κέρδη των επιχειρήσεών σου</div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-3 space-y-1.5 text-xs">
            <div className="font-bold text-gray-700 mb-1">🗺️ Τετράγωνα</div>
            <div className="flex gap-2"><span className="text-base">🏁</span><div><strong>Αφετηρία:</strong> Κερδίζεις 1.000€ όταν περνάς ή σταματάς εδώ</div></div>
            <div className="flex gap-2"><span className="text-base">🏪</span><div><strong>Επιχείρηση:</strong> Μπορείς να αγοράσεις (αν δεν έχεις), να αναβαθμίσεις ή να πουλήσεις</div></div>
            <div className="flex gap-2"><span className="text-base">🎴</span><div><strong>Κάρτα Ρίσκου:</strong> Τραβάς κάρτα — μπορεί να κερδίσεις ή να χάσεις χρήματα!</div></div>
            <div className="flex gap-2"><span className="text-base">🏦</span><div><strong>Τράπεζα:</strong> Παίρνεις 1.000€ από την τράπεζα</div></div>
            <div className="flex gap-2"><span className="text-base">💸</span><div><strong>Έξοδα:</strong> Πληρώνεις τα έξοδα λειτουργίας όλων των επιχειρήσεών σου</div></div>
            <div className="flex gap-2"><span className="text-base">⬆️</span><div><strong>Αναβάθμιση:</strong> Μπορείς να αναβαθμίσεις μία επιχείρησή σου για μεγαλύτερα κέρδη</div></div>
            <div className="flex gap-2"><span className="text-base">🛫</span><div><strong>Αεροδρόμιο:</strong> Πληρώνεις {AIRPORT_COST}€ και πας σε οποιοδήποτε τετράγωνο της επιλογής σου</div></div>
            <div className="flex gap-2"><span className="text-base">🤝</span><div><strong>Business Meeting:</strong> Αγοράζεις ή πουλάς επιχείρηση σε ειδική τιμή αποτίμησης</div></div>
          </div>
          <div className="bg-green-50 rounded-2xl p-3 text-xs">
            <div className="font-bold text-green-700 mb-1">🏪 Επιχειρήσεις</div>
            <div>Κάθε επιχείρηση έχει: <strong>κόστος αγοράς</strong> (μείον επιδότηση τράπεζας), <strong>καθαρό κέρδος/γύρο</strong> (κέρδος μείον έξοδα), και <strong>τιμή πώλησης</strong>. Μπορείς να αναβαθμίσεις για ακόμα μεγαλύτερα κέρδη!</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-3 text-xs">
            <div className="font-bold text-yellow-700 mb-1">🎓 Bonus Βιβλίου</div>
            <div>Κάθε 100 πόντους που μάζεψες στο κουίζ του βιβλίου = 10€ επιπλέον στο ξεκίνημα (έως 500€)!</div>
          </div>
        </div>
        <Button onClick={()=>setShowRules(false)} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl mt-4 py-3 font-bold">
          Αρχίζω! 🚀
        </Button>
      </div>
    </div>
  );

  // ─── Persistent header ───────────────────────────────────────────────────────
  const Header = () => (
    <div className="bg-teal-600 text-white px-4 py-2 flex items-center justify-between flex-shrink-0">
      <div>
        <div className="font-bold text-sm leading-none">Γύρος {round}/{TOTAL_ROUNDS}</div>
        <div className="text-[10px] text-teal-200 mt-0.5">{SQUARES[position].emoji} {SQUARES[position].name}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-base font-black leading-none">💶{cash.toLocaleString()}€</div>
          <div className="text-[10px] text-teal-200">Σύνολο: {totalWealth().toLocaleString()}€</div>
        </div>
        <button onClick={()=>setShowRules(true)} className="bg-white/20 hover:bg-white/30 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">?</button>
      </div>
    </div>
  );

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (phase==="intro") return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-4">
      {showRules && <RulesModal/>}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🚀</div>
          <h1 className="text-3xl font-black text-teal-700">START-UP</h1>
          <h2 className="text-2xl font-black text-orange-500">ADVENTURE</h2>
          <p className="text-xs text-gray-400 mt-1">by KidsInBusiness.gr</p>
        </div>
        <div className="bg-teal-50 rounded-2xl p-4 mb-4 text-sm space-y-2">
          <div>🎲 <strong>10 γύροι</strong> γύρω από το ταμπλό — ρίξε ζάρι κάθε γύρο</div>
          <div>🏪 <strong>Αγόρασε επιχειρήσεις</strong> — μάζεψε κέρδη κάθε γύρο</div>
          <div>🎴 <strong>Κάρτες ρίσκου</strong> — καλές ή κακές εκπλήξεις!</div>
          <div>⬆️ <strong>Αναβάθμισε</strong> για μεγαλύτερα κέρδη</div>
          <div>🏆 Κερδίζει όποιος έχει τη μεγαλύτερη <strong>συνολική αξία</strong></div>
        </div>
        {bookBonus>0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 mb-4 text-center text-sm">
            🎓 <strong>Bonus βιβλίου!</strong> +{bookBonus}€ = Ξεκινάς με <strong>{(5000+bookBonus).toLocaleString()}€</strong>
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={startGame} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-lg py-6 rounded-2xl font-bold">
            Ξεκινάω! 🚀
          </Button>
          <button onClick={()=>setShowRules(true)} className="bg-gray-100 hover:bg-gray-200 rounded-2xl px-4 font-bold text-gray-600">
            📋
          </button>
        </div>
        <button onClick={()=>navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-600 mt-3">
          ← Πίσω στο βιβλίο
        </button>
      </div>
    </div>
  );

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  if (phase==="results") {
    const wealth = totalWealth();
    const grade  = wealth>=25000 ? {label:"Επιχειρηματίας Θρύλος!",stars:"🏆🏆🏆",color:"text-yellow-600"}
                 : wealth>=15000 ? {label:"Έμπειρος Επενδυτής",     stars:"⭐⭐⭐",  color:"text-blue-600"}
                 : wealth>=10000 ? {label:"Αναπτυσσόμενος CEO",     stars:"⭐⭐",    color:"text-green-600"}
                 :                 {label:"Νέος Επιχειρηματίας",    stars:"🌱",     color:"text-gray-600"};
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">{grade.stars}</div>
            <h2 className={`text-2xl font-black ${grade.color}`}>{grade.label}</h2>
            <div className="text-4xl font-black text-gray-800 mt-3">💶{wealth.toLocaleString()}€</div>
            <div className="text-sm text-gray-500 mt-1">Κεφάλαιο + Αξία επιχειρήσεων</div>
          </div>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between p-2 bg-green-50 rounded-xl"><span>💶 Ρευστό</span><span className="font-bold">{cash.toLocaleString()}€</span></div>
            {ownedBizList().map(b=>(
              <div key={b.id} className="flex justify-between p-2 bg-blue-50 rounded-xl">
                <span>{b.emoji} {b.name}{upgraded[b.id]?" ⬆️":""}</span>
                <span className="font-bold">{(upgraded[b.id]?b.saleUpg:b.sale).toLocaleString()}€</span>
              </div>
            ))}
            {bookBonus>0 && <div className="flex justify-between p-2 bg-yellow-50 rounded-xl"><span>🎓 Bonus βιβλίου</span><span className="font-bold text-yellow-600">+{bookBonus}€</span></div>}
            <div className="flex justify-between p-3 bg-gray-100 rounded-xl font-black text-lg border-2"><span>Σύνολο</span><span>{wealth.toLocaleString()}€</span></div>
          </div>
          <Button onClick={startGame} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-bold mb-2">🔄 Παίξε ξανά!</Button>
          <button onClick={()=>navigate("/book")} className="w-full text-sm text-gray-400 hover:text-gray-600 py-2">← Πίσω στο βιβλίο</button>
        </div>
      </div>
    );
  }

  // ─── MAIN GAME LAYOUT (all other phases) ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showRules && <RulesModal/>}
      <Header/>

      {/* Status chips */}
      {(hasDiscount||hasLucky||totalNet()>0) && (
        <div className="px-3 pt-2 flex gap-1.5 flex-wrap">
          {hasDiscount && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">🚀 20% έκπτωση</span>}
          {hasLucky    && <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">🍀 Τυχερή κάρτα</span>}
          {totalNet()>0&& <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">🏪 +{totalNet()}€/γύρο</span>}
        </div>
      )}

      {/* Board */}
      <div className="pt-2">
        <Board airportMode={phase==="airport_pick"}/>
      </div>

      {/* Bottom action panel */}
      <div className="flex-1 px-3 py-2 flex flex-col gap-2">

        {/* ROLLING */}
        {phase==="rolling" && (
          <div className="space-y-2">
            <Button onClick={rollDice} className="w-full bg-teal-600 hover:bg-teal-700 text-white text-2xl py-8 rounded-2xl font-black shadow-lg">
              🎲 Ρίξε Ζάρι!
            </Button>
            {log.length>0 && (
              <div className="bg-white rounded-xl p-3 max-h-24 overflow-y-auto shadow-sm">
                {log.slice(0,5).map((l,i)=><div key={i} className="text-xs text-gray-600 py-0.5 border-b border-gray-100 last:border-0">{l}</div>)}
              </div>
            )}
          </div>
        )}

        {/* ANIMATING */}
        {phase==="animating" && (
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-5xl mb-2 animate-bounce">{"⚀⚁⚂⚃⚄⚅"[(dice||1)-1]}</div>
            <div className="font-black text-2xl text-teal-700">Ζάρι: {dice}</div>
            <div className="text-gray-500 text-sm mt-1 animate-pulse">Κινείσαι... 🧍</div>
            <div className="mt-2 text-xs text-teal-600 font-medium">{SQUARES[animPos].emoji} {SQUARES[animPos].name}</div>
          </div>
        )}

        {/* ACTION — Risk card */}
        {phase==="action" && currentCard && !sqBiz && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">{currentCard.emoji}</span>
              <span className="font-black">{currentCard.title}</span>
              <span className="ml-auto text-xs opacity-80">🎴 Κάρτα Ρίσκου</span>
            </div>
            <div className="p-4">
              <p className="text-gray-700 text-sm mb-3">{currentCard.body}</p>
              {currentCard.delta!==0 && (
                <div className={`text-3xl font-black text-center mb-4 ${currentCard.delta>0?"text-green-600":"text-red-600"}`}>
                  {currentCard.delta>0?"+":""}{currentCard.delta}€
                </div>
              )}
              {currentCard.special==="discount"&&<div className="bg-green-100 text-green-700 rounded-xl p-3 mb-3 text-sm font-bold text-center">✅ Έκπτωση 20% αποθηκεύτηκε!</div>}
              {currentCard.special==="lucky"   &&<div className="bg-yellow-100 text-yellow-700 rounded-xl p-3 mb-3 text-sm font-bold text-center">🍀 Τυχερή κάρτα αποθηκεύτηκε!</div>}
              <Button onClick={doNextRound} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold">
                Συνέχεια →
              </Button>
            </div>
          </div>
        )}

        {/* ACTION — Business */}
        {phase==="action" && sqBiz && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-teal-500 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-2xl">{sqBiz.emoji}</span>
              <div>
                <div className="font-black text-sm">{sqBiz.name}</div>
                {isOwned&&<div className="text-xs opacity-80">✅ Δική σου{isUpg?" · ⬆️ Αναβαθμισμένη":""}</div>}
              </div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-1.5 text-xs mb-3">
                <div className="bg-gray-50 rounded-lg p-2 flex flex-col">
                  <span className="text-gray-500">Κόστος</span>
                  <span className="font-bold text-sm">{(sqBiz.buy-sqBiz.subsidy).toLocaleString()}€</span>
                  {hasDiscount&&<span className="text-green-600 font-bold">{netCost.toLocaleString()}€ (-20%)</span>}
                  <span className="text-green-600 text-[10px]">επιδ. {sqBiz.subsidy}€</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 flex flex-col">
                  <span className="text-gray-500">Κέρδος/γύρο</span>
                  <span className="font-bold text-sm text-blue-700">+{netProfit(sqBiz)}€</span>
                  <span className="text-[10px] text-orange-500">έξοδα -{sqBiz.expense}€</span>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 flex flex-col">
                  <span className="text-gray-500">Αναβάθμιση</span>
                  <span className="font-bold text-sm">{sqBiz.upgCost.toLocaleString()}€</span>
                  <span className="text-[10px] text-purple-600">+{sqBiz.upgProfit}€/γύρο</span>
                </div>
                <div className="bg-orange-50 rounded-lg p-2 flex flex-col">
                  <span className="text-gray-500">Πώληση</span>
                  <span className="font-bold text-sm text-orange-700">{(isUpg?sqBiz.saleUpg:sqBiz.sale).toLocaleString()}€</span>
                </div>
              </div>
              {!isOwned ? (
                <div className="space-y-2">
                  <Button onClick={()=>buyBiz(sqBiz)} disabled={cash<netCost}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold">
                    🏪 Αγορά {netCost.toLocaleString()}€
                  </Button>
                  {cash<netCost&&<p className="text-xs text-center text-red-500">Δεν έχεις αρκετά ({cash.toLocaleString()}€)</p>}
                  <Button onClick={doNextRound} variant="outline" className="w-full rounded-2xl text-sm">Πέρασμα →</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {!isUpg&&<Button onClick={()=>upgradeBiz(sqBiz)} disabled={cash<sqBiz.upgCost} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs py-3 font-bold">⬆️ {sqBiz.upgCost.toLocaleString()}€</Button>}
                  <Button onClick={()=>sellBiz(sqBiz)} variant="outline" className="flex-1 rounded-2xl text-red-600 border-red-300 text-xs py-3">💼 Πούλα</Button>
                  <Button onClick={doNextRound} variant="outline" className="flex-1 rounded-2xl text-xs py-3">→</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* UPGRADE PICK */}
        {phase==="upgrade_pick" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-purple-600 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-xl">⬆️</span>
              <span className="font-black">Αναβάθμιση Επιχείρησης</span>
            </div>
            <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
              {ownedBizList().filter(b=>!upgraded[b.id]).map(biz=>(
                <button key={biz.id} onClick={()=>upgradeBiz(biz)} disabled={cash<biz.upgCost}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between ${cash>=biz.upgCost?"border-purple-300 hover:border-purple-500 hover:bg-purple-50":"border-gray-200 opacity-50"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{biz.emoji}</span>
                    <div>
                      <div className="font-bold text-sm">{biz.name}</div>
                      <div className="text-xs text-green-600">+{biz.upgProfit}€/γύρο extra</div>
                    </div>
                  </div>
                  <div className="font-black text-purple-700">{biz.upgCost.toLocaleString()}€</div>
                </button>
              ))}
            </div>
            <div className="p-3 pt-0">
              <Button onClick={doNextRound} variant="outline" className="w-full rounded-2xl">Παράλειψη →</Button>
            </div>
          </div>
        )}

        {/* AIRPORT PICK */}
        {phase==="airport_pick" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-sky-500 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-xl">🛫</span>
              <div>
                <div className="font-black text-sm">Διεθνές Αεροδρόμιο</div>
                <div className="text-xs opacity-80">Πάτα οποιοδήποτε τετράγωνο στον πίνακα παραπάνω!</div>
              </div>
            </div>
            <div className="p-3 text-center">
              {cash<AIRPORT_COST
                ? <div className="text-red-500 text-sm mb-2">Δεν έχεις αρκετά για εισιτήριο ({AIRPORT_COST}€)</div>
                : <div className="text-sky-700 font-bold text-sm animate-pulse mb-2">👆 Επέλεξε τετράγωνο επιχείρησης στον πίνακα (κόστος: {AIRPORT_COST}€)</div>
              }
              <Button onClick={doNextRound} variant="outline" className="w-full rounded-2xl">Παράλειψη →</Button>
            </div>
          </div>
        )}

        {/* BUSINESS MEETING */}
        {phase==="meeting" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-indigo-600 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <span className="font-black">Business Meeting</span>
            </div>
            {!meetingBiz ? (
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-2">Αγόρασε ή πούλα επιχείρηση σε τιμή αποτίμησης</p>
                <div className="space-y-1 max-h-40 overflow-y-auto mb-2">
                  {BUSINESSES.filter(b=>!owned[b.id]).slice(0,8).map(biz=>{
                    const price=Math.round((biz.buy-biz.subsidy)*(hasDiscount?0.8:1));
                    return (
                      <button key={biz.id} onClick={()=>setMeetingBiz(biz)} disabled={cash<price}
                        className={`w-full text-left p-2 rounded-xl border flex items-center gap-2 text-xs transition-all ${cash>=price?"border-teal-300 hover:bg-teal-50":"border-gray-200 opacity-50"}`}>
                        <span>{biz.emoji}</span><span className="flex-1">{biz.name}</span>
                        <span className="font-bold text-teal-700">{price.toLocaleString()}€</span>
                      </button>
                    );
                  })}
                </div>
                {ownedBizList().length>0 && (
                  <>
                    <p className="text-xs text-gray-500 mb-1">Πώληση:</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto mb-2">
                      {ownedBizList().map(biz=>(
                        <button key={biz.id} onClick={()=>sellBiz(biz)}
                          className="w-full text-left p-2 rounded-xl border border-orange-300 hover:bg-orange-50 text-xs flex items-center gap-2">
                          <span>{biz.emoji}</span><span className="flex-1">{biz.name}</span>
                          <span className="font-bold text-orange-600">{(upgraded[biz.id]?biz.saleUpg:biz.sale).toLocaleString()}€</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <Button onClick={doNextRound} variant="outline" className="w-full rounded-2xl text-sm">Παράλειψη →</Button>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="text-4xl mb-1">{meetingBiz.emoji}</div>
                <div className="font-black">{meetingBiz.name}</div>
                <div className="text-2xl font-black text-teal-700 mt-1">{Math.round((meetingBiz.buy-meetingBiz.subsidy)*(hasDiscount?0.8:1)).toLocaleString()}€</div>
                <div className="text-xs text-green-600 mb-3">Κέρδος: +{netProfit(meetingBiz)}€/γύρο</div>
                <Button onClick={()=>buyBiz(meetingBiz)} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-2xl font-bold mb-2">🏪 Αγορά!</Button>
                <Button onClick={()=>setMeetingBiz(null)} variant="outline" className="w-full rounded-2xl">← Πίσω</Button>
              </div>
            )}
          </div>
        )}

        {/* PROFIT */}
        {phase==="profit" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-green-500 text-white px-4 py-2 flex items-center gap-2">
              <span className="text-xl">💶</span>
              <span className="font-black">Κέρδη Γύρου {round-1}</span>
            </div>
            <div className="p-3 space-y-1.5">
              {ownedBizList().map(b=>(
                <div key={b.id} className="flex justify-between text-sm bg-green-50 rounded-lg p-2">
                  <span>{b.emoji} {b.name}{upgraded[b.id]?" ⬆️":""}</span>
                  <span className="font-bold text-green-700">+{netProfit(b)}€</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-base border-t pt-2">
                <span>Σύνολο</span>
                <span className={roundProfit>=0?"text-green-700":"text-red-600"}>
                  {roundProfit>=0?"+":""}{roundProfit}€
                </span>
              </div>
            </div>
            <div className="px-3 pb-3">
              <Button onClick={()=>setPhase("rolling")} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold">
                Γύρος {round} →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
