import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BOOK_CHAPTERS } from "@/config/bookConfig";

const PROGRESS_KEY = "kib_book_progress_v1";
const ANSWERS_KEY = "kib_book_answers_v1";

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
  const [mathAnswers, setMathAnswers] = useState<string[]>([]);
  const [mathChecked, setMathChecked] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  useEffect(() => {
    if (!ch) return;
    setQuizAnswers(new Array(ch.quiz.length).fill(null));
    setMathAnswers(new Array(ch.mathChallenge.length).fill(""));
    try {
      const prog = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      if (prog[ch.id]) setAlreadyDone(true);
    } catch {}
  }, [ch]);

  if (!ch) {
    return (
      <div style={{ minHeight: "100vh", background: "#fff9e9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", color: "#270F57" }}>
          <div style={{ fontSize: 48 }}>ð</div>
          <div style={{ fontWeight: 800, fontSize: 20, marginTop: 12 }}>ÎÎµÏÎ¬Î»Î±Î¹Î¿ Î´ÎµÎ½ Î²ÏÎ­Î¸Î·ÎºÎµ</div>
          <button onClick={() => navigate("/book")} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 12, background: "#270F57", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>
            â Î Î¯ÏÏ
          </button>
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

  const s = {
    page: { minHeight: "100vh", background: "#fff9e9", fontFamily: "'Inter', sans-serif", paddingBottom: 60 } as React.CSSProperties,
    header: {
      background: `linear-gradient(135deg, ${grad})`,
      padding: "24px 20px 32px",
    } as React.CSSProperties,
    backBtn: {
      background: "rgba(255,255,255,0.2)",
      border: "none",
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
      padding: "6px 14px",
      borderRadius: 99,
      cursor: "pointer",
      marginBottom: 16,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    } as React.CSSProperties,
    chNum: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 4 },
    title: { color: "#fff", fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 4 },
    sub: { color: "rgba(255,255,255,0.8)", fontSize: 14 },
    coinsBadge: {
      marginTop: 16,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "rgba(255,255,255,0.2)",
      borderRadius: 99,
      padding: "6px 16px",
      color: "#fff",
      fontWeight: 700,
      fontSize: 13,
    } as React.CSSProperties,
    body: { padding: "24px 16px", maxWidth: 680, margin: "0 auto" },
    card: { background: "#fff", borderRadius: 18, padding: "24px", marginBottom: 16, boxShadow: "0 4px 16px rgba(39,15,87,0.07)" } as React.CSSProperties,
    cardTitle: { fontSize: 16, fontWeight: 800, color: "#270F57", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 },
    keyItem: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: "#270F57", lineHeight: 1.5 },
    bullet: { width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${grad})`, marginTop: 5, flexShrink: 0 },
    phaseBtn: (active: boolean) => ({
      padding: "10px 20px",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: 14,
      border: "none",
      cursor: "pointer",
      background: active ? "#270F57" : "#f4eaff",
      color: active ? "#fff" : "#270F57",
      flex: 1,
    } as React.CSSProperties),
    quizQ: { fontSize: 15, fontWeight: 700, color: "#270F57", marginBottom: 12, lineHeight: 1.4 },
    optionBtn: (sel: boolean, correct: boolean | null, isCorrect: boolean) => {
      let bg = "#f4eaff";
      let color = "#270F57";
      let border = "2px solid transparent";
      if (sel && !quizSubmitted) { bg = "#e9d5ff"; border = "2px solid #765F8F"; }
      if (quizSubmitted && isCorrect) { bg = "#dcfce7"; color = "#15803d"; border = "2px solid #22c55e"; }
      if (quizSubmitted && sel && !isCorrect) { bg = "#fee2e2"; color = "#b91c1c"; border = "2px solid #f87171"; }
      return { display: "block", width: "100%", padding: "11px 14px", borderRadius: 12, marginBottom: 8, textAlign: "left" as const, fontWeight: 600, fontSize: 13, cursor: quizSubmitted ? "default" : "pointer", background: bg, color, border, transition: "all 0.15s" };
    },
    primaryBtn: {
      display: "block",
      width: "100%",
      padding: "14px",
      borderRadius: 14,
      background: "#270F57",
      color: "#fff",
      fontWeight: 800,
      fontSize: 15,
      border: "none",
      cursor: "pointer",
      marginTop: 16,
    } as React.CSSProperties,
    activityOption: (sel: boolean) => ({
      display: "block",
      width: "100%",
      padding: "14px 16px",
      borderRadius: 14,
      marginBottom: 10,
      textAlign: "left" as const,
      fontWeight: 600,
      fontSize: 13,
      cursor: "pointer",
      background: sel ? "#270F57" : "#f4eaff",
      color: sel ? "#fff" : "#270F57",
      border: sel ? "2px solid #270F57" : "2px solid transparent",
      lineHeight: 1.5,
    } as React.CSSProperties),
    sortItem: (cat: string) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 14px",
      borderRadius: 99,
      margin: "4px",
      fontSize: 12,
      fontWeight: 600,
      background: cat === (ch.activity.categories?.[0] || "") ? "#dbeafe" : "#fce7f3",
      color: cat === (ch.activity.categories?.[0] || "") ? "#1d4ed8" : "#9d174d",
    } as React.CSSProperties),
    mathInput: (correct: boolean | null) => ({
      width: "100%",
      padding: "10px 14px",
      borderRadius: 10,
      border: correct === null ? "2px solid #e0d4f5" : correct ? "2px solid #22c55e" : "2px solid #f87171",
      fontSize: 15,
      fontWeight: 700,
      color: "#270F57",
      outline: "none",
      boxSizing: "border-box" as const,
      background: correct === null ? "#fff" : correct ? "#dcfce7" : "#fee2e2",
    } as React.CSSProperties),
    doneBox: {
      textAlign: "center" as const,
      padding: "40px 20px",
    },
  };

  const phaseLabel: Record<Phase, string> = {
    learn: "ð ÎÎ±Î¸Î±Î¯Î½Ï",
    quiz: "â Quiz",
    activity: "ð¯ ÎÏÎ±ÏÏÎ·ÏÎ¹ÏÏÎ·ÏÎ±",
    math: "ð¢ ÎÎ±Î¸Î·Î¼Î±ÏÎ¹ÎºÎ¬",
    done: "â Î¤Î­Î»Î¿Ï",
  };

  // Phase nav tabs
  const phases: Phase[] = ["learn", "quiz", "activity", "math"];
  const phaseIdx = phases.indexOf(phase);

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate("/book")}>â ÎÎ»Î± ÏÎ± ÎºÎµÏÎ¬Î»Î±Î¹Î±</button>
        <div style={s.chNum}>ÎÎµÏÎ¬Î»Î±Î¹Î¿ {ch.id} Â· {ch.emoji}</div>
        <div style={s.title}>{ch.titleEl}</div>
        <div style={s.sub}>{ch.subtitleEl}</div>
        <div style={s.coinsBadge}>ðª {ch.coins} coins Â· {ch.badge} {ch.badgeName}</div>
        {alreadyDone && <div style={{ marginTop: 10, color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700 }}>â ÎÏÎµÎ¹Ï Î¿Î»Î¿ÎºÎ»Î·ÏÏÏÎµÎ¹ Î±ÏÏÏ ÏÎ¿ ÎºÎµÏÎ¬Î»Î±Î¹Î¿!</div>}
      </div>

      {phase !== "done" && (
        <div style={{ display: "flex", gap: 8, padding: "16px 16px 0", maxWidth: 680, margin: "0 auto", flexWrap: "wrap" }}>
          {phases.map((p, i) => (
            <button key={p} style={s.phaseBtn(phase === p)} onClick={() => setPhase(p)}>
              {phaseLabel[p]}
            </button>
          ))}
        </div>
      )}

      <div style={s.body}>
        {/* ââââ LEARN ââââ */}
        {phase === "learn" && (
          <>
            {ch.quote && (
              <div style={{ ...s.card, background: `linear-gradient(135deg, ${grad})`, color: "#fff" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>ð¬</div>
                <div style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.6, marginBottom: 8 }}>"{ch.quote.text}"</div>
                <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>â {ch.quote.author}</div>
              </div>
            )}
            <div style={s.card}>
              <div style={s.cardTitle}>ð¯ Î¤Î¹ Î¸Î± Î¼Î¬Î¸ÎµÎ¹Ï</div>
              {ch.keyLearning.map((k, i) => (
                <div key={i} style={s.keyItem}>
                  <div style={s.bullet} />
                  <span>{k}</span>
                </div>
              ))}
            </div>
            <button style={s.primaryBtn} onClick={() => setPhase("quiz")}>
              ÎÎµÎºÎ¯Î½Î± ÏÎ¿ Quiz â
            </button>
          </>
        )}

        {/* ââââ QUIZ ââââ */}
        {phase === "quiz" && (
          <>
            {quizSubmitted && (
              <div style={{ ...s.card, background: quizScore >= 60 ? "#dcfce7" : "#fee2e2", border: `2px solid ${quizScore >= 60 ? "#22c55e" : "#f87171"}` }}>
                <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>{quizScore >= 80 ? "ð" : quizScore >= 60 ? "â­" : "ðª"}</div>
                <div style={{ textAlign: "center", fontWeight: 900, fontSize: 20, color: quizScore >= 60 ? "#15803d" : "#b91c1c" }}>
                  {correctQuiz}/{ch.quiz.length} ÏÏÏÏÎ¬ â {quizScore}%
                </div>
                <div style={{ textAlign: "center", fontSize: 13, color: "#555", marginTop: 4 }}>
                  {quizScore >= 80 ? "Î¤Î­Î»ÎµÎ¹Î±! Î Î¬Î¼Îµ ÏÏÎ· Î´ÏÎ±ÏÏÎ·ÏÎ¹ÏÏÎ·ÏÎ±!" : quizScore >= 60 ? "ÎÎ±Î»Î¬! ÎÏÎ¿ÏÎµÎ¯Ï Î½Î± Î´Î¿ÎºÎ¹Î¼Î¬ÏÎµÎ¹Ï Î¾Î±Î½Î¬ Î® Î½Î± ÏÏÎ½ÎµÏÎ¯ÏÎµÎ¹Ï." : "ÎÎ¹Î¬Î²Î±ÏÎµ Î¾Î±Î½Î¬ ÎºÎ±Î¹ Î¾Î±Î½Î±Î´Î¿ÎºÎ¯Î¼Î±ÏÎµ!"}
                </div>
              </div>
            )}

            {ch.quiz.map((q, qi) => (
              <div key={qi} style={s.card}>
                <div style={s.quizQ}>{qi + 1}. {q.question}</div>
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    style={s.optionBtn(quizAnswers[qi] === oi, quizSubmitted ? quizAnswers[qi] === q.correct : null, oi === q.correct)}
                    onClick={() => {
                      if (quizSubmitted) return;
                      const a = [...quizAnswers];
                      a[qi] = oi;
                      setQuizAnswers(a);
                    }}
                  >
                    {["Î", "Î", "Î", "Î"][oi]}. {opt}
                    {quizSubmitted && oi === q.correct && " â"}
                    {quizSubmitted && quizAnswers[qi] === oi && oi !== q.correct && " â"}
                  </button>
                ))}
              </div>
            ))}

            {!quizSubmitted ? (
              <button
                style={{ ...s.primaryBtn, opacity: quizAnswers.includes(null) ? 0.5 : 1 }}
                disabled={quizAnswers.includes(null)}
                onClick={() => setQuizSubmitted(true)}
              >
                Î¥ÏÎ¿Î²Î¿Î»Î® Quiz
              </button>
            ) : (
              <button style={s.primaryBtn} onClick={() => setPhase("activity")}>
                ÎÏÎ±ÏÏÎ·ÏÎ¹ÏÏÎ·ÏÎ± â
              </button>
            )}
          </>
        )}

        {/* ââââ ACTIVITY ââââ */}
        {phase === "activity" && (
          <>
            <div style={s.card}>
    À0        <div style={s.cardTitle}>ð¯ {ch.activity.title}</div>
              <div style={{ fontSize: 14, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>{ch.activity.instruction}</div>

              {/* SORT */}
              {ch.activity.type === "sort" && ch.activity.items && (
                <div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {ch.activity.categories?.map((cat) => (
                      <div key={cat} style={{ flex: 1, minWidth: 140 }}>
                        <div style={{ fontWeight: 800, fontSize: 13, color: "#270F57", marginBottom: 8, textAlign: "center" }}>{cat}</div>
                        <div style={{ background: "#f4eaff", borderRadius: 12, padding: "10px", minHeight: 80 }}>
                          {ch.activity.items?.filter((it) => it.category === cat).map((it, i) => (
                            <div key={i} style={s.sortItem(cat)}>{it.label}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#765F8F", marginTop: 12, textAlign: "center" }}>ÎÎ¹ ÎºÎ±ÏÎ·Î³Î¿ÏÎ¯ÎµÏ ÏÎ±ÏÎ¿ÏÏÎ¹Î¬Î¶Î¿Î½ÏÎ±Î¹ Î®Î´Î· ÏÎ±Î¾Î¹Î½Î¿Î¼Î·Î¼Î­Î½ÎµÏ.</div>
                </div>
              )}

              {/* CHOICE or BUDGET */}
              {(ch.activity.type === "choice" || ch.activity.type === "budget") && ch.activity.options?.map((opt, i) => (
    À0          <button key={i} style={s.activityOption(activityChoice === opt)} onClick={() => setActivityChoice(opt)}>
                  {opt}
                </button>
              ))}

              {/* INPUT */}
              {ch.activity.type === "input" && ch.activity.options?.map((label, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#270F57", marginBottom: 6 }}>{label}</div>
                  <input style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0d4f5", fontSize: 14, outline: "none", boxSizing: "border-box" as const }} placeholder={`${label}...`} />
                </div>
              ))}
            </div>

            <button style={s.primaryBtn} onClick={() => setPhase("math")}>
              ÎÎ±Î¸Î·Î¼Î±ÏÎ¹ÎºÎ® Î ÏÏÎºÎ»Î·ÏÎ· â
            </button>
          </>
        )}

        {/* ââââ MATH ââââ */}
        {phase === "math" && (
          <>
            <div style={s.card}>
              <div style={s.cardTitle}>ð¢ ÎÎ±Î¸Î·Î¼Î±ÏÎ¹ÎºÎ® Î ÏÏÎºÎ»Î·ÏÎ·</div>
              {ch.mathChallenge.map((q, i) => {
                const val = mathAnswers[i];
                const correct = mathChecked ? val.trim().replace(",", ".") === q.answer.replace(",", ".") : null;
                return (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#270F57", marginBottom: 8, lineHeight: 1.5 }}>
                      {i + 1}. {q.question}
                    </div>
                    <input
                      style={s.mathInput(correct)}
                      type="text"
                      inputMode="numeric"
                      placeholder="ÎÏÎ¬Î½ÏÎ·ÏÎ·..."
                      value={val}
                      onChange={(e) => {
                        const a = [...mathAnswers];
                        a[i] = e.target.value;
                        setMathAnswers(a);
                        setMathChecked(false);
                      }}
                    />
                    {mathChecked && (
                      <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600, color: correct ? "#15803d" : "#b91c1c" }}>
                        {correct ? "â Î£ÏÏÏÏ!" : `â Î£ÏÏÏÏ: ${q.answer}`}
                      </div>
                    )}
                  </div>
                );
              })}

              {!mathChecked ? (
                <button
                  style={{ ...s.primaryBtn, opacity: mathAnswers.some((a) => !a.trim()) ? 0.5 : 1 }}
                  disabled={mathAnswers.some((a) => !a.trim())}
                  onClick={() => setMathChecked(true)}
                >
                  ÎÎ»ÎµÎ³ÏÎ¿Ï
                </button>
              ) : (
                <div>
                  <div style={{ textAlign: "center", fontWeight: 900, fontSize: 18, color: "#270F57", marginBottom: 16 }}>
                    {mathCorrect}/{ch.mathChallenge.length} ÏÏÏÏÎ¬ {mathCorrect === ch.mathChallenge.length ? "ð" : "ðª"}
                  </div>
                  <button style={s.primaryBtn} onClick={completeCh}>
                    ð ÎÎ»Î¿ÎºÎ»Î®ÏÏÏÎ· ÎÎµÏÎ±Î»Î±Î¯Î¿Ï â +{ch.coins} coins
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ââââ DONE ââââ */}
        {phase === "done" && (
          <div style={{ ...s.card, ...s.doneBox }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{ch.badge}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#270F57", marginBottom: 8 }}>
              ÎÏÏÎ¬Î²Î¿! ÎÎ­ÏÎ´Î¹ÏÎµÏ ÏÎ¿ badge
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#765F8F", marginBottom: 20 }}>
              {ch.badgeName}
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${grad})`, borderRadius: 99, padding: "12px 28px", color: "#fff", fontWeight: 900, fontSize: 20, marginBottom: 24 }}>
              ðª +{ch.coins} coins!
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {ch.id < 16 && (
                <button
                  style={{ padding: "12px 24px", borderRadius: 14, background: "#270F57", color: "#fff", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
                  onClick={() => navigate(`/book/${ch.id + 1}`)}
                >
                  ÎÏÏÎ¼ÎµÎ½Î¿ ÎÎµÏÎ¬Î»Î±Î¹Î¿ â
                </button>
              )}
              <button
                style={{ padding: "12px 24px", borderRadius: 14, background: "#f4eaff", color: "#270F57", fontWeight: 800, fontSize: 14, border: "none", cursor: "pointer" }}
                onClick={() => navigate("/book")}
              >
                ÎÎ»Î± ÏÎ± ÎºÎµÏÎ¬Î»Î±Î¹Î±
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookChapter;
