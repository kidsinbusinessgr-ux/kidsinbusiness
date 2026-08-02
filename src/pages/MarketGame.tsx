import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Phase = "intro"|"rolling"|"animating"|"action"|"rent"|"upgrade_pick"|"airport_pick"|"meeting"|"bot_turn"|"profit"|"results";
type SquareType = "start"|"business"|"risk"|"bank"|"expenses"|"upgrade"|"airport"|"meeting";

interface Square    { id:number; type:SquareType; name:string; emoji:string; bizId?:string; }
interface Business  { id:string; name:string; emoji:string; buy:number; profit:number; expense:number; upgCost:number; upgProfit:number; subsidy:number; sale:number; saleUpg:number; }
interface RiskCard  { id:string; emoji:string; title:string; body:string; delta:number; special?:"discount"|"lucky"; }
interface BotTurnState { botPlayerIdx:number; targetPos:number; currAnimPos:number; step:number; diceRoll:number; }
interface Player    { id:number; name:string; emoji:string; colorBg:string; cash:number; pos:number; owned:Record<string,boolean>; upgraded:Record<string,boolean>; isBot:boolean; }

// ── Playable characters ───────────────────────────────────────────────────────
const CHARACTERS = [
  { name:"Σοφία",  emoji:"👩‍💼", colorBg:"bg-rose-500",   gradient:"from-rose-400 to-pink-600",    title:"Η Δημιουργική",  bio:"Βλέπει ευκαιρίες παντού και δεν φοβάται να ρισκάρει!" },
  { name:"Νίκος",  emoji:"🧑‍💼", colorBg:"bg-sky-600",    gradient:"from-sky-500 to-blue-700",     title:"Ο Στρατηγιστής", bio:"Ψύχραιμος και αναλυτικός — σκέφτεται πριν επενδύσει!" },
  { name:"Ζωή",    emoji:"👩‍🚀", colorBg:"bg-violet-600", gradient:"from-violet-500 to-purple-700", title:"Η Innovator",    bio:"Τεχνολογία και καινοτομία — πάντα ένα βήμα μπροστά!" },
];

const SQUARES: Square[] = [
  { id:0,  type:"start",    name:"Αφετηρία",        emoji:"🏁" },
  { id:1,  type:"business", name:"Αθλητικά",         emoji:"🏅", bizId:"athletic"    },
  { id:2,  type:"business", name:"Κομμωτήριο",       emoji:"💈", bizId:"hair"        },
  { id:3,  type:"business", name:"Εστιατόριο",       emoji:"🍴", bizId:"restaurant"  },
  { id:4,  type:"risk",     name:"Κάρτα Ρίσκου",     emoji:"⚠️" },
  { id:5,  type:"business", name:"Φούρνος",          emoji:"🥖", bizId:"bakery"      },
  { id:6,  type:"business", name:"Γυμναστήριο",      emoji:"💪", bizId:"gym"         },
  { id:7,  type:"business", name:"Πλυντ. Ρούχων",    emoji:"🫧", bizId:"laundry"     },
  { id:8,  type:"business", name:"Water Sports",     emoji:"🏄", bizId:"watersports" },
  { id:9,  type:"business", name:"Ανακύκλωση",       emoji:"♻️", bizId:"recycling"   },
  { id:10, type:"business", name:"Spa Center",       emoji:"🧖", bizId:"spa"         },
  { id:11, type:"business", name:"Pet Shop",         emoji:"🐕", bizId:"petshop"     },
  { id:12, type:"business", name:"Super Market",     emoji:"🏪", bizId:"supermarket" },
  { id:13, type:"risk",     name:"Κάρτα Ρίσκου",     emoji:"⚠️" },
  { id:14, type:"business", name:"Ξενοδοχείο",       emoji:"🏩", bizId:"hotel"       },
  { id:15, type:"bank",     name:"Τράπεζα",          emoji:"🏦" },
  { id:16, type:"risk",     name:"Κάρτα Ρίσκου",     emoji:"⚠️" },
  { id:17, type:"expenses", name:"Έξοδα",            emoji:"💸" },
  { id:18, type:"business", name:"Τουριστικό",       emoji:"🗺️", bizId:"travel"      },
  { id:19, type:"risk",     name:"Κάρτα Ρίσκου",     emoji:"⚠️" },
  { id:20, type:"upgrade",  name:"Αναβάθμιση",       emoji:"⬆️" },
  { id:21, type:"business", name:"Παιχνίδια",        emoji:"🎮", bizId:"toys"        },
  { id:22, type:"business", name:"Rent a Car",       emoji:"🚙", bizId:"rentacar"    },
  { id:23, type:"business", name:"Παπούτσια",        emoji:"👠", bizId:"shoes"       },
  { id:24, type:"airport",  name:"Αεροδρόμιο",       emoji:"🛫" },
  { id:25, type:"meeting",  name:"Biz Meeting",      emoji:"👔" },
  { id:26, type:"business", name:"Αντ. Αυτ/νων",     emoji:"🚘", bizId:"cardealer"   },
  { id:27, type:"risk",     name:"Κάρτα Ρίσκου",     emoji:"⚠️" },
  { id:28, type:"expenses", name:"Έξοδα",            emoji:"💸" },
  { id:29, type:"business", name:"Οπτικά",           emoji:"🕶️", bizId:"optical"     },
];

const BUSINESSES: Business[] = [
  { id:"athletic",    name:"Κατ. Αθλητικών",        emoji:"🏅", buy:4500, profit:300, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"restaurant",  name:"Εστιατόριο",             emoji:"🍴", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"spa",         name:"Spa Center",             emoji:"🧖", buy:4000, profit:250, expense:80,  upgCost:1500, upgProfit:100, subsidy:900,  sale:6000,  saleUpg:7500  },
  { id:"bakery",      name:"Φούρνος",                emoji:"🥖", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:80,  subsidy:850,  sale:5500,  saleUpg:6500  },
  { id:"toys",        name:"Κατ. Παιχνίδια",         emoji:"🎮", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"hair",        name:"Κομμωτήριο",             emoji:"💈", buy:3500, profit:210, expense:75,  upgCost:900,  upgProfit:90,  subsidy:800,  sale:5200,  saleUpg:6200  },
  { id:"petshop",     name:"Pet Shop",               emoji:"🐕", buy:3700, profit:230, expense:80,  upgCost:1000, upgProfit:100, subsidy:850,  sale:5500,  saleUpg:6800  },
  { id:"supermarket", name:"Super Market",           emoji:"🏪", buy:5000, profit:400, expense:150, upgCost:2000, upgProfit:200, subsidy:1200, sale:7500,  saleUpg:9500  },
  { id:"gym",         name:"Γυμναστήριο",            emoji:"💪", buy:4500, profit:320, expense:100, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"cardealer",   name:"Αντ. Αυτοκινήτων",       emoji:"🚘", buy:5000, profit:450, expense:170, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"laundry",     name:"Πλυντ. Ρούχων",          emoji:"🫧", buy:3800, profit:220, expense:70,  upgCost:1000, upgProfit:100, subsidy:900,  sale:5500,  saleUpg:6800  },
  { id:"optical",     name:"Κατ. Οπτικών",           emoji:"🕶️", buy:4200, profit:250, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
  { id:"shoes",       name:"Κατ. Παπουτσιών",        emoji:"👠", buy:4000, profit:280, expense:90,  upgCost:1500, upgProfit:120, subsidy:1000, sale:6500,  saleUpg:8000  },
  { id:"hotel",       name:"Ξενοδοχείο",             emoji:"🏩", buy:5000, profit:500, expense:200, upgCost:2500, upgProfit:300, subsidy:1800, sale:8500,  saleUpg:11000 },
  { id:"watersports", name:"Water Sports",           emoji:"🏄", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
  { id:"travel",      name:"Τουριστικό Πρακτορείο",  emoji:"🗺️", buy:4500, profit:320, expense:110, upgCost:1500, upgProfit:150, subsidy:1000, sale:6800,  saleUpg:8500  },
  { id:"recycling",   name:"Εργοστ. Ανακύκλωσης",   emoji:"♻️", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"rentacar",    name:"Rent a Car",             emoji:"🚙", buy:4800, profit:350, expense:120, upgCost:1800, upgProfit:180, subsidy:1200, sale:7200,  saleUpg:9000  },
  { id:"cinema",      name:"Κινηματογράφος",         emoji:"🎬", buy:5000, profit:450, expense:180, upgCost:2000, upgProfit:250, subsidy:1500, sale:8000,  saleUpg:10000 },
  { id:"carwash",     name:"Πλυντ. Αυτοκινήτων",    emoji:"🚗", buy:4200, profit:280, expense:90,  upgCost:1200, upgProfit:120, subsidy:950,  sale:6300,  saleUpg:7800  },
];

const RISK_CARDS: RiskCard[] = [
  { id:"r1",  emoji:"🔥", title:"Ευκαιρία Χορηγίας!",           body:"Ένας χορηγός ενδιαφέρεται για σένα.",        delta:500  },
  { id:"r2",  emoji:"💰", title:"Κρατική Επιδότηση!",            body:"Η κυβέρνηση υποστηρίζει μικρές επιχειρήσεις.", delta:300 },
  { id:"r3",  emoji:"⭐", title:"Εξαιρετικές Κριτικές!",         body:"Οι πελάτες αγαπούν την επιχείρησή σου!",     delta:250  },
  { id:"r4",  emoji:"🏆", title:"Βραβείο Επιχειρηματικότητας!",  body:"Κέρδισες βραβείο και έλαβες έπαθλο!",        delta:600  },
  { id:"r5",  emoji:"🤝", title:"Νέος Εταίρος!",                 body:"Κάποιος επενδύει στην επιχείρησή σου.",      delta:350  },
  { id:"r6",  emoji:"💡", title:"Έξυπνη Ιδέα!",                 body:"Καινοτομία — νέοι πελάτες!",                 delta:400  },
  { id:"r7",  emoji:"🎉", title:"Γιορτινή Περίοδος!",            body:"Οι πωλήσεις εκτοξεύονται!",                 delta:400  },
  { id:"r8",  emoji:"🚀", title:"Νέα Ευκαιρία!",                body:"Επόμενη αγορά με 20% έκπτωση!",              delta:0, special:"discount" },
  { id:"r9",  emoji:"🍀", title:"Η Τυχερή σου Μέρα!",            body:"Μισά έξοδα στην επόμενη αρνητική κάρτα!",  delta:0, special:"lucky" },
  { id:"r10", emoji:"🔧", title:"Έκτακτη Συντήρηση!",            body:"Απρόβλεπτη επισκευή εξοπλισμού.",           delta:-350 },
  { id:"r11", emoji:"📉", title:"Οικονομική Κρίση!",              body:"Η αγορά πέφτει.",                           delta:-500 },
  { id:"r12", emoji:"⚠️", title:"Ανταγωνιστής!",                body:"Νέος ανταγωνιστής παίρνει πελάτες.",        delta:-300 },
  { id:"r13", emoji:"💳", title:"Χρέος Τράπεζας!",               body:"Ένα παλιό χρέος επιστρέφει.",               delta:-500 },
  { id:"r14", emoji:"🛠️", title:"Ανακαίνιση!",                  body:"Χρειάζεσαι νέα διακόσμηση.",                delta:-300 },
  { id:"r15", emoji:"💼", title:"Απεργία Προσωπικού!",           body:"Οι εργαζόμενοι απεργούν.",                  delta:-250 },
  { id:"r16", emoji:"⛈️", title:"Κακός Καιρός!",                body:"Τα καταστήματα κλείνουν μία μέρα.",         delta:-250 },
  { id:"r17", emoji:"🛑", title:"Νομικό Πρόβλημα!",              body:"Νομικό ζήτημα στην επιχείρησή σου.",       delta:-400 },
  { id:"r18", emoji:"⚡", title:"Διακοπή Ρεύματος!",             body:"Όλα τα καταστήματα κλείνουν.",              delta:-150 },
  { id:"r19", emoji:"🤕", title:"Εργατικό Ατύχημα!",             body:"Αποζημίωση στον υπάλληλο.",                 delta:-600 },
  { id:"r20", emoji:"📈", title:"Πληθωρισμός!",                  body:"Αυξάνονται τα έξοδα.",                      delta:-200 },
];

const TOTAL_ROUNDS  = 10;
const BANK_AMOUNT   = 1000;
const AIRPORT_COST  = 200;

const SQ_STYLE: Record<SquareType,string> = {
  start:    "bg-emerald-500 text-white",
  business: "bg-cyan-600 text-white",
  risk:     "bg-rose-500 text-white",
  bank:     "bg-amber-400 text-amber-900",
  expenses: "bg-orange-500 text-white",
  upgrade:  "bg-violet-600 text-white",
  airport:  "bg-sky-500 text-white",
  meeting:  "bg-indigo-600 text-white",
};

const sqGrid = (id:number): React.CSSProperties => {
  if (id<=10)  return {gridColumn:`${id+1}`,gridRow:'6'};
  if (id<=14)  return {gridColumn:'11',gridRow:`${16-id}`};
  if (id<=25)  return {gridColumn:`${26-id}`,gridRow:'1'};
  return             {gridColumn:'1',gridRow:`${id-24}`};
};

const getBiz = (id:string) => BUSINESSES.find(b=>b.id===id)!;
const BOT_RISK_DELTAS = [-500,-400,-300,-200,-150,0,150,250,300,400,500,600];
const DICE_FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];

export default function MarketGame() {
  const navigate  = useNavigate();
  const timerRef  = useRef<ReturnType<typeof setInterval>|null>(null);

  const [players,       setPlayers]       = useState<Player[]>([]);
  const [phase,         setPhase]         = useState<Phase>("intro");
  const [round,         setRound]         = useState(1);
  const [dice,          setDice]          = useState<number|null>(null);
  const [animPos,       setAnimPos]       = useState(0);
  const [animating,     setAnimating]     = useState(false);
  const [botTurnState,  setBotTurnState]  = useState<BotTurnState|null>(null);
  const [botQueueIdx,   setBotQueueIdx]   = useState(0);
  const [currentCard,   setCurrentCard]   = useState<RiskCard|null>(null);
  const [usedRisk,      setUsedRisk]      = useState<string[]>([]);
  const [hasDiscount,   setHasDiscount]   = useState(false);
  const [hasLucky,      setHasLucky]      = useState(false);
  const [bookBonus,     setBookBonus]     = useState(0);
  const [log,           setLog]           = useState<string[]>([]);
  const [roundProfit,   setRoundProfit]   = useState(0);
  const [rentInfo,      setRentInfo]      = useState<{ownerIdx:number;amount:number;biz:Business}|null>(null);
  const [meetingBiz,    setMeetingBiz]    = useState<Business|null>(null);
  const [showRules,     setShowRules]     = useState(false);
  const [tooltipSq,     setTooltipSq]     = useState<number|null>(null);
  const [selectedChar,  setSelectedChar]  = useState(0);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ if(!session) navigate("/book-login"); });
  },[navigate]);

  useEffect(()=>{
    supabase.auth.getUser().then(async({data:{user}})=>{
      if(!user) return;
      const {data} = await supabase.from("book_progress" as any).select("coins_earned").eq("user_id",user.id);
      if(data){ const t=(data as any[]).reduce((s:number,r:any)=>s+(r.coins_earned||0),0); setBookBonus(Math.min(500,Math.floor(t/100)*10)); }
    });
  },[]);

  // ── Bot turn sequencer ────────────────────────────────────────────────────
  useEffect(()=>{
    if(phase!=="bot_turn") return;
    const numBots=players.filter(p=>p.isBot).length;
    if(!botTurnState){
      if(botQueueIdx>=numBots){
        setPlayers(prev=>prev.map(p=>{
          const net=BUSINESSES.filter(b=>p.owned[b.id]).reduce((s,b)=>s+b.profit+(p.upgraded[b.id]?b.upgProfit:0)-b.expense,0);
          return net!==0?{...p,cash:Math.max(0,p.cash+net)}:p;
        }));
        const humanNet=BUSINESSES.filter(b=>players[0]?.owned[b.id]).reduce((s,b)=>s+b.profit+(players[0]?.upgraded[b.id]?b.upgProfit:0)-b.expense,0);
        setRoundProfit(humanNet);
        if(round>=TOTAL_ROUNDS){setTimeout(()=>setPhase("results"),500);return;}
        setRound(r=>r+1);
        setDice(null);setCurrentCard(null);setMeetingBiz(null);setRentInfo(null);
        setTimeout(()=>setPhase(humanNet!==0?"profit":"rolling"),400);
        return;
      }
      const playerIdx=botQueueIdx+1;
      const bot=players[playerIdx];
      if(!bot){setBotQueueIdx(i=>i+1);return;}
      const d=Math.floor(Math.random()*6)+1;
      const targetPos=(bot.pos+d)%SQUARES.length;
      setBotTurnState({botPlayerIdx:playerIdx,targetPos,currAnimPos:bot.pos,step:0,diceRoll:d});
      return;
    }
    if(botTurnState.step<botTurnState.diceRoll){
      const t=setTimeout(()=>{
        const next=(botTurnState.currAnimPos+1)%SQUARES.length;
        setBotTurnState(prev=>prev?{...prev,currAnimPos:next,step:prev.step+1}:null);
      },260);
      return ()=>clearTimeout(t);
    }
    const t=setTimeout(()=>{
      applyBotAction(botTurnState.botPlayerIdx,botTurnState.targetPos);
      setBotTurnState(null);
      setBotQueueIdx(i=>i+1);
    },350);
    return ()=>clearTimeout(t);
  },[phase,botQueueIdx,botTurnState]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const human       = players[0];
  const addLog      = (msg:string) => setLog(prev=>[msg,...prev.slice(0,14)]);
  const getOwnedBiz = (p:Player)=> BUSINESSES.filter(b=>p.owned[b.id]);
  const netProfit   = (b:Business,p:Player)=>b.profit+(p.upgraded[b.id]?b.upgProfit:0)-b.expense;
  const totalAssets = (p:Player)=>getOwnedBiz(p).reduce((s,b)=>s+(p.upgraded[b.id]?b.saleUpg:b.sale),0);
  const totalWealth = (p:Player)=>p.cash+totalAssets(p);
  const findOwner   = (bizId:string):number=>players.findIndex(p=>p.owned[bizId]);

  const startGame = ()=>{
    if(timerRef.current) clearInterval(timerRef.current);
    const char = CHARACTERS[selectedChar];
    setPlayers([
      {id:0,name:char.name, emoji:char.emoji, colorBg:char.colorBg,  cash:8000+bookBonus,pos:0,owned:{},upgraded:{},isBot:false},
      {id:1,name:"Μαρία",   emoji:"👧",        colorBg:"bg-pink-500", cash:7000,          pos:0,owned:{},upgraded:{},isBot:true },
      {id:2,name:"Άλεξ",    emoji:"👦",        colorBg:"bg-blue-500", cash:7000,          pos:0,owned:{},upgraded:{},isBot:true },
    ]);
    setPhase("rolling"); setRound(1); setDice(null); setAnimPos(0);
    setUsedRisk([]); setHasDiscount(false); setHasLucky(false);
    setLog([]); setRoundProfit(0); setBotQueueIdx(0);
    setCurrentCard(null); setMeetingBiz(null); setRentInfo(null); setBotTurnState(null);
  };

  const rollDice = ()=>{
    const d=Math.floor(Math.random()*6)+1;
    setDice(d); setAnimating(true); setPhase("animating");
    let step=0, curr=human.pos;
    timerRef.current=setInterval(()=>{
      step++; curr=(curr+1)%SQUARES.length; setAnimPos(curr);
      if(step===d){
        if(timerRef.current) clearInterval(timerRef.current);
        setAnimating(false);
        if(curr<human.pos&&human.pos!==0){
          setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash+BANK_AMOUNT};return n;});
          addLog(`🏁 Πέρασες από την Αφετηρία! +${BANK_AMOUNT}€`);
        }
        setPlayers(prev=>{const n=[...prev];n[0]={...n[0],pos:curr};return n;});
        setTimeout(()=>handleSquare(curr,players),100);
      }
    },280);
  };

  const handleSquare=(pos:number,pl:Player[])=>{
    const sq=SQUARES[pos];
    addLog(`🎲 Έπεσες: ${sq.emoji} ${sq.name}`);
    if(sq.type==="start"){
      setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash+BANK_AMOUNT};return n;});
      addLog(`🏁 Αφετηρία! +${BANK_AMOUNT}€`);
      triggerBotTurns();
    } else if(sq.type==="bank"){
      setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash+BANK_AMOUNT};return n;});
      addLog(`🏦 Τράπεζα! +${BANK_AMOUNT}€`);
      triggerBotTurns();
    } else if(sq.type==="risk"){
      drawRisk();
    } else if(sq.type==="business"&&sq.bizId){
      const ownerIdx=pl.findIndex(p=>p.owned[sq.bizId!]);
      if(ownerIdx>0){
        const biz=getBiz(sq.bizId);
        const rent=biz.profit;
        setPlayers(prev=>{
          const n=[...prev];
          n[0]={...n[0],cash:Math.max(0,n[0].cash-rent)};
          n[ownerIdx]={...n[ownerIdx],cash:n[ownerIdx].cash+rent};
          return n;
        });
        setRentInfo({ownerIdx,amount:rent,biz});
        addLog(`💸 Πλήρωσες ${rent}€ ενοίκιο στον/στη ${pl[ownerIdx].name}!`);
        setPhase("rent");
      } else {
        setPhase("action");
      }
    } else if(sq.type==="expenses"){
      const h=pl[0];
      const total=getOwnedBiz(h).reduce((s,b)=>s+b.expense,0);
      if(total>0){setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:Math.max(0,n[0].cash-total)};return n;}); addLog(`💸 Έξοδα: -${total}€`);}
      triggerBotTurns();
    } else if(sq.type==="upgrade"){
      const h=pl[0];
      if(getOwnedBiz(h).filter(b=>!h.upgraded[b.id]).length>0) setPhase("upgrade_pick");
      else{ addLog("⬆️ Δεν υπάρχει επιχείρηση για αναβάθμιση."); triggerBotTurns(); }
    } else if(sq.type==="airport"){
      setPhase("airport_pick");
    } else if(sq.type==="meeting"){
      setPhase("meeting");
    }
  };

  const drawRisk=()=>{
    const avail=RISK_CARDS.filter(r=>!usedRisk.includes(r.id));
    const pool=avail.length>0?avail:RISK_CARDS;
    const card=pool[Math.floor(Math.random()*pool.length)];
    setUsedRisk(prev=>[...prev,card.id]);
    if(card.special==="discount"){setHasDiscount(true);setCurrentCard(card);setPhase("action");return;}
    if(card.special==="lucky"){setHasLucky(true);setCurrentCard(card);setPhase("action");return;}
    let delta=card.delta;
    if(delta<0&&hasLucky){delta=Math.floor(delta/2);setHasLucky(false);addLog("🍀 Τυχερή κάρτα! Μισά έξοδα.");}
    setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:Math.max(0,n[0].cash+delta)};return n;});
    setCurrentCard(card);
    setPhase("action");
  };

  const triggerBotTurns=()=>{ setBotQueueIdx(0); setBotTurnState(null); setPhase("bot_turn"); };

  const buyBiz=(biz:Business)=>{
    let price=biz.buy-biz.subsidy;
    if(hasDiscount){price=Math.round(price*0.8);setHasDiscount(false);}
    if(!human||human.cash<price) return;
    setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash-price,owned:{...n[0].owned,[biz.id]:true}};return n;});
    addLog(`🏪 Αγόρασες: ${biz.emoji} ${biz.name} (${price}€)`);
    triggerBotTurns();
  };

  const sellBiz=(biz:Business)=>{
    const price=human.upgraded[biz.id]?biz.saleUpg:biz.sale;
    setPlayers(prev=>{
      const n=[...prev];
      const o={...n[0].owned}; delete o[biz.id];
      const u={...n[0].upgraded}; delete u[biz.id];
      n[0]={...n[0],cash:n[0].cash+price,owned:o,upgraded:u};
      return n;
    });
    addLog(`💼 Πούλησες: ${biz.emoji} ${biz.name} (${price}€)`);
    triggerBotTurns();
  };

  const upgradeBiz=(biz:Business)=>{
    if(!human||human.cash<biz.upgCost) return;
    setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash-biz.upgCost,upgraded:{...n[0].upgraded,[biz.id]:true}};return n;});
    addLog(`⬆️ Αναβάθμισες: ${biz.emoji} ${biz.name}`);
    triggerBotTurns();
  };

  const teleport=(pos:number)=>{
    if(!human||human.cash<AIRPORT_COST) return;
    setPlayers(prev=>{const n=[...prev];n[0]={...n[0],cash:n[0].cash-AIRPORT_COST,pos};return n;});
    addLog(`🛫 Αεροδρόμιο → ${SQUARES[pos].emoji} ${SQUARES[pos].name}`);
    handleSquare(pos,players.map((p,i)=>i===0?{...p,pos}:p));
  };

  const applyBotAction=(playerIdx:number,newPos:number)=>{
    setPlayers(prev=>{
      const next=[...prev];
      const bot={...next[playerIdx],owned:{...next[playerIdx].owned},upgraded:{...next[playerIdx].upgraded}};
      const sq=SQUARES[newPos];
      let cashDelta=0;
      if(newPos<bot.pos&&bot.pos!==0) cashDelta+=BANK_AMOUNT;
      if(sq.type==="start"||sq.type==="bank"){
        cashDelta+=BANK_AMOUNT;
      } else if(sq.type==="risk"){
        cashDelta+=BOT_RISK_DELTAS[Math.floor(Math.random()*BOT_RISK_DELTAS.length)];
      } else if(sq.type==="expenses"){
        cashDelta-=BUSINESSES.filter(b=>bot.owned[b.id]).reduce((s,b)=>s+b.expense,0);
      } else if(sq.type==="upgrade"){
        const upgradeable=BUSINESSES.filter(b=>bot.owned[b.id]&&!bot.upgraded[b.id]);
        if(upgradeable.length>0&&bot.cash+cashDelta>=upgradeable[0].upgCost){
          cashDelta-=upgradeable[0].upgCost;
          bot.upgraded[upgradeable[0].id]=true;
        }
      } else if(sq.type==="business"&&sq.bizId){
        const biz=getBiz(sq.bizId);
        const ownerIdx=next.findIndex(p=>p.owned[sq.bizId!]);
        if(ownerIdx===-1){
          const cost=biz.buy-biz.subsidy;
          if(bot.cash+cashDelta>=cost&&Math.random()<0.72){
            cashDelta-=cost; bot.owned[sq.bizId]=true;
            addLog(`${bot.emoji} ${bot.name} αγόρασε ${biz.emoji} ${biz.name}!`);
          }
        } else if(ownerIdx!==playerIdx){
          const rent=biz.profit;
          if(bot.cash+cashDelta>=rent){
            cashDelta-=rent;
            next[ownerIdx]={...next[ownerIdx],cash:next[ownerIdx].cash+rent};
            if(ownerIdx===0) addLog(`💰 ${bot.emoji} ${bot.name} πλήρωσε ${rent}€ ενοίκιο σε σένα! (${biz.emoji} ${biz.name})`);
            else addLog(`${bot.emoji} ${bot.name} → ${next[ownerIdx].name} ${rent}€`);
          }
        }
      }
      next[playerIdx]={...bot,pos:newPos,cash:Math.max(0,bot.cash+cashDelta)};
      return next;
    });
  };

  const getDisplayPos=(playerIdx:number):number=>{
    if(playerIdx===0) return animating?animPos:(players[0]?.pos??0);
    if(botTurnState&&botTurnState.botPlayerIdx===playerIdx) return botTurnState.currAnimPos;
    return players[playerIdx]?.pos??0;
  };

  const sq          = SQUARES[human?.pos??0];
  const sqBiz       = sq.bizId?getBiz(sq.bizId):null;
  const isOwnedByMe = sqBiz?!!(human?.owned[sqBiz.id]):false;
  const isUpg       = sqBiz?!!(human?.upgraded[sqBiz.id]):false;
  const netCost     = sqBiz?Math.round((sqBiz.buy-sqBiz.subsidy)*(hasDiscount?0.8:1)):0;
  const ownerOfSq   = sq.bizId?findOwner(sq.bizId):-1;

  // ── Board ─────────────────────────────────────────────────────────────────
  const Board=({airportMode=false})=>(
    <div className="w-full px-2">
      <div className="rounded-2xl p-1 shadow-2xl" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)"}}>
        <div className="rounded-xl overflow-hidden border border-white/30"
          style={{display:'grid',gridTemplateColumns:'repeat(11,1fr)',gridTemplateRows:'repeat(6,50px)'}}>
          {/* Center */}
          <div style={{gridColumn:'2/11',gridRow:'2/6'}}
            className="flex flex-col items-center justify-between overflow-hidden relative">
            <div className="absolute inset-0" style={{background:"#81d4e8",backgroundImage:"repeating-linear-gradient(135deg,rgba(255,255,255,0.1) 0px,rgba(255,255,255,0.1) 1px,transparent 1px,transparent 10px),repeating-linear-gradient(45deg,rgba(255,255,255,0.1) 0px,rgba(255,255,255,0.1) 1px,transparent 1px,transparent 10px)"}}/>
            <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-0.5">
              <img src="/startup-logo.svg" alt="Start-up Adventure" className="w-full object-contain flex-1 min-h-0 px-1" style={{maxHeight:'calc(100% - 56px)'}}/>
              <div className="w-full px-1 space-y-0.5 pb-0.5">
                <div className="text-[7px] text-center text-teal-900 font-black">Γύρος {round}/{TOTAL_ROUNDS}</div>
                {players.map(p=>(
                  <div key={p.id} className="flex items-center gap-0.5 text-[7px] bg-white/80 rounded px-1">
                    <span className={`${p.colorBg} text-white rounded px-0.5 font-bold`}>{p.emoji}</span>
                    <span className="truncate text-gray-700 font-semibold">{p.name}</span>
                    <span className="ml-auto font-black text-gray-800">{p.cash.toLocaleString()}€</span>
                  </div>
                ))}
                {airportMode&&<div className="text-[7px] font-black animate-pulse bg-sky-100 text-sky-800 rounded px-1 text-center">👆 Επέλεξε τετράγωνο!</div>}
              </div>
            </div>
          </div>
          {/* Squares */}
          {SQUARES.map(s=>{
            const displayPositions=players.map((_,i)=>getDisplayPos(i));
            const pawnsHere=players.filter((_,i)=>displayPositions[i]===s.id);
            const humanHere=displayPositions[0]===s.id;
            const ownedBy=players.find(p=>s.bizId&&p.owned[s.bizId]);
            const isTarget=airportMode&&s.type==="business"&&!human?.owned[s.bizId||""]&&s.id!==human?.pos;
            const isActive=pawnsHere.length>0;
            return(
              <div key={s.id} style={sqGrid(s.id)}
                className={[
                  "border border-white/20 flex flex-col items-center justify-between overflow-hidden relative transition-all duration-200 py-0.5",
                  SQ_STYLE[s.type],
                  humanHere?"ring-[3px] ring-white z-10 scale-110 shadow-xl":"",
                  !humanHere&&isActive?"ring-2 ring-white/70 z-10 scale-105":"",
                  isTarget?"cursor-pointer hover:scale-110 hover:ring-2 hover:ring-white animate-pulse":"",
                ].join(" ")}
                onClick={isTarget?()=>teleport(s.id):undefined}
                onMouseEnter={()=>setTooltipSq(s.id)}
                onMouseLeave={()=>setTooltipSq(null)}>
                <span className="text-base leading-none">{s.emoji}</span>
                {ownedBy&&<div className={`absolute top-0 left-0 right-0 h-1 ${ownedBy.colorBg}`}/>}
                <div className="flex gap-0.5 justify-center flex-wrap">
                  {pawnsHere.map(p=>(
                    <div key={p.id}
                      className={`${p.colorBg} rounded-full flex items-center justify-center ring-1 ring-white shadow-sm text-[9px] font-bold leading-none`}
                      style={{width:'14px',height:'14px'}}>
                      {p.emoji}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {tooltipSq!==null&&(
        <div className="mt-1 mx-1 text-center text-xs bg-gray-900 text-white rounded-xl px-2 py-1 shadow-lg">
          {SQUARES[tooltipSq].emoji} <strong>{SQUARES[tooltipSq].name}</strong>
          {(()=>{const o=players.find(p=>SQUARES[tooltipSq].bizId&&p.owned[SQUARES[tooltipSq].bizId!]);
            return o?<span className={`ml-1 px-1.5 py-0.5 rounded-full text-white text-[10px] ${o.colorBg}`}>{o.emoji} {o.name}</span>:null;
          })()}
        </div>
      )}
    </div>
  );

  // ── Rules modal ───────────────────────────────────────────────────────────
  const RulesModal=()=>(
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={()=>setShowRules(false)}>
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 max-h-[88vh] overflow-y-auto shadow-2xl" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-indigo-700">📋 Οδηγίες Παιχνιδιού</h2>
          <button onClick={()=>setShowRules(false)} className="text-gray-400 text-2xl hover:text-gray-600">✕</button>
        </div>
        <div className="space-y-2 text-xs">
          <div className="bg-indigo-50 rounded-2xl p-3"><strong className="text-indigo-700">🎯 Στόχος:</strong> Σε {TOTAL_ROUNDS} γύρους μάζεψε τη μεγαλύτερη αξία (μετρητά + επιχειρήσεις). Παίζεις εναντίον της Μαρίας 👧 και του Άλεξ 👦!</div>
          <div className="bg-sky-50 rounded-2xl p-3 space-y-1">
            <div className="font-bold text-sky-700 mb-1">🗺️ Τετράγωνα</div>
            <div>🏁 <strong>Αφετηρία</strong> — +1.000€</div>
            <div>🏪 <strong>Επιχείρηση</strong> — αγορά, αναβάθμιση ή πώληση</div>
            <div>💸 <strong>Ενοίκιο</strong> — αν πέσεις σε ξένη επιχείρηση πληρώνεις!</div>
            <div>⚠️ <strong>Κάρτα Ρίσκου</strong> — τυχαίο κέρδος ή ζημιά</div>
            <div>🏦 <strong>Τράπεζα</strong> — +1.000€</div>
            <div>💸 <strong>Έξοδα</strong> — πληρώνεις λειτουργικά έξοδα</div>
            <div>⬆️ <strong>Αναβάθμιση</strong> — μεγαλύτερα κέρδη</div>
            <div>🛫 <strong>Αεροδρόμιο</strong> — -{AIRPORT_COST}€ τηλεμεταφορά</div>
            <div>👔 <strong>Biz Meeting</strong> — αγορά/πώληση σε αποτίμηση</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3"><strong>💰 Κέρδη:</strong> Κάθε γύρο κερδίζεις καθαρό κέρδος από κάθε επιχείρησή σου.</div>
          <div className="bg-amber-50 rounded-2xl p-3"><strong>🎓 Bonus:</strong> Κάθε 100 πόντους βιβλίου = +10€ εκκίνηση (έως +500€).</div>
        </div>
        <Button onClick={()=>setShowRules(false)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl mt-3 py-3 font-black">Κατάλαβα! 🚀</Button>
      </div>
    </div>
  );

  // ── Header ────────────────────────────────────────────────────────────────
  const Header=()=>(
    <div style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}} className="text-white px-3 py-2 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full ${human?.colorBg} flex items-center justify-center text-xl ring-2 ring-white shadow-sm`}>{human?.emoji}</div>
        <div>
          <div className="font-black text-sm">{human?.name} · Γύρος {round}/{TOTAL_ROUNDS}</div>
          <div className="text-[10px] text-white/70">{SQUARES[human?.pos??0].emoji} {SQUARES[human?.pos??0].name}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="text-base font-black">💶 {human?.cash.toLocaleString()}€</div>
          <div className="text-[10px] text-white/70">Αξία: {human?totalWealth(human).toLocaleString():0}€</div>
        </div>
        <button onClick={()=>setShowRules(true)} className="bg-white/20 hover:bg-white/30 rounded-full w-9 h-9 flex items-center justify-center font-black text-sm border-2 border-white/40">?</button>
      </div>
    </div>
  );

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if(phase==="intro") return(
    <div className="min-h-screen flex flex-col items-center justify-center p-4 game-font"
      style={{background:"linear-gradient(160deg,#6366f1 0%,#8b5cf6 40%,#ec4899 100%)"}}>
      {showRules&&<RulesModal/>}
      {/* Title */}
      <div className="text-center mb-5">
        <div className="text-6xl mb-1 drop-shadow-lg" style={{filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.3))"}}>🚀</div>
        <h1 className="text-5xl font-black text-white leading-none drop-shadow-xl"
          style={{textShadow:"3px 3px 0 rgba(0,0,0,0.3),0 0 40px rgba(255,255,255,0.2)"}}>
          START-UP
        </h1>
        <h2 className="text-4xl font-black text-amber-300 leading-none drop-shadow-xl"
          style={{textShadow:"2px 2px 0 rgba(0,0,0,0.3)"}}>
          ADVENTURE
        </h2>
        <p className="text-white/80 mt-2 text-sm font-semibold">Επέλεξε τον χαρακτήρα σου!</p>
      </div>

      {/* Character cards */}
      <div className="flex gap-2 mb-5 w-full max-w-xs">
        {CHARACTERS.map((c,i)=>(
          <button key={i} onClick={()=>setSelectedChar(i)}
            className={`flex-1 rounded-2xl p-3 text-center transition-all duration-200 border-4 ${
              selectedChar===i
                ?"border-white scale-105 shadow-2xl bg-white/25"
                :"border-white/30 bg-white/10 hover:bg-white/20 hover:scale-102"
            }`}>
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg ring-2 ring-white/60`}>
              {c.emoji}
            </div>
            <div className="font-black text-white text-sm">{c.name}</div>
            <div className="text-amber-300 text-[10px] font-bold">{c.title}</div>
            <div className="text-white/60 text-[9px] mt-1 leading-tight">{c.bio}</div>
            {selectedChar===i&&<div className="mt-1.5 bg-white text-purple-700 rounded-full text-[9px] font-black px-2 py-0.5">✓ Επιλεγμένος</div>}
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-4 text-sm text-white w-full max-w-xs space-y-1.5 border border-white/20">
        <div>🎲 <strong>10 γύροι</strong> γύρω από το ταμπλό</div>
        <div>🏪 Αγόρασε επιχειρήσεις, μάζεψε κέρδη κάθε γύρο</div>
        <div>💸 Αν κάποιος πέσει στη δική σου — πληρώνει <strong>ενοίκιο</strong>!</div>
        <div>🤖 Εναντίον Μαρίας 👧 και Άλεξ 👦</div>
      </div>

      {bookBonus>0&&(
        <div className="bg-amber-400/20 border-2 border-amber-300 rounded-2xl p-3 mb-4 text-center text-sm text-white w-full max-w-xs">
          🎓 <strong>Bonus βιβλίου!</strong> Ξεκινάς με <strong>{(8000+bookBonus).toLocaleString()}€</strong>
        </div>
      )}

      <div className="flex gap-2 w-full max-w-xs">
        <Button onClick={startGame}
          className="flex-1 bg-white hover:bg-white/90 text-purple-700 text-xl py-7 rounded-2xl font-black shadow-2xl border-4 border-white/80">
          Ξεκινάω! 🚀
        </Button>
        <button onClick={()=>setShowRules(true)}
          className="bg-white/20 hover:bg-white/30 rounded-2xl px-5 font-black text-white border-2 border-white/40 text-lg">
          📋
        </button>
      </div>
      <button onClick={()=>navigate("/book")} className="text-white/50 text-xs mt-4 hover:text-white/70">← Πίσω στο βιβλίο</button>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if(phase==="results"){
    const ranked=[...players].sort((a,b)=>totalWealth(b)-totalWealth(a));
    const humanRank=ranked.findIndex(p=>p.id===0)+1;
    const medals=["🥇","🥈","🥉"];
    return(
      <div className="min-h-screen flex items-center justify-center p-4 game-font"
        style={{background:"linear-gradient(160deg,#6366f1 0%,#8b5cf6 40%,#ec4899 100%)"}}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center mb-5">
            <div className="text-6xl mb-2">{humanRank===1?"🏆":"🎮"}</div>
            <h2 className="text-2xl font-black text-gray-800">{humanRank===1?"Κέρδισες! Μπράβο!":"Τελική Κατάταξη"}</h2>
            <p className="text-gray-500 text-sm">{humanRank===1?"Είσαι ο καλύτερος επιχειρηματίας!":"Συνέχισε να προσπαθείς!"}</p>
          </div>
          <div className="space-y-2 mb-5">
            {ranked.map((p,i)=>(
              <div key={p.id} className={`p-3 rounded-2xl border-2 ${p.id===0?"border-indigo-400 bg-indigo-50":"border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{medals[i]||"🎖️"}</span>
                  <div className={`${p.colorBg} text-white rounded-full w-9 h-9 flex items-center justify-center text-xl shadow`}>{p.emoji}</div>
                  <div className="flex-1">
                    <div className="font-black text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500">{getOwnedBiz(p).map(b=>b.emoji).join("")||"Καμία επιχείρηση"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-base text-gray-800">💶{totalWealth(p).toLocaleString()}€</div>
                    <div className="text-xs text-gray-400">{p.cash.toLocaleString()}€ + {totalAssets(p).toLocaleString()}€</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={startGame} className="w-full text-white text-lg py-4 rounded-2xl font-black mb-2 shadow-lg"
            style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}}>
            🔄 Παίξε ξανά!
          </Button>
          <button onClick={()=>navigate("/book")} className="w-full text-sm text-gray-400 py-2 hover:text-gray-600">← Πίσω στο βιβλίο</button>
        </div>
      </div>
    );
  }

  // ── MAIN GAME ─────────────────────────────────────────────────────────────
  return(
    <div className="min-h-screen flex flex-col game-font" style={{background:"linear-gradient(180deg,#f5f3ff 0%,#ede9fe 100%)"}}>
      {showRules&&<RulesModal/>}
      <Header/>

      {/* Active bonuses */}
      {(hasDiscount||hasLucky)&&(
        <div className="px-3 pt-2 flex gap-2">
          {hasDiscount&&<span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-black border border-emerald-300">🚀 20% έκπτωση</span>}
          {hasLucky&&   <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black border border-amber-300">🍀 Τυχερή κάρτα</span>}
        </div>
      )}

      <div className="pt-2"><Board airportMode={phase==="airport_pick"}/></div>

      <div className="flex-1 px-3 py-2 flex flex-col gap-2">

        {/* ROLLING */}
        {phase==="rolling"&&(
          <div className="space-y-2">
            <button onClick={rollDice}
              className="w-full text-white text-2xl py-7 rounded-2xl font-black shadow-xl transition-transform active:scale-95"
              style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 6px 0 #4338ca"}}>
              🎲 Ρίξε Ζάρι!
            </button>
            {log.length>0&&(
              <div className="bg-white rounded-2xl p-3 max-h-28 overflow-y-auto shadow-sm border border-purple-100">
                {log.slice(0,6).map((l,i)=><div key={i} className="text-xs text-gray-600 py-0.5 border-b border-gray-100 last:border-0">{l}</div>)}
              </div>
            )}
          </div>
        )}

        {/* ANIMATING */}
        {phase==="animating"&&(
          <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-purple-100">
            <div className="text-5xl mb-2 animate-bounce">{DICE_FACES[(dice||1)-1]}</div>
            <div className="font-black text-2xl text-indigo-700">Ζάρι: {dice}</div>
            <div className="text-sm text-indigo-500 mt-1 animate-pulse font-semibold">{SQUARES[animPos].emoji} {SQUARES[animPos].name}</div>
          </div>
        )}

        {/* RENT */}
        {phase==="rent"&&rentInfo&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-rose-200">
            <div style={{background:"linear-gradient(90deg,#f43f5e,#e11d48)"}} className="text-white px-4 py-3 text-center">
              <div className="text-4xl mb-1">💸</div>
              <div className="font-black text-xl">Πλήρωσες Ενοίκιο!</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-5xl mb-2">{rentInfo.biz.emoji}</div>
              <div className="font-black text-gray-800 text-lg mb-1">{rentInfo.biz.name}</div>
              <div className="text-sm text-gray-500 mb-3">
                ανήκει στον/στη <span className={`${players[rentInfo.ownerIdx]?.colorBg} text-white px-2 py-0.5 rounded-full text-xs font-bold`}>{players[rentInfo.ownerIdx]?.emoji} {players[rentInfo.ownerIdx]?.name}</span>
              </div>
              <div className="text-4xl font-black text-rose-600 mb-4">-{rentInfo.amount}€</div>
              <div className="text-xs text-gray-400 mb-4">Ενοίκιο = Ημερήσιο κέρδος επιχείρησης</div>
              <button onClick={()=>{setRentInfo(null);setPhase("action");}}
                className="w-full text-white py-3 rounded-2xl font-black shadow-md"
                style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}}>
                Συνέχεια →
              </button>
            </div>
          </div>
        )}

        {/* ACTION — Risk card */}
        {phase==="action"&&currentCard&&!sqBiz&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-purple-100">
            <div style={{background:currentCard.delta>=0?"linear-gradient(90deg,#10b981,#059669)":"linear-gradient(90deg,#f43f5e,#e11d48)"}}
              className="text-white px-4 py-3 flex items-center gap-3">
              <span className="text-3xl">{currentCard.emoji}</span>
              <div>
                <div className="font-black text-base">{currentCard.title}</div>
                <div className="text-white/80 text-xs">{currentCard.body}</div>
              </div>
            </div>
            <div className="p-4 text-center">
              {currentCard.delta!==0&&(
                <div className={`text-5xl font-black mb-4 ${currentCard.delta>0?"text-emerald-600":"text-rose-600"}`}>
                  {currentCard.delta>0?"+":""}{currentCard.delta}€
                </div>
              )}
              {currentCard.special==="discount"&&<div className="bg-emerald-100 text-emerald-800 rounded-2xl p-3 mb-3 font-black">✅ Έκπτωση 20% αποθηκεύτηκε!</div>}
              {currentCard.special==="lucky"&&   <div className="bg-amber-100 text-amber-800 rounded-2xl p-3 mb-3 font-black">🍀 Τυχερή κάρτα αποθηκεύτηκε!</div>}
              <button onClick={triggerBotTurns}
                className="w-full text-white py-3 rounded-2xl font-black shadow-md"
                style={{background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}}>
                Συνέχεια →
              </button>
            </div>
          </div>
        )}

        {/* ACTION — Business */}
        {phase==="action"&&sqBiz&&!rentInfo&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-cyan-100">
            <div style={{background:"linear-gradient(90deg,#0891b2,#0e7490)"}} className="text-white px-4 py-3 flex items-center gap-3">
              <span className="text-3xl">{sqBiz.emoji}</span>
              <div>
                <div className="font-black text-base">{sqBiz.name}</div>
                {isOwnedByMe&&<div className="text-white/80 text-xs">✅ Δική σου{isUpg?" · ⬆️ Αναβαθμισμένη":""}</div>}
                {ownerOfSq>0&&<div className="text-white/80 text-xs">🏠 Του/Της {players[ownerOfSq]?.name}</div>}
              </div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200">
                  <div className="text-gray-500 mb-0.5">Κόστος αγοράς</div>
                  <div className="font-black text-gray-800">{(sqBiz.buy-sqBiz.subsidy).toLocaleString()}€{hasDiscount&&<span className="text-emerald-600"> → {netCost.toLocaleString()}€</span>}</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-200">
                  <div className="text-gray-500 mb-0.5">Κέρδος/γύρο</div>
                  <div className="font-black text-emerald-700">+{human?netProfit(sqBiz,human):0}€</div>
                </div>
                <div className="bg-rose-50 rounded-xl p-2 border border-rose-200">
                  <div className="text-gray-500 mb-0.5">Ενοίκιο αν πέσουν</div>
                  <div className="font-black text-rose-600">{sqBiz.profit}€/επίσκεψη</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 border border-amber-200">
                  <div className="text-gray-500 mb-0.5">Τιμή πώλησης</div>
                  <div className="font-black text-amber-700">{(isUpg?sqBiz.saleUpg:sqBiz.sale).toLocaleString()}€</div>
                </div>
              </div>
              {!isOwnedByMe&&ownerOfSq<0?(
                <div className="space-y-2">
                  <button onClick={()=>buyBiz(sqBiz)} disabled={!human||human.cash<netCost}
                    className="w-full text-white py-3 rounded-2xl font-black shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{background:"linear-gradient(90deg,#0891b2,#0e7490)"}}>
                    🏪 Αγορά {netCost.toLocaleString()}€
                  </button>
                  {human&&human.cash<netCost&&<p className="text-xs text-center text-rose-500 font-semibold">Δεν έχεις αρκετά ({human.cash.toLocaleString()}€)</p>}
                  <button onClick={triggerBotTurns} className="w-full py-2.5 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200">Πέρασμα →</button>
                </div>
              ):isOwnedByMe?(
                <div className="flex gap-2">
                  {!isUpg&&<button onClick={()=>upgradeBiz(sqBiz)} disabled={!human||human.cash<sqBiz.upgCost}
                    className="flex-1 text-white py-3 rounded-2xl text-xs font-black disabled:opacity-40"
                    style={{background:"linear-gradient(90deg,#7c3aed,#6d28d9)"}}>
                    ⬆️ {sqBiz.upgCost.toLocaleString()}€
                  </button>}
                  <button onClick={()=>sellBiz(sqBiz)} className="flex-1 py-3 rounded-2xl text-rose-600 border-2 border-rose-300 text-xs font-black hover:bg-rose-50">💼 Πούλα</button>
                  <button onClick={triggerBotTurns} className="flex-1 py-3 rounded-2xl text-gray-500 bg-gray-100 text-xs font-bold hover:bg-gray-200">→</button>
                </div>
              ):(
                <button onClick={triggerBotTurns} className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Συνέχεια →</button>
              )}
            </div>
          </div>
        )}

        {/* UPGRADE PICK */}
        {phase==="upgrade_pick"&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-violet-100">
            <div style={{background:"linear-gradient(90deg,#7c3aed,#6d28d9)"}} className="text-white px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">⬆️</span><span className="font-black text-base">Αναβάθμιση Επιχείρησης</span>
            </div>
            <div className="p-3 space-y-2 max-h-52 overflow-y-auto">
              {human&&getOwnedBiz(human).filter(b=>!human.upgraded[b.id]).map(biz=>(
                <button key={biz.id} onClick={()=>upgradeBiz(biz)} disabled={human.cash<biz.upgCost}
                  className={`w-full text-left p-3 rounded-2xl border-2 flex items-center justify-between transition-colors ${human.cash>=biz.upgCost?"border-violet-300 hover:bg-violet-50":"border-gray-200 opacity-50 cursor-not-allowed"}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{biz.emoji}</span>
                    <div>
                      <div className="font-black text-sm text-gray-800">{biz.name}</div>
                      <div className="text-xs text-emerald-600 font-semibold">+{biz.upgProfit}€/γύρο επιπλέον</div>
                    </div>
                  </div>
                  <div className="font-black text-violet-700 text-sm">{biz.upgCost.toLocaleString()}€</div>
                </button>
              ))}
            </div>
            <div className="p-3 pt-0">
              <button onClick={triggerBotTurns} className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Παράλειψη →</button>
            </div>
          </div>
        )}

        {/* AIRPORT */}
        {phase==="airport_pick"&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-sky-100">
            <div style={{background:"linear-gradient(90deg,#0ea5e9,#0284c7)"}} className="text-white px-4 py-3">
              <div className="font-black text-base">🛫 Αεροδρόμιο</div>
              <div className="text-xs text-white/80">Πάτα οποιοδήποτε τετράγωνο! Κόστος: {AIRPORT_COST}€</div>
            </div>
            <div className="p-3">
              {human&&human.cash<AIRPORT_COST&&<p className="text-rose-500 text-sm text-center mb-2 font-semibold">Δεν έχεις αρκετά ({AIRPORT_COST}€)</p>}
              <button onClick={triggerBotTurns} className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Παράλειψη →</button>
            </div>
          </div>
        )}

        {/* MEETING */}
        {phase==="meeting"&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-indigo-100">
            <div style={{background:"linear-gradient(90deg,#4338ca,#3730a3)"}} className="text-white px-4 py-3">
              <div className="font-black text-base">👔 Business Meeting</div>
              <div className="text-xs text-white/80">Αγόρασε ή πούλα σε τιμή αποτίμησης</div>
            </div>
            {!meetingBiz?(
              <div className="p-3">
                <div className="space-y-1 max-h-36 overflow-y-auto mb-2">
                  {BUSINESSES.filter(b=>!human?.owned[b.id]&&findOwner(b.id)===-1).slice(0,8).map(biz=>{
                    const price=Math.round((biz.buy-biz.subsidy)*(hasDiscount?0.8:1));
                    return(
                      <button key={biz.id} onClick={()=>setMeetingBiz(biz)} disabled={!human||human.cash<price}
                        className={`w-full text-left p-2 rounded-xl border-2 flex items-center gap-2 text-xs font-semibold transition-colors ${human&&human.cash>=price?"border-indigo-200 hover:bg-indigo-50":"border-gray-200 opacity-50 cursor-not-allowed"}`}>
                        <span className="text-lg">{biz.emoji}</span>
                        <span className="flex-1 text-gray-800">{biz.name}</span>
                        <span className="font-black text-indigo-700">{price.toLocaleString()}€</span>
                      </button>
                    );
                  })}
                </div>
                {human&&getOwnedBiz(human).length>0&&(
                  <>
                    <p className="text-xs text-gray-500 font-semibold mb-1 mt-2">Πώληση επιχείρησης:</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto mb-2">
                      {getOwnedBiz(human).map(biz=>(
                        <button key={biz.id} onClick={()=>sellBiz(biz)}
                          className="w-full text-left p-2 rounded-xl border-2 border-orange-200 hover:bg-orange-50 text-xs flex items-center gap-2 font-semibold">
                          <span className="text-lg">{biz.emoji}</span>
                          <span className="flex-1 text-gray-800">{biz.name}</span>
                          <span className="font-black text-orange-600">{(human.upgraded[biz.id]?biz.saleUpg:biz.sale).toLocaleString()}€</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <button onClick={triggerBotTurns} className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Παράλειψη →</button>
              </div>
            ):(
              <div className="p-4 text-center">
                <div className="text-5xl mb-2">{meetingBiz.emoji}</div>
                <div className="font-black text-lg text-gray-800">{meetingBiz.name}</div>
                <div className="text-3xl font-black text-indigo-700 mt-1">{Math.round((meetingBiz.buy-meetingBiz.subsidy)*(hasDiscount?0.8:1)).toLocaleString()}€</div>
                <div className="text-xs text-rose-500 mb-4 font-semibold">Ενοίκιο αν πέσουν: {meetingBiz.profit}€/επίσκεψη</div>
                <button onClick={()=>buyBiz(meetingBiz)} className="w-full text-white py-3 rounded-2xl font-black shadow-md mb-2"
                  style={{background:"linear-gradient(90deg,#4338ca,#3730a3)"}}>🏪 Αγορά!</button>
                <button onClick={()=>setMeetingBiz(null)} className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100">← Πίσω</button>
              </div>
            )}
          </div>
        )}

        {/* BOT TURN */}
        {phase==="bot_turn"&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-gray-200">
            <div style={{background:"linear-gradient(90deg,#374151,#1f2937)"}} className="text-white px-4 py-2 flex items-center gap-2">
              {botTurnState
                ?<><div className={`w-8 h-8 rounded-full ${players[botTurnState.botPlayerIdx]?.colorBg} flex items-center justify-center text-lg shadow`}>{players[botTurnState.botPlayerIdx]?.emoji}</div>
                   <span className="font-black text-sm">{players[botTurnState.botPlayerIdx]?.name} παίζει...</span>
                   <span className="ml-auto text-2xl animate-bounce">{DICE_FACES[botTurnState.diceRoll-1]}</span></>
                :<><div className="text-xl animate-spin">⚙️</div>
                   <span className="font-black text-sm">
                     {botQueueIdx<players.filter(p=>p.isBot).length
                       ?`${players[botQueueIdx+1]?.emoji} ${players[botQueueIdx+1]?.name} ετοιμάζεται...`
                       :"Μαζεύω κέρδη..."}
                   </span></>
              }
            </div>
            <div className="px-3 pt-2 pb-1 flex gap-2">
              {players.filter(p=>p.isBot).map((p)=>{
                const isActive=botTurnState?.botPlayerIdx===p.id;
                const dispPos=getDisplayPos(p.id);
                return(
                  <div key={p.id} className={`flex-1 rounded-2xl p-2 text-center text-xs border-2 transition-all duration-300 ${isActive?`${p.colorBg} text-white border-transparent scale-105 shadow-lg`:"bg-gray-50 border-gray-200"}`}>
                    <div className="text-2xl">{p.emoji}</div>
                    <div className="font-black text-sm">{p.name}</div>
                    <div className={isActive?"text-white/90 font-semibold":"text-gray-600"}>{p.cash.toLocaleString()}€</div>
                    {isActive&&botTurnState&&<div className="text-[9px] mt-0.5 opacity-80">{SQUARES[dispPos]?.emoji} {SQUARES[dispPos]?.name}</div>}
                  </div>
                );
              })}
            </div>
            <div className="px-3 pb-2 max-h-20 overflow-y-auto">
              {log.slice(0,4).map((l,i)=>(
                <div key={i} className={`text-xs py-0.5 border-b border-gray-100 last:border-0 ${i===0?"text-gray-800 font-semibold":"text-gray-400"}`}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* PROFIT */}
        {phase==="profit"&&(
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-2 border-emerald-100">
            <div style={{background:"linear-gradient(90deg,#10b981,#059669)"}} className="text-white px-4 py-3 flex items-center gap-2">
              <span className="text-2xl">💶</span>
              <span className="font-black text-base">Κέρδη Γύρου {round-1}</span>
            </div>
            <div className="p-3 space-y-1.5">
              {human&&getOwnedBiz(human).map(b=>(
                <div key={b.id} className="flex justify-between text-sm bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                  <span className="font-semibold">{b.emoji} {b.name}{human.upgraded[b.id]?" ⬆️":""}</span>
                  <span className="font-black text-emerald-700">+{netProfit(b,human)}€</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-base border-t border-emerald-200 pt-2 mt-1">
                <span className="text-gray-800">Σύνολο κέρδους</span>
                <span className={roundProfit>=0?"text-emerald-700":"text-rose-600"}>{roundProfit>=0?"+":""}{roundProfit}€</span>
              </div>
            </div>
            <div className="px-3 pb-3">
              <button onClick={()=>setPhase("rolling")} className="w-full text-white py-3 rounded-2xl font-black shadow-md"
                style={{background:"linear-gradient(90deg,#10b981,#059669)"}}>
                Γύρος {round} 🚀
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
