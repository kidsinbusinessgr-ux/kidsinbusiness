import React, { useState, useEffect } from "react";
import { Star, Save, User, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const MentorReview = () => {
  const { language } = useLanguage();
  const t = translations.mentorReview;

  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kib_reviews");
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const newReview = {
      id: Date.now(),
      score,
      note,
      date: new Date().toLocaleDateString(language === "el" ? "el-GR" : "en-US"),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem("kib_reviews", JSON.stringify(updated));
    setNote("");
    alert(language === "el" ? "Η αξιολόγηση αποθηκεύτηκε!" : "Review saved!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
        <h1 className="text-3xl font-bold tracking-tight">{t.pageTitle[language]}</h1>
      </div>

      <div className="bg-background border rounded-xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="text-primary" />
          </div>
          <p className="font-medium text-foreground">
            {t.reviewing[language]}{" "}
            <span className="text-primary font-bold">Student Alpha</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-4">
            {t.innovationScore[language]}:{" "}
            <span className="text-xl font-bold text-primary">{score}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full h-3 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t.feedbackLabel[language]}</label>
          <textarea
            className="w-full p-4 border rounded-xl min-h-[120px] bg-background"
            placeholder={t.feedbackPlaceholder[language]}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          className="w-full py-6 text-lg font-bold gap-2"
        >
          <Save className="w-5 h-5" />
          {t.saveButton[language]}
        </Button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold flex items-center gap-2">
          <History className="w-5 h-5" /> {t.recentEvaluations[language]}
        </h3>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {language === "el"
              ? "Δεν υπάρχουν ακόμα αποθηκευμένες αξιολογήσεις."
              : "No reviews saved yet."}
          </p>
        ) : (
          <div className="space-y-2">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border bg-card px-4 py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {t.innovationScore[language]}: {r.score}/10
                  </p>
                  <p className="text-muted-foreground text-xs max-w-md truncate">
                    {r.note}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorReview;

