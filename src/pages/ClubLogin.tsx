import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type Mode = "choose" | "teacher" | "student";

const ClubLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentName, setStudentName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("Λάθος email ή κωδικός."); } else { navigate("/club/teacher"); }
    setLoading(false);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const code = classCode.trim().toUpperCase();
    const name = studentName.trim();
    const { data: classData, error: classError } = await supabase.from("club_classes").select("id, name").eq("class_code", code).single();
    if (classError || !classData) { setError("Ο κωδικός τάξης δεν βρέθηκε. Ρώτησε τον εκπαιδευτικό σου."); setLoading(false); return; }
    let { data: student } = await supabase.from("club_students").select("id, full_name, role").eq("class_id", classData.id).eq("full_name", name).single();
    if (!student) {
      const { data: newStudent, error: insertError } = await supabase.from("club_students").insert({ full_name: name, class_id: classData.id }).select("id, full_name, role").single();
      if (insertError || !newStudent) { setError("Πρόβλημα εγγραφής. Δοκίμασε ξανά."); setLoading(false); return; }
      student = newStudent;
    }
    localStorage.setItem("club_student", JSON.stringify({ id: student.id, name: student.full_name, role: student.role, classId: classData.id, className: classData.name }));
    navigate("/club/student");
    setLoading(false);
  };

  const s = {
    page: { minHeight: "100vh", background: "#fff9e9", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Inter', sans-serif" } as React.CSSProperties,
    card: { background: "#fff", borderRadius: 24, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 8px 32px rgba(39,15,87,0.10)" } as React.CSSProperties,
    title: { fontSize: 22, fontWeight: 800, color: "#270F57", marginBottom: 6, textAlign: "center" as const },
    sub: { fontSize: 14, color: "#765F8F", textAlign: "center" as const, marginBottom: 28 },
    btnPrimary: { display: "block", width: "100%", padding: "14px", borderRadius: 14, background: "#270F57", color: "#fff9e9", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", marginBottom: 12, textAlign: "center" as const } as React.CSSProperties,
    btnSecondary: { display: "block", width: "100%", padding: "14px", borderRadius: 14, background: "transparent", color: "#270F57", fontWeight: 700, fontSize: 15, border: "1.5px solid #270F57", cursor: "pointer", textAlign: "center" as const } as React.CSSProperties,
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#270F57", marginBottom: 6 },
    input: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e0d4f5", fontSize: 14, color: "#270F57", outline: "none", boxSizing: "border-box" as const, marginBottom: 16 },
    back: { background: "none", border: "none", color: "#765F8F", fontSize: 13, cursor: "pointer", marginTop: 16, display: "block", textAlign: "center" as const, width: "100%" } as React.CSSProperties,
    error: { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#270F57,#765F8F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>K</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: "#270F57" }}>KidsInBusiness</span>
          </div>
        </div>
        {mode === "choose" && (
          <>
            <div style={s.title}>Καλώς ήρθες!</div>
            <div style={s.sub}>Ποιος είσαι;</div>
            <button style={s.btnPrimary} onClick={() => setMode("teacher")}>👩‍🏫 Είμαι Εκπαιδευτικός</button>
            <button style={s.btnSecondary} onClick={() => setMode("student")}>🎒 Είμαι Μαθητής</button>
          </>
        )}
        {mode === "teacher" && (
          <>
            <div style={s.title}>Είσοδος Εκπαιδευτικού</div>
            <div style={s.sub}>Χρησιμοποίησε το email σου</div>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={handleTeacherLogin}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@school.gr" required />
              <label style={s.label}>Κωδικός</label>
              <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="submit" style={s.btnPrimary} disabled={loading}>{loading ? <Loader2 className="animate-spin inline w-4 h-4" /> : "Είσοδος →"}</button>
            </form>
            <button style={s.back} onClick={() => { setMode("choose"); setError(""); }}>← Πίσω</button>
          </>
        )}
        {mode === "student" && (
          <>
            <div style={s.title}>Είσοδος Μαθητή</div>
            <div style={s.sub}>Βάλε το όνομά σου και τον κωδικό της τάξης</div>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={handleStudentLogin}>
              <label style={s.label}>Ονοματεπώνυμο</label>
              <input style={s.input} type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="π.χ. Μαρία Παπαδοπούλου" required />
              <label style={s.label}>Κωδικός Τάξης</label>
              <input style={{ ...s.input, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }} type="text" value={classCode} onChange={e => setClassCode(e.target.value.toUpperCase())} placeholder="π.χ. ΕΠΙΧ2025" required />
              <button type="submit" style={s.btnPrimary} disabled={loading}>{loading ? <Loader2 className="animate-spin inline w-4 h-4" /> : "Μπαίνω! →"}</button>
            </form>
            <button style={s.back} onClick={() => { setMode("choose"); setError(""); }}>← Πίσω</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClubLogin;
