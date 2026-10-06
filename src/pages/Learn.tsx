import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Star, Zap, TrendingUp, ShieldCheck, Users } from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Τι είναι το χρήμα;",
    emoji: "💰",
    icon: Zap,
    color: "from-yellow-400 to-orange-400",
    description: "Μάθε πώς λειτουργεί το χρήμα και γιατί το χρειαζόμαστε.",
    xp: 50,
    slides: [
      { title: "Ιστορία του χρήματος", body: "Παλιά, οι άνθρωποι αντάλλαζαν πράγματα — π.χ. ψωμί με ψάρια. Το χρήμα εφευρέθηκε για να κάνει εύκολη την ανταλλαγή." },
      { title: "Τι κάνει το χρήμα;", body: "Το χρήμα λειτουργεί ως μέτρο αξίας, μέσο ανταλλαγής και αποθήκη αξίας. Χωρίς αυτό, κάθε συναλλαγή θα ήταν πολύ δύσκολη!" },
      { title: "Φυσικό vs Ψηφιακό", body: "Σήμερα υπάρχουν νομίσματα & χαρτονομίσματα, αλλά και ψηφιακά χρήματα σε κάρτες και apps. Και τα δύο έχουν την ίδια αξία." },
    ],
    questions: [
      { q: "Γιατί εφευρέθηκε το χρήμα;", options: ["Για να παίζουμε παιχνίδια", "Για να κάνει εύκολη την ανταλλαγή", "Για να στολίζουμε"], correct: 1 },
      { q: "Ποιος από τους παρακάτω είναι ρόλος του χρήματος;", options: ["Μέτρο αξίας", "Είδος τροφής", "Παιχνίδι"], correct: 0 },
      { q: "Τι είναι ψηφιακά χρήματα;", options: ["Νομίσματα από πλαστικό", "Χρήματα σε κάρτες και apps", "Χρυσά νομίσματα"], correct: 1 },
    ],
  },
  {
    id: 2,
    title: "Αποταμίευση",
    emoji: "🏦",
    icon: Star,
    color: "from-blue-400 to-indigo-500",
    description: "Γιατί να αποταμιεύεις και πώς να ξεκινήσεις σήμερα.",
    xp: 60,
    slides: [
      { title: "Τι είναι αποταμίευση;", body: "Αποταμίευση σημαίνει να κρατάς ένα μέρος από αυτά που κερδίζεις για αργότερα. Δεν ξοδεύεις τα πάντα τώρα!" },
      { title: "Ο κανόνας 50-30-20", body: "50% για ανάγκες, 30% για επιθυμίες, 20% για αποταμίευση. Αυτός ο κανόνας σε βοηθά να οργανώσεις τα χρήματά σου." },
      { title: "Η δύναμη του χρόνου", body: "Αν αποταμιεύεις 1€ κάθε μέρα, σε ένα χρόνο έχεις 365€! Η τακτική αποταμίευση φτιάχνει μεγάλα ποσά." },
    ],
    questions: [
      { q: "Τι σημαίνει αποταμίευση;", options: ["Να ξοδεύεις όλα τα χρήματά σου", "Να κρατάς ένα μέρος για αργότερα", "Να δανείζεις χρήματα"], correct: 1 },
      { q: "Στον κανόνα 50-30-20, πόσο % πάει για αποταμίευση;", options: ["50%", "30%", "20%"], correct: 2 },
      { q: "Αν αποταμιεύεις 1€ κάθε μέρα, πόσα έχεις σε ένα χρόνο;", options: ["100€", "365€", "1000€"], correct: 1 },
    ],
  },
  {
    id: 3,
    title: "Επιχειρηματικότητα",
    emoji: "🚀",
    icon: TrendingUp,
    color: "from-purple-400 to-pink-500",
    description: "Πώς να μετατρέψεις μια ιδέα σε επιχείρηση.",
    xp: 70,
    slides: [
      { title: "Τι είναι επιχειρηματίας;", body: "Ο επιχειρηματίας βλέπει ένα πρόβλημα και δημιουργεί μια λύση. Δεν χρειάζεσαι ηλικία — χρειάζεσαι ιδέα και δράση!" },
      { title: "Η επιχειρηματική ιδέα", body: "Μια καλή ιδέα λύνει ένα πρόβλημα που έχουν πολλοί. Σκέψου: τι με ενοχλεί; Πώς μπορώ να το φτιάξω;" },
      { title: "Από ιδέα σε προϊόν", body: "Βήμα 1: Ιδέα → Βήμα 2: Δοκίμασε με λίγους → Βήμα 3: Βελτίωσε → Βήμα 4: Μεγάλωσε. Αυτός είναι ο κύκλος της startup!" },
    ],
    questions: [
      { q: "Τι κάνει ένας επιχειρηματίας;", options: ["Βλέπει πρόβλημα και δημιουργεί λύση", "Περιμένει να λύσουν άλλοι τα προβλήματα", "Ξοδεύει χρήματα τυχαία"], correct: 0 },
      { q: "Τι χαρακτηρίζει μια καλή επιχειρηματική ιδέα;", options: ["Να είναι πολύ ακριβή", "Να λύνει ένα πρόβλημα πολλών", "Να είναι μυστική"], correct: 1 },
      { q: "Ποιο είναι το πρώτο βήμα από ιδέα σε προϊόν;", options: ["Να μεγαλώσεις", "Να βελτιώσεις", "Να δοκιμάσεις με λίγους"], correct: 2 },
    ],
  },
  {
    id: 4,
    title: "Επένδυση",
    emoji: "📈",
    icon: TrendingUp,
    color: "from-green-400 to-teal-500",
    description: "Κάνε τα χρήματά σου να αυξάνονται με επενδύσεις.",
    xp: 80,
    slides: [
      { title: "Τι είναι επένδυση;", body: "Επένδυση σημαίνει να βάζεις χρήματα σε κάτι με σκοπό να πάρεις πίσω περισσότερα. Π.χ. μετοχές, ακίνητα, επιχειρήσεις." },
      { title: "Ρίσκο και απόδοση", body: "Όσο μεγαλύτερο ρίσκο, τόσο μεγαλύτερη πιθανή απόδοση. Αλλά μπορείς και να χάσεις! Πάντα επένδυε με σύνεση." },
      { title: "Compound interest", body: "Ο Einstein το έλεγε '8ο θαύμα του κόσμου': τα κέρδη σου βγάζουν κι αυτά κέρδη. 100€ × 10% = 110€, μετά 110€ × 10% = 121€..." },
    ],
    questions: [
      { q: "Τι σημαίνει να επενδύεις;", options: ["Να ξοδεύεις όλα σου τα χρήματα", "Να βάζεις χρήματα για να πάρεις περισσότερα", "Να δανείζεις σε φίλους"], correct: 1 },
      { q: "Τι ισχύει για ρίσκο και απόδοση;", options: ["Μεγαλύτερο ρίσκο = μεγαλύτερη απόδοση", "Χωρίς ρίσκο κερδίζεις πάντα", "Το ρίσκο δεν υπάρχει στις επενδύσεις"], correct: 0 },
      { q: "Τι είναι το compound interest;", options: ["Τόκος που μηδενίζεται", "Κέρδη που βγάζουν κι αυτά κέρδη", "Χρέος που μεγαλώνει"], correct: 1 },
    ],
  },
  {
    id: 5,
    title: "Υπεύθυνη Κατανάλωση",
    emoji: "🌱",
    icon: ShieldCheck,
    color: "from-emerald-400 to-green-600",
    description: "Πώς να ξοδεύεις έξυπνα και με συνείδηση.",
    xp: 60,
    slides: [
      { title: "Ανάγκη vs Επιθυμία", body: "Ανάγκη: κάτι που ΠΡΕΠΕΙ να έχεις (φαγητό, σπίτι). Επιθυμία: κάτι που ΘΕΛΕΙΣ αλλά δεν είναι απαραίτητο. Η διαφορά είναι κρίσιμη!" },
      { title: "Έξυπνες αγορές", body: "Πριν αγοράσεις: Το χρειάζομαι; Έχω τα χρήματα; Μπορώ να περιμένω; Αν ναι σε όλα, αγόρασέ το — αλλιώς σκέψου ξανά." },
      { title: "Αειφόρος κατανάλωση", body: "Οι αγορές μας επηρεάζουν τον πλανήτη. Επέλεξε ποιοτικά προϊόντα που κρατούν, και προτίμα εταιρείες με σεβασμό στο περιβάλλον." },
    ],
    questions: [
      { q: "Τι είναι ανάγκη;", options: ["Κάτι που θέλεις", "Κάτι που πρέπει να έχεις", "Κάτι ακριβό"], correct: 1 },
      { q: "Ποια ερώτηση ΔΕΝ πρέπει να κάνεις πριν αγοράσεις;", options: ["Το χρειάζομαι;", "Πόσο ζυγίζει;", "Έχω τα χρήματα;"], correct: 1 },
      { q: "Τι σημαίνει αειφόρος κατανάλωση;", options: ["Να αγοράζεις πολλά", "Να επιλέγεις με σεβασμό στον πλανήτη", "Να μην αγοράζεις τίποτα"], correct: 1 },
    ],
  },
  {
    id: 6,
    title: "Ομαδική Εργασία",
    emoji: "🤝",
    icon: Users,
    color: "from-pink-400 to-rose-500",
    description: "Γιατί οι καλύτερες επιχειρήσεις χτίζονται μαζί.",
    xp: 65,
    slides: [
      { title: "Γιατί ομάδα;", body: "Ένας μπορεί να κάνει πολλά, αλλά μαζί κάνουμε περισσότερα. Κάθε μέλος φέρνει διαφορετικές δεξιότητες και ιδέες!" },
      { title: "Ρόλοι στην ομάδα", body: "Κάθε επιχείρηση χρειάζεται: Creative (ιδέες), Organizer (οργάνωση), Seller (πωλήσεις), Techie (τεχνολογία). Ποιος είσαι εσύ;" },
      { title: "Επικοινωνία = Επιτυχία", body: "Η καλή επικοινωνία σημαίνει: άκου πρώτα, μίλα με σεβασμό, μοίρασε τη δόξα. Οι καλές ομάδες το κάνουν αυτό συνέχεια." },
    ],
    questions: [
      { q: "Ποιο είναι το πλεονέκτημα της ομαδικής εργασίας;", options: ["Κάνουμε λιγότερα", "Φέρνουμε διαφορετικές δεξιότητες", "Δεν χρειαζόμαστε επικοινωνία"], correct: 1 },
      { q: "Ποιος ρόλος ασχολείται με τις πωλήσεις;", options: ["Creative", "Organizer", "Seller"], correct: 2 },
      { q: "Τι σημαίνει καλή επικοινωνία;", options: ["Να μιλάς πάντα εσύ πρώτος", "Να ακούς, να μιλάς με σεβασμό, να μοιράζεσαι", "Να κρατάς μυστικά"], correct: 1 },
    ],
  },
];

type Phase = "list" | "intro" | "slide" | "quiz" | "result";

export default function Learn() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("list");
  const [activeLesson, setActiveLesson] = useState<(typeof lessons)[0] | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  const startLesson = (lesson: (typeof lessons)[0]) => {
    setActiveLesson(lesson);
    setSlideIdx(0);
    setQuestionIdx(0);
    setSelected(null);
    setCorrect(0);
    setPhase("intro");
  };

  const nextSlide = () => {
    if (!activeLesson) return;
    if (slideIdx < activeLesson.slides.length - 1) {
      setSlideIdx(slideIdx + 1);
    } else {
      setQuestionIdx(0);
      setSelected(null);
      setPhase("quiz");
    }
  };

  const answerQuestion = (idx: number) => {
    if (selected !== null || !activeLesson) return;
    setSelected(idx);
    if (idx === activeLesson.questions[questionIdx].correct) {
      setCorrect((c) => c + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeLesson) return;
    if (questionIdx < activeLesson.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelected(null);
    } else {
      const earned = Math.round((activeLesson.xp * correct) / activeLesson.questions.length);
      setXpEarned(earned);
      setPhase("result");
    }
  };

  if (phase === "list") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 py-6">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Μάθε Οικονομικά</h1>
              <p className="text-gray-500 text-sm">6 μαθήματα · Απόκτησε XP</p>
            </div>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => startLesson(lesson)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className={`bg-gradient-to-br ${lesson.color} text-white p-3 rounded-xl text-2xl w-14 h-14 flex items-center justify-center flex-shrink-0`}>
                  {lesson.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {lesson.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{lesson.description}</div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-sm flex-shrink-0">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {lesson.xp} XP
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Πίσω στην αρχική
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!activeLesson) return null;

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{activeLesson.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeLesson.title}</h2>
          <p className="text-gray-500 mb-6">{activeLesson.description}</p>
          <div className="flex justify-center gap-4 mb-8 text-sm">
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
              {activeLesson.slides.length} διαφάνειες
            </div>
            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400" /> έως {activeLesson.xp} XP
            </div>
          </div>
          <button
            onClick={() => setPhase("slide")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Ξεκίνα →
          </button>
          <button onClick={() => setPhase("list")} className="mt-3 block w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Πίσω
          </button>
        </div>
      </div>
    );
  }

  if (phase === "slide") {
    const slide = activeLesson.slides[slideIdx];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <div className="flex gap-1 mb-6">
            {activeLesson.slides.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= slideIdx ? "bg-indigo-500" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
            {slideIdx + 1} / {activeLesson.slides.length}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">{slide.title}</h3>
          <p className="text-gray-600 leading-relaxed mb-8">{slide.body}</p>
          <button
            onClick={nextSlide}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {slideIdx < activeLesson.slides.length - 1 ? "Επόμενο →" : "Στο Quiz! 🎯"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz") {
    const q = activeLesson.questions[questionIdx];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
          <div className="flex gap-1 mb-6">
            {activeLesson.questions.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < questionIdx ? "bg-green-400" : i === questionIdx ? "bg-indigo-500" : "bg-gray-200"}`} />
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-4 uppercase tracking-wider">
            Ερώτηση {questionIdx + 1} / {activeLesson.questions.length}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-6">{q.q}</h3>
          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              let cls = "w-full text-left p-4 rounded-xl border-2 font-medium transition-all ";
              if (selected === null) {
                cls += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
              } else if (i === q.correct) {
                cls += "border-green-400 bg-green-50 text-green-700";
              } else if (i === selected && i !== q.correct) {
                cls += "border-red-300 bg-red-50 text-red-600";
              } else {
                cls += "border-gray-200 text-gray-400";
              }
              return (
                <button key={i} className={cls} onClick={() => answerQuestion(i)} disabled={selected !== null}>
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <button onClick={nextQuestion} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
              {questionIdx < activeLesson.questions.length - 1 ? "Επόμενη ερώτηση →" : "Δες αποτέλεσμα 🎉"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const pct = Math.round((correct / activeLesson.questions.length) * 100);
    const passed = correct >= 2;
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">{passed ? "🏆" : "💪"}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {passed ? "Μπράβο σου!" : "Προσπάθησε ξανά!"}
          </h2>
          <p className="text-gray-500 mb-6">
            {correct} / {activeLesson.questions.length} σωστές ({pct}%)
          </p>
          {passed && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              <span className="text-amber-700 font-bold text-xl">+{xpEarned} XP</span>
            </div>
          )}
          <div className="space-y-3">
            {!passed && (
              <button
                onClick={() => { setQuestionIdx(0); setSelected(null); setCorrect(0); setSlideIdx(0); setPhase("slide"); }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Επανάληψη 🔄
              </button>
            )}
            <button
              onClick={() => setPhase("list")}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Άλλο μάθημα →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
