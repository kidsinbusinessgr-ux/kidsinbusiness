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

export default function BookDashboard() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<BookProgress[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [childName, setChildName] = useState("Μικρός Επενδυτής");

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const namePart = user.email?.split("@")[0] || "Μικρός Επενδυτής";
      setChildName(namePart);
      const { data } = await supabase
        .from("book_progress" as any)
        .select("*")
        .eq("user_id", user.id);
      if (data) {
        setProgress(data as BookProgress[]);
        setTotalCoins((data as BookProgress[]).reduce((s, p) => s + (p.coins_earned || 0), 0));
      }
    } else {
      const stored = localStorage.getItem("book_progress");
      if (stored) {
        const parsed: BookProgress[] = JSON.parse(stored);
        setProgress(parsed);
        setTotalCoins(parsed.reduce((s, p) => s + (p.coins_earned || 0), 0));
      }
    }
  };

  const getChapterProgress = (chapterId: number): BookProgress | undefined =>
    progress.find((p) => p.chapter_id === chapterId);

  const completedCount = progress.filter((p) => p.completed).length;
  const overallPercent = Math.round((completedCount / BOOK_CHAPTERS.length) * 100);

  const islands = [
    { name: "Νησί των Βασικών", emoji: "🏝️", chapters: BOOK_CHAPTERS.slice(0, 4) },
    { name: "Νησί της Σοφίας", emoji: "🌴", chapters: BOOK_CHAPTERS.slice(4, 8) },
    { name: "Νησί του Χρήματος", emoji: "⛵", chapters: BOOK_CHAPTERS.slice(8, 12) },
    { name: "Νησί των Επενδυτών", emoji: "🏆", chapters: BOOK_CHAPTERS.slice(12, 16) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-gray-500 hover:text-gray-700 text-sm">
              ← Πίσω
            </button>
            <div>
              <h1 className="font-bold text-lg text-gray-800">📚 Μικροί Επενδυτές, Μεγάλο Μέλλον</h1>
              <p className="text-xs text-gray-500">Γεια σου, {childName}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2">
            <span className="text-lg">🪙</span>
            <span className="font-bold text-yellow-700 text-lg">{totalCoins}</span>
            <span className="text-xs text-yellow-600">/ {TOTAL_COINS}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Overall Progress */}
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
                      : "🔒 Ολοκλήρωσε το προηγούμενο νησί"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {island.chapters.map((chapter, chIdx) => {
                  const prog = getChapterProgress(chapter.id);
                  const isCompleted = !!prog?.completed;
                  const globalIdx = islandIdx * 4 + chIdx;
                  const isUnlocked = globalIdx === 0 || getChapterProgress(BOOK_CHAPTERS[globalIdx - 1].id)?.completed;

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => isUnlocked && navigate(`/book/${chapter.id}`)}
                      disabled={!isUnlocked}
                      className={`
                        relative rounded-2xl p-4 text-left transition-all
                        ${isCompleted
                          ? `bg-gradient-to-br ${chapter.color} text-white shadow-md`
                          : isUnlocked
                            ? "bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-md cursor-pointer"
                            : "bg-gray-50 border border-gray-100 cursor-not-allowed"
                        }
                      `}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                          <span className="text-2xl">🔒</span>
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

        {completedCount === BOOK_CHAPTERS.length && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 text-center text-white shadow-lg">
            <div className="text-5xl mb-3">🏆</div>
            <h2 className="text-2xl font-black mb-2">Συγχαρητήρια!</h2>
            <p className="text-lg font-medium mb-1">Ολοκλήρωσες το βιβλίο!</p>
            <p className="text-sm opacity-90">Κέρδισες {totalCoins} coins και {BOOK_CHAPTERS.length} badges!</p>
            <p className="mt-3 text-sm opacity-80">Είσαι πλέον επίσημος <strong>Μικρός Επενδυτής</strong> 🌟</p>
          </div>
        )}

        <div className="text-center text-xs text-gray-400 pb-4">
          Βιβλίο: "Μικροί Επενδυτές, Μεγάλο Μέλλον" • Σταυρούλα Αρνηθινού
        </div>
      </div>
    </div>
  );
}
