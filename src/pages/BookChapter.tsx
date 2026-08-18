import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOOK_CHAPTERS } from "@/config/bookConfig";

const PROGRESS_KEY = "kib_book_progress_v1";

const GRAD_MAP: Record<string, string> = {
  "from-yellow-400 to-orange-400": "#facc15, #fb923c",
  "from-blue-400 to-cyan-400": "#60a5fa, #22d3ee",
  "from-green-400 to-emerald-500": "#4ade80, #10b981",
  "from-teal-400 to-green-500": "#2dd4bf, #22c55e",
  "from-pink-400 to-rose-500": "#f472b6, #f43f5e",
  "from-violet-400 to-purple-500": "#a78bfa, #a855f7",
  "from-amber-400 to-yellow-500": "#fbbf24, #eab308",
  "from-orange-400 to-red-400": "#fb923c, #f87171",
  "from-blue-500 to-indigo-500": "#3b82f6, #6366f1",
  "from-cyan-500 to-blue-500": "#06b6d4, #3b82f6",
  "from-red-400 to-orange-500": "#f87171, #f97316",
  "from-gray-500 to-slate-600": "#6b7280, #475569",
  "from-emerald-500 to-teal-500": "#10b981, #14b8a6",
  "from-red-500 to-pink-500": "#ef4444, #ec4899",
  "from-slate-500 to-gray-600": "#64748b, #4b5563",
  "from-purple-500 to-indigo-500": "#a855f7, #6366f1",
};

type Phase = "learn" | "quiz" | "activity" | "math" | "done";

const BookChapter = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chapterId = Number(id);
  const ch = BOOK_CHAPTERS.find((c) => c.id === chapterId);

  const [phase, setPhase] = useState<Phase>("learn");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activityChoice, setActivityChoice] = useState<string | null>(null);
  const [sortAssignments, setSortAssignments] = useState<Record<string, string>>({});
  const [sortChecked, setSortChecked] = useState(false);
  const [mathAnswers, setMathAnswers] = useState<string[]>([]);
  const [mathChecked, setMathChecked] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    if (!ch) return;
    setQuizAnswers(new Array(ch.quiz.length).fill(null));
    setMathAnswers(new Array(ch.mathChallenge.length).fill(""));
    setSortAssignments({});
    setSortChecked(false);
    try {
      const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      if (prog[ch.id]) setAlreadyDone(true);
    } catch {}
  }, [ch]);

  if (!ch) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff9e9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#270F57" }}>
          <div style={{ fontSize: 48 }}>📚</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 12 }}>Κεφάλαιο δεν βρέθηκε</div>
          <button onClick={() => navigate("/book")} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, background: "#270F57", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>← Πίσω</button>
        </div>
      </div>
    );
  }

  const grad = GRAD_MAP[ch.color] || "#765F8F, #270F57";
  const correctQuiz = quizAnswers.filter((a, i) => a === ch.quiz[i].correct).length;
  const quizScore = quizSubmitted ? Math.round((correctQuiz / ch.quiz.length) * 100) : 0;
  const mathCorrect = mathAnswers.filter((a, i) =>
    a.trim().replace(",", ".") === ch.mathChallenge[i].answer.replace(",", ".")
  ).length;

  const completeCh = () => {
    try {
      const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      prog[ch.id] = true;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
    } catch {}
    setPhase("done");
  };

  // Sort activity helpers
  const cats = ch.activity.categories || [];
  const allItems = ch.activity.items || [];
  const allAssigned = allItems.length > 0 && allItems.every(it => sortAssignments[it.label]);
  const sortScore = sortChecked ? allItems.filter(it => sortAssignments[it.label] === it.category).length : 0;

  const cycleItem = (label: string) => {
    if (sortChecked) return;
    setSortAssignments(prev => {
      const cur = prev[label];
      if (!cur) return { ...prev, [label]: cats[0] };
      const idx = cats.indexOf(cur);
      if (idx === cats.length - 1) {
        const next = { ...prev };
        delete next[label];
        return next;
      }
      return { ...prev, [label]: cats[idx + 1] };
    });
  };

  const getSortItemStyle = (label: string, itemCat: string): React.CSSProperties => {
    const assigned = sortAssignments[label];
    if (!assigned) return { background: "#f0e8ff", color: "#270F57", border: "2px solid #d8b4fe" };
    if (!sortChecked) {
      return assigned === cats[0]
        ? { background: "#dbeafe", color: "#1d4ed8", border: "2px solid #93c5fd" }
        : { background: "#fce7f3", color: "#9d174d", border: "2px solid #f9a8d4" };
    }
    const correct = assigned === itemCat;
    return correct
      ? { background: "#dcfce7", color: "#15803d", border: "2px solid #22c55e" }
      : { background: "#fee2e2", color: "#b91c1c", border: "2px solid #f87171" };
  };

  const s = {
    page: { minHeight: "100vh", background: "#fff9e9", fontFamily: "'Inter', sans-serif", paddingBottom: 60 } as React.CSSProperties,
    header: { background: `linear-gradient(135deg, ${grad})`, padding: "24px 20px 32px" } as React.CSSProperties,
    backBtn: { background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, padding: "6px 14px", borderRadius: 99, cursor: "pointer", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 4 } as React.CSSProperties,
    body: { padding: "24px 16px", maxWidth: 680, margin: "0 auto" },
    card: { background: "#fff", borderRadius: 18, padding: "24px", marginBottom: 16, boxShadow: "0 4px 16px rgba(39,15,87,0.07)" } as React.CSSProperties,
    cardTitle: { fontSize: 16, fontWeight: 800, color: "#270F57", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
    keyItem: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: "#270F57", lineHeight: 1.5 },
    bullet: { width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${grad})`, marginTop: 5, flexShrink: 0 },
    phaseTab: (active: boolean) => ({
      padding: "12px 16px", borderRadius: 14, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer",
      background: active ? "#270F57" : "#fff", color: active ? "#fff" : "#270F57",
      flex: 1, boxShadow: active ? "0 4px 12px rgba(39,15,87,0.25)" : "0 2px 8px rgba(39,15,87,0.08)",
      transition: "all 0.2s", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4,
    } as React.CSSProperties),
    quizQ: { fontSize: 15, fontWeight: 700, color: "#270F57", marginBottom: 12, lineHeight: 1.4 },
    optionBtn: (sel: boolean, correct: boolean | null, isCorrect: boolean) => {
      let bg = "#f4eaff", color = "#270F57", border = "2px solid transparent";
      if (sel && !quizSubmitted) { bg = "#e9d5ff"; border = "2px solid #765F8F"; }
      if (quizSubmitted && isCorrect) { bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; }
      if (quizSubmitted && sel && !isCorrect) { bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #f87171"; }
      return { display: "block", width: "100%", padding: "12px 14px", borderRadius: 12, marginBottom: 8, textAlign: "left" as const, fontWeight: 600, fontSize: 13, cursor: quizSubmitted ? "default" : "pointer", background: bg, color, border, transition: "all 0.15s" };
    },
    primaryBtn: { display: "block", width: "100%", padding: "15px", borderRadius: 14, background: "#270F57", color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", marginTop: 16 } as React.CSSProperties,
    activityOption: (sel: boolean) => ({ display: "block", width: "100%", padding: "14px 16px", borderRadius: 14, marginBottom: 10, textAlign: "left" as const, fontWeight: 600, fontSize: 13, cursor: "pointer", background: sel ? "#270F57" : "#f4eaff", color: sel ? "#fff" : "#270F57", border: sel ? "2px solid #270F57" : "2px solid transparent", lineHeight: 1.5 } as React.CSSProperties),
    mathInput: (correct: boolean | null) => ({ width: "100%", padding: "10px 14px", borderRadius: 10, border: correct === null ? "2px solid #e0d4f5" : correct ? "2px solid #22c55e" : "2px solid #f87171", fontSize: 15, fontWeight: 700, color: "#270F57", outline: "none", boxSizing: "border-box" as const, background: correct === null ? "#fff" : correct ? "#dcfce7" : "#fee2e2" } as React.CSSProperties),
  };

  const phaseConfig: { key: Phase; emoji: string; label: string }[] = [
    { key: "learn", emoji: "📚", label: "Μαθαίνω" },
    { key: "quiz", emoji: "❓", label: "Quiz" },
    { key: "activity", emoji: "🎯", label: "Δραστηριότητα" },
    { key: "math", emoji: "🔢", label: "Μαθηματικά" },
  ];

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/book")}>← Όλα τα κεφάλαια</button>
        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Κεφάλαιο {ch.id} · {ch.emoji}</div>
        <div style={{ color: "#fff", fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 }}>{ch.titleEl}</div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{ch.subtitleEl}</div>
        <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", borderRadius: 99, padding: "6px 16px", color: "#fff", fontWeight: 700, fontSize: 13 }}>
          🪙 {ch.coins} coins · {ch.badge} {ch.badgeName}
        </div>
        {alreadyDone && <div style={{ marginTop: 10, color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700 }}>✅ Έχεις ολοκληρώσει αυτό το κεφάλαιο!</div>}
      </div>

      {/* PHASE TABS */}
      {phase !== "done" && (
        <div style={{ display: "flex", gap: 8, padding: "16px 16px 0", maxWidth: 680, margin: "0 auto" }}>
          {phaseConfig.map((p) => (
            <button key={p.key} style={s.phaseTab(phase === p.key)} onClick={() => setPhase(p.key)}>
              <span style={{ fontSize: 18 }}>{p.emoji}</span>
              <span style={{ fontSize: 11 }}>{p.label}</span>
            </button>
          ))}
        </div>
      )}

      <div style={s.body}>
        {/* ── LEARN ── */}
        {phase === "learn" && (
          <>
            {ch.quote && (
              <div style={{ ...s.card, background: `linear-gradient(135deg, ${grad})`, color: "#fff" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.7, marginBottom: 10 }}>"{ch.quote.text}"</div>
                <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>— {ch.quote.author}</div>
              </div>
            )}
            <div style={s.card}>
              <div style={s.cardTitle}>🎯 Τι θα μάθεις</div>
              {ch.keyLearning.map((k, i) => (
                <div key={i} style={s.keyItem}><div style={s.bullet} /><span>{k}</span></div>
              ))}
            </div>
            <button style={s.primaryBtn} onClick={() => setPhase("quiz")}>Ξεκίνα το Quiz →</button>
          </>
        )}

        {/* ── QUIZ ── */}
        {phase === "quiz" && (
          <>
            {quizSubmitted && (
              <div style={{ ...s.card, background: quizScore >= 60 ? "#dcfce7" : "#fee2e2", border: `2px solid ${quizScore >= 60 ? "#22c55e" : "#f87171"}` }}>
                <div style={{ fontSize: 36, textAlign: "center", marginBottom: 8 }}>{quizScore >= 80 ? "🏆" : quizScore >= 60 ? "⭐" : "💪"}</div>
                <div style={{ textAlign: "center", fontWeight: 900, fontSize: 22, color: quizScore >= 60 ? "#15803d" : "#b91c1c" }}>{correctQuiz}/{ch.quiz.length} σωστά — {quizScore}%</div>
                <div style={{ textAlign: "center", fontSize: 13, color: "#555", marginTop: 6 }}>
                  {quizScore >= 80 ? "Τέλεια! Πάμε στη δραστηριότητα!" : quizScore >= 60 ? "Καλά! Μπορείς να συνεχίσεις." : "Διάβασε ξανά και ξαναδοκίμασε!"}
                </div>
              </div>
            )}
            {ch.quiz.map((q, qi) => (
              <div key={qi} style={s.card}>
                <div style={s.quizQ}>{qi + 1}. {q.question}</div>
                {q.options.map((opt, oi) => (
                  <button key={oi} style={s.optionBtn(quizAnswers[qi] === oi, quizSubmitted ? quizAnswers[qi] === q.correct : null, oi === q.correct)}
                    onClick={() => { if (quizSubmitted) return; const a = [...quizAnswers]; a[qi] = oi; setQuizAnswers(a); }}>
                    <strong>{["Α", "Β", "Γ", "Δ"][oi]}.</strong> {opt}
                    {quizSubmitted && oi === q.correct && " ✓"}
                    {quizSubmitted && quizAnswers[qi] === oi && oi !== q.correct && " ✗"}
                  </button>
                ))}
              </div>
            ))}
            {!quizSubmitted
              ? <button style={{ ...s.primaryBtn, opacity: quizAnswers.includes(null) ? 0.5 : 1 }} disabled={quizAnswers.includes(null)} onClick={() => setQuizSubmitted(true)}>Υποβολή Quiz</button>
              : <button style={s.primaryBtn} onClick={() => setPhase("activity")}>Δραστηριότητα →</button>
            }
          </>
        )}

        {/* ── ACTIVITY ── */}
        {phase === "activity" && (
          <>
            <div style={s.card}>
              <div style={s.cardTitle}>🎯 {ch.activity.title}</div>
              <div style={{ fontSize: 14, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>{ch.activity.instruction}</div>

              {/* SORT — interactive click-to-assign */}
              {ch.activity.type === "sort" && allItems.length > 0 && (
                <>
                  {/* Pool of unassigned items */}
                  {allItems.some(it => !sortAssignments[it.label]) && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#765F8F", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Κάνε κλικ σε κάθε κάρτα για να την τοποθετήσεις →</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {allItems.filter(it => !sortAssignments[it.label]).map((it, i) => (
                          <button key={i} onClick={() => cycleItem(it.label)}
                            style={{ padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#f0e8ff", color: "#270F57", border: "2px solid #d8b4fe", transition: "all 0.15s" }}>
                            {it.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Two columns */}
                  <div style={{ display: "flex", gap: 12 }}>
                    {cats.map((cat, ci) => {
                      const catItems = allItems.filter(it => sortAssignments[it.label] === cat);
                      const colColors = [
                        { bg: "#dbeafe", border: "#93c5fd", text: "#1d4ed8", headBg: "#2563eb" },
                        { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d", headBg: "#db2777" },
                      ];
                      const col = colColors[ci] || colColors[0];
                      return (
                        <div key={cat} style={{ flex: 1 }}>
                          <div style={{ background: col.headBg, color: "#fff", fontWeight: 800, fontSize: 13, padding: "8px 12px", borderRadius: "12px 12px 0 0", textAlign: "center" }}>{cat}</div>
                          <div style={{ background: col.bg, borderRadius: "0 0 12px 12px", border: `2px solid ${col.border}`, borderTop: "none", padding: 10, minHeight: 100 }}>
                            {catItems.length === 0 && (
                              <div style={{ color: col.text, opacity: 0.4, fontSize: 12, textAlign: "center", marginTop: 16 }}>Άδειο</div>
                            )}
                            {catItems.map((it, i) => {
                              const itemStyle = getSortItemStyle(it.label, it.category);
                              return (
                                <button key={i} onClick={() => cycleItem(it.label)}
                                  style={{ ...itemStyle, display: "block", width: "100%", padding: "7px 12px", borderRadius: 10, marginBottom: 6, fontSize: 12, fontWeight: 600, cursor: sortChecked ? "default" : "pointer", textAlign: "left" as const, transition: "all 0.15s" }}>
                                  {it.label}
                                  {sortChecked && (sortAssignments[it.label] === it.category ? " ✓" : " ✗")}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Check / result */}
                  {!sortChecked ? (
                    <button style={{ ...s.primaryBtn, opacity: allAssigned ? 1 : 0.5 }} disabled={!allAssigned} onClick={() => setSortChecked(true)}>
                      Έλεγχος Απαντήσεων ✓
                    </button>
                  ) : (
                    <>
                      <div style={{ textAlign: "center", fontWeight: 900, fontSize: 18, color: sortScore >= Math.ceil(allItems.length / 2) ? "#270F57" : "#b91c1c", margin: "16px 0 8px" }}>
                        {sortScore}/{allItems.length} σωστά {sortScore === allItems.length ? "🏆" : sortScore >= Math.ceil(allItems.length / 2) ? "⭐" : "💪"}
                      </div>
                      {sortScore >= Math.ceil(allItems.length / 2)
                        ? <button style={s.primaryBtn} onClick={() => setPhase("math")}>Μαθηματική Πρόκληση →</button>
                        : <div>
                            <div style={{ textAlign: "center", fontSize: 13, color: "#765F8F", marginBottom: 12 }}>Χρειάζεσαι τουλάχιστον {Math.ceil(allItems.length / 2)} σωστά για να συνεχίσεις!</div>
                            <button style={{ ...s.primaryBtn, background: "#765F8F" }} onClick={() => { setSortChecked(false); setSortAssignments({}); }}>🔄 Ξαναπροσπάθησε!</button>
                          </div>
                      }
                    </>
                  )}
                </>
              )}

              {/* CHOICE / BUDGET */}
              {(ch.activity.type === "choice" || ch.activity.type === "budget") && ch.activity.options?.map((opt, i) => (
                <button key={i} style={s.activityOption(activityChoice === opt)} onClick={() => setActivityChoice(opt)}>{opt}</button>
              ))}

              {/* INPUT */}
              {ch.activity.type === "input" && ch.activity.options?.map((label, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#270F57", marginBottom: 6 }}>{label}</div>
                  <input style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d4f5", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} placeholder={`${label}...`} />
                </div>
              ))}
            </div>

            {/* Continue button for non-sort */}
            {ch.activity.type !== "sort" && (
              <button style={s.primaryBtn} onClick={() => setPhase("math")}>Μαθηματική Πρόκληση →</button>
            )}
          </>
        )}

        {/* ── MATH ── */}
        {phase === "math" && (
          <div style={s.card}>
            <div style={s.cardTitle}>🔢 Μαθηματική Πρόκληση</div>
            {ch.mathChallenge.map((q, i) => {
              const val = mathAnswers[i];
              const correct = mathChecked ? val.trim().replace(",", ".") === q.answer.replace(",", ".") : null;
              return (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#270F57", marginBottom: 8, lineHeight: 1.5 }}>{i + 1}. {q.question}</div>
                  <input style={s.mathInput(correct)} type="text" inputMode="numeric" placeholder="Απάντηση..." value={val}
                    onChange={(e) => { const a = [...mathAnswers]; a[i] = e.target.value; setMathAnswers(a); setMathChecked(false); }} />
                  {mathChecked && (
                    <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600, color: correct ? "#15803d" : "#b91c1c" }}>
                      {correct ? "✓ Σωστό!" : `✗ Σωστό: ${q.answer}`}
                    </div>
                  )}
                </div>
              );
            })}
            {!mathChecked
              ? <button style={{ ...s.primaryBtn, opacity: mathAnswers.some(a => !a.trim()) ? 0.5 : 1 }} disabled={mathAnswers.some(a => !a.trim())} onClick={() => setMathChecked(true)}>Έλεγχος</button>
              : <div>
                  <div style={{ textAlign: "center", fontWeight: 900, fontSize: 18, color: "#270F57", marginBottom: 16 }}>{mathCorrect}/{ch.mathChallenge.length} σωστά {mathCorrect === ch.mathChallenge.length ? "🏆" : "💪"}</div>
                  <button style={s.primaryBtn} onClick={completeCh}>🎉 Ολοκλήρωση Κεφαλαίου → +{ch.coins} coins</button>
                </div>
            }
          </div>
        )}

        {/* ── DONE ── */}
        {phase === "done" && (
          <div style={{ ...s.card, textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>{ch.badge}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#270F57", marginBottom: 8 }}>Μπράβο! Κέρδισες το badge</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#765F8F", marginBottom: 24 }}>{ch.badgeName}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${grad})`, borderRadius: 99, padding: "12px 28px", color: "#fff", fontWeight: 900, fontSize: 22, marginBottom: 28 }}>
              🪙 +{ch.coins} coins!
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {ch.id < 16 && (
                <button style={{ padding: "12px 28px", borderRadius: 14, background: "#270F57", color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
                  onClick={() => navigate(`/book/${ch.id + 1}`)}>Επόμενο Κεφάλαιο →</button>
              )}
              <button style={{ padding: "12px 28px", borderRadius: 14, background: "#f4eaff", color: "#270F57", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
                onClick={() => navigate("/book")}>Όλα τα κεφάλαια</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookChapter;
