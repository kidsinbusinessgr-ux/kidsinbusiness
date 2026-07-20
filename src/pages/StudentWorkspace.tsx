import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Trophy, Zap, BookOpen, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/kids-in-business-logo.png";
import { PROGRAMS } from "@/config/programsConfig";

// Localized strings for student workspace (Greek only for now — kids in Greece)
const T = {
  hi: "Γεια σου",
  student: "Μαθητή",
  subtitle: "Επίλεξε ένα πρόγραμμα και συνέχισε εκεί που σταμάτησες!",
  myProgress: "Η Πρόοδός μου",
  chapter: "Κεφάλαιο",
  lessons: "μαθήματα",
  start: "Ξεκινώ",
  continue: "Συνεχίζω",
  completed: "Ολοκλήρωσα!",
  locked: "Κλειδωμένο",
  points: "πόντοι",
  achievements: "Επιτεύγματα",
  noAchievements: "Ολοκλήρωσε το πρώτο σου μάθημα για να κερδίσεις το πρώτο σου badge!",
  backToTeacher: "← Επιστροφή στον Δάσκαλο",
};

const STORAGE_KEY = "student_progress";

interface StudentProgress {
  name: string;
  programId: string;
  chapterIndex: number;
  lessonIndex: number;
  points: number;
  completedChapters: number[];
}

const defaultProgress = (): StudentProgress => ({
  name: "",
  programId: "business-plan",
  chapterIndex: 0,
  lessonIndex: 0,
  points: 0,
  completedChapters: [],
});

const BADGES = [
  { id: "first_lesson", emoji: "⭐", label: "Πρώτο Μάθημα", condition: (p: StudentProgress) => p.points >= 10 },
  { id: "first_chapter", emoji: "🏅", label: "Πρώτο Κεφάλαιο", condition: (p: StudentProgress) => p.completedChapters.length >= 1 },
  { id: "three_chapters", emoji: "🥇", label: "Τρία Κεφάλαια", condition: (p: StudentProgress) => p.completedChapters.length >= 3 },
  { id: "all_chapters", emoji: "🏆", label: "Πρωταθλητής!", condition: (p: StudentProgress) => p.completedChapters.length >= 6 },
];

const StudentWorkspace = () => {
  const [progress, setProgress] = useState<StudentProgress>(defaultProgress());
  const [nameInput, setNameInput] = useState("");
  const [isNamed, setIsNamed] = useState(false);
  const [activeProgram, setActiveProgram] = useState(PROGRAMS[0]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved) as StudentProgress;
        setProgress(p);
        if (p.name) setIsNamed(true);
        const prog = PROGRAMS.find((pr) => pr.id === p.programId) ?? PROGRAMS[0];
        setActiveProgram(prog);
      } catch {
        // ignore
      }
    }
  }, []);

  const save = (p: StudentProgress) => {
    setProgress(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const p = { ...progress, name: nameInput.trim() };
    save(p);
    setIsNamed(true);
  };

  const handleCompleteLesson = () => {
    const ch = activeProgram.chapters[progress.chapterIndex];
    if (!ch) return;
    let newLesson = progress.lessonIndex + 1;
    let newChapter = progress.chapterIndex;
    let newCompleted = [...progress.completedChapters];
    let newPoints = progress.points + 10;

    if (newLesson >= ch.lessons.length) {
      // Chapter complete
      if (!newCompleted.includes(progress.chapterIndex)) {
        newCompleted.push(progress.chapterIndex);
        newPoints += 50;
      }
      newChapter = Math.min(progress.chapterIndex + 1, activeProgram.chapters.length - 1);
      newLesson = 0;
    }

    const p: StudentProgress = {
      ...progress,
      lessonIndex: newLesson,
      chapterIndex: newChapter,
      completedChapters: newCompleted,
      points: newPoints,
    };
    save(p);
  };

  const selectProgram = (programId: string) => {
    const prog = PROGRAMS.find((p) => p.id === programId) ?? PROGRAMS[0];
    setActiveProgram(prog);
    const p: StudentProgress = { ...progress, programId, chapterIndex: 0, lessonIndex: 0 };
    save(p);
  };

  const earnedBadges = BADGES.filter((b) => b.condition(progress));
  const currentChapter = activeProgram.chapters[progress.chapterIndex];
  const overallProgress = Math.round(
    ((progress.completedChapters.length) / activeProgram.chapters.length) * 100
  );

  // Name prompt screen
  if (!isNamed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 flex flex-col items-center justify-center px-4">
        <img src={logo} alt="KidsInBusiness" className="h-16 mb-8" />
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-2xl font-bold mb-2">Καλωσήρθες!</h1>
          <p className="text-muted-foreground mb-6">Πώς σε λένε;</p>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-3">
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Το όνομά μου..."
              className="border-2 rounded-xl px-4 py-3 text-lg text-center focus:outline-none focus:border-primary"
              maxLength={30}
            />
            <Button type="submit" size="lg" className="rounded-xl text-lg py-6">
              Ξεκινώ! 🚀
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <img src={logo} alt="KidsInBusiness" className="h-8" />
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 font-bold text-sm flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-500" />
            {progress.points} {T.points}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-bold">
            {T.hi}, {progress.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">{T.subtitle}</p>
        </div>

        {/* Program selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {PROGRAMS.map((p) => (
            <button
              key={p.id}
              onClick={() => selectProgram(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border-2 ${
                activeProgram.id === p.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-white text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.titleEl}</span>
            </button>
          ))}
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              {T.myProgress}
            </h2>
            <span className="text-primary font-bold text-lg">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 rounded-full" />
          <p className="text-xs text-muted-foreground mt-2">
            {progress.completedChapters.length} / {activeProgram.chapters.length}{" "}
            {T.chapter === "Κεφάλαιο" ? "κεφάλαια ολοκληρωμένα" : "chapters complete"}
          </p>
        </div>

        {/* Current lesson card */}
        {currentChapter && (
          <div className={`rounded-2xl p-6 shadow-sm border-2 border-primary/30 bg-gradient-to-br ${activeProgram.color} text-white`}>
            <p className="text-white/70 text-sm mb-1 font-medium">
              {T.chapter} {progress.chapterIndex + 1} · {T.lessons.replace("μαθήματα", `Μάθημα ${progress.lessonIndex + 1}`)}
            </p>
            <h2 className="text-2xl font-bold mb-1">
              {currentChapter.emoji} {currentChapter.titleEl}
            </h2>
            <p className="text-white/80 text-sm mb-5">{currentChapter.descriptionEl}</p>
            <div className="flex items-center gap-2 mb-4">
              <Progress
                value={Math.round((progress.lessonIndex / currentChapter.lessons.length) * 100)}
                className="h-2 flex-1 bg-white/30"
              />
              <span className="text-sm font-bold text-white">
                {progress.lessonIndex}/{currentChapter.lessons.length}
              </span>
            </div>
            <Button
              onClick={handleCompleteLesson}
              size="lg"
              className="w-full bg-white text-primary hover:bg-white/90 font-bold text-base rounded-xl"
            >
              {progress.lessonIndex === 0 ? T.start : T.continue} →
            </Button>
          </div>
        )}

        {/* All chapters */}
        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {activeProgram.titleEl}
          </h2>
          <div className="space-y-2">
            {activeProgram.chapters.map((ch, idx) => {
              const isDone = progress.completedChapters.includes(idx);
              const isCurrent = idx === progress.chapterIndex;
              const isLocked = idx > progress.chapterIndex;

              return (
                <div
                  key={ch.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/5"
                      : isDone
                      ? "border-green-300 bg-green-50"
                      : isLocked
                      ? "border-muted bg-muted/30 opacity-60"
                      : "border-muted bg-white"
                  }`}
                >
                  <div className="text-2xl w-10 text-center">{ch.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {T.chapter} {ch.id}: {ch.titleEl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ch.lessons.length} {T.lessons}
                    </p>
                  </div>
                  <div>
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : isCurrent ? (
                      <Badge className="bg-primary text-primary-foreground">Τώρα</Badge>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workbook CTA */}
        <Link to="/workbook" className="block">
          <div className="rounded-2xl border-2 border-violet-300 bg-gradient-to-r from-violet-500 to-pink-500 text-white p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-5xl">📓</span>
            <div className="flex-1">
              <h2 className="font-bold text-lg">Business Plan Workbook</h2>
              <p className="text-white/80 text-sm">Συμπλήρωσε το ψηφιακό workbook και χτίσε την επιχείρησή σου βήμα-βήμα!</p>
            </div>
            <ArrowRight className="w-6 h-6 shrink-0" />
          </div>
        </Link>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {T.achievements}
          </h2>
          {earnedBadges.length === 0 ? (
            <p className="text-muted-foreground text-sm">{T.noAchievements}</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {BADGES.map((b) => {
                const earned = b.condition(progress);
                return (
                  <div
                    key={b.id}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 w-24 text-center transition-all ${
                      earned
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-muted bg-muted/20 opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-3xl">{b.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{b.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back to teacher */}
        <div className="text-center pb-8">
          <Link to="/" className="text-muted-foreground text-sm hover:text-primary transition-colors">
            {T.backToTeacher}
          </Link>
        </div>
      </main>
    </div>
  );
};

export default StudentWorkspace;
