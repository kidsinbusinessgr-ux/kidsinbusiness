import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BOOK_CODE = "ependitis2026";
const ACCESS_KEY = "kib_book_access_v1";

const BookLogin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    if (value.trim().toLowerCase() === BOOK_CODE) {
      try { localStorage.setItem(ACCESS_KEY, "1"); } catch {}
      navigate("/book");
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #270F57, #765F8F)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
      padding: "20px",
    } as React.CSSProperties,
    card: {
      background: "#fff",
      borderRadius: 24,
      padding: "40px 32px",
      maxWidth: 400,
      width: "100%",
      textAlign: "center" as const,
      boxShadow: "0 20px 60px rgba(39,15,87,0.3)",
    } as React.CSSProperties,
    logo: { fontSize: 56, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 900, color: "#270F57", marginBottom: 6 },
    subtitle: { fontSize: 14, color: "#765F8F", marginBottom: 28, lineHeight: 1.5 },
    inputWrap: {
      position: "relative" as const,
      marginBottom: 12,
      animation: shake ? "shake 0.5s" : "none",
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      borderRadius: 14,
      border: error ? "2px solid #f87171" : "2px solid #e0d4f5",
      fontSize: 16,
      fontWeight: 700,
      color: "#270F57",
      outline: "none",
      boxSizing: "border-box" as const,
      textAlign: "center" as const,
      letterSpacing: "0.08em",
      background: error ? "#fff5f5" : "#faf7ff",
      transition: "border 0.2s",
    } as React.CSSProperties,
    errorMsg: {
      fontSize: 13,
      color: "#ef4444",
      fontWeight: 600,
      marginBottom: 16,
      display: error ? "block" : "none",
    } as React.CSSProperties,
    btn: {
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: "linear-gradient(135deg, #270F57, #765F8F)",
      color: "#fff",
      fontWeight: 800,
      fontSize: 16,
      border: "none",
      cursor: "pointer",
      marginBottom: 16,
    } as React.CSSProperties,
    hint: { fontSize: 12, color: "#aaa", lineHeight: 1.5 },
  };

  return (
    <>
      <style>{
        `@keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }`
      }</style>
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.logo}>📚</div>
          <div style={s.title}>Μικροί Επενδυτές</div>
          <div style={s.subtitle}>
            Μεγάλο Μέλλον<br />
            Εισήγαγε τον κωδικό του βιβλίου για να αποκτήσεις πρόσβαση
          </div>
          <div style={s.inputWrap}>
            <input
              style={s.input}
              type="text"
              placeholder="Κωδικός βιβλίου..."
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
          <div style={s.errorMsg}>❌ Λάθος κωδικός. Δοκίμασε ξανά!</div>
          <button style={s.btn} onClick={handleSubmit}>
            Είσοδος 🚀
          </button>
          <div style={s.hint}>
            Ο κωδικός βρίσκεται στο εξώφυλλο του βιβλίου σου
          </div>
        </div>
      </div>
    </>
  );
};

export default BookLogin;
