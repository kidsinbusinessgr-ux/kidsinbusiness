import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Τύποι ────────────────────────────────────────────────────────────────────

type TeacherStep = "setup" | "lobby" | "live" | "results";

interface Scenario {
  id: string;
  title: string;
  desc: string;
  ageRange: string;
  icon: string;
  available: boolean;
}

interface Team {
  name: string;
  initial: string;
  color: string;
  textColor: string;
  profit: number;
  submitted: boolean;
  round: number;
  strategy: string;
}

// ─── Σενάρια ──────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    title: "Online Shop Χειροποίητων",
    desc: "Τιμολόγηση, κόστος και ζήτηση. Ιδανικό για πρώτη επαφή με την αγορά.",
    ageRange: "12–15 ετών",
    icon: "🥤",
    available: true,
  },
  {
    id: "sneakers",
    title: "Sneaker brand στα social media",
    desc: "Marketing budget, ROI και ανταγωνισμός σε ψηφιακό περιβάλλον.",
    ageRange: "14–18 ετών",
    icon: "👟",
    available: false,
  },
  {
    id: "eco",
    title: "Eco startup — πράσινη ενέργεια",
    desc: "Επένδυση, ρίσκο και αειφόρος ανάπτυξη.",
    ageRange: "15–18 ετών",
    icon: "🌿",
    available: false,
  },
];

// ─── Mock ομάδες (σε production: Supabase realtime) ──────────────────────────

const INITIAL_TEAMS: Team[] = [
  { name: "Alpha", initial: "Α", color: "#EEEDFE", textColor: "#3C3489", profit: 2340, submitted: true, round: 5, strategy: "Premium τιμή" },
  { name: "Beta", initial: "Β", color: "#E1F5EE", textColor: "#085041", profit: 1890, submitted: true, round: 5, strategy: "Μεγάλος όγκος" },
  { name: "Gamma", initial: "Γ", color: "#FAEEDA", textColor: "#633806", profit: 1120, submitted: false, round: 4, strategy: "Ισορροπία" },
  { name: "Delta", initial: "Δ", color: "#FAECE7", textColor: "#712B13", profit: -240, submitted: false, round: 3, strategy: "Προσφορά -20%" },
];

// ─── Στυλ ─────────────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    background: "#f8f4ff",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  header: {
    background: "#270F57",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  } as React.CSSProperties,
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  } as React.CSSProperties,
  body: {
    maxWidth: 780,
    margin: "0 auto",
    padding: "28px 20px",
  } as React.CSSProperties,
  h1: {
    fontSize: 22,
    fontWeight: 800,
    color: "#270F57",
    marginBottom: 6,
  } as React.CSSProperties,
  sub: {
    fontSize: 14,
    color: "#765F8F",
    marginBottom: 24,
    lineHeight: 1.5,
  } as React.CSSProperties,
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: "20px 22px",
    border: "1px solid #e8dff5",
    marginBottom: 16,
  } as React.CSSProperties,
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#765F8F",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    marginBottom: 12,
  } as React.CSSProperties,
  btn: {
    padding: "12px 24px",
    borderRadius: 14,
    background: "#270F57",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    border: "none",
    cursor: "pointer",
  } as React.CSSProperties,
  btnSecondary: {
    padding: "10px 20px",
    borderRadius: 12,
    background: "transparent",
    color: "#270F57",
    fontWeight: 700,
    fontSize: 13,
    border: "1.5px solid #e0d4f5",
    cursor: "pointer",
  } as React.CSSProperties,
  btnDanger: {
    padding: "10px 20px",
    borderRadius: 12,
    background: "transparent",
    color: "#ef4444",
    fontWeight: 700,
    fontSize: 13,
    border: "1.5px solid #fecaca",
    cursor: "pointer",
  } as React.CSSProperties,
  metricCard: {
    background: "#faf7ff",
    borderRadius: 14,
    padding: "14px 16px",
    border: "1px solid #e8dff5",
    textAlign: "center" as const,
  } as React.CSSProperties,
};

// ─── Βήμα 1: Setup ────────────────────────────────────────────────────────────

function StepSetup({ onStart }: { onStart: (scenarioId: string, classCode: string) => void }) {
  const [selected, setSelected] = useState("cafe");
  const [rounds, setRounds] = useState(5);

  const code = "KIB-7X4";

  return (
    <>
      <div style={s.h1}>Νέο session τάξης</div>
      <div style={s.sub}>Επίλεξε σενάριο και ρύθμισε την παρτίδα.</div>

      <div style={s.card}>
        <div style={s.cardTitle}>Σενάριο</div>
        {SCENARIOS.map((sc) => (
          <div
            key={sc.id}
            onClick={() => sc.available && setSelected(sc.id)}
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              border: selected === sc.id ? "2px solid #270F57" : "1.5px solid #e8dff5",
              background: selected === sc.id ? "#f4eaff" : "#faf7ff",
              marginBottom: 10,
              cursor: sc.available ? "pointer" : "default",
              opacity: sc.available ? 1 : 0.5,
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 28, lineHeight: 1 }}>{sc.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#270F57" }}>{sc.title}</span>
                {!sc.available && (
                  <span style={{ fontSize: 10, fontWeight: 600, background: "#FAEEDA", color: "#633806", padding: "2px 8px", borderRadius: 10 }}>Σύντομα</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#765F8F", marginBottom: 4 }}>{sc.desc}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Ηλικία: {sc.ageRange}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Ρυθμίσεις</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: "#270F57" }}>Αριθμός γύρων</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e0d4f5", background: "#faf7ff", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#270F57" }}
              onClick={() => setRounds((r) => Math.max(2, r - 1))}
            >−</button>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#270F57", minWidth: 20, textAlign: "center" }}>{rounds}</span>
            <button
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e0d4f5", background: "#faf7ff", cursor: "pointer", fontSize: 16, fontWeight: 700, color: "#270F57" }}
              onClick={() => setRounds((r) => Math.min(8, r + 1))}
            >+</button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#765F8F" }}>Συνιστώμενο: 5 γύροι ≈ 30 λεπτά συνολικά</div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Κωδικός τάξης</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#270F57", letterSpacing: "0.1em", fontFamily: "monospace" }}>{code}</div>
          <div style={{ fontSize: 12, color: "#765F8F", lineHeight: 1.5 }}>
            Οι μαθητές πηγαίνουν στο<br />
            <span style={{ fontWeight: 700, color: "#270F57" }}>app.kidsinbusiness.gr/classroom/student</span><br />
            και πληκτρολογούν αυτόν τον κωδικό.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={s.btn} onClick={() => onStart(selected, code)}>
          Εκκίνηση session ▶
        </button>
      </div>
    </>
  );
}

// ─── Βήμα 2: Lobby (αναμονή μαθητών) ────────────────────────────────────────

function StepLobby({ classCode, onStart }: { classCode: string; onStart: () => void }) {
  const [connected, setConnected] = useState(0);

  useEffect(() => {
    const intervals = [800, 1600, 2800, 4200];
    const timers = intervals.map((ms, i) =>
      setTimeout(() => setConnected(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const mockStudents = ["Ελένη", "Νίκος", "Μαρία", "Κώστας"];

  return (
    <>
      <div style={s.h1}>Αναμονή μαθητών</div>
      <div style={s.sub}>
        Ζήτησε από τους μαθητές να ανοίξουν το <strong>app.kidsinbusiness.gr/classroom/student</strong> και να πληκτρολογήσουν τον κωδικό.
      </div>

      <div style={{ ...s.card, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#765F8F", marginBottom: 8 }}>Κωδικός τάξης</div>
        <div style={{ fontSize: 48, fontWeight: 900, color: "#270F57", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: 4 }}>{classCode}</div>
        <div style={{ fontSize: 12, color: "#aaa" }}>Γράψτε τον στον πίνακα ή προβάλετέ τον στην οθόνη</div>
      </div>

      <div style={s.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={s.cardTitle}>Συνδεδεμένοι μαθητές</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#270F57" }}>{connected} / 16</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
          {mockStudents.slice(0, connected).map((name) => (
            <div key={name} style={{ background: "#E1F5EE", borderRadius: 10, padding: "8px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#085041" }}>
              ✓ {name}
            </div>
          ))}
          {Array.from({ length: 4 - connected }).map((_, i) => (
            <div key={i} style={{ background: "#faf7ff", borderRadius: 10, padding: "8px", textAlign: "center", fontSize: 12, color: "#ddd", border: "1px dashed #e0d4f5" }}>
              —
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button style={s.btnSecondary} onClick={() => setConnected(4)}>
          Προσομοίωση 4 μαθητών
        </button>
        <button
          style={{ ...s.btn, opacity: connected >= 2 ? 1 : 0.5 }}
          disabled={connected < 2}
          onClick={onStart}
        >
          Έναρξη παιχνιδιού ▶
        </button>
      </div>
    </>
  );
}

// ─── Βήμα 3: Live Monitor ────────────────────────────────────────────────────

function StepLive({ onFinish }: { onFinish: () => void }) {
  const [currentRound, setCurrentRound] = useState(3);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const totalRounds = 5;

  const submittedCount = teams.filter((t) => t.submitted).length;
  const allSubmitted = submittedCount === teams.length;

  const advanceRound = () => {
    if (currentRound >= totalRounds) {
      onFinish();
      return;
    }
    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        submitted: false,
        round: t.round + 1,
        profit: t.profit + Math.floor(Math.random() * 400) - 100,
      }))
    );
    setCurrentRound((r) => r + 1);
    // Simulate submissions after delay
    setTimeout(() => {
      setTeams((prev) =>
        prev.map((t, i) => ({ ...t, submitted: i < 3 }))
      );
    }, 1800);
  };

  const sortedTeams = [...teams].sort((a, b) => b.profit - a.profit);
  const maxProfit = Math.max(...teams.map((t) => Math.abs(t.profit)));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={s.h1}>Γύρος {currentRound} / {totalRounds}</div>
          <div style={s.sub}>Online Shop Χειροποίητων · Live παρακολούθηση</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={s.metricCard}>
            <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>Υπέβαλαν</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#270F57" }}>{submittedCount}/{teams.length}</div>
          </div>
          <div style={s.metricCard}>
            <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>Γύρος</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#270F57" }}>{currentRound}/{totalRounds}</div>
          </div>
        </div>
      </div>

      {/* Progress bar γύρου */}
      <div style={{ height: 6, background: "#e8dff5", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: 6, background: "#270F57", borderRadius: 3, width: `${(currentRound / totalRounds) * 100}%`, transition: "width .4s" }} />
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Κατάταξη ομάδων — live</div>
        {sortedTeams.map((team, i) => {
          const barW = maxProfit > 0 ? Math.abs(Math.round((team.profit / maxProfit) * 100)) : 0;
          return (
            <div
              key={team.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: i < teams.length - 1 ? "1px solid #f0e8f5" : "none",
              }}
            >
              <div style={{ fontSize: 16, width: 24, textAlign: "center" }}>
                {["🥇", "🥈", "🥉", "4"][i]}
              </div>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: team.textColor, flexShrink: 0 }}>
                {team.initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#270F57" }}>{team.name}</span>
                  <span style={{ fontSize: 11, color: team.submitted ? "#085041" : "#765F8F", fontWeight: 600 }}>
                    {team.submitted ? "✓ Υπέβαλε" : `Γύρος ${team.round}...`}
                  </span>
                </div>
                <div style={{ height: 8, background: "#f0e8f5", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: 8, width: `${barW}%`, background: team.profit >= 0 ? "#1D9E75" : "#D85A30", borderRadius: 4, transition: "width .5s" }} />
                </div>
                <div style={{ fontSize: 11, color: "#765F8F", marginTop: 3 }}>{team.strategy}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: team.profit >= 0 ? "#085041" : "#712B13", minWidth: 72, textAlign: "right" }}>
                {team.profit >= 0 ? "+" : ""}{team.profit.toLocaleString("el-GR")}€
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Ανακοίνωσε στην τάξη</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Ποια ομάδα έχει το μεγαλύτερο κέρδος; Γιατί;",
            "Η Delta έχει ζημία — τι έκανε διαφορετικά;",
            "Αν μπορούσατε να αλλάξετε μία απόφαση, ποια θα ήταν;",
          ].map((q) => (
            <div key={q} style={{ fontSize: 13, color: "#270F57", padding: "10px 14px", background: "#f4eaff", borderRadius: 10 }}>
              💬 {q}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        {!allSubmitted && (
          <button style={s.btnSecondary} onClick={() => setTeams((prev) => prev.map((t) => ({ ...t, submitted: true })))}>
            Κλείσε γύρο (παρακαμπτήριο)
          </button>
        )}
        <button
          style={{ ...s.btn, opacity: allSubmitted ? 1 : 0.5 }}
          disabled={!allSubmitted}
          onClick={advanceRound}
        >
          {currentRound >= totalRounds ? "Δες αποτελέσματα →" : `Γύρος ${currentRound + 1} →`}
        </button>
      </div>
    </>
  );
}

// ─── Βήμα 4: Αποτελέσματα ────────────────────────────────────────────────────

function StepResults({ onRestart }: { onRestart: () => void }) {
  const sortedTeams = [...INITIAL_TEAMS].sort((a, b) => b.profit - a.profit);

  const insights = [
    "Η ομάδα Alpha επέλεξε premium τιμή με χαμηλό κόστος — η καλύτερη στρατηγική για αυτό το σενάριο.",
    "Η Delta έκανε υπερβολικές επενδύσεις σε marketing χωρίς να ελέγξει το λειτουργικό κόστος.",
    "Η ισορροπία τιμής-ζήτησης (Beta) είναι συχνά ασφαλέστερη από τις ακραίες στρατηγικές.",
  ];

  return (
    <>
      <div style={s.h1}>Τελικά αποτελέσματα</div>
      <div style={s.sub}>Online Shop Χειροποίητων · Τέλος session</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={s.metricCard}>
          <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>1η ομάδα</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#270F57" }}>Alpha</div>
        </div>
        <div style={s.metricCard}>
          <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>Μέγιστο κέρδος</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#085041" }}>+2.340€</div>
        </div>
        <div style={s.metricCard}>
          <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>Lean Canvas</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#270F57" }}>4/4 ✓</div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Κατάταξη</div>
        {sortedTeams.map((team, i) => (
          <div
            key={team.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: i < sortedTeams.length - 1 ? "1px solid #f0e8f5" : "none",
            }}
          >
            <span style={{ fontSize: 18, width: 28 }}>{["🥇", "🥈", "🥉", "4"][i]}</span>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: team.textColor, flexShrink: 0 }}>
              {team.initial}
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#270F57" }}>{team.name}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: team.profit >= 0 ? "#085041" : "#712B13" }}>
              {team.profit >= 0 ? "+" : ""}{team.profit.toLocaleString("el-GR")}€
            </div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Διδακτικές παρατηρήσεις</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{ fontSize: 13, color: "#270F57", lineHeight: 1.6, padding: "10px 14px", background: "#f4eaff", borderRadius: 10 }}>
              {ins}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button style={{ ...s.btnSecondary, flex: 1 }} onClick={() => window.print()}>
          📥 Εκτύπωση / PDF
        </button>
        <button style={{ ...s.btn, flex: 1 }} onClick={onRestart}>
          ▶ Νέο session
        </button>
      </div>
    </>
  );
}

// ─── Κύριο component ──────────────────────────────────────────────────────────

const ClassroomTeacher = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<TeacherStep>("setup");
  const [classCode, setClassCode] = useState("");

  const STEP_LABELS: Record<TeacherStep, string> = {
    setup: "Ρύθμιση",
    lobby: "Lobby",
    live: "Live",
    results: "Αποτελέσματα",
  };

  const STEP_ORDER: TeacherStep[] = ["setup", "lobby", "live", "results"];
  const currentIdx = STEP_ORDER.indexOf(step);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <img src="/logo.png" alt="Kids in Business" style={{ height: 32, width: "auto" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Η Τάξη Επιχειρεί</div>
            <div style={{ fontSize: 11, color: "#c4a8e0" }}>Dashboard εκπαιδευτικού</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {classCode && (
            <div style={{ fontSize: 12, color: "#c4a8e0" }}>
              Κωδικός: <span style={{ fontWeight: 800, color: "#fff", letterSpacing: "0.06em" }}>{classCode}</span>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
          >
            Έξοδος
          </button>
        </div>
      </div>

      {/* Step bar */}
      <div style={{ background: "#1a0a38", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex" }}>
          {STEP_ORDER.map((s_key, i) => (
            <div
              key={s_key}
              style={{
                flex: 1,
                padding: "10px 8px",
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                color: i < currentIdx ? "#9FE1CB" : i === currentIdx ? "#fff" : "rgba(255,255,255,0.35)",
                borderBottom: i === currentIdx ? "2px solid #fff" : "2px solid transparent",
              }}
            >
              {i < currentIdx ? "✓ " : ""}{STEP_LABELS[s_key]}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={s.body}>
        {step === "setup" && (
          <StepSetup
            onStart={(scenarioId, code) => {
              setClassCode(code);
              setStep("lobby");
            }}
          />
        )}
        {step === "lobby" && (
          <StepLobby
            classCode={classCode}
            onStart={() => setStep("live")}
          />
        )}
        {step === "live" && (
          <StepLive onFinish={() => setStep("results")} />
        )}
        {step === "results" && (
          <StepResults onRestart={() => { setClassCode(""); setStep("setup"); }} />
        )}
      </div>
    </div>
  );
};

export default ClassroomTeacher;
