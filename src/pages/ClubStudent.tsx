import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, ExternalLink } from "lucide-react";

type Tab = "lessons" | "challenges" | "leancanvas" | "pitch";
interface StudentSession { id: string; name: string; role: string | null; classId: string; className: string; }

const ROLES = [
  { key: "sales", label: "Sales", emoji: "💼", desc: "Πωλήσεις & εξεύρεση πελατών" },
  { key: "marketing", label: "Marketing", emoji: "📣", desc: "Επικοινωνία & προώθηση" },
  { key: "technical", label: "Technical", emoji: "⚙️", desc: "Τεχνολογία & υλοποίηση" },
  { key: "finance", label: "Finance", emoji: "💰", desc: "Οικονομικά & κόστος" },
  { key: "operations", label: "Operations", emoji: "📋", desc: "Οργάνωση & λειτουργία" },
];

const LEAN_FIELDS = [
  { key: "problem", label: "Πρόβλημα", emoji: "🔍", hint: "Ποιο πρόβλημα λύνεις;" },
  { key: "solution", label: "Λύση", emoji: "💡", hint: "Ποια είναι η λύση σου;" },
  { key: "unique_value_prop", label: "Μοναδική Αξία", emoji: "⭐", hint: "Τι σε κάνει μοναδικό;" },
  { key: "customer_segments", label: "Πελάτες", emoji: "👥", hint: "Ποιοι είναι οι πελάτες σου;" },
  { key: "channels", label: "Κανάλια", emoji: "📡", hint: "Πώς θα φτάσεις τους πελάτες;" },
  { key: "revenue_streams", label: "Έσοδα", emoji: "💰", hint: "Πώς θα βγάλεις χρήματα;" },
  { key: "cost_structure", label: "Κόστος", emoji: "📊", hint: "Ποια είναι τα κόστη;" },
  { key: "key_metrics", label: "Μετρικές", emoji: "📈", hint: "Πώς θα μετράς επιτυχία;" },
  { key: "unfair_advantage", label: "Πλεονέκτημα", emoji: "🏆", hint: "Τι δεν μπορεί να αντιγράψει κανείς;" },
];

const ClubStudent = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<StudentSession | null>(null);
  const [tab, setTab] = useState<Tab>("lessons");
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any>>({});
  const [canvas, setCanvas] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState({ content: "", logo_url: "" });
  const [canvasId, setCanvasId] = useState<string | null>(null);
  const [pitchId, setPitchId] = useState<string | null>(null);
  const [savingCanvas, setSavingCanvas] = useState(false);
  const [savingPitch, setSavingPitch] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<any | null>(null);
  const [submitText, setSubmitText] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [choosingRole, setChoosingRole] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("club_student");
    if (!raw) { navigate("/club"); return; }
    const s: StudentSession = JSON.parse(raw);
    setSession(s); loadData(s);
  }, []);

  const loadData = async (s: StudentSession) => {
    const [lr, cr, sr, cvr, pr] = await Promise.all([
      supabase.from("club_lessons").select("*").eq("class_id", s.classId).order("week_number"),
      supabase.from("club_challenges").select("*").eq("class_id", s.classId).order("week_number"),
      supabase.from("club_submissions").select("*").eq("student_id", s.id),
      supabase.from("club_lean_canvas").select("*").eq("student_id", s.id).single(),
      supabase.from("club_pitches").select("*").eq("student_id", s.id).single(),
    ]);
    setLessons(lr.data || []); setChallenges(cr.data || []);
    const m: Record<string, any> = {}; (sr.data || []).forEach((x: any) => { m[x.challenge_id] = x; }); setSubmissions(m);
    if (cvr.data) { setCanvasId(cvr.data.id); const { id, student_id, updated_at, ...f } = cvr.data; setCanvas(f); }
    if (pr.data) { setPitchId(pr.data.id); setPitch({ content: pr.data.content || "", logo_url: pr.data.logo_url || "" }); }
    setLoading(false);
  };

  const pickRole = async (role: string) => {
    if (!session) return;
    await supabase.from("club_students").update({ role }).eq("id", session.id);
    const u = { ...session, role }; setSession(u); localStorage.setItem("club_student", JSON.stringify(u)); setChoosingRole(false);
  };

  const saveCanvas = async () => {
    if (!session) return; setSavingCanvas(true);
    if (canvasId) { await supabase.from("club_lean_canvas").update({ ...canvas, updated_at: new Date().toISOString() }).eq("id", canvasId); }
    else { const { data } = await supabase.from("club_lean_canvas").insert({ student_id: session.id, ...canvas }).select().single(); if (data) setCanvasId(data.id); }
    setSavingCanvas(false); setSavedMsg("✅ Αποθηκεύτηκε!"); setTimeout(() => setSavedMsg(""), 2500);
  };

  const savePitch = async () => {
    if (!session) return; setSavingPitch(true);
    if (pitchId) { await supabase.from("club_pitches").update({ content: pitch.content, logo_url: pitch.logo_url, updated_at: new Date().toISOString() }).eq("id", pitchId); }
    else { const { data } = await supabase.from("club_pitches").insert({ student_id: session.id, content: pitch.content, logo_url: pitch.logo_url }).select().single(); if (data) setPitchId(data.id); }
    setSavingPitch(false); setSavedMsg("✅ Αποθηκεύτηκε!"); setTimeout(() => setSavedMsg(""), 2500);
  };

  const uploadLogo = async () => {
    if (!logoFile || !session) return; setUploadingLogo(true);
    const path = `logos/${session.id}_${Date.now()}_${logoFile.name}`;
    const { error } = await supabase.storage.from("club-logos").upload(path, logoFile);
    if (!error) { const { data } = supabase.storage.from("club-logos").getPublicUrl(path); setPitch(prev => ({ ...prev, logo_url: data.publicUrl })); }
    setUploadingLogo(false);
  };

  const submitChallenge = async () => {
    if (!session || !activeChallenge) return; setSubmitting(true);
    let fileUrl = null, fileName = null;
    if (submitFile) {
      const path = `submissions/${session.id}_${Date.now()}_${submitFile.name}`;
      const { error: e } = await supabase.storage.from("club-materials").upload(path, submitFile);
      if (!e) { const { data } = supabase.storage.from("club-materials").getPublicUrl(path); fileUrl = data.publicUrl; fileName = submitFile.name; }
    }
    const { data } = await supabase.from("club_submissions").upsert({ student_id: session.id, challenge_id: activeChallenge.id, content: submitText, file_url: fileUrl, file_name: fileName, submitted_at: new Date().toISOString() }, { onConflict: "student_id,challenge_id" }).select().single();
    if (data) setSubmissions(prev => ({ ...prev, [activeChallenge.id]: data }));
    setSubmitting(false); setActiveChallenge(null); setSubmitText(""); setSubmitFile(null);
    setSavedMsg("✅ Υποβλήθηκε!"); setTimeout(() => setSavedMsg(""), 2500);
  };

  const logout = () => { localStorage.removeItem("club_student"); navigate("/club"); };

  const s = {
    page: { minHeight: "100vh", background: "#f7f5ff", fontFamily: "'Inter',sans-serif" } as React.CSSProperties,
    nav: { background: "#270F57", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" } as React.CSSProperties,
    body: { maxWidth: 860, margin: "0 auto", padding: "28px 16px" } as React.CSSProperties,
    card: { background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 2px 12px rgba(39,15,87,0.07)" } as React.CSSProperties,
    tab: (a: boolean) => ({ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: a ? "#270F57" : "#f0ebff", color: a ? "#fff" : "#270F57" }) as React.CSSProperties,
    btn: { padding: "10px 20px", borderRadius: 12, background: "#270F57", color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" } as React.CSSProperties,
    btnSm: { padding: "7px 14px", borderRadius: 10, background: "#f4eaff", color: "#270F57", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" } as React.CSSProperties,
    inp: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #e0d4f5", fontSize: 13, boxSizing: "border-box" as const, marginBottom: 10, outline: "none", background: "#fff" } as React.CSSProperties,
    lbl: { fontSize: 12, fontWeight: 600, color: "#270F57", display: "block", marginBottom: 4 } as React.CSSProperties,
    h: { fontSize: 16, fontWeight: 700, color: "#270F57", marginBottom: 12 } as React.CSSProperties,
    pill: (r: string) => { const c: Record<string,string> = { sales:"#dbeafe", marketing:"#fce7f3", technical:"#d1fae5", finance:"#fef3c7", operations:"#e0e7ff" }; return { background: c[r]||"#f0ebff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#270F57", display: "inline-block" } as React.CSSProperties; },
  };

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}><Loader2 className="animate-spin" size={32} color="#270F57" /></div>;
  if (!session) return null;
  const ri = ROLES.find(r => r.key === session.role);

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"#f4eaff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#270F57", fontSize:16 }}>{session.name.charAt(0).toUpperCase()}</div>
          <div><div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{session.name}</div><div style={{ color:"#c4a8e0", fontSize:12 }}>{session.className}</div></div>
          {session.role && <span style={{ ...s.pill(session.role), marginLeft:8 }}>{ri?.emoji} {ri?.label}</span>}
        </div>
        <button onClick={logout} style={{ background:"none", border:"none", color:"#c4a8e0", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:13 }}><LogOut size={15} /> Έξοδος</button>
      </nav>
      <div style={s.body}>
        {!session.role && !choosingRole && (
          <div style={{ ...s.card, marginBottom:20, background:"#270F57", color:"#fff9e9" }}>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:8 }}>👋 Καλώς ήρθες, {session.name.split(" ")[0]}!</div>
            <div style={{ fontSize:14, marginBottom:16, opacity:0.8 }}>Επίλεξε τον ρόλο σου στην ομάδα:</div>
            <button onClick={() => setChoosingRole(true)} style={{ ...s.btn, background:"#fff9e9", color:"#270F57" }}>🎯 Επιλογή Ρόλου</button>
          </div>
        )}
        {choosingRole && (
          <div style={{ ...s.card, marginBottom:20 }}>
            <div style={s.h}>Επίλεξε τον ρόλο σου</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
              {ROLES.map(r => <button key={r.key} onClick={() => pickRole(r.key)} style={{ padding:"16px 12px", borderRadius:14, border:"2px solid #e0d4f5", background:"#f7f5ff", cursor:"pointer", textAlign:"left" as const }}><div style={{ fontSize:22, marginBottom:6 }}>{r.emoji}</div><div style={{ fontWeight:700, color:"#270F57", fontSize:13 }}>{r.label}</div><div style={{ fontSize:11, color:"#765F8F", marginTop:4 }}>{r.desc}</div></button>)}
            </div>
          </div>
        )}
        {savedMsg && <div style={{ background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:10, padding:"10px 16px", fontSize:13, marginBottom:16, color:"#065f46" }}>{savedMsg}</div>}
        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" as const }}>
          {([["lessons","📚 Μαθήματα"],["challenges","⚡ Challenges"],["leancanvas","🧩 Lean Canvas"],["pitch","🎤 Pitch"]] as [Tab,string][]).map(([t,l]) => <button key={t} style={s.tab(tab===t)} onClick={() => setTab(t)}>{l}</button>)}
        </div>
        {tab === "lessons" && <div style={{ display:"grid", gap:12 }}>
          {lessons.length === 0 && <div style={{ ...s.card, textAlign:"center", padding:40, color:"#765F8F" }}>Δεν υπάρχουν μαθήματα ακόμα.</div>}
          {lessons.map(l => <div key={l.id} style={{ ...s.card, display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ background:"#270F57", color:"#fff", borderRadius:10, width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, flexShrink:0 }}>{l.week_number}</div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#270F57", fontSize:15, marginBottom:4 }}>{l.title}</div>{l.content && <div style={{ fontSize:13, color:"#5a4070", lineHeight:1.6, marginBottom:8 }}>{l.content}</div>}{l.material_url && <a href={l.material_url} target="_blank" rel="noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"#270F57", textDecoration:"none", background:"#f4eaff", padding:"5px 12px", borderRadius:8 }}>📎 {l.material_name||"Υλικό"} <ExternalLink size={11} /></a>}</div>
          </div>)}
        </div>}
        {tab === "challenges" && <div>
          {activeChallenge && <div style={{ ...s.card, marginBottom:16, border:"1.5px solid #c4a8e0" }}>
            <div style={s.h}>⚡ {activeChallenge.title}</div>
            {activeChallenge.description && <div style={{ fontSize:13, color:"#5a4070", marginBottom:12 }}>{activeChallenge.description}</div>}
            <label style={s.lbl}>Η απάντησή σου</label>
            <textarea style={{ ...s.inp, minHeight:80, resize:"vertical" as const }} value={submitText} onChange={e => setSubmitText(e.target.value)} placeholder="Γράψε την απάντησή σου..." />
            <label style={s.lbl}>Αρχείο (προαιρετικό)</label>
            <input type="file" onChange={e => setSubmitFile(e.target.files?.[0]||null)} style={{ marginBottom:12 }} />
            <div style={{ display:"flex", gap:10 }}>
              <button style={s.btn} onClick={submitChallenge} disabled={submitting}>{submitting ? <Loader2 size={14} className="animate-spin inline" /> : "Υποβολή →"}</button>
              <button style={s.btnSm} onClick={() => setActiveChallenge(null)}>Άκυρο</button>
            </div>
          </div>}
          <div style={{ display:"grid", gap:12 }}>
            {challenges.length === 0 && <div style={{ ...s.card, textAlign:"center", padding:40, color:"#765F8F" }}>Δεν υπάρχουν challenges ακόμα.</div>}
            {challenges.map(c => { const sub = submissions[c.id]; return <div key={c.id} style={{ ...s.card, display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ background:sub?"#d1fae5":"#f4eaff", color:"#270F57", borderRadius:10, width:42, height:42, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, flexShrink:0 }}>{sub ? "✅" : `W${c.week_number}`}</div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, color:"#270F57", marginBottom:4 }}>⚡ {c.title}</div>{c.description && <div style={{ fontSize:13, color:"#5a4070", marginBottom:6 }}>{c.description}</div>}{c.due_date && <div style={{ fontSize:12, color:"#765F8F", marginBottom:6 }}>📅 {new Date(c.due_date).toLocaleDateString("el-GR")}</div>}{sub ? <div style={{ fontSize:12, color:"#059669", fontWeight:600 }}>✅ Υποβλήθηκε</div> : <button style={s.btnSm} onClick={() => { setActiveChallenge(c); setSubmitText(""); setSubmitFile(null); }}>Υποβολή →</button>}</div>
            </div>; })}
          </div>
        </div>}
        {tab === "leancanvas" && <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={s.h}>🧩 Lean Canvas</div>
            <button style={s.btn} onClick={saveCanvas} disabled={savingCanvas}>{savingCanvas ? <Loader2 size={14} className="animate-spin inline" /> : "Αποθήκευση"}</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:12 }}>
            {LEAN_FIELDS.map(f => <div key={f.key} style={s.card}>
              <label style={{ ...s.lbl, fontSize:13, marginBottom:6 }}>{f.emoji} {f.label}</label>
              <div style={{ fontSize:11, color:"#765F8F", marginBottom:8 }}>{f.hint}</div>
              <textarea style={{ ...s.inp, minHeight:80, resize:"vertical" as const, marginBottom:0 }} value={canvas[f.key]||""} onChange={e => setCanvas(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.hint} />
            </div>)}
          </div>
          <div style={{ textAlign:"right", marginTop:16 }}><button style={s.btn} onClick={saveCanvas} disabled={savingCanvas}>{savingCanvas ? <Loader2 size={14} className="animate-spin inline" /> : "💾 Αποθήκευση"}</button></div>
        </div>}
        {tab === "pitch" && <div style={{ display:"grid", gap:16 }}>
          <div style={s.card}>
            <div style={s.h}>🎤 Το Pitch μου</div>
            <label style={s.lbl}>Γράψε το elevator pitch σου</label>
            <textarea style={{ ...s.inp, minHeight:140, resize:"vertical" as const }} value={pitch.content} onChange={e => setPitch(prev => ({ ...prev, content: e.target.value }))} placeholder="Γεια! Το προϊόν μου είναι..." />
            <button style={s.btn} onClick={savePitch} disabled={savingPitch}>{savingPitch ? <Loader2 size={14} className="animate-spin inline" /> : "💾 Αποθήκευση"}</button>
          </div>
          <div style={s.card}>
            <div style={s.h}>🎨 Λογότυπο</div>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" as const }}>
              {pitch.logo_url && <img src={pitch.logo_url} alt="Logo" style={{ width:100, height:100, objectFit:"contain", borderRadius:12, border:"1.5px solid #e0d4f5" }} />}
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, color:"#765F8F", marginBottom:10 }}>Σχεδίασε στο <a href="https://www.canva.com" target="_blank" rel="noreferrer" style={{ color:"#270F57", fontWeight:700 }}>Canva ↗</a> και ανέβασε εδώ.</div>
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0]||null)} style={{ marginBottom:10 }} />
                {logoFile && <button style={s.btn} onClick={uploadLogo} disabled={uploadingLogo}>{uploadingLogo ? <Loader2 size={14} className="animate-spin inline" /> : "⬆️ Ανέβασμα"}</button>}
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default ClubStudent;
