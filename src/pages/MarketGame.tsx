import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// ── Types ──────────────────────────────────────────────────────────────────
interface Choice {
  text: string;
  consequence: string;
  coinsChange: number;   // positive = gain, negative = spend
  savingsChange: number;
  givingChange: number;
  wisdomPoints: number;  // 0-3 how wise the choice is
  emoji: string;
}

interface Scenario {
  id: number;
  chapter: number;
  situation: string;
  emoji: string;
  choices: [Choice, Choice, Choice];
}

// ── Scenarios (5 total, each linked to a chapter) ─────────────────────────
const SCENARIOS: Scenario[] = [
  {
    id: 1,
    chapter: 8,
    situation: "Βλέπεις μια διαφήμιση για νέα αθλητικά παπούτσια 25€. «Τα ΘΕΛΕΙΣ τόσο πολύ!» λέει η διαφήμιση. Τα παπούτσια σου είναι καλά ακόμα.",
    emoji: "👟",
    choices: [
      { text: "Τα αγοράζω αμέσως!", consequence: "Αγόρασες παπούτσια που δεν χρειαζόσουν. Τα χρήματά σου λιγόστεψαν.", coinsChange: -25, savingsChange: 0, givingChange: 0, wisdomPoints: 0, emoji: "😅" },
      { text: "Σκέφτομαι αν τα χρειάζομαι πραγματικά...", consequence: "Σωστά! Η διαφήμιση σε επηρέαζε. Τα παπούτσια σου είναι εντάξει — κρατάς τα χρήματα!", coinsChange: 0, savingsChange: 0, givingChange: 0, wisdomPoints: 3, emoji: "🧠" },
      { text: "Τα βάζω στη λίστα επιθυμιών και αποταμιεύω", consequence: "Έξυπνο! Αν τα θες πολύ, θα τα πάρεις — αλλά με σχέδιο.", coinsChange: 5, savingsChange: 5, givingChange: 0, wisdomPoints: 2, emoji: "📝" },
    ]
  },
  {
    id: 2,
    chapter: 3,
    situation: "Ο φίλος σου πουλά το παλιό του ποδήλατο για 20€ — πολύ φθηνό! Εσύ έχεις ήδη ποδήλατο αλλά αυτό είναι πιο ωραίο.",
    emoji: "🚲",
    choices: [
      { text: "Το αγοράζω, είναι ευκαιρία!", consequence: "Αγόρασες δεύτερο ποδήλατο που δεν χρειαζόσουν. Φθηνή τιμή ≠ καλή αγορά!", coinsChange: -20, savingsChange: 0, givingChange: 0, wisdomPoints: 0, emoji: "😬" },
      { text: "Δεν το χρειάζομαι — έχω ήδη ποδήλατο", consequence: "Τέλεια κριτική σκέψη! Η «ευκαιρία» είναι ευκαιρία μόνο αν σε χρειάζεται.", coinsChange: 0, savingsChange: 0, givingChange: 0, wisdomPoints: 3, emoji: "💪" },
      { text: "Το αγοράζω για να το μεταπουλήσω ακριβότερα!", consequence: "Επιχειρηματική σκέψη! Αν βρεις αγοραστή, κερδίζεις — αλλά έχει ρίσκο.", coinsChange: -20, savingsChange: 0, givingChange: 0, wisdomPoints: 2, emoji: "🚀" },
    ]
  },
  {
    id: 3,
    chapter: 12,
    situation: "Το αγαπημένο σου σνακ κόστιζε 1€. Τώρα κοστίζει 1,50€! Δεν φταίει ο μπακάλης — είναι ο πληθωρισμός: όλα ακρίβυναν!",
    emoji: "🍫",
    choices: [
      { text: "Το αγοράζω ούτως ή άλλως", consequence: "Το αγόρασες — αλλά 50 λεπτά παραπάνω × 5 φορές την εβδομάδα = 2,50€ τον μήνα λιγότερα!", coinsChange: -2, savingsChange: 0, givingChange: 0, wisdomPoints: 1, emoji: "😔" },
      { text: "Ψάχνω φθηνότερη εναλλακτική", consequence: "Έξυπνο! Ο πληθωρισμός δεν σε νικά — προσαρμόζεσαι!", coinsChange: 0, savingsChange: 1, givingChange: 0, wisdomPoints: 3, emoji: "🧠" },
      { text: "Το αγοράζω λιγότερο συχνά για να εξοικονομήσω", consequence: "Καλή ισορροπία! Δεν στερείσαι αλλά δεν σπαταλάς.", coinsChange: -1, savingsChange: 1, givingChange: 0, wisdomPoints: 2, emoji: "👍" },
    ]
  },
  {
    id: 4,
    chapter: 5,
    situation: "Ο συμμαθητής σου ξέχασε το μεσημεριανό και δεν έχει χρήματα. Εσύ έχεις 5€ για σνακ.",
    emoji: "🥪",
    choices: [
      { text: "Δεν είναι πρόβλημά μου", consequence: "Τεχνικά σωστό — αλλά η προσφορά κάνει τον κόσμο καλύτερο. Χάνεις ευκαιρία.", coinsChange: 0, savingsChange: 0, givingChange: 0, wisdomPoints: 0, emoji: "😶" },
      { text: "Του αγοράζω φαγητό από τα δικά μου", consequence: "Η γενναιοδωρία σου έκανε τη μέρα του φίλου σου καλύτερη. Αυτά είναι τα χρήματα του βάζου Προσφορά!", coinsChange: -2, savingsChange: 0, givingChange: 3, wisdomPoints: 3, emoji: "❤️" },
      { text: "Μοιραζόμαστε το δικό μου φαγητό", consequence: "Τέλεια! Προσφορά χωρίς να ξοδέψεις χρήματα — και εξίσου ωραία!", coinsChange: 0, savingsChange: 0, givingChange: 2, wisdomPoints: 3, emoji: "🤝" },
    ]
  },
  {
    id: 5,
    chapter: 4,
    situation: "Έχεις μαζέψει 30€ αποταμίευση! Η μαμά σου λέει «μπράβο — κάνε ό,τι θέλεις». Τι κάνεις;",
    emoji: "🐷",
    choices: [
      { text: "Τα ξοδεύω όλα τώρα, το αξίζω!", consequence: "Απόλαυσες τα χρήματά σου — αλλά ο κουμπαράς άδειασε. Ξεκινάς από μηδέν.", coinsChange: -30, savingsChange: -30, givingChange: 0, wisdomPoints: 0, emoji: "🎢" },
      { text: "Κρατάω 20€ αποταμίευση και ξοδεύω 10€", consequence: "Εξαιρετικό! Απόλαυσες ένα μέρος αλλά κράτησες τη βάση σου. Αυτό κάνουν οι έξυπνοι επενδυτές!", coinsChange: -10, savingsChange: -10, givingChange: 0, wisdomPoints: 3, emoji: "🌟" },
      { text: "Τα βάζω όλα στην τράπεζα για τόκο", consequence: "Super σοφό! Τα χρήματά σου δουλεύουν για σένα τώρα.", coinsChange: 2, savingsChange: 30, givingChange: 0, wisdomPoints: 2, emoji: "🏦" },
    ]
  }
];

// ── Phase types ────────────────────────────────────────────────────────────
type Phase = "intro" | "jars" | "scenarios" | "results";

interface JarAllocation { spending: number; saving: number; giving: number; }
interface ScenarioResult { scenarioId: number; choiceIdx: number; choice: Choice; }

// ── Main component ─────────────────────────────────────────────────────────
export default function MarketGame() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [jars, setJars] = useState<JarAllocation>({ spending: 25, saving: 20, giving: 5 });
  const [currentScenario, setCurrentScenario] = useState(0);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showConsequence, setShowConsequence] = useState(false);
  const [timer, setTimer] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const TOTAL_COINS = 50;
  const remaining = TOTAL_COINS - jars.spending - jars.saving - jars.giving;

  // Timer for scenarios
  useEffect(() => {
    if (phase !== "scenarios" || showConsequence) return;
    setTimer(15);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          // Auto-pick middle choice if time runs out
          if (selectedChoice === null) handleChoice(1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [currentScenario, phase, showConsequence]);

  const handleChoice = (idx: number) => {
    if (showConsequence) return;
    clearInterval(timerRef.current!);
    setSelectedChoice(idx);
    setShowConsequence(true);
  };

  const handleNextScenario = () => {
    const scenario = SCENARIOS[currentScenario];
    const choice = scenario.choices[selectedChoice!];
    setResults(prev => [...prev, { scenarioId: scenario.id, choiceIdx: selectedChoice!, choice }]);
    setShowConsequence(false);
    setSelectedChoice(null);
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(c => c + 1);
    } else {
      setPhase("results");
    }
  };

  // ── Calculate final score ──────────────────────────────────────────────
  const calcResults = () => {
    const totalWisdom = results.reduce((s, r) => s + r.choice.wisdomPoints, 0);
    const maxWisdom = SCENARIOS.length * 3;
    const wisdomPct = totalWisdom / maxWisdom;
    const totalGiving = results.reduce((s, r) => s + r.choice.givingChange, 0) + jars.giving;
    const totalSaving = results.reduce((s, r) => s + r.choice.savingsChange, 0) + jars.saving;
    const coinsLeft = results.reduce((s, r) => s + r.choice.coinsChange, 0) + TOTAL_COINS;

    const stars = wisdomPct >= 0.85 ? 5 : wisdomPct >= 0.65 ? 4 : wisdomPct >= 0.45 ? 3 : wisdomPct >= 0.25 ? 2 : 1;
    return { stars, totalWisdom, maxWisdom, totalGiving, totalSaving, coinsLeft };
  };

  const starLabels = ["", "Αρχάριος Καταναλωτής", "Μαθητευόμενος Επενδυτής", "Σοφός Αγοραστής", "Έξυπνος Επενδυτής", "Μικρός Οικονομολόγος! 🏆"];

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE: INTRO
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "intro") return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-7xl mb-4">🏪</div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Η Μικρή Αγορά</h1>
        <p className="text-gray-500 mb-6">Προσομοίωση πραγματικής ζωής — εφάρμοσε αυτά που έμαθες!</p>

        <div className="bg-white rounded-2xl border p-5 mb-6 text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫙</span>
            <div><p className="font-semibold text-gray-800">Φάση 1: Τα 3 Βάζα</p><p className="text-sm text-gray-500">Μοίρασε τα 50 coins εβδομαδιαίου χαρτζιλικιού σου</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div><p className="font-semibold text-gray-800">Φάση 2: Αποφάσεις</p><p className="text-sm text-gray-500">5 πραγματικές καταστάσεις — τι θα έκανες;</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div><p className="font-semibold text-gray-800">Φάση 3: Αποτελέσματα</p><p className="text-sm text-gray-500">Δες πόσο σοφός επενδυτής είσαι!</p></div>
          </div>
        </div>

        <Button onClick={() => setPhase("jars")} className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white shadow-lg">
          Ξεκινάμε! 🚀
        </Button>
        <button onClick={() => navigate("/book")} className="mt-3 text-sm text-gray-400 hover:text-gray-600">← Πίσω στα κεφάλαια</button>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE: JARS
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "jars") {
    const jarConfig = [
      { key: "spending" as const, emoji: "🛍️", label: "Ξόδεμα", color: "bg-blue-100 border-blue-300", textColor: "text-blue-700", desc: "Για αγορές & διασκέδαση" },
      { key: "saving" as const, emoji: "🐷", label: "Αποταμίευση", color: "bg-green-100 border-green-300", textColor: "text-green-700", desc: "Για τον στόχο σου" },
      { key: "giving" as const, emoji: "❤️", label: "Προσφορά", color: "bg-pink-100 border-pink-300", textColor: "text-pink-700", desc: "Για να βοηθάς άλλους" },
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 px-4 py-8">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🫙</div>
            <h2 className="text-2xl font-black text-gray-800">Φάση 1: Τα 3 Βάζα</h2>
            <p className="text-gray-500 mt-1">Έχεις <span className="font-bold text-emerald-600">50 coins</span> εβδομαδιαίο χαρτζιλίκι. Πώς τα μοιράζεις;</p>
          </div>

          {/* Remaining coins */}
          <div className={`text-center py-3 rounded-2xl mb-5 font-bold text-lg ${remaining === 0 ? "bg-green-100 text-green-700" : remaining < 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
            {remaining === 0 ? "✅ Μοίρασες όλα τα coins!" : remaining > 0 ? `🪙 ${remaining} coins ακόμα να μοιράσεις` : `❌ Ξεπέρασες κατά ${Math.abs(remaining)} coins!`}
          </div>

          <div className="space-y-4 mb-6">
            {jarConfig.map(jar => (
              <div key={jar.key} className={`${jar.color} border-2 rounded-2xl p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{jar.emoji}</span>
                    <div>
                      <p className={`font-bold ${jar.textColor}`}>{jar.label}</p>
                      <p className="text-xs text-gray-500">{jar.desc}</p>
                    </div>
                  </div>
                  <span className={`text-2xl font-black ${jar.textColor}`}>{jars[jar.key]}🪙</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setJars(j => ({ ...j, [jar.key]: Math.max(0, j[jar.key] - 5) }))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-current font-bold text-lg flex items-center justify-center">−</button>
                  <div className="flex-1">
                    <Progress value={(jars[jar.key] / 50) * 100} className="h-3" />
                  </div>
                  <button onClick={() => setJars(j => ({ ...j, [jar.key]: Math.min(50, j[jar.key] + 5) }))}
                    className="w-10 h-10 rounded-full bg-white border-2 border-current font-bold text-lg flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setPhase("scenarios")}
            disabled={remaining !== 0}
            className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white shadow-lg disabled:opacity-50"
          >
            Έτοιμος! Πάμε στις Αποφάσεις →
          </Button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE: SCENARIOS
  // ══════════════════════════════════════════════════════════════════════════
  if (phase === "scenarios") {
    const scenario = SCENARIOS[currentScenario];
    const progressPct = ((currentScenario) / SCENARIOS.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-6">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500 font-medium">Κατάσταση {currentScenario + 1} / {SCENARIOS.length}</div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full ${timer <= 5 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
              ⏱ {timer}s
            </div>
          </div>
          <Progress value={progressPct} className="h-2 mb-5" />

          {/* Chapter link */}
          <div className="text-xs text-purple-500 font-medium mb-3">📖 Σχετίζεται με Κεφάλαιο {scenario.chapter}</div>

          {/* Situation */}
          <div className="bg-white rounded-2xl border shadow-sm p-5 mb-4">
            <div className="text-4xl mb-3 text-center">{scenario.emoji}</div>
            <p className="text-gray-800 font-medium text-center leading-relaxed">{scenario.situation}</p>
          </div>

          {/* Choices */}
          {!showConsequence ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center font-medium">Τι κάνεις;</p>
              {scenario.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(i)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-purple-300 hover:shadow-md transition-all font-medium text-gray-700"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          ) : (
            /* Consequence */
            <div className={`rounded-2xl p-5 border-2 ${
              scenario.choices[selectedChoice!].wisdomPoints >= 2 ? "bg-green-50 border-green-300" : "bg-orange-50 border-orange-300"
            }`}>
              <div className="text-4xl text-center mb-3">{scenario.choices[selectedChoice!].emoji}</div>
              <p className="text-center font-bold text-gray-800 mb-2">Διάλεξες: "{scenario.choices[selectedChoice!].text}"</p>
              <p className="text-center text-gray-600 text-sm mb-4">{scenario.choices[selectedChoice!].consequence}</p>

              {/* Coins effect */}
              {scenario.choices[selectedChoice!].coinsChange !== 0 && (
                <div className={`text-center text-sm font-bold mb-3 ${scenario.choices[selectedChoice!].coinsChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {scenario.choices[selectedChoice!].coinsChange > 0 ? "+" : ""}{scenario.choices[selectedChoice!].coinsChange} coins
                </div>
              )}

              <div className="flex justify-center gap-1 mb-4">
                {[1,2,3].map(p => (
                  <span key={p} className={`text-2xl ${p <= scenario.choices[selectedChoice!].wisdomPoints ? "opacity-100" : "opacity-20"}`}>⭐</span>
                ))}
              </div>

              <Button onClick={handleNextScenario} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white font-bold rounded-xl">
                {currentScenario < SCENARIOS.length - 1 ? "Επόμενη κατάσταση →" : "Δες τα αποτελέσματα! 🏆"}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  PHASE: RESULTS
  // ══════════════════════════════════════════════════════════════════════════
  const { stars, totalWisdom, maxWisdom, totalGiving, totalSaving, coinsLeft } = calcResults();

  const starColors = ["", "text-gray-400", "text-orange-400", "text-yellow-400", "text-yellow-500", "text-yellow-500"];
  const resultMessages = [
    "",
    "Συνέχισε να μαθαίνεις — κάθε απόφαση είναι εμπειρία!",
    "Καλή αρχή! Με λίγη εξάσκηση θα γίνεις εξαιρετικός!",
    "Μπράβο! Έδειξες σοφή οικονομική σκέψη!",
    "Εξαιρετικά! Σκέφτεσαι σαν αληθινός επενδυτής!",
    "Τέλειο! Είσαι έτοιμος να κατακτήσεις τον κόσμο της οικονομίας! 🌟"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Trophy */}
        <div className="text-center mb-6">
          <div className="text-7xl mb-3">🏆</div>
          <h2 className="text-2xl font-black text-gray-800">Αποτελέσματα!</h2>
          <p className="text-gray-500 mt-1">{starLabels[stars]}</p>
        </div>

        {/* Stars */}
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-5 text-center">
          <div className="flex justify-center gap-2 mb-3">
            {[1,2,3,4,5].map(s => (
              <span key={s} className={`text-4xl transition-all ${s <= stars ? starColors[stars] : "opacity-20"}`}>⭐</span>
            ))}
          </div>
          <p className="text-gray-600 font-medium">{resultMessages[stars]}</p>
          <p className="text-sm text-gray-400 mt-1">{totalWisdom} / {maxWisdom} πόντοι σοφίας</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl border p-3 text-center">
            <div className="text-2xl mb-1">🪙</div>
            <div className="text-xl font-black text-gray-800">{coinsLeft}</div>
            <div className="text-xs text-gray-500">coins απέμειναν</div>
          </div>
          <div className="bg-white rounded-xl border p-3 text-center">
            <div className="text-2xl mb-1">🐷</div>
            <div className="text-xl font-black text-green-600">{totalSaving}</div>
            <div className="text-xs text-gray-500">αποταμίευση</div>
          </div>
          <div className="bg-white rounded-xl border p-3 text-center">
            <div className="text-2xl mb-1">❤️</div>
            <div className="text-xl font-black text-pink-600">{totalGiving}</div>
            <div className="text-xs text-gray-500">προσφορά</div>
          </div>
        </div>

        {/* Decision breakdown */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 mb-5">
          <h3 className="font-bold text-gray-800 mb-3">Οι αποφάσεις σου:</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-xl">{r.choice.emoji}</span>
                <div className="flex-1">
                  <span className="text-gray-700">{SCENARIOS[i].emoji} {r.choice.text.slice(0, 35)}{r.choice.text.length > 35 ? "…" : ""}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3].map(p => (
                    <span key={p} className={`text-sm ${p <= r.choice.wisdomPoints ? "text-yellow-500" : "text-gray-200"}`}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={() => { setPhase("intro"); setResults([]); setCurrentScenario(0); setSelectedChoice(null); setShowConsequence(false); }}
            className="w-full py-3 font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white">
            🔄 Παίξε ξανά με διαφορετικές επιλογές!
          </Button>
          <Button variant="outline" onClick={() => navigate("/book")} className="w-full rounded-2xl">
            ← Πίσω στα κεφάλαια
          </Button>
        </div>
      </div>
    </div>
  );
}
