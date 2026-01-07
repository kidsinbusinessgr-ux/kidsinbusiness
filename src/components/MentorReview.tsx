import React, { useState, useEffect } from 'react';
import { Star, Save, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const MentorReview = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [score, setScore] = useState(5);
  const [studentName, setStudentName] = useState("Avgerinos");

  // Load reviews from free localStorage on mount
  useEffect(() => {
    const savedReviews = localStorage.getItem('kib_reviews');
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  const saveReview = () => {
    if (!note) {
      alert("Please add a note for the student!");
      return;
    }

    const newReview = { 
      id: Date.now(),
      studentName, 
      score, 
      note, 
      date: new Date().toLocaleDateString() 
    };
    
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('kib_reviews', JSON.stringify(updatedReviews));
    
    alert(`Review saved! 50 KIB Coins awarded to ${studentName}.`);
    setNote(""); 
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Review Panel</h1>
      </div>
      
      {/* Review Form */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-blue-600">
          <MessageSquare className="w-5 h-5" />
          <h2 className="text-xl font-semibold text-foreground">Reviewing: {studentName}'s Venture</h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Innovation Score: {score}/10</label>
            <input 
              type="range" min="1" max="10" 
              value={score} 
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Needs Work</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mentor Feedback</label>
            <textarea 
              className="w-full p-4 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none transition"
              rows={4}
              placeholder="What did the student do well? What are the next steps?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <Button 
            onClick={saveReview}
            className="w-full md:w-auto gap-2 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Award className="w-5 h-5" />
            Finalize Review & Award 50 Coins
          </Button>
        </div>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-muted-foreground">
          <Save className="w-4 h-4" /> 
          Recent Evaluations
        </h3>
        
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">No reviews submitted yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-lg border-l-4 border-primary shadow-sm flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">{r.studentName}</p>
                <p className="text-sm text-slate-600 italic">"{r.note}"</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{r.date}</p>
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-bold">
                {r.score}/10
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Add this helper for the icon if GraduationCap isn't imported
const GraduationCap = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);

export default MentorReview;
