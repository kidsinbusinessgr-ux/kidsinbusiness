import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BundlePage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await supabase.from("waitlist").insert({ email: email.trim(), type: "bundle" });
    } catch (e) {
      // silent fail
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff9e9", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <header style={{ backgroundColor: "#270F57", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/"><img src="/logo.png" alt="Kids in Business" style={{ height: 44 }} /></a>
        <a href="/book-login" style={{ color: "#fff9e9", textDecoration: "none", fontSize: 14, fontWeight: 600, backgroundColor: "rgba(255,249,233,0.18)", padding: "7px 18px", borderRadius: 20 }}>Είσοδος</a>
      </header>

      <section style={{ textAlign: "center", padding: "72px 24px 56px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
        <p style={{ color: "#5a4070", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>ΣΎΝΤΟΜΑ ΔΙΑΘΈΣΙΜΟ</p>
        <h1 style={{ color: "#270F57", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.2 }}>
          Πακέτο Bundle
        </h1>
        <p style={{ color: "#5a4070", fontSize: 16, lineHeight: 1.8, margin: "0 0 12px" }}>
          <strong>Φυσικό βιβλίο</strong> + <strong>ψηφιακή πρόσβαση</strong> μαζί — η πληρέστερη εμπειρία για το παιδί σου.
        </p>
        <p style={{ color: "#5a4070", fontSize: 15, lineHeight: 1.7, margin: "0 0 36px" }}>
          Άφησε το email σου και θα σε ειδοποιήσουμε μόλις είναι διαθέσιμο.
        </p>

        {!submitted ? (
          <div style={{ display: "flex", gap: 10, maxWidth: 440, margin: "0 auto 16px", flexWrap: "wrap" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="το email σου"
              autoFocus
              style={{ flex: 1, minWidth: 200, padding: "14px 18px", borderRadius: 10, border: "2px solid #5a4070", fontSize: 15, outline: "none", boxSizing: "border-box" as const }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ backgroundColor: "#5a4070", color: "#fff9e9", border: "none", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : "Ειδοποίησέ με →"}
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: "#5a4070", color: "#fff9e9", borderRadius: 16, padding: "28px 32px", maxWidth: 420, margin: "0 auto 16px" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
            <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>Σε καταχωρήσαμε!</p>
            <p style={{ fontSize: 14, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>Θα σε ειδοποιήσουμε μόλις το bundle είναι διαθέσιμο.</p>
          </div>
        )}
        <p style={{ color: "#aaa", fontSize: 13 }}>Κανένα spam. Μόνο μία ειδοποίηση.</p>
      </section>

      <section style={{ backgroundColor: "#f4eaff", padding: "44px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#270F57", fontSize: 20, fontWeight: 800, margin: "0 0 24px" }}>Τι περιλαμβάνει το Bundle</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
          {[
            { icon: "📚", title: "Φυσικό Βιβλίο", desc: "Μικροί Επενδυτές, Μεγάλο Μέλλον — το βιβλίο στα χέρια σου" },
            { icon: "💻", title: "Ψηφιακή Πλατφόρμα", desc: "16 κεφάλαια, κουίζ, παιχνίδι αγοράς & γονικό dashboard" },
            { icon: "🚚", title: "Αποστολή στην Ελλάδα", desc: "Παράδοση σε όλη την Ελλάδα" },
          ].map(f => (
            <div key={f.title} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "22px 20px", maxWidth: 180, width: "100%", border: "1px solid rgba(90,64,112,0.15)", boxShadow: "0 4px 16px rgba(39,15,87,0.07)" }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ color: "#270F57", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
              <div style={{ color: "#5a4070", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ backgroundColor: "#1a0a3d", color: "#f4eaff", padding: "24px", textAlign: "center" }}>
        <a href="/" style={{ color: "#f4eaff", fontSize: 13, textDecoration: "none" }}>← Πίσω στην αρχική</a>
        <p style={{ opacity: 0.4, margin: "10px 0 0", fontSize: 12 }}>© 2026 Kids in Business</p>
      </footer>
    </div>
  );
};

export default BundlePage;
