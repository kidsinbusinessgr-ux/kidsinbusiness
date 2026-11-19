import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BOOK_USER_KEY, checkBookAccess, hadOldAccess, redeemBookCode } from "@/lib/bookAccess";

type SavedUser = { name?: string; age?: number; parentEmail?: string };

const readSavedUser = (): SavedUser | null => {
  try {
    const raw = localStorage.getItem(BOOK_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const BookLogin = () => {
  const navigate = useNavigate();
  const [saved] = useState<SavedUser | null>(readSavedUser);
  const [code, setCode] = useState("");
  const [name, setName] = useState(saved?.name || "");
  const [age, setAge] = useState(saved?.age ? String(saved.age) : "");
  const [parentEmail, setParentEmail] = useState(saved?.parentEmail || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  // Παιδί που είχε μπει πριν από την αλλαγή: του ζητάμε τον κωδικό μία φορά.
  const [returning] = useState(() => hadOldAccess() || !!saved);

  // Αν έχει ήδη πρόσβαση (ελέγχει ο server), πήγαινε κατευθείαν στο /book
  useEffect(() => {
    let alive = true;
    checkBookAccess().then(ok => {
      if (!alive) return;
      if (ok) navigate("/book", { replace: true });
      else setChecking(false);
    });
    return () => { alive = false; };
  }, [navigate]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Γράψε το όνομά σου!"); return; }
    if (!age.trim()) { setError("Γράψε την ηλικία σου!"); return; }
    if (!parentEmail.trim() || !parentEmail.includes("@")) { setError("Γράψε σωστό email γονέα!"); return; }
    if (name.trim().length > 50) { setError("Το όνομα είναι πολύ μακρύ!"); return; }
    if (parentEmail.trim().length > 100) { setError("Το email είναι πολύ μακρύ!"); return; }
    if (!code.trim()) { setError("Γράψε τον κωδικό βιβλίου!"); return; }

    setLoading(true);

    const result = await redeemBookCode(code);
    if (result !== "ok") {
      setError(
        result === "too_many" ? "Πολλές προσπάθειες. Περίμενε λίγα λεπτά και δοκίμασε ξανά!"
        : result === "error" ? "Κάτι πήγε στραβά με τη σύνδεση. Δοκίμασε ξανά!"
        : "Λάθος κωδικός βιβλίου. Δοκίμασε ξανά!"
      );
      setLoading(false);
      return;
    }

    const cleanEmail = parentEmail.trim().toLowerCase();
    const sameChild = !!saved && saved.name === name.trim() && saved.parentEmail === cleanEmail;

    // Νέα εγγραφή μόνο για νέο παιδί (όχι για όποιον ξαναγράφει τον κωδικό του)
    if (!sameChild) {
      try {
        await supabase.from("book_registrations").insert({
          child_name: name.trim(),
          child_age: Number(age),
          parent_email: cleanEmail,
          registered_at: new Date().toISOString(),
        });
      } catch {}
    }

    try {
      localStorage.setItem(BOOK_USER_KEY, JSON.stringify({
        name: name.trim(),
        age: Number(age),
        parentEmail: cleanEmail,
        registeredAt: new Date().toISOString(),
      }));
      // Η πρόοδος σβήνει μόνο όταν μπαίνει άλλο παιδί στην ίδια συσκευή
      if (!sameChild) localStorage.removeItem("kib_book_progress_v1");
    } catch {}

    setLoading(false);
    navigate("/book");
  };

  const inp = (extraStyle?: React.CSSProperties): React.CSSProperties => ({
    width: "100%",
    padding: "13px 18px",
    borderRadius: 14,
    border: "2px solid #e0d4f5",
    fontSize: 15,
    fontWeight: 600,
    color: "#270F57",
    outline: "none",
    boxSizing: "border-box",
    background: "#faf7ff",
    marginBottom: 10,
    ...extraStyle,
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #270F57, #765F8F)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(39,15,87,0.3)" }}>
        <img src="/logo.png" alt="Kids in Business" style={{ height: 70, width: "auto", margin: "0 auto 16px" }} />
        <div style={{ fontSize: 22, fontWeight: 900, color: "#270F57", marginBottom: 4 }}>Μικροί Επενδυτές</div>
        <div style={{ fontSize: 14, color: "#765F8F", marginBottom: 28, lineHeight: 1.5 }}>
          Μεγάλο Μέλλον<br />Συμπλήρωσε τα στοιχεία σου για να ξεκινήσεις!
        </div>

        {returning && !checking && (
          <div style={{ fontSize: 13, color: "#270F57", fontWeight: 600, marginBottom: 16, padding: "10px 14px", background: "#f3edff", borderRadius: 12, lineHeight: 1.5 }}>
            👋 Καλώς ήρθες ξανά! Γράψε τον κωδικό του βιβλίου σου μία φορά ακόμα. Η πρόοδός σου μένει όπως ήταν.
          </div>
        )}

        <input style={inp()} type="text" placeholder="Όνομα παιδιού..." value={name} onChange={e => { setName(e.target.value); setError(""); }}  maxLength={50}/>
        <input style={inp()} type="number" placeholder="Ηλικία..." value={age} min="6" max="18" onChange={e => { setAge(e.target.value); setError(""); }} />
        <input style={inp()} type="email" placeholder="Email γονέα..." value={parentEmail} onChange={e => { setParentEmail(e.target.value); setError(""); }}  maxLength={100}/>
        <input style={inp({ letterSpacing: "0.08em", textAlign: "center" })} type="text" placeholder="Κωδικός βιβλίου..."
          value={code} onChange={e => { setCode(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}  maxLength={30}/>

        {error && (
          <div style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, marginBottom: 12, padding: "8px 14px", background: "#fff5f5", borderRadius: 10 }}>
            ❌ {error}
          </div>
        )}

        <button
          style={{ width: "100%", padding: "14px", borderRadius: 14, background: loading ? "#aaa" : "linear-gradient(135deg, #270F57, #765F8F)", color: "#fff", fontWeight: 800, fontSize: 16, border: "none", cursor: loading ? "default" : "pointer", marginBottom: 16 }}
          onClick={handleSubmit} disabled={loading || checking}
        >
          {loading || checking ? "Φόρτωση..." : "Είσοδος 🚀"}
        </button>

        <div style={{ fontSize: 12, color: "#aaa" }}>
          Ο κωδικός βρίσκεται στο εξώφυλλο του βιβλίου σου
        
        <div style={{ marginTop: 12, fontSize: 11, color: "#bbb" }}>
          <a href="/privacy" style={{ color: "#765F8F", textDecoration: "underline" }}>Πολιτική Απορρήτου & Όροι Χρήσης</a>
        </div></div>
      </div>
    </div>
  );
};

export default BookLogin;
