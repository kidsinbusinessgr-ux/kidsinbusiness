import { useNavigate } from "react-router-dom";

// TODO: Replace these with your actual Stripe Payment Link URLs
// Create them at: https://dashboard.stripe.com/payment-links
const STRIPE_MONTHLY_URL = "https://buy.stripe.com/REPLACE_ME_MONTHLY";
const STRIPE_ANNUAL_URL = "https://buy.stripe.com/REPLACE_ME_ANNUAL";

const SubscribePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: "📖", text: "16 ψηφιακά κεφάλαια", desc: "Δομημένη μάθηση για παιδιά 8–14" },
    { icon: "✅", text: "Κουίζ ανά κεφάλαιο", desc: "Επιβεβαίωση κατανόησης" },
    { icon: "🎮", text: "Παιχνίδι Αγοράς", desc: "Μάθηση μέσα από προσομοίωση" },
    { icon: "👨‍👩‍👧", text: "Γονικό Dashboard", desc: "Παρακολούθηση προόδου παιδιού" },
    { icon: "💡", text: "Εβδομαδιαίο περιεχόμενο", desc: "Νέο υλικό κάθε εβδομάδα" },
    { icon: "📊", text: "Παρακολούθηση προόδου", desc: "Στατιστικά και αξιολόγηση" },
  ];

  const cardBase: React.CSSProperties = {
    flex: "1 1 300px",
    maxWidth: 340,
    borderRadius: 20,
    padding: 32,
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff9e9", fontFamily: "'Segoe UI', Arial, sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#270F57", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
          title="Επιστροφή στην αρχική"
        >
          <img src="/logo.png" alt="Kids in Business" style={{ height: 44 }} />
        </button>
        <a
          href="/book-login"
          style={{ color: "#fff9e9", textDecoration: "none", fontSize: 14, fontWeight: 600, backgroundColor: "rgba(255,249,233,0.18)", padding: "7px 18px", borderRadius: 20 }}
        >
          Είσοδος
        </a>
      </header>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "64px 24px 48px", maxWidth: 680, margin: "0 auto" }}>
        <p style={{ color: "#5a4070", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
          ΕΚΠΑΙΔΕΥΤΙΚΗ ΠΛΑΤΦΟΡΜΑ
        </p>
        <h1 style={{ color: "#270F57", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, margin: "0 0 20px", lineHeight: 1.2 }}>
          Το παιδί σου μαθαίνει<br />οικονομικά. Παίζοντας.
        </h1>
        <p style={{ color: "#5a4070", fontSize: 17, lineHeight: 1.8, margin: "0 auto", maxWidth: 520 }}>
          Πρόσβαση στο πλήρες πρόγραμμα Kids in Business — βιβλίο, κουίζ, παιχνίδι αγοράς, και γονικό dashboard.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{ padding: "0 24px 64px", maxWidth: 760, margin: "0 auto", display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>

        {/* Monthly Card */}
        <div style={{
          ...cardBase,
          backgroundColor: "#fff",
          border: "2px solid #e8d5f5",
          boxShadow: "0 4px 20px rgba(39,15,87,0.08)",
        }}>
          <p style={{ color: "#5a4070", fontSize: 13, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>Μηνιαία</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
            <span style={{ color: "#270F57", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>€4,99</span>
            <span style={{ color: "#5a4070", fontSize: 15, marginBottom: 8 }}>/μήνα</span>
          </div>
          <p style={{ color: "#aaa", fontSize: 13, margin: "0 0 24px" }}>Ακύρωση οποτεδήποτε</p>
          <a
            href={STRIPE_MONTHLY_URL}
            style={{
              display: "block",
              backgroundColor: "#270F57",
              color: "#fff9e9",
              textDecoration: "none",
              textAlign: "center",
              borderRadius: 12,
              padding: "14px",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 24,
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            Εγγραφή →
          </a>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {features.map(f => (
              <li key={f.text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                <div>
                  <div style={{ color: "#270F57", fontSize: 14, fontWeight: 600 }}>{f.text}</div>
                  <div style={{ color: "#888", fontSize: 12, marginTop: 1 }}>{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Annual Card — highlighted */}
        <div style={{
          ...cardBase,
          backgroundColor: "#270F57",
          boxShadow: "0 12px 40px rgba(39,15,87,0.30)",
          position: "relative",
        }}>
          {/* Best value badge */}
          <div style={{
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#f4c542",
            color: "#270F57",
            fontSize: 12,
            fontWeight: 800,
            padding: "5px 18px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}>
            ✨ ΚΑΛΥΤΕΡΗ ΑΞΙΑ — 35% ΕΚΠΤΩΣΗ
          </div>

          <p style={{ color: "#f4eaff", fontSize: 13, fontWeight: 700, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1, opacity: 0.75 }}>Ετήσια</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
            <span style={{ color: "#fff9e9", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>€39</span>
            <span style={{ color: "#f4eaff", fontSize: 15, marginBottom: 8, opacity: 0.7 }}>/χρόνο</span>
          </div>
          <p style={{ color: "#f4eaff", fontSize: 13, margin: "0 0 24px", opacity: 0.6 }}>
            αντί €59,88 · μόλις <strong style={{ opacity: 1, color: "#fff9e9" }}>€3,25/μήνα</strong>
          </p>
          <a
            href={STRIPE_ANNUAL_URL}
            style={{
              display: "block",
              backgroundColor: "#fff9e9",
              color: "#270F57",
              textDecoration: "none",
              textAlign: "center",
              borderRadius: 12,
              padding: "14px",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 24,
              transition: "opacity 0.2s",
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}
          >
            Εγγραφή →
          </a>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {features.map(f => (
              <li key={f.text} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                <div>
                  <div style={{ color: "#fff9e9", fontSize: 14, fontWeight: 600 }}>{f.text}</div>
                  <div style={{ color: "#f4eaff", fontSize: 12, marginTop: 1, opacity: 0.65 }}>{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust signals */}
      <section style={{ backgroundColor: "#f4eaff", padding: "44px 24px" }}>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", maxWidth: 600, margin: "0 auto" }}>
          {[
            { icon: "🔒", text: "Ασφαλής πληρωμή", sub: "μέσω Stripe" },
            { icon: "↩️", text: "Ακύρωση εύκολα", sub: "χωρίς κυρώσεις" },
            { icon: "📱", text: "Παντού", sub: "κινητό, tablet, PC" },
          ].map(t => (
            <div key={t.text} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ color: "#270F57", fontSize: 14, fontWeight: 700 }}>{t.text}</div>
              <div style={{ color: "#5a4070", fontSize: 12, marginTop: 2 }}>{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a0a3d", color: "#f4eaff", padding: "28px 24px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#f4eaff", fontSize: 13, marginBottom: 8 }}
        >
          ← Πίσω στην αρχική
        </button>
        <p style={{ opacity: 0.4, margin: "8px 0 0", fontSize: 12 }}>© 2026 Kids in Business</p>
      </footer>

    </div>
  );
};

export default SubscribePage;
