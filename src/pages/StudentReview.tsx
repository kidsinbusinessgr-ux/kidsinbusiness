import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ReviewScores = {
  innovation: number;
  feasibility: number;
  clarity: number;
};

type ReviewData = {
  scores: ReviewScores;
  selectedTags: string[];
  feedbackText: string;
  status: "draft" | "finalized";
  lastSavedAt: string | null;
};

type VentureData = {
  ventureName: string;
  problem: string;
  solution: string;
  revenueStreams: string;
};

type StudentData = {
  id: string;
  name: string;
  avatar?: string;
  venture: VentureData;
};

const FEEDBACK_TAGS = [
  "Great Market Research",
  "Needs More Detail",
  "Strong USP",
  "Check Pricing",
  "Clear Problem Statement",
  "Innovative Approach",
  "Realistic Goals",
  "Needs Financial Plan",
];

// Mock student data - in production this would come from database
const MOCK_STUDENTS: Record<string, StudentData> = {
  "1": {
    id: "1",
    name: "Maria Papadopoulos",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    venture: {
      ventureName: "EcoBottle Refill Station",
      problem:
        "Students buy plastic bottles daily, creating waste and spending money unnecessarily.",
      solution:
        "A smart refill station near the school that dispenses filtered water with flavor options into reusable bottles.",
      revenueStreams:
        "Sell branded reusable bottles, charge per refill with a loyalty program, and offer premium flavors.",
    },
  },
  "2": {
    id: "2",
    name: "Dimitris Konstantinou",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimitris",
    venture: {
      ventureName: "Tech Tutors Club",
      problem:
        "Younger students struggle with technology homework and parents can't always help them.",
      solution:
        "A peer-to-peer tutoring service where older students help younger ones with coding, apps, and digital skills.",
      revenueStreams:
        "Charge per session, offer package deals, and create online tutorial videos for extra income.",
    },
  },
};

const StudentReview = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [student] = useState<StudentData | null>(() =>
    studentId ? MOCK_STUDENTS[studentId] || null : null,
  );

  const [review, setReview] = useState<ReviewData>({
    scores: { innovation: 3, feasibility: 3, clarity: 3 },
    selectedTags: [],
    feedbackText: "",
    status: "draft",
    lastSavedAt: null,
  });

  useEffect(() => {
    const loadUserAndReview = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Sign in required",
          description: "You need to be logged in to review student ventures.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setTeacherId(user.id);

      if (!studentId) return;

      const { data, error } = await supabase
        .from("mentor_reviews")
        .select("scores, selected_tags, feedback_text, status, created_at")
        .eq("teacher_id", user.id)
        .eq("student_id", studentId)
        .maybeSingle();

      if (error && (error as any).code !== "PGRST116") {
        console.error("Error loading review", error);
        toast({
          title: "Could not load existing review",
          description: "You can still create a new review.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setReview({
          scores: (data.scores as ReviewScores) ?? {
            innovation: 3,
            feasibility: 3,
            clarity: 3,
          },
          selectedTags: (data.selected_tags as string[]) ?? [],
          feedbackText: (data.feedback_text as string) ?? "",
          status: (data.status as "draft" | "finalized") ?? "draft",
          lastSavedAt: (data.created_at as string) ?? null,
        });
      }
    };

    loadUserAndReview();
  }, [navigate, studentId, toast]);

  useEffect(() => {
    if (!student) {
      toast({
        title: "Student not found",
        description: "Redirecting to teacher portal...",
        variant: "destructive",
      });
      setTimeout(() => navigate("/teacher-portal"), 2000);
    }
  }, [student, navigate, toast]);

  const saveDraft = async () => {
    if (!teacherId || !studentId || !student) return;

    const draftData: ReviewData = {
      ...review,
      status: "draft",
      lastSavedAt: new Date().toISOString(),
    };

    const { error } = await supabase.from("mentor_reviews").upsert(
      {
        teacher_id: teacherId,
        student_id: studentId,
        student_name: student.name,
        venture_name: student.venture.ventureName,
        scores: draftData.scores,
        selected_tags: draftData.selectedTags,
        feedback_text: draftData.feedbackText,
        status: draftData.status,
      },
      { onConflict: "teacher_id,student_id" },
    );

    if (error) {
      console.error("Error saving draft", error);
      toast({
        title: "Could not save draft",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    setReview(draftData);
    toast({
      title: "Draft saved",
      description: "Your review has been saved. You can come back to it later.",
    });
  };

  const generateAISummary = () => {
    const { innovation, feasibility, clarity } = review.scores;
    const avgScore = ((innovation + feasibility + clarity) / 3).toFixed(1);

    let tone = "good";
    if (parseFloat(avgScore) >= 4.5) tone = "excellent";
    else if (parseFloat(avgScore) >= 3.5) tone = "strong";
    else if (parseFloat(avgScore) < 3) tone = "needs improvement";

    const hasGreatResearch = review.selectedTags.includes("Great Market Research");
    const hasStrongUSP = review.selectedTags.includes("Strong USP");
    const needsDetail = review.selectedTags.includes("Needs More Detail");

    let summary = "";
    if (tone === "excellent") {
      summary = `Outstanding work! Your venture shows exceptional ${
        hasStrongUSP ? "unique value proposition and " : ""
      }creativity with a clear path to implementation. ${
        hasGreatResearch
          ? "Your market research is particularly impressive."
          : "Keep refining your approach with real-world feedback."
      }`;
    } else if (tone === "strong") {
      summary = `Great effort! Your idea has ${
        innovation >= 4 ? "strong innovative potential" : "solid foundations"
      } and ${feasibility >= 4 ? "realistic execution plans" : "good feasibility"}. ${
        needsDetail
          ? "Consider adding more specific details to strengthen your proposal."
          : "Focus on clarifying your key value propositions."
      }`;
    } else if (tone === "needs improvement") {
      summary = `You're on the right track! ${
        needsDetail ? "Adding more detail to your plan" : "Refining your core idea"
      } will help strengthen your venture. ${
        clarity < 3
          ? "Work on making your pitch clearer and more focused."
          : "Consider researching similar solutions to understand your competitive advantage better."
      }`;
    } else {
      summary = `Solid work! Your venture shows ${
        innovation >= 4 ? "creative thinking" : "practical potential"
      } with room to grow. ${
        hasGreatResearch
          ? "Your research foundation is strong."
          : "Consider deeper market research to validate your assumptions."
      }`;
    }

    setReview((prev) => ({ ...prev, feedbackText: summary }));
    toast({
      title: "AI Summary Generated",
      description: "Review the generated feedback and adjust as needed.",
    });
  };

  const finalizeReview = async () => {
    if (!review.feedbackText.trim()) {
      toast({
        title: "Missing feedback",
        description: "Please add feedback text before finalizing the review.",
        variant: "destructive",
      });
      return;
    }

    if (!teacherId || !studentId || !student) return;

    const finalData: ReviewData = {
      ...review,
      status: "finalized",
      lastSavedAt: new Date().toISOString(),
    };

    const { error } = await supabase.from("mentor_reviews").upsert(
      {
        teacher_id: teacherId,
        student_id: studentId,
        student_name: student.name,
        venture_name: student.venture.ventureName,
        scores: finalData.scores,
        selected_tags: finalData.selectedTags,
        feedback_text: finalData.feedbackText,
        status: finalData.status,
      },
      { onConflict: "teacher_id,student_id" },
    );

    if (error) {
      console.error("Error finalizing review", error);
      toast({
        title: "Could not finalize review",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Finalized! 🎉",
      description: "Success! 50 KIB Coins sent to the student for completing this milestone.",
      duration: 5000,
    });

    setTimeout(() => navigate("/teacher-portal"), 2000);
  };

  const toggleTag = (tag: string) => {
    setReview((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag],
    }));
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/teacher-portal")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portal
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={student.avatar} alt={student.name} />
                  <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-bold text-foreground">{student.name}</h1>
                  <p className="text-sm text-muted-foreground">Reviewing: {student.venture.ventureName}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {review.lastSavedAt && (
                <p className="text-xs text-muted-foreground">
                  Last saved: {new Date(review.lastSavedAt).toLocaleTimeString()}
                </p>
              )}
              {review.status === "draft" && (
                <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split Screen */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Business Model Canvas (Read-Only) */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Business Model Canvas</h2>
              <p className="text-sm text-muted-foreground">Student's venture submission</p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-primary">The Problem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{student.venture.problem}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-primary">The Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{student.venture.solution}</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-primary">Revenue Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{student.venture.revenueStreams}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Review Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Mentor Review</h2>
              <p className="text-sm text-muted-foreground">Evaluate and provide feedback</p>
            </div>

            {/* 3-Pillar Rubric */}
            <Card className="border-2 bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">3-Pillar Rubric</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Innovation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Innovation</label>
                    <Badge variant="secondary" className="text-base px-3">
                      {review.scores.innovation}/5
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">How creative is the idea?</p>
                  <Slider
                    value={[review.scores.innovation]}
                    onValueChange={([value]) =>
                      setReview((prev) => ({ ...prev, scores: { ...prev.scores, innovation: value } }))
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Feasibility */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Feasibility</label>
                    <Badge variant="secondary" className="text-base px-3">
                      {review.scores.feasibility}/5
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Can this actually be built?</p>
                  <Slider
                    value={[review.scores.feasibility]}
                    onValueChange={([value]) =>
                      setReview((prev) => ({ ...prev, scores: { ...prev.scores, feasibility: value } }))
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Clarity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Clarity</label>
                    <Badge variant="secondary" className="text-base px-3">
                      {review.scores.clarity}/5
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Is the pitch easy to understand?</p>
                  <Slider
                    value={[review.scores.clarity]}
                    onValueChange={([value]) =>
                      setReview((prev) => ({ ...prev, scores: { ...prev.scores, clarity: value } }))
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick-Feedback Chips */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Quick Feedback Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {FEEDBACK_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={review.selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform px-3 py-1.5"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Assisted Feedback */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">Mentor Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={generateAISummary}
                  className="w-full gap-2 border-primary/50 hover:border-primary"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Summary
                </Button>
                <Textarea
                  value={review.feedbackText}
                  onChange={(e) => setReview((prev) => ({ ...prev, feedbackText: e.target.value }))}
                  placeholder="Write your personalized feedback here..."
                  className="min-h-[150px] resize-none"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={saveDraft}
                className="flex-1 gap-2"
                disabled={review.status === "finalized"}
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
              <Button
                onClick={finalizeReview}
                className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
                disabled={review.status === "finalized"}
              >
                <Send className="h-4 w-4" />
                Finalize Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReview;
