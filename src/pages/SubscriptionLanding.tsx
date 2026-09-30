import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionLanding = () => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [bookCode, setBookCode] = useState("");
  const navigate = useNavigate();

  const handleCodeSubmit = () => {
    if (bookCode.trim()) {
      navigate("/book-login");
    }
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 20,
    padding: 32,
    maxWidth: 300,
    width: "100%",
    textAlign: "center" as const,
  };

  const features = [
    { icon: "📖", title: "16 Κεφάλαια", desc: "Διαδραστικό περιεχόμενο για κάθε ηλικία" },
    { icon: "🎮", title: "Παιχνίδι Αγοράς", desc: "Simulation χρηματιστηρίου" },
    { icon: "✅", title: "Κουίζ & Αξιολόγηση", desc: "Τεστ γνώσεων ανά κεφάλαιο" },
    { icon: "👨‍👩‍👧", title: "Γονικό Dashboard", desc: "Παρακολούθηση προόδου" },
  ];

  const parentBenefits = [
    "Παρακολουθήστε την πρόοδο του παιδιού σας με μια ματιά",
    "Θέστε ευέλικτες παραμέτρους μάθησης",
    "Γιορτάστε τις υγιείς οικονομικές συνήθειες",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff9e9", fontFamily: "'Segoe UI', Arial, sans-serif", margin: 0, padding: 0 }}>
      {/* Header */}
      <header style={{ backgroundColor: "#270F57", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src="/logo.png" alt="Kids in Business" style={{ height: 44 }} />
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/book" style={{ color: "#fff9e9", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Το Βιβλίο</a>
          <a href="/auth" style={{ color: "#fff9e9", textDecoration: "none", fontSize: 14, fontWeight: 600, backgroundColor: "rgba(255,249,233,0.18)", padding: "7px 18px", borderRadius: 20 }}>Είσοδος</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ backgroundColor: "#270F57", color: "#fff9e9", textAlign: "center", padding: "60px 24px 100px" }}>
        {/* Ηλικία label */}
        <div style={{ display: "inline-block", backgroundColor: "rgba(255,249,233,0.12)", borderRadius: 20, padding: "5px 18px", marginBottom: 16 }}>
          <p style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", opacity: 0.9, margin: 0, fontWeight: 700 }}>
            Για παιδιά 8–14 ετών
          </p>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 auto 22px", maxWidth: 680 }}>
          Μικροί Επενδυτές,<br />Μεγάλο Μέλλον
        </h1>
        <p style={{ fontSize: "clamp(15px, 2.5vw, 18px)", opacity: 0.82, maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.7 }}>
          Μάθε για χρήματα, αποταμίευση, επενδύσεις και επιχειρηματικότητα — μέσα από κεφάλαια, κουίζ και παιχνίδια.
        </p>

        {/* Feature badges */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {["📚 16 Κεφάλαια", "🎮 Παιχνίδι Αγοράς", "✅ Κουίζ"].map((t) => (
            <span key={t} style={{ backgroundColor: "rgba(255,249,233,0.14)", borderRadius: 20, padding: "6px 16px", fontSize: 13 }}>{t}</span>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, opacity: 0.75, display: "flex", alignItems: "center", gap: 6 }}>
            🏆 Βραβευμένο από το JA Greece
          </span>
          <span style={{ fontSize: 13, opacity: 0.75, display: "flex", alignItems: "center", gap: 6 }}>
            📰 Όπως αναφέρθηκε στο WIRED Greece
          </span>
        </div>
      </section>

      {/* 3 CTA Cards */}
      <section style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", padding: "0 24px 56px", marginTop: -56 }}>
        {/* Card 1 — Book Code */}
        <div style={{ ...cardBase, backgroundColor: "#fff", boxShadow: "0 8px 32px rgba(39,15,87,0.13)" }}>
          <div style={{ fontSize: 46, marginBottom: 12 }}>📚</div>
          <h2 style={{ color: "#270F57", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Έχω το Βιβλίο</h2>
          <p style={{ color: "#5a4070", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
            Αγόρασες το βιβλίο; Εισάγαγε τον κωδικό σου και απόκτησε <strong>δωρεάν</strong> πρόσβαση στην πλατφόρμα.
          </p>
          {!showCodeInput ? (
            <button onClick={() => setShowCodeInput(true)}
              style={{ backgroundColor: "#270F57", color: "#fff9e9", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
              Εισαγωγή Κωδικού →
            </button>
          ) : (
            <div style={{ textAlign: "left" }}>
              <input
                type="text"
                value={bookCode}
                onChange={(e) => setBookCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCodeSubmit()}
                placeholder="Κωδικός βιβλίου"
                autoFocus
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "2px solid #270F57", fontSize: 14, marginBottom: 8, boxSizing: "border-box", outline: "none" }}
              />
              <button onClick={handleCodeSubmit}
                style={{ backgroundColor: "#270F57", color: "#fff9e9", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" }}>
                Ενεργοποίηση
              </button>
            </div>
          )}
          <p style={{ fontSize: 12, color: "#888", margin: "12px 0 0" }}>🎁 Δωρεάν με κάθε αγορά βιβλίου</p>
        </div>

        {/* Card 2 — Subscription (highlighted) */}
        <div style={{ ...cardBase, backgroundColor: "#270F57", boxShadow: "0 8px 40px rgba(39,15,87,0.32)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 14, right: 14, backgroundColor: "#f4b400", color: "#1a0a3d", fontSize: 10, fontWeight: 900, padding: "4px 12px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>
            Δημοφιλές
          </div>
          <div style={{ fontSize: 46, marginBottom: 12 }}>🚀</div>
          <h2 style={{ color: "#fff9e9", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Ψηφιακή Συνδρομή</h2>
          <div style={{ color: "#f4eaff", margin: "0 0 4px" }}>
            <span style={{ fontSize: 36, fontWeight: 900 }}>€4,99</span>
            <span style={{ fontSize: 14, opacity: 0.8 }}> /μήνα</span>
          </div>
          <p style={{ color: "#f4eaff", fontSize: 13, opacity: 0.72, margin: "0 0 14px" }}>ή €39/χρόνο — εξοικονόμηση 35%</p>
          <p style={{ color: "#f4eaff", fontSize: 14, lineHeight: 1.7, opacity: 0.9, margin: "0 0 20px" }}>
            Πλήρης πρόσβαση χωρίς αγορά βιβλίου. Ψηφιακά κεφάλαια, κουίζ, παιχνίδια.
          </p>
          <button
            onClick={() => navigate("/subscribe")}
            style={{ backgroundColor: "#fff9e9", color: "#270F57", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 15, fontWeight: 900, cursor: "pointer", width: "100%" }}>
            Εγγραφή Συνδρομής →
          </button>
          <p style={{ fontSize: 12, color: "#f4eaff", margin: "12px 0 0", opacity: 0.6 }}>Ακύρωση οποτεδήποτε</p>
        </div>

        {/* Card 3 — Bundle */}
        <div style={{ ...cardBase, backgroundColor: "#f4eaff", border: "2px solid #5a4070", boxShadow: "0 8px 28px rgba(39,15,87,0.10)" }}>
          <div style={{ fontSize: 46, marginBottom: 12 }}>📦</div>
          <h2 style={{ color: "#270F57", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>Πακέτο Bundle</h2>
          <p style={{ color: "#5a4070", fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>
            Φυσικό βιβλίο + ψηφιακή πρόσβαση. Η πληρέστερη εμπειρία για το παιδί σου!
          </p>
          <div style={{ color: "#270F57", fontSize: 18, fontWeight: 900, margin: "0 0 16px" }}>Βιβλίο + Πλατφόρμα</div>
          <button
            onClick={() => navigate("/bundle")}
            style={{ backgroundColor: "#5a4070", color: "#fff9e9", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
            Αγορά Bundle →
          </button>
          <p style={{ fontSize: 12, color: "#5a4070", margin: "12px 0 0" }}>📦 Αποστολή σε όλη την Ελλάδα</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "#270F57", color: "#fff9e9", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, margin: "0 0 10px" }}>Τι περιλαμβάνει η πλατφόρμα</h2>
        <p style={{ opacity: 0.65, margin: "0 0 40px", fontSize: 15 }}>Όλα όσα χρειάζεται ένας μικρός επενδυτής</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", maxWidth: 860, margin: "0 auto" }}>
          {features.map((f) => (
            <div key={f.title} style={{ backgroundColor: "rgba(255,249,233,0.08)", borderRadius: 14, padding: "24px 18px", maxWidth: 185, width: "100%", border: "1px solid rgba(255,249,233,0.10)" }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.4, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, opacity: 0.72, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Parent Section */}
      <section style={{ backgroundColor: "#fff9e9", padding: "64px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#5a4070", fontWeight: 700, marginBottom: 12 }}>
          Φτιαγμένο για γονείς
        </p>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 900, color: "#270F57", margin: "0 auto 36px", maxWidth: 560, lineHeight: 1.3 }}>
          Περισσότερη αυτοπεποίθηση στα παιδιά σας, κάθε μέρα.
        </h2>
        <ul style={{ listStyle: "none", padding: 0, maxWidth: 460, margin: "0 auto", textAlign: "left" }}>
          {parentBenefits.map((item) => (
            <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 14, fontSize: 16, color: "#270F57", marginBottom: 18, lineHeight: 1.5 }}>
              <span style={{ color: "#5a4070", fontWeight: 900, fontSize: 18, flexShrink: 0, marginTop: 1 }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a0a3d", color: "#f4eaff", padding: "28px 24px", textAlign: "center" }}>
        <img src="/logo.png" alt="Kids in Business" style={{ height: 30, marginBottom: 10, display: "block", margin: "0 auto 10px" }} />
        <p style={{ opacity: 0.5, margin: "8px 0 0", fontSize: 13 }}>
          © 2026 Kids in Business ·{" "}
          <a href="/privacy" style={{ color: "#f4eaff" }}>Πολιτική Απορρήτου</a>
        </p>
      </footer>
    </div>
  );
};

export default SubscriptionLanding;
