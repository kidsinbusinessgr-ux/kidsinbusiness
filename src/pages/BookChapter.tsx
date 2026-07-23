import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BOOK_CHAPTERS, BookChapter as BookChapterType } from "@/config/bookConfig";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type Phase = "intro" | "quiz" | "activity" | "complete";

export default function BookChapter() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chapter = BOOK_CHAPTERS.find((c) => c.id === parseInt(id || "1"));

  const [phase, setPhase] = useState<Phase>("intro");
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null, null]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [activityChoice, setActivityChoice] = useState<string | null>(null);
  const [sortItems, setSortItems] = useState<{ [key: string]: string[] }>({});
  const [mathAnswers, setMathAnswers] = useState<string[]>(["", ""]);
  const [mathChecked, setMathChecked] = useState([false, false]);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  // Reset all state when chapter id changes
  useEffect(() => {
    setPhase("intro");
    setQuizAnswers([null, null, null, null, null]);
    setQuizSubmitted(false);
    setQuizScore(0);
    setCurrentQ(0);
    setActivityChoice(null);
    setMathAnswers(["", ""]);
    setMathChecked([false, false]);
    setCoinsEarned(0);
    setCelebrating(false);
  }, [id]);

  useEffect(() => {
    if (!chapter) return;
    // Initialize sort activity
    if (chapter.activity.type === "sort" && chapter.activity.categories) {
      const init: { [key: string]: string[] } = {};
      chapter.activity.categories.forEach((cat) => { init[cat] = []; });
      setSortItems(init);
    }
  }, [chapter]);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Κεφάλαιο δεν βρέθηκε.</p>
          <Button onClick={() => navigate("/book")}>← Πίσω</Button>
        </div>
      </div>
    );
  }

  // --- QUIZ LOGIC ---
  const handleQuizAnswer = (answerIdx: number) => {
    if (quizSubmitted) return;
    const updated = [...quizAnswers];
    updated[currentQ] = answerIdx;
    setQuizAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (currentQ < chapter.quiz.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit quiz
      const score = quizAnswers.filter((a, i) => a === chapter.quiz[i].correct).length;
      setQuizScore(score);
      setQuizSubmitted(true);
    }
  };

  const handleQuizDone = () => setPhase("activity");

  // --- ACTIVITY LOGIC ---
  const handleSortDrop = (item: string, category: string) => {
    setSortItems((prev) => {
      const updated = { ...prev };
      // Remove from all categories first
      Object.keys(updated).forEach((cat) => {
        updated[cat] = updated[cat].filter((i) => i !== item);
      });
      updated[category] = [...updated[category], item];
      return updated;
    });
  };

  const handleActivityDone = async () => {
    // Calculate coins: base + quiz bonus
    const quizBonus = Math.round((quizScore / 5) * chapter.coins * 0.5);
    const baseCoins = Math.round(chapter.coins * 0.5);
    const total = baseCoins + quizBonus;
    setCoinsEarned(total);
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 2000);

    // Save progress
    await saveProgress(total);
    setPhase("complete");
  };

  const saveProgress = async (coins: number) => {
    const { data: { user } } = await supabase.auth.getUser();

    const record = {
      chapter_id: chapter.id,
      completed: true,
      quiz_score: quizScore,
      coins_earned: coins,
    };

    if (user) {
      await supabase
        .from("book_progress" as any)
        .upsert({ ...record, user_id: user.id }, { onConflict: "user_id,chapter_id" });
    } else {
      // Guest: save to localStorage
      const stored = localStorage.getItem("book_progress");
      const parsed = stored ? JSON.parse(stored) : [];
      const filtered = parsed.filter((p: any) => p.chapter_id !== chapter.id);
      filtered.push(record);
      localStorage.setItem("book_progress", JSON.stringify(filtered));
    }
  };

  const checkMath = (idx: number) => {
    const checked = [...mathChecked];
    checked[idx] = true;
    setMathChecked(checked);
  };

  const isMathCorrect = (idx: number) => {
    const ans = mathAnswers[idx].trim().replace(",", ".");
    const correct = chapter.mathChallenge[idx].answer.replace(",", ".");
    return ans === correct;
  };

  // =====================
  //  RENDER: INTRO
  // =====================
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Back */}
          <button onClick={() => navigate("/book")} className="text-gray-500 hover:text-gray-700 text-sm mb-4 block">
            ← Πίσω στον χάρτη
          </button>

          {/* Chapter hero */}
          <div className={`bg-gradient-to-br ${chapter.color} rounded-3xl p-8 text-white text-center shadow-xl mb-6`}>
            <div className="text-6xl mb-4">{chapter.emoji}</div>
            <div className="text-sm font-medium opacity-80 mb-1">Κεφάλαιο {chapter.id}</div>
            <h1 className="text-2xl font-black mb-2">{chapter.titleEl}</h1>
            <p className="text-sm opacity-90">{chapter.subtitleEl}</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <span>🪙</span>
              <span className="font-bold">Κερδίζεις έως {chapter.coins} coins!</span>
            </div>
          </div>

          {/* Key Learnings */}
          <div className="bg-white rounded-2xl border p-5 mb-4 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">📖 Τι θα μάθεις:</h2>
            <ul className="space-y-2">
              {chapter.keyLearning.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          {chapter.quote && (
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-4">
              <p className="text-sm italic text-purple-800">"{chapter.quote.text}"</p>
              <p className="text-xs text-purple-600 mt-1 font-medium">— {chapter.quote.author}</p>
            </div>
          )}

          <Button
            onClick={() => setPhase("quiz")}
            className={`w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r ${chapter.color} border-0 text-white shadow-lg`}
          >
            Ξεκινάμε! 🚀
          </Button>
        </div>
      </div>
    );
  }

  // =====================
  //  RENDER: QUIZ
  // =====================
  if (phase === "quiz") {
    const q = chapter.quiz[currentQ];
    const progress = ((currentQ + (quizSubmitted ? 1 : 0)) / chapter.quiz.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button onClick={() => setPhase("intro")} className="text-gray-500 hover:text-gray-700 text-sm mb-4 block">
            ← Πίσω
          </button>

          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">🧠 Quiz — Κεφάλαιο {chapter.id}</h2>
              {!quizSubmitted && (
                <span className="text-sm text-gray-500">{currentQ + 1} / {chapter.quiz.length}</span>
              )}
            </div>
            <Progress value={progress} className="h-2 mb-4" />

            {!quizSubmitted ? (
              <>
                <p className="font-semibold text-gray-800 mb-4 text-lg">{q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuizAnswer(i)}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all font-medium
                        ${quizAnswers[currentQ] === i
                          ? "border-purple-500 bg-purple-50 text-purple-800"
                          : "border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50/50"
                        }
                      `}
                    >
                      <span className="inline-block w-7 h-7 rounded-full bg-white border border-current mr-2 text-center text-sm leading-7">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleNextQuestion}
                  disabled={quizAnswers[currentQ] === null}
                  className={`w-full mt-4 bg-gradient-to-r ${chapter.color} border-0 text-white`}
                >
                  {currentQ < chapter.quiz.length - 1 ? "Επόμενη ερώτηση →" : "Τέλος Quiz ✓"}
                </Button>
              </>
            ) : (
              /* Results */
              <div className="text-center py-4">
                <div className="text-6xl mb-4">
                  {quizScore >= 4 ? "🎉" : quizScore >= 3 ? "👍" : "💪"}
                </div>
                <h3 className="text-2xl font-black mb-2">
                  {quizScore} / {chapter.quiz.length} σωστές!
                </h3>
                <p className="text-gray-500 mb-4">
                  {quizScore === 5 ? "Τέλειο! Γνωρίζεις τα πάντα! 🌟" :
                    quizScore >= 4 ? "Πολύ καλά! Συνέχισε έτσι!" :
                      quizScore >= 3 ? "Καλά! Με λίγη εξάσκηση γίνεσαι άριστος!" :
                        "Θα τα καταφέρεις! Διάβασε ξανά και δοκίμασε!"}
                </p>

                {/* Review wrong answers */}
                <div className="text-left space-y-3 mb-4">
                  {chapter.quiz.map((q2, i) => {
                    const isCorrect = quizAnswers[i] === q2.correct;
                    return (
                      <div key={i} className={`p-3 rounded-xl ${isCorrect ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                        <p className="text-sm font-medium text-gray-700">{q2.question}</p>
                        <p className={`text-xs mt-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {isCorrect ? "✓" : "✗"} Σωστό: {q2.options[q2.correct]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleQuizDone}
                  className={`w-full bg-gradient-to-r ${chapter.color} border-0 text-white`}
                >
                  Συνέχεια στη Δραστηριότητα →
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =====================
  //  RENDER: ACTIVITY
  // =====================
  if (phase === "activity") {
    const act = chapter.activity;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <button onClick={() => setPhase("quiz")} className="text-gray-500 hover:text-gray-700 text-sm mb-4 block">
            ← Πίσω
          </button>

          {/* Activity card */}
          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-4">
            <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${chapter.color} text-white rounded-full px-4 py-1.5 text-sm font-bold mb-4`}>
              🎮 Δραστηριότητα
            </div>
            <h2 className="font-bold text-xl text-gray-800 mb-2">{act.title}</h2>
            <p className="text-gray-600 text-sm mb-5">{act.instruction}</p>

            {/* SORT activity */}
            {act.type === "sort" && act.items && act.categories && (
              <div>
                {/* Unsorted pool */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Αντικείμενα (πάτα για να τα κατηγοριοποιήσεις):</p>
                  <div className="flex flex-wrap gap-2">
                    {act.items
                      .filter((item) => !Object.values(sortItems).flat().includes(item.label))
                      .map((item) => (
                        <span key={item.label} className="text-xs bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 font-medium">
                          {item.label}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 gap-3">
                  {act.categories.map((cat) => (
                    <div key={cat} className="border-2 border-dashed border-gray-200 rounded-xl p-3 min-h-[80px]">
                      <p className="text-xs font-bold text-gray-500 mb-2">{cat}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(sortItems[cat] || []).map((label) => {
                          const correctCat = act.items?.find((i) => i.label === label)?.category;
                          const isRight = correctCat === cat;
                          return (
                            <span
                              key={label}
                              onClick={() => {
                                // Move back to pool
                                setSortItems((prev) => {
                                  const updated = { ...prev };
                                  updated[cat] = updated[cat].filter((i) => i !== label);
                                  return updated;
                                });
                              }}
                              className={`text-xs rounded-lg px-2 py-1 cursor-pointer font-medium border ${
                                isRight ? "bg-green-100 border-green-300 text-green-800" : "bg-red-100 border-red-300 text-red-800"
                              }`}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                      {/* Drop targets */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {act.items
                          ?.filter((item) => !Object.values(sortItems).flat().includes(item.label))
                          .slice(0, 3)
                          .map((item) => (
                            <button
                              key={`${cat}-${item.label}`}
                              onClick={() => handleSortDrop(item.label, cat)}
                              className="text-xs bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg px-2 py-1"
                            >
                              + {item.label.slice(0, 15)}{item.label.length > 15 ? "…" : ""}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHOICE activity */}
            {act.type === "choice" && act.options && (
              <div className="space-y-3">
                {act.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setActivityChoice(opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                      activityChoice === opt
                        ? "border-purple-500 bg-purple-50 text-purple-800"
                        : "border-gray-100 bg-gray-50 hover:border-purple-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* BUDGET activity */}
            {act.type === "budget" && act.options && (
              <div className="space-y-3">
                {act.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setActivityChoice(opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                      activityChoice === opt
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-gray-100 bg-gray-50 hover:border-green-200"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT activity */}
            {act.type === "input" && act.options && (
              <div className="space-y-3">
                {act.options.map((label, i) => (
                  <div key={i}>
                    <label className="text-xs font-medium text-gray-500 block mb-1">{label}</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
                      placeholder={`Γράψε ${label.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Math Challenge */}
          <div className="bg-white rounded-2xl shadow-sm border p-5 mb-4">
            <h2 className="font-bold text-gray-800 mb-3">🔢 Μαθηματικές Προκλήσεις</h2>
            {chapter.mathChallenge.map((mc, i) => (
              <div key={i} className={`mb-4 p-4 rounded-xl bg-blue-50 border border-blue-100`}>
                <p className="text-sm font-medium text-gray-800 mb-3">{mc.question}</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={mathAnswers[i]}
                    onChange={(e) => {
                      const updated = [...mathAnswers];
                      updated[i] = e.target.value;
                      setMathAnswers(updated);
                    }}
                    disabled={mathChecked[i]}
                    className="border border-blue-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-400"
                    placeholder="Απάντηση"
                  />
                  {!mathChecked[i] ? (
                    <Button
                      size="sm"
                      onClick={() => checkMath(i)}
                      disabled={!mathAnswers[i]}
                      className="text-xs"
                    >
                      Έλεγξε
                    </Button>
                  ) : (
                    <span className={`text-sm font-bold ${isMathCorrect(i) ? "text-green-600" : "text-red-600"}`}>
                      {isMathCorrect(i) ? "✓ Σωστό!" : `✗ Σωστό: ${mc.answer}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleActivityDone}
            className={`w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r ${chapter.color} border-0 text-white shadow-lg`}
          >
            Ολοκλήρωσα! Δώσε μου τα coins! 🪙
          </Button>
        </div>
      </div>
    );
  }

  // =====================
  //  RENDER: COMPLETE
  // =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        {celebrating && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🎉</div>
          </div>
        )}

        <div className={`bg-gradient-to-br ${chapter.color} rounded-3xl p-8 text-white shadow-xl mb-6`}>
          <div className="text-6xl mb-4">{chapter.badge}</div>
          <h1 className="text-2xl font-black mb-2">Κεφάλαιο Ολοκληρώθηκε!</h1>
          <p className="opacity-90 mb-4">"{chapter.badgeName}" ξεκλειδώθηκε!</p>

          <div className="bg-white/20 rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-80">Quiz</span>
              <span className="font-bold">{quizScore}/5</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-80">Δραστηριότητα</span>
              <span className="font-bold">✓</span>
            </div>
            <div className="border-t border-white/30 pt-2 flex justify-between items-center">
              <span className="font-bold">Coins που κέρδισες</span>
              <span className="text-2xl font-black">🪙 {coinsEarned}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {chapter.id < BOOK_CHAPTERS.length && (
            <Button
              onClick={() => navigate(`/book/${chapter.id + 1}`)}
              className="w-full py-4 text-base font-bold rounded-2xl"
            >
              Επόμενο Κεφάλαιο →
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate("/book")}
            className="w-full rounded-2xl"
          >
            ← Πίσω στον Χάρτη
          </Button>
        </div>
      </div>
    </div>
  );
}
