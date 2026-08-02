import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BOOK_CHAPTERS, TOTAL_COINS } from "@/config/bookConfig";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface BookProgress {
  chapter_id: number;
  completed: boolean;
  quiz_score: number;
  coins_earned: number;
}

// Chapters 1-3 are free, 4-16 require book code
const FREE_CHAPTERS = 3;

export default function BookDashboard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<BookProgress[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [childName, setChildName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCode, setHasCode] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  // Audio source — update path when file is ready
  const AUTHOR_AUDIO_SRC = "/author-message.mp3";

  useEffect(() => {
    loadProgress();
    if (!localStorage.getItem("intro_seen")) {
      setShowIntro(true);
    }
  }, []);

  const loadProgress = async () => {
    setAuthLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setIsLoggedIn(true);
      setIsFounder(user.email === "kidsinbusinessgr@gmail.com");

      // Load profile (name + code)
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles" as any)
        .select("full_name, book_code")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile load error:", profileError);
      }

      if (profile) {
        setChildName((profile as any).full_name || user.email?.split("@")[0] || "Μικρός Επενδυτής");
        setHasCode(!!(profile as any).book_code);
      } else {
        setChildName(user.email?.split("@")[0] || "Μικρός Επενδυτής");
        // Fallback: check directly if user has activated a code
        const { data: rows } = await supabase
          .from("user_profiles" as any)
          .select("book_code")
          .eq("id", user.id);
        if (rows && rows.length > 0 && (rows[0] as any).book_code) {
          setHasCode(true);
        }
      }

      // Load progress
      const { data } = await supabase
        .from("book_progress" as any)
        .select("*")
        .eq("user_id", user.id);
      if (data) {
        setProgress(data as BookProgress[]);
        setTotalCoins((data as BookProgress[]).reduce((s, p) => s + (p.coins_earned || 0), 0));
      }
    } else {
      setIsLoggedIn(false);
      // Guest: load from localStorage, only free chapters tracked
      const stored = localStorage.getItem("book_progress");
      if (stored) {
        const parsed: BookProgress[] = JSON.parse(stored);
        setProgress(parsed);
        setTotalCoins(parsed.reduce((s, p) => s + (p.coins_earned || 0), 0));
      }
    }
    setAuthLoading(false);
  };

  const handleChapterClick = (chapterId: number, isUnlocked: boolean) => {
    if (!isUnlocked) return;

    // Chapters 4-16 require login + code
    if (chapterId > FREE_CHAPTERS) {
      if (!isLoggedIn) {
        navigate("/book-login");
        return;
      }
      if (!hasCode) {
        navigate("/activate");
        return;
      }
    }
    navigate(`/book/${chapterId}`);
  };

  const getChapterProgress = (chapterId: number): BookProgress | undefined =>
    progress.find((p) => p.chapter_id === chapterId);

  const completedCount = progress.filter((p) => p.completed).length;
  const overallPercent = Math.round((completedCount / BOOK_CHAPTERS.length) * 100);

  const islands = [
    { name: "Το Νησί της Ανακάλυψης", emoji: "🏝️", chapters: BOOK_CHAPTERS.slice(0, 4) },
    { name: "Το Νησί της Σοφίας", emoji: "🌴", chapters: BOOK_CHAPTERS.slice(4, 8) },
    { name: "Το Νησί του Χρήματος", emoji: "⛵", chapters: BOOK_CHAPTERS.slice(8, 12) },
    { name: "Το Νησί των Επενδυτών", emoji: "🏆", chapters: BOOK_CHAPTERS.slice(12, 16) },
  ];

  const dismissIntro = () => {
    localStorage.setItem("intro_seen", "1");
    setShowIntro(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Intro Modal — first visit only */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="text-4xl">🎧</div>
              <h2 className="text-xl font-bold text-gray-800">Μήνυμα από τη συγγραφέα</h2>
              <p className="text-sm text-gray-500">Σταυρούλα Αρνιθενού</p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-center">
              Αγαπητέ μικρέ επενδυτή, καλωσόρισες! Αγόρασες το βιβλίο{" "}
              <span className="font-semibold">«Μικροί Επενδυτές, Μεγάλο Μέλλον»</span> και με τον
              κωδικό που βρήκες μέσα, ξεκλείδωσες αυτή την πλατφόρμα. Εδώ θα ταξιδέψεις σε 4
              νησιά γνώσης, θα λύσεις κουίζ και θα μαζέψεις νομίσματα. Πριν ξεκινήσεις, άκου
              ένα μικρό μήνυμά μου!
            </p>
            <audio
              controls
              className="w-full rounded-lg"
              src={AUTHOR_AUDIO_SRC}
            >
              Ο browser σου δεν υποστηρίζει audio.
            </audio>
            <button
              onClick={dismissIntro}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition"
            >
              Ξεκινάω την περιπέτεια! 🚀
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-bold text-lg text-gray-800">📚 Μικροί Επενδυτές, Μεγάλο Μέλλον</h1>
              {isLoggedIn && childName ? (
                <p className="text-xs text-gray-500">Γεια σου, {childName}!</p>
              ) : (
                <p className="text-xs text-gray-500">Καλωσόρισες!</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {isFounder && (
                  <button
                    onClick={() => navigate("/book-admin")}
                    className="text-xs text-purple-600 border border-purple-200 rounded-full px-3 py-1 hover:bg-purple-50"
                  >
                    📊 Dashboard
                  </button>
                )}
                <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold text-yellow-700 text-lg">{totalCoins}</span>
                  <span className="text-xs text-yellow-600">/ {TOTAL_COINS}</span>
                </div>
                <button
                  onClick={async () => { await supabase.auth.signOut(); loadProgress(); }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Έξοδος
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/book-login")}
                className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Σύνδεση / Εγγραφή
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Banner for guests */}
        {!authLoading && !isLoggedIn && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎉</div>
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">Καλωσόρισες στο βιβλίο!</h2>
                <p className="text-sm opacity-90 mb-3">
                  Τα <strong>3 πρώτα κεφάλαια είναι δωρεάν</strong>. Για να ξεκλειδώσεις όλα τα κεφάλαια χρειάζεσαι τον κωδικό από το βιβλίο.
                </p>
                <button
                  onClick={() => navigate("/book-login")}
                  className="bg-white text-purple-700 font-bold px-5 py-2 rounded-xl text-sm hover:bg-purple-50"
                >
                  Εγγραφή / Σύνδεση →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner for logged-in but no code */}
        {!authLoading && isLoggedIn && !hasCode && (
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔑</div>
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">Ξεκλείδωσε όλα τα κεφάλαια!</h2>
                <p className="text-sm opacity-90 mb-3">
                  Βρες τον κωδικό στο εσωτερικό εξώφυλλο του βιβλίου σου.
                </p>
                <button
                  onClick={() => navigate("/activate")}
                  className="bg-white text-orange-700 font-bold px-5 py-2 rounded-xl text-sm hover:bg-orange-50"
                >
                  Εισαγωγή κωδικού →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overall Progress */}
        {(isLoggedIn || completedCount > 0) && (
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-800">Η πρόοδός σου</h2>
                <p className="text-sm text-gray-500">{completedCount} από {BOOK_CHAPTERS.length} κεφάλαια ολοκληρωμένα</p>
              </div>
              <div className="text-3xl font-black text-purple-600">{overallPercent}%</div>
            </div>
            <Progress value={overallPercent} className="h-3" />
            {completedCount > 0 && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Τα badges σου:</p>
                <div className="flex flex-wrap gap-2">
                  {BOOK_CHAPTERS.filter((c) => getChapterProgress(c.id)?.completed).map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-3 py-1 text-xs font-medium text-purple-700">
                      {c.badge} {c.badgeName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Islands */}
        {islands.map((island, islandIdx) => {
          const islandUnlocked = islandIdx === 0 || islands[islandIdx - 1].chapters.every(
            (c) => getChapterProgress(c.id)?.completed
          );
          const islandCompleted = island.chapters.filter((c) => getChapterProgress(c.id)?.completed).length;

          return (
            <div key={island.name} className={`space-y-3 ${!islandUnlocked ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{island.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{island.name}</h3>
                  <p className="text-xs text-gray-500">
                    {islandUnlocked
                      ? `${islandCompleted}/${island.chapters.length} ολοκληρωμένα`
                      : "🔒 Ολοκλήρωσε το προηγούμενο νησί πρώτα"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {island.chapters.map((chapter, chIdx) => {
                  const prog = getChapterProgress(chapter.id);
                  const isCompleted = !!prog?.completed;
                  const globalIdx = islandIdx * 4 + chIdx;
                  const isUnlocked = globalIdx === 0 || getChapterProgress(BOOK_CHAPTERS[globalIdx - 1].id)?.completed;

                  // Code-locked: chapters 4+ need code
                  const needsCode = chapter.id > FREE_CHAPTERS && (!isLoggedIn || !hasCode);

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter.id, !!isUnlocked)}
                      disabled={!isUnlocked && !needsCode}
                      className={`
                        relative rounded-2xl p-4 text-left transition-all
                        ${isCompleted
                          ? `bg-gradient-to-br ${chapter.color} text-white shadow-md`
                          : needsCode
                            ? "bg-white border-2 border-dashed border-purple-200 hover:border-purple-400 cursor-pointer"
                            : isUnlocked
                              ? "bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-md cursor-pointer"
                              : "bg-gray-50 border border-gray-100 cursor-not-allowed"
                        }
                      `}
                    >
                      {/* Completion lock */}
                      {!isUnlocked && !needsCode && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                          <span className="text-2xl">🔒</span>
                        </div>
                      )}

                      {/* Code lock overlay */}
                      {needsCode && !isCompleted && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-purple-50/90">
                          <span className="text-2xl mb-1">🔑</span>
                          <span className="text-xs font-semibold text-purple-600 text-center px-1">
                            {isLoggedIn ? "Εισαγωγή κωδικού" : "Εγγραφή"}
                          </span>
                        </div>
                      )}

                      <div className="text-2xl mb-2">{chapter.emoji}</div>
                      <div className={`text-xs font-semibold mb-1 ${isCompleted ? "text-white/80" : "text-gray-500"}`}>
                        Κεφάλαιο {chapter.id}
                      </div>
                      <div className={`text-sm font-bold leading-tight ${isCompleted ? "text-white" : "text-gray-800"}`}>
                        {chapter.titleEl}
                      </div>
                      <div className={`mt-2 text-xs flex items-center gap-1 ${isCompleted ? "text-white/90" : "text-yellow-600"}`}>
                        <span>🪙</span>
                        {isCompleted ? `+${prog?.coins_earned || chapter.coins}` : `${chapter.coins} coins`}
                      </div>
                      {isCompleted && prog?.quiz_score !== undefined && (
                        <div className="mt-1 text-xs text-white/80">Quiz: {prog.quiz_score}/5 ✓</div>
                      )}
                      {isCompleted && (
                        <div className="absolute top-2 right-2 text-lg">{chapter.badge}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Completion banner */}
        {completedCount === BOOK_CHAPTERS.length && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center text-white shadow-lg">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-black mb-2">Συγχαρητήρια!</h2>
            <p className="text-lg font-medium mb-1">Ολοκλήρωσες το βιβλίο!</p>
            <p className="text-sm opacity-90">Κέρδισες {totalCoins} coins και {BOOK_CHAPTERS.length} badges!</p>
            <p className="mt-3 text-sm opacity-80">Είσαι πλέον επίσημος <strong>Μικρός Επενδυτής</strong> 🌟</p>
          </div>
        )}

        {/* Market Game CTA */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center">
          <div className="text-4xl mb-2">🏪</div>
          <h3 className="font-black text-lg mb-1">Η Μικρή Αγορά</h3>
          <p className="text-sm opacity-90 mb-4">Εφάρμοσε αυτά που έμαθες σε πραγματικές καταστάσεις!</p>
          <button
            onClick={() => {
              if (!isLoggedIn) { navigate("/book-login"); return; }
              navigate("/market-game");
            }}
            className="bg-white text-emerald-700 font-bold px-6 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Παίξε τώρα! 🚀
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 pb-4">
          Βιβλίο: "Μικροί Επενδυτές, Μεγάλο Μέλλον" • Αρνιθενού Σταυρούλα, Μαθηματικός MSc
        </div>
      </div>
    </div>
  );
}
