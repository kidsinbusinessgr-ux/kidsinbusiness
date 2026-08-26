import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Τύποι ────────────────────────────────────────────────────────────────────

type Step = "join" | "simulation" | "leaderboard" | "canvas";

interface Decision {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

interface CanvasAnswer {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
}

// ─── Δεδομένα σεναρίου (MVP: καφετέρια) ─────────────────────────────────────

const DECISIONS: Decision[] = [
  { id: "budget", label: "1.00€", desc: "Χαμηλή τιμή, μεγάλος όγκος", icon: "💸" },
  { id: "balanced", label: "1.50€", desc: "Ισορροπία τιμής-ζήτησης", icon: "☕" },
  { id: "premium", label: "2.00€", desc: "Premium, λιγότεροι πελάτες", icon: "⭐" },
  { id: "promo", label: "Προσφορά -20%", desc: "Διπλάσια ζήτηση, μικρότερο περιθώριο", icon: "🎯" },
];

const CANVAS_QUESTIONS = [
  {
    key: "q1" as keyof CanvasAnswer,
    num: "01",
    question: "Ποιο πρόβλημα λύνεις;",
    hint: "Κάτι που ενοχλεί κόσμο σήμερα — μην είσαι γενικός",
    placeholder: "π.χ. Δεν υπάρχει πλυντήριο αυτοκινήτων κοντά στα σπίτια",
  },
  {
    key: "q2" as keyof CanvasAnswer,
    num: "02",
    question: "Ποιος είναι ο πελάτης σου;",
    hint: "Όχι «όλοι» — πες μία συγκεκριμένη ομάδα ανθρώπων",
    placeholder: "π.χ. Γονείς 35-50 που δουλεύουν πολύ και δεν έχουν χρόνο",
  },
  {
    key: "q3" as keyof CanvasAnswer,
    num: "03",
    question: "Πώς το λύνει τώρα ο πελάτης σου;",
    hint: "Ψάξε την υπάρχουσα λύση — πόσο χρόνο ή χρήμα χάνει;",
    placeholder: "π.χ. Πάει σε πλυντήριο — 12€ + 20 λεπτά οδήγηση",
  },
  {
    key: "q4" as keyof CanvasAnswer,
    num: "04",
    question: "Πώς βγάζεις χρήματα;",
    hint: "Τιμή × πελάτες = έσοδα. Μπορείς να το υπολογίσεις;",
    placeholder: "π.χ. 8€/αυτοκίνητο × 10 αυτοκίνητα = 80€/ημέρα",
  },
  {
    key: "q5" as keyof CanvasAnswer,
    num: "05",
    question: "Τι χρειάζεσαι για να ξεκινήσεις;",
    hint: "Υλικά, ανθρώπους, χρήματα — κράτα το μικρό",
    placeholder: "π.χ. Σφουγγάρια, σαπούνι, λάστιχο νερού — 30€",
  },
  {
    key: "q6" as keyof CanvasAnswer,
    num: "06",
    question: "Γιατί εσύ και όχι κάποιος άλλος;",
    hint: "Το πλεονέκτημά σου — μπορεί να είναι απλό",
    placeholder: "π.χ. Πάμε εμείς στον πελάτη, δεν περιμένει ουρά",
  },
];

// ─── Στυλ ─────────────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #270F57, #765F8F)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  } as React.CSSProperties,
  card: {
    background: "#fff",
    borderRadius: 24,
    padding: "28px 24px",
    maxWidth: 480,
    width: "100%",
    margin: "0 auto",
  } as React.CSSProperties,
  logo: {
    height: 36,
    width: "auto",
    marginBottom: 16,
  } as React.CSSProperties,
  stepBar: {
    display: "flex",
    gap: 0,
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid #e0d4f5",
    marginBottom: 24,
  } as React.CSSProperties,
  h1: {
    fontSize: 20,
    fontWeight: 800,
    color: "#270F57",
    marginBottom: 6,
  } as React.CSSProperties,
  sub: {
    fontSize: 13,
    color: "#765F8F",
    marginBottom: 20,
    lineHeight: 1.5,
  } as React.CSSProperties,
  inputBase: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "1.5px solid #e0d4f5",
    fontSize: 14,
    color: "#270F57",
    outline: "none",
    boxSizing: "border-box" as const,
    background: "#faf7ff",
    marginBottom: 8,
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  btn: {
    width: "100%",
    padding: "13px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #270F57, #765F8F)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    border: "none",
    cursor: "pointer",
    marginTop: 8,
  } as React.CSSProperties,
  btnSecondary: {
    width: "100%",
    padding: "11px",
    borderRadius: 14,
    background: "transparent",
    color: "#270F57",
    fontWeight: 700,
    fontSize: 14,
    border: "1.5px solid #e0d4f5",
    cursor: "pointer",
    marginTop: 8,
  } as React.CSSProperties,
};

// ─── Βοηθητικό: μπάρα βημάτων ─────────────────────────────────────────────

const STEPS: { key: Step; label: string }[] = [
  { key: "join", label: "Είσοδος" },
  { key: "simulation", label: "Simulation" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "canvas", label: "Lean Canvas" },
];

function StepBar({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div style={s.stepBar}>
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div
            key={step.key}
            style={{
              flex: 1,
              padding: "8px 4px",
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
              background: done ? "#E1F5EE" : active ? "#EEEDFE" : "#faf7ff",
              color: done ? "#085041" : active ? "#3C3489" : "#bbb",
              borderRight: i < STEPS.length - 1 ? "1px solid #e0d4f5" : "none",
            }}
          >
            {done ? "✓ " : ""}
            {step.label}
          </div>
        );
      })}
    </div>
  );
}

// ─── Βήμα 1: Είσοδος ──────────────────────────────────────────────────────────

function StepJoin({ onNext }: { onNext: (name: string, team: string) => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (!name.trim()) { setError("Γράψε το όνομά σου!"); return; }
    if (!code.trim()) { setError("Γράψε τον κωδικό τάξης!"); return; }
    onNext(name.trim(), code.trim().toUpperCase());
  };

  return (
    <>
      <div style={s.h1}>Καλώς ήρθες!</div>
      <div style={s.sub}>Συμπλήρωσε τα στοιχεία σου για να μπεις στην τάξη.</div>
      <input
        style={s.inputBase}
        placeholder="Όνομα μαθητή..."
        value={name}
        onChange={(e) => { setName(e.target.value); setError(""); }}
        maxLength={40}
      />
      <input
        style={{ ...s.inputBase, letterSpacing: "0.1em", textAlign: "center" as const }}
        placeholder="Κωδικός τάξης (π.χ. KIB-7X4)..."
        value={code}
        onChange={(e) => { setCode(e.target.value); setError(""); }}
        maxLength={12}
        onKeyDown={(e) => e.key === "Enter" && handle()}
      />
      {error && (
        <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, marginBottom: 8, padding: "7px 12px", background: "#fff5f5", borderRadius: 8 }}>
          ❌ {error}
        </div>
      )}
      <button style={s.btn} onClick={handle}>Είσοδος 🚀</button>
    </>
  );
}

// ─── Βήμα 2: Simulation ───────────────────────────────────────────────────────

function StepSimulation({
  studentName,
  teamCode,
  onNext,
}: {
  studentName: string;
  teamCode: string;
  onNext: (choice: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [budget, setBudget] = useState({ marketing: 200, materials: 300, staff: 500 });

  const totalBudget = 1000;
  const used = budget.marketing + budget.materials + budget.staff;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    setTimeout(() => onNext(selected), 1200);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={s.h1}>Γύρος 3 / 5</div>
          <div style={s.sub}>Καφετέρια στο σχολείο · Ομάδα {teamCode}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 2 }}>Ταμείο</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#270F57" }}>2.100€</div>
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#270F57", marginBottom: 10 }}>
        Απόφαση: Τιμή καφέ για τον επόμενο γύρο
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {DECISIONS.map((d) => (
          <div
            key={d.id}
            onClick={() => !submitted && setSelected(d.id)}
            style={{
              padding: "12px",
              borderRadius: 12,
              border: selected === d.id ? "2px solid #765F8F" : "1.5px solid #e0d4f5",
              background: selected === d.id ? "#f4eaff" : "#faf7ff",
              cursor: submitted ? "default" : "pointer",
              transition: "all .15s",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{d.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#270F57" }}>{d.label}</div>
            <div style={{ fontSize: 11, color: "#765F8F", marginTop: 2 }}>{d.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "#270F57", marginBottom: 10 }}>
        Κατανομή budget (σύνολο: {totalBudget}€)
      </div>

      {(["marketing", "materials", "staff"] as const).map((key) => {
        const labels = { marketing: "Marketing", materials: "Πρώτες ύλες", staff: "Εργαζόμενοι" };
        const colors = { marketing: "#765F8F", materials: "#1D9E75", staff: "#EF9F27" };
        return (
          <div key={key} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#765F8F" }}>{labels[key]}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#270F57" }}>{budget[key]}€</span>
            </div>
            <input
              type="range"
              min={0}
              max={totalBudget}
              step={50}
              value={budget[key]}
              disabled={submitted}
              onChange={(e) => {
                const val = Number(e.target.value);
                const others = used - budget[key];
                if (others + val <= totalBudget) {
                  setBudget((prev) => ({ ...prev, [key]: val }));
                }
              }}
              style={{ width: "100%", accentColor: colors[key] }}
            />
          </div>
        );
      })}

      {!submitted ? (
        <button
          style={{ ...s.btn, opacity: selected ? 1 : 0.5 }}
          onClick={handleSubmit}
          disabled={!selected}
        >
          Υποβολή απόφασης ✓
        </button>
      ) : (
        <div style={{ textAlign: "center", padding: "14px", background: "#E1F5EE", borderRadius: 14, color: "#085041", fontWeight: 700, fontSize: 14 }}>
          ✅ Υποβλήθηκε! Περιμένουμε τις άλλες ομάδες...
        </div>
      )}
    </>
  );
}

// ─── Βήμα 3: Leaderboard ──────────────────────────────────────────────────────

const MOCK_TEAMS = [
  { name: "Alpha", profit: 2340, color: "#EEEDFE", textColor: "#3C3489", initial: "Α" },
  { name: "Beta", profit: 1890, color: "#E1F5EE", textColor: "#085041", initial: "Β" },
  { name: "Gamma", profit: 1120, color: "#FAEEDA", textColor: "#633806", initial: "Γ" },
  { name: "Delta", profit: -240, color: "#FAECE7", textColor: "#712B13", initial: "Δ" },
];

const MEDALS = ["🥇", "🥈", "🥉", "4"];

function StepLeaderboard({ teamCode, onNext }: { teamCode: string; onNext: () => void }) {
  const maxProfit = Math.max(...MOCK_TEAMS.map((t) => t.profit));

  return (
    <>
      <div style={s.h1}>Αποτελέσματα</div>
      <div style={s.sub}>Τέλος γύρων · Καφετέρια στο σχολείο</div>

      {MOCK_TEAMS.map((team, i) => {
        const barWidth = team.profit > 0 ? Math.round((team.profit / maxProfit) * 100) : 0;
        const isMe = team.name === teamCode;
        return (
          <div
            key={team.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 0",
              borderBottom: i < MOCK_TEAMS.length - 1 ? "1px solid #f0e8f5" : "none",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, width: 28 }}>{MEDALS[i]}</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: team.textColor, flexShrink: 0 }}>
              {team.initial}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#270F57" }}>
                {team.name} {isMe && <span style={{ fontSize: 11, background: "#EEEDFE", color: "#3C3489", padding: "2px 7px", borderRadius: 10 }}>εσύ</span>}
              </div>
              <div style={{ height: 6, background: "#f0e8f5", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
                <div style={{ height: 6, width: `${barWidth}%`, background: team.profit > 0 ? "#1D9E75" : "#D85A30", borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: team.profit > 0 ? "#085041" : "#712B13", minWidth: 60, textAlign: "right" }}>
              {team.profit > 0 ? "+" : ""}{team.profit.toLocaleString("el-GR")}€
            </div>
          </div>
        );
      })}

      <div style={{ background: "#f4eaff", borderRadius: 14, padding: "14px", marginTop: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#765F8F", marginBottom: 6 }}>Τι έμαθες σήμερα</div>
        <div style={{ fontSize: 12, color: "#270F57", lineHeight: 1.7 }}>
          📈 Η τιμή επηρεάζει τη ζήτηση — αλλά όχι γραμμικά<br />
          💼 Ο έλεγχος κόστους είναι πιο σημαντικός από τα έσοδα<br />
          🤝 Οι ομαδικές αποφάσεις χρειάζονται επικοινωνία
        </div>
      </div>

      <button style={s.btn} onClick={onNext}>
        Lean Canvas — η δική μου ιδέα →
      </button>
    </>
  );
}

// ─── Βήμα 4: Lean Canvas ──────────────────────────────────────────────────────

function StepCanvas({ studentName, onDone }: { studentName: string; onDone: () => void }) {
  const [answers, setAnswers] = useState<CanvasAnswer>({ q1: "", q2: "", q3: "", q4: "", q5: "", q6: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const filled = Object.values(answers).filter((v) => v.trim().length > 0).length;

  const handleSubmit = () => {
    if (filled < 6) {
      setError("Συμπλήρωσε και τις έξι ερωτήσεις πριν υποβάλεις!");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={s.h1}>Μπράβο, {studentName}!</div>
          <div style={s.sub}>Το Lean Canvas σου είναι έτοιμο. Ετοιμάσου να παρουσιάσεις στην τάξη.</div>
          <div style={{ background: "#f4eaff", borderRadius: 14, padding: "14px", textAlign: "left", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#765F8F", marginBottom: 8 }}>Elevator pitch — 2 λεπτά:</div>
            <div style={{ fontSize: 13, color: "#270F57", lineHeight: 1.7 }}>
              1. Ποιο πρόβλημα λύνεις<br />
              2. Ποιος είναι ο πελάτης σου<br />
              3. Πόσο θα κοστίζει η λύση σου
            </div>
          </div>
          <button style={s.btn} onClick={onDone}>Τέλος 🏁</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={s.h1}>Lean Canvas</div>
      <div style={s.sub}>
        Τώρα σκέψου τη δική σου επιχειρηματική ιδέα. Απάντησε και στις έξι ερωτήσεις.
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#765F8F" }}>{filled}/6 ολοκληρώθηκαν</span>
      </div>

      {CANVAS_QUESTIONS.map((q) => (
        <div
          key={q.key}
          style={{
            background: answers[q.key].trim() ? "#f4eaff" : "#faf7ff",
            border: answers[q.key].trim() ? "1.5px solid #765F8F" : "1.5px solid #e0d4f5",
            borderRadius: 14,
            padding: "14px",
            marginBottom: 10,
            transition: "all .15s",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "#765F8F", marginBottom: 2 }}>{q.num}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#270F57", marginBottom: 4 }}>{q.question}</div>
          <div style={{ fontSize: 11, color: "#765F8F", marginBottom: 8, fontStyle: "italic" }}>{q.hint}</div>
          <textarea
            placeholder={q.placeholder}
            value={answers[q.key]}
            onChange={(e) => {
              setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }));
              setError("");
            }}
            maxLength={200}
            rows={2}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid #e0d4f5",
              fontSize: 13,
              color: "#270F57",
              outline: "none",
              resize: "none" as const,
              background: "#fff",
              fontFamily: "'Inter', sans-serif",
              boxSizing: "border-box" as const,
            }}
          />
        </div>
      ))}

      {error && (
        <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, marginBottom: 8, padding: "8px 14px", background: "#fff5f5", borderRadius: 10 }}>
          ❌ {error}
        </div>
      )}

      <button style={{ ...s.btn, opacity: filled >= 3 ? 1 : 0.5 }} onClick={handleSubmit}>
        Υποβολή Lean Canvas ✓
      </button>
    </>
  );
}

// ─── Κύριο component ──────────────────────────────────────────────────────────

const ClassroomStudent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("join");
  const [studentName, setStudentName] = useState("");
  const [teamCode, setTeamCode] = useState("");

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <img src="/logo.png" alt="Kids in Business" style={s.logo} />
          <div style={{ fontSize: 12, color: "#765F8F", fontWeight: 600 }}>Η Τάξη Επιχειρεί</div>
        </div>

        <StepBar current={step} />

        {step === "join" && (
          <StepJoin
            onNext={(name, code) => {
              setStudentName(name);
              setTeamCode(code);
              setStep("simulation");
            }}
          />
        )}

        {step === "simulation" && (
          <StepSimulation
            studentName={studentName}
            teamCode={teamCode}
            onNext={() => setStep("leaderboard")}
          />
        )}

        {step === "leaderboard" && (
          <StepLeaderboard
            teamCode={teamCode}
            onNext={() => setStep("canvas")}
          />
        )}

        {step === "canvas" && (
          <StepCanvas
            studentName={studentName}
            onDone={() => navigate("/")}
          />
        )}
      </div>
    </div>
  );
};

export default ClassroomStudent;
