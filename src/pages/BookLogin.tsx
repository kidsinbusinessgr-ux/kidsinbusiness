import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ACCESS_KEY = "kib_book_access_v1";
const USER_KEY = "kib_book_user_v1";

const BookLogin = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Αν έχει ήδη κάνει login, πήγαινε κατευθείαν στο /book
  useEffect(() => {
    try {
      if (localStorage.getItem(ACCESS_KEY) === "1") {
        navigate("/book", { replace: true });
      }
    } catch {}
  }, [navigate]);

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Γράψε το όνομά σου!"); return; }
    if (!age.trim()) { setError("Γράψε την ηλικία σου!"); return; }
    if (!parentEmail.trim() || !parentEmail.includes("@")) { setError("Γράψε σωστό email γονέα!"); return; }
    if (name.trim().length > 50) { setError("Το όνομα είναι πολύ μακρύ!"); return; }
    if (parentEmail.trim().length > 100) { setError("Το email είναι πολύ μακρύ!"); return; }
    if (!code.trim()) { setError("Γράψε τον κωδικό βιβλίου!"); return; }

    setLoading(true);

    let codeValid = false;
    try {
      const { data } = await supabase.rpc("validate_and_use_book_code" as any, { input_code: code.trim().toLowerCase() });
      codeValid = !!data;
    } catch {}
    if (!codeValid) { setError("Λάθος κωδικός βιβλίου. Δοκίμασε ξανά!"); setLoading(false); return; }

    try {
      await supabase.from("book_registrations").insert({
        child_name: name.trim(),
        child_age: Number(age),
        parent_email: parentEmail.trim().toLowerCase(),
        registered_at: new Date().toISOString(),
      });
    } catch {}

    try {
      localStorage.setItem(ACCESS_KEY, "1");
      localStorage.setItem(USER_KEY, JSON.stringify({
        name: name.trim(),
        age: Number(age),
        parentEmail: parentEmail.trim().toLowerCase(),
        registeredAt: new Date().toISOString(),
      }));
    } catch {}

    setLoading(false);
    localStorage.removeItem("kib_book_progress_v1");
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
        <div style={{ fontSize: 56, marginBottom: 12 }}>📚</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#270F57", marginBottom: 4 }}>Μικροί Επενδυτές</div>
        <div style={{ fontSize: 14, color: "#765F8F", marginBottom: 28, lineHeight: 1.5 }}>
          Μεγάλο Μέλλον<br />Συμπλήρωσε τα στοιχεία σου για να ξεκινήσεις!
        </div>

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
          onClick={handleSubmit} disabled={loading}
        >
          {loading ? "Φόρτωση..." : "Είσοδος 🚀"}
        </button>

        <div style={{ fontSize: 12, color: "#aaa" }}>
          Ο κωδικός βρίσκεται στο εξώφυλλο του βιβλίου σου
        </div>
      </div>
    </div>
  );
};

export default BookLogin;
