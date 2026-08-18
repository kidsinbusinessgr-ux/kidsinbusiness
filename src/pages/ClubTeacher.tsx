import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, LogOut, Copy, Check } from "lucide-react";

type Tab = "classes" | "lessons" | "challenges" | "students";

interface ClubClass { id: string; name: string; class_code: string; school_year: string; description: string; }
interface Student { id: string; full_name: string; role: string; created_at: string; }
interface Lesson { id: string; week_number: number; title: string; content: string; material_url: string; material_name: string; }

const ROLES = [
  { key: "sales", label: "Sales", emoji: "💼" },
  { key: "marketing", label: "Marketing", emoji: "📣" },
  { key: "technical", label: "Technical", emoji: "⚙️" },
  { key: "finance", label: "Finance", emoji: "💰" },
  { key: "operations", label: "Operations", emoji: "📋" },
];

const ClubTeacher = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("classes");
  const [classes, setClasses] = useState<ClubClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClubClass | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");
  const [showNewClass, setShowNewClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassCode, setNewClassCode] = useState("");
  const [newClassYear, setNewClassYear] = useState("2025-2026");
  const [savingClass, setSavingClass] = useState(false);
  const [showNewLesson, setShowNewLesson] = useState(false);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonWeek, setLessonWeek] = useState(1);
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);
  const [showNewChallenge, setShowNewChallenge] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDesc, setChallengeDesc] = useState("");
  const [challengeWeek, setChallengeWeek] = useState(1);
  const [challengeDue, setChallengeDue] = useState("");
  const [savingChallenge, setSavingChallenge] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/club"); else loadClasses();
    });
  }, []);

  const loadClasses = async () => {
    const { data } = await supabase.from("club_classes").select("*").order("created_at", { ascending: false });
    setClasses(data || []);
    if (data && data.length > 0) setSelectedClass(data[0]);
    setLoading(false);
  };

  useEffect(() => { if (selectedClass) { loadStudents(); loadLessons(); loadChallenges(); } }, [selectedClass]);

  const loadStudents = async () => {
    if (!selectedClass) return;
    const { data } = await supabase.from("club_students").select("*").eq("class_id", selectedClass.id).order("created_at");
    setStudents(data || []);
  };

  const loadLessons = async () => {
    if (!selectedClass) return;
    const { data } = await supabase.from("club_lessons").select("*").eq("class_id", selectedClass.id).order("week_number");
    setLessons(data || []);
  };

  const loadChallenges = async () => {
    if (!selectedClass) return;
    const { data } = await supabase.from("club_challenges").select("*").eq("class_id", selectedClass.id).order("week_number");
    setChallenges(data || []);
  };

  const createClass = async () => {
    if (!newClassName || !newClassCode) return;
    setSavingClass(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase.from("club_classes").insert({ name: newClassName, class_code: newClassCode.toUpperCase(), school_year: newClassYear, teacher_id: session?.user.id }).select().single();
    if (!error && data) { setClasses(prev => [data, ...prev]); setSelectedClass(data); setShowNewClass(false); setNewClassName(""); setNewClassCode(""); }
    setSavingClass(false);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const path = `${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const createLesson = async () => {
    if (!selectedClass || !lessonTitle) return;
    setSavingLesson(true);
    let materialUrl = null, materialName = null;
    if (lessonFile) { materialUrl = await uploadFile(lessonFile, "club-materials"); materialName = lessonFile.name; }
    const { data, error } = await supabase.from("club_lessons").insert({ class_id: selectedClass.id, week_number: lessonWeek, title: lessonTitle, content: lessonContent, material_url: materialUrl, material_name: materialName }).select().single();
    if (!error && data) { setLessons(prev => [...prev, data].sort((a, b) => a.week_number - b.week_number)); setShowNewLesson(false); setLessonTitle(""); setLessonContent(""); setLessonFile(null); }
    setSavingLesson(false);
  };

  const createChallenge = async () => {
    if (!selectedClass || !challengeTitle) return;
    setSavingChallenge(true);
    const { data, error } = await supabase.from("club_challenges").insert({ class_id: selectedClass.id, week_number: challengeWeek, title: challengeTitle, description: challengeDesc, due_date: challengeDue || null }).select().single();
    if (!error && data) { setChallenges(prev => [...prev, data]); setShowNewChallenge(false); setChallengeTitle(""); setChallengeDesc(""); }
    setSavingChallenge(false);
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopiedCode(code); setTimeout(() => setCopiedCode(""), 2000); };
  const logout = async () => { await supabase.auth.signOut(); navigate("/club"); };

  const s = {
    page: { minHeight: "100vh", background: "#f7f5ff", fontFamily: "'Inter',sans-serif" } as React.CSSProperties,
    nav: { background: "#270F57", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" } as React.CSSProperties,
    body: { maxWidth: 1000, margin: "0 auto", padding: "32px 20px" } as React.CSSProperties,
    row: { display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" as const },
    card: { background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(39,15,87,0.07)", flex: 1 } as React.CSSProperties,
    tab: (active: boolean) => ({ padding: "8px 18px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: active ? "#270F57" : "#f0ebff", color: active ? "#fff" : "#270F57" }) as React.CSSProperties,
    btn: { padding: "10px 20px", borderRadius: 12, background: "#270F57", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" } as React.CSSProperties,
    btnSm: { padding: "7px 14px", borderRadius: 10, background: "#f4eaff", color: "#270F57", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" } as React.CSSProperties,
    input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0d4f5", fontSize: 13, boxSizing: "border-box" as const, marginBottom: 10, outline: "none" } as React.CSSProperties,
    label: { fontSize: 12, fontWeight: 600, color: "#270F57", display: "block", marginBottom: 4 } as React.CSSProperties,
    sectionTitle: { fontSize: 16, fontWeight: 700, color: "#270F57", marginBottom: 12 } as React.CSSProperties,
    pill: (role: string) => { const colors: Record<string, string> = { sales: "#dbeafe", marketing: "#fce7f3", technical: "#d1fae5", finance: "#fef3c7", operations: "#e0e7ff" }; return { background: colors[role] || "#f0ebff", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#270F57", display: "inline-block" } as React.CSSProperties; },
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><Loader2 className="animate-spin" size={32} color="#270F57" /></div>;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={{ color: "#fff9e9", fontWeight: 800, fontSize: 17 }}>👩‍🏫 Teacher Dashboard — KidsInBusiness</span>
        <button onClick={logout} style={{ background: "none", border: "none", color: "#c4a8e0", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><LogOut size={16} /> Αποσύνδεση</button>
      </nav>
      <div style={s.body}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c)} style={{ ...s.tab(selectedClass?.id === c.id), display: "flex", alignItems: "center", gap: 8 }}>
              {c.name} <span style={{ background: "#f4eaff", borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 800 }}>{c.class_code}</span>
            </button>
          ))}
          <button onClick={() => setShowNewClass(true)} style={s.btnSm}><Plus size={12} className="inline" /> Νέα Τάξη</button>
        </div>

        {showNewClass && (
          <div style={{ ...s.card, marginBottom: 20, border: "1.5px solid #c4a8e0", flex: "none" }}>
            <div style={s.sectionTitle}>Νέα Τάξη</div>
            <div style={s.row}>
              <div style={{ flex: 1 }}><label style={s.label}>Όνομα Τάξης</label><input style={s.input} value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="π.χ. Όμιλος Επιχειρηματικότητας Α" /></div>
              <div style={{ flex: 1 }}><label style={s.label}>Κωδικός (για μαθητές)</label><input style={{ ...s.input, textTransform: "uppercase", fontWeight: 700 }} value={newClassCode} onChange={e => setNewClassCode(e.target.value.toUpperCase())} placeholder="π.χ. ΕΠΙΧ2025" /></div>
              <div style={{ flex: 1 }}><label style={s.label}>Σχολικό Έτος</label><input style={s.input} value={newClassYear} onChange={e => setNewClassYear(e.target.value)} /></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn} onClick={createClass} disabled={savingClass}>{savingClass ? <Loader2 size={14} className="animate-spin inline" /> : "Δημιουργία"}</button>
              <button style={s.btnSm} onClick={() => setShowNewClass(false)}>Άκυρο</button>
            </div>
          </div>
        )}

        {selectedClass && (
          <>
            <div style={s.row}>
              <div style={{ ...s.card, background: "#270F57", color: "#fff9e9", flex: "0 0 auto" }}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>ΚΩΔΙΚΟΣ ΤΑΞΗΣ</div>
                <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "0.1em", marginBottom: 8 }}>{selectedClass.class_code}</div>
                <button onClick={() => copyCode(selectedClass.class_code)} style={{ background: "#fff3", border: "none", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {copiedCode === selectedClass.class_code ? <Check size={12} /> : <Copy size={12} />}
                  {copiedCode === selectedClass.class_code ? "Αντιγράφηκε!" : "Αντιγραφή"}
                </button>
              </div>
              <div style={s.card}><div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>ΜΑΘΗΤΕΣ</div><div style={{ fontSize: 28, fontWeight: 800, color: "#270F57" }}>{students.length}</div></div>
              <div style={s.card}><div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>ΜΑΘΗΜΑΤΑ</div><div style={{ fontSize: 28, fontWeight: 800, color: "#270F57" }}>{lessons.length}</div></div>
              <div style={s.card}><div style={{ fontSize: 11, color: "#765F8F", marginBottom: 4 }}>CHALLENGES</div><div style={{ fontSize: 28, fontWeight: 800, color: "#270F57" }}>{challenges.length}</div></div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {([["students","👥 Μαθητές"],["lessons","📚 Μαθήματα"],["challenges","⚡ Challenges"]] as [Tab,string][]).map(([t, label]) => (
                <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t as Tab)}>{label}</button>
              ))}
            </div>

            {tab === "students" && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Μαθητές ({students.length})</div>
                {students.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 32, color: "#765F8F" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                    Κανένας μαθητής ακόμα. Μοιράσου τον κωδικό <strong>{selectedClass.class_code}</strong>!
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 10 }}>
                    {students.map(st => (
                      <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#f7f5ff", borderRadius: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#270F57", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{st.full_name.charAt(0).toUpperCase()}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#270F57" }}>{st.full_name}</div>
                          <div style={{ fontSize: 12, color: "#765F8F" }}>{new Date(st.created_at).toLocaleDateString("el-GR")}</div>
                        </div>
                        {st.role ? <span style={s.pill(st.role)}>{ROLES.find(r => r.key === st.role)?.emoji} {st.role}</span> : <span style={{ fontSize: 11, color: "#999" }}>Χωρίς ρόλο</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "lessons" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={s.sectionTitle}>Εβδομαδιαία Μαθήματα</div>
                  <button style={s.btn} onClick={() => setShowNewLesson(true)}><Plus size={14} className="inline" /> Νέο Μάθημα</button>
                </div>
                {showNewLesson && (
                  <div style={{ ...s.card, marginBottom: 16, border: "1.5px solid #c4a8e0", flex: "none" }}>
                    <div style={s.sectionTitle}>Νέο Μάθημα</div>
                    <div style={s.row}>
                      <div style={{ flex: "0 0 100px" }}><label style={s.label}>Εβδομάδα</label><input style={s.input} type="number" min={1} value={lessonWeek} onChange={e => setLessonWeek(+e.target.value)} /></div>
                      <div style={{ flex: 1 }}><label style={s.label}>Τίτλος</label><input style={s.input} value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="π.χ. Τι είναι το Lean Canvas;" /></div>
                    </div>
                    <label style={s.label}>Περιεχόμενο / Σημειώσεις</label>
                    <textarea style={{ ...s.input, minHeight: 80, resize: "vertical" as const }} value={lessonContent} onChange={e => setLessonContent(e.target.value)} placeholder="Γράψε εδώ τις σημειώσεις..." />
                    <label style={s.label}>Αρχείο υλικού (PDF, PPTX, κλπ.)</label>
                    <input type="file" onChange={e => setLessonFile(e.target.files?.[0] || null)} style={{ marginBottom: 12 }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={s.btn} onClick={createLesson} disabled={savingLesson}>{savingLesson ? <Loader2 size={14} className="animate-spin inline" /> : "Αποθήκευση"}</button>
                      <button style={s.btnSm} onClick={() => setShowNewLesson(false)}>Άκυρο</button>
                    </div>
                  </div>
                )}
                <div style={{ display: "grid", gap: 12 }}>
                  {lessons.map(l => (
                    <div key={l.id} style={{ ...s.card, display: "flex", gap: 16, alignItems: "flex-start", flex: "none" }}>
                      <div style={{ background: "#270F57", color: "#fff", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{l.week_number}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#270F57", marginBottom: 4 }}>{l.title}</div>
                        {l.content && <div style={{ fontSize: 13, color: "#5a4070", marginBottom: 6 }}>{l.content}</div>}
                        {l.material_url && <a href={l.material_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#765F8F", textDecoration: "none", background: "#f4eaff", padding: "3px 10px", borderRadius: 8 }}>📎 {l.material_name || "Αρχείο"}</a>}
                      </div>
                    </div>
                  ))}
                  {lessons.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#765F8F" }}>Δεν υπάρχουν μαθήματα ακόμα.</div>}
                </div>
              </div>
            )}

            {tab === "challenges" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={s.sectionTitle}>Εβδομαδιαία Challenges</div>
                  <button style={s.btn} onClick={() => setShowNewChallenge(true)}><Plus size={14} className="inline" /> Νέο Challenge</button>
                </div>
                {showNewChallenge && (
                  <div style={{ ...s.card, marginBottom: 16, border: "1.5px solid #c4a8e0", flex: "none" }}>
                    <div style={s.sectionTitle}>Νέο Challenge</div>
                    <div style={s.row}>
                      <div style={{ flex: "0 0 100px" }}><label style={s.label}>Εβδομάδα</label><input style={s.input} type="number" min={1} value={challengeWeek} onChange={e => setChallengeWeek(+e.target.value)} /></div>
                      <div style={{ flex: 1 }}><label style={s.label}>Τίτλος Challenge</label><input style={s.input} value={challengeTitle} onChange={e => setChallengeTitle(e.target.value)} placeholder="π.χ. Συμπλήρωσε το Lean Canvas" /></div>
                      <div style={{ flex: "0 0 160px" }}><label style={s.label}>Ημερομηνία παράδοσης</label><input style={s.input} type="date" value={challengeDue} onChange={e => setChallengeDue(e.target.value)} /></div>
                    </div>
                    <label style={s.label}>Περιγραφή</label>
                    <textarea style={{ ...s.input, minHeight: 70, resize: "vertical" as const }} value={challengeDesc} onChange={e => setChallengeDesc(e.target.value)} placeholder="Τι πρέπει να κάνουν τα παιδιά..." />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button style={s.btn} onClick={createChallenge} disabled={savingChallenge}>{savingChallenge ? <Loader2 size={14} className="animate-spin inline" /> : "Αποθήκευση"}</button>
                      <button style={s.btnSm} onClick={() => setShowNewChallenge(false)}>Άκυρο</button>
                    </div>
                  </div>
                )}
                <div style={{ display: "grid", gap: 12 }}>
                  {challenges.map(c => (
                    <div key={c.id} style={{ ...s.card, display: "flex", gap: 16, alignItems: "flex-start", flex: "none" }}>
                      <div style={{ background: "#f4eaff", color: "#270F57", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>W{c.week_number}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#270F57", marginBottom: 4 }}>⚡ {c.title}</div>
                        {c.description && <div style={{ fontSize: 13, color: "#5a4070", marginBottom: 4 }}>{c.description}</div>}
                        {c.due_date && <div style={{ fontSize: 12, color: "#765F8F" }}>📅 {new Date(c.due_date).toLocaleDateString("el-GR")}</div>}
                      </div>
                    </div>
                  ))}
                  {challenges.length === 0 && <div style={{ textAlign: "center", padding: 32, color: "#765F8F" }}>Δεν υπάρχουν challenges ακόμα.</div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClubTeacher;
