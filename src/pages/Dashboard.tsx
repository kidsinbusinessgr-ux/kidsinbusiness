import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Zap, TrendingUp, Star, CheckCircle2, Circle, Users, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import GlobalTip from "@/components/GlobalTip";
import { useAuthAndClasses } from "@/hooks/useAuthAndClasses";

const MINI_IDS = ["mini-1", "mini-2", "mini-3"] as const;
const CLASS_IDS = ["class-1", "class-2"] as const;
const PROJECT_IDS = ["project-1", "project-2"] as const;
const ALL_IDS = [...MINI_IDS, ...CLASS_IDS, ...PROJECT_IDS];

const Dashboard = () => {
  const { classes, loading, renameClass } = useAuthAndClasses();
  const [currentClassId, setCurrentClassId] = useState<string>("");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [recentCompleted, setRecentCompleted] = useState<string[]>([]);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Initialize currentClassId once classes are loaded
  useEffect(() => {
    if (classes.length > 0 && !currentClassId) {
      const savedClass = localStorage.getItem("currentClassId");
      const validClass = classes.find((c) => c.id === savedClass);
      setCurrentClassId(validClass ? validClass.id : classes[0].id);
    }
  }, [classes, currentClassId]);

  // Save selected class
  useEffect(() => {
    if (currentClassId) {
      localStorage.setItem("currentClassId", currentClassId);
    }
  }, [currentClassId]);

  // Load completed challenges for current class
  useEffect(() => {
    const key = `completedChallenges_${currentClassId}`;
    const legacy = localStorage.getItem("completedChallenges");
    const saved = localStorage.getItem(key) ?? legacy;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setCompletedIds(new Set(parsed.filter((id) => ALL_IDS.includes(id as any))));
      } catch {
        // ignore parse errors
        setCompletedIds(new Set());
      }
    } else {
      setCompletedIds(new Set());
    }
  }, [currentClassId]);

  // Load recent completion history per class
  useEffect(() => {
    const historyKey = `completedChallengesHistory_${currentClassId}`;
    const historyRaw = localStorage.getItem(historyKey);
    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw) as string[];
        const filtered = parsed.filter((id) => ALL_IDS.includes(id as any));
        // most recent last in history, so reverse and take unique
        const seen = new Set<string>();
        const uniqueRecent: string[] = [];
        for (let i = filtered.length - 1; i >= 0 && uniqueRecent.length < 3; i--) {
          const id = filtered[i];
          if (!seen.has(id)) {
            seen.add(id);
            uniqueRecent.push(id);
          }
        }
        setRecentCompleted(uniqueRecent);
      } catch {
        // ignore parse errors
        setRecentCompleted([]);
      }
    } else {
      setRecentCompleted([]);
    }
  }, [currentClassId]);

  const completedCount = completedIds.size;
  const totalChallenges = ALL_IDS.length;
  const miniCompleted = MINI_IDS.filter((id) => completedIds.has(id)).length;
  const classCompleted = CLASS_IDS.filter((id) => completedIds.has(id)).length;
  const projectsCompleted = PROJECT_IDS.filter((id) => completedIds.has(id)).length;

  const challengeMeta: Record<string, { title: string; type: string; icon: typeof Star }> = {
    "mini-1": { title: "Ιδέα σε 5 λεπτά", type: "Mini Challenge", icon: Star },
    "mini-2": { title: "Λύσε το πρόβλημα", type: "Mini Challenge", icon: Star },
    "mini-3": { title: "Pitch σε 30 δευτερόλεπτα", type: "Mini Challenge", icon: Star },
    "class-1": { title: "Ο ρόλος του ηγέτη", type: "Δραστηριότητα", icon: TrendingUp },
    "class-2": { title: "Η επιχείρησή μου", type: "Δραστηριότητα", icon: TrendingUp },
    "project-1": { title: "Business Plan Junior", type: "Project", icon: BookOpen },
    "project-2": { title: "Παρουσίαση ομάδας", type: "Project", icon: BookOpen },
  };
  const achievements = [
    {
      id: "first-challenge",
      title: "Πρώτο Challenge",
      description: "Ολοκλήρωσε το πρώτο σου challenge.",
      unlocked: completedCount >= 1,
    },
    {
      id: "three-challenges",
      title: "3 Challenges",
      description: "Ολοκλήρωσε 3 challenges συνολικά.",
      unlocked: completedCount >= 3,
    },
    {
      id: "all-mini",
      title: "Όλα τα Mini Challenges",
      description: "Ολοκλήρωσε όλα τα Mini Challenges.",
      unlocked: miniCompleted === MINI_IDS.length && MINI_IDS.length > 0,
    },
    {
      id: "all-class",
      title: "Όλες οι Δραστηριότητες Τάξης",
      description: "Ολοκλήρωσε όλες τις Δραστηριότητες Τάξης.",
      unlocked: classCompleted === CLASS_IDS.length && CLASS_IDS.length > 0,
    },
    {
      id: "all-projects",
      title: "Όλα τα Projects",
      description: "Ολοκλήρωσε όλα τα Projects.",
      unlocked: projectsCompleted === PROJECT_IDS.length && PROJECT_IDS.length > 0,
    },
    {
      id: "all-challenges",
      title: "Master of Challenges",
      description: "Ολοκλήρωσε όλα τα διαθέσιμα challenges.",
      unlocked: completedCount === totalChallenges && totalChallenges > 0,
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const overallPercent = totalChallenges ? Math.round((completedCount / totalChallenges) * 100) : 0;

  const getClassLabel = (id: string): string => {
    return classes.find((c) => c.id === id)?.name || id;
  };

  const getClassStats = (classId: string) => {
    const key = `completedChallenges_${classId}`;
    const legacy = localStorage.getItem("completedChallenges");
    const saved = typeof window !== "undefined" ? localStorage.getItem(key) ?? legacy : null;
    if (!saved) {
      return { completed: 0, percent: 0 };
    }
    try {
      const parsed = JSON.parse(saved) as string[];
      const set = new Set(parsed.filter((id) => ALL_IDS.includes(id as any)));
      const completed = set.size;
      const percent = totalChallenges ? Math.round((completed / totalChallenges) * 100) : 0;
      return { completed, percent };
    } catch {
      return { completed: 0, percent: 0 };
    }
  };

  const handleStartEdit = (classId: string, currentName: string) => {
    setEditingClassId(classId);
    setEditName(currentName);
  };

  const handleSaveEdit = async () => {
    if (editingClassId && editName.trim()) {
      await renameClass(editingClassId, editName.trim());
      setEditingClassId(null);
      setEditName("");
    }
  };

  const handleCancelEdit = () => {
    setEditingClassId(null);
    setEditName("");
  };

  if (loading || classes.length === 0 || !currentClassId) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Φόρτωση...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Καλώς ήρθατε στο Kids in Business</h1>
            <p className="text-muted-foreground text-lg">
              Εμπνεύστε τους μαθητές σας να γίνουν οι επιχειρηματίες του αύριο
            </p>
          </div>
          {/* Class selector */}
          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 text-xs md:text-sm">
              {classes.map((cls) => (
                <Button
                  key={cls.id}
                  type="button"
                  variant={currentClassId === cls.id ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full px-3 py-1 h-8"
                  onClick={() => {
                    setCurrentClassId(cls.id);
                  }}
                >
                  {cls.name}
                </Button>
              ))}
            </div>

            {/* Rename classes inline */}
            <Card className="w-full max-w-xs border-dashed">
              <CardHeader className="py-2">
                <CardTitle className="text-xs font-medium">Μετονομασία τμημάτων</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 py-2">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center gap-2">
                    {editingClassId === cls.id ? (
                      <>
                        <Input
                          value={editName}
                          className="h-7 text-xs flex-1"
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit();
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={handleSaveEdit}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs flex-1">{cls.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() => handleStartEdit(cls.id, cls.name)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Continue Learning */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Πρόοδος στις δράσεις & challenges
              </CardTitle>
              <CardDescription>Συνολική εικόνα προόδου από τη σελίδα Δράσεις.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Πρόοδος Challenges</h3>
                    <div className="w-full bg-muted rounded-full h-2 mb-2 overflow-hidden">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${overallPercent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{overallPercent}% ολοκληρωμένο</p>
                  </div>
                </div>
                <Link to="/actions">
                  <Button className="w-full group">
                    Πήγαινε στις Δράσεις
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tip of the Week */}
          <div>
            <GlobalTip tip="Ξεκινήστε κάθε μάθημα με ένα παράδειγμα από την καθημερινή ζωή των παιδιών - η σύνδεση με την πραγματικότητα κάνει τη μάθηση πιο ουσιαστική!" />
          </div>
        </div>

        {/* Recent Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Πρόσφατες Δράσεις
            </CardTitle>
          </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentCompleted.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Δεν υπάρχουν ακόμη ολοκληρωμένες δράσεις. Ξεκινήστε από τη σελίδα Δράσεις για να δείτε εδώ τα πιο πρόσφατα challenges.
                  </p>
                )}
                {recentCompleted.map((id) => {
                  const meta = challengeMeta[id];
                  if (!meta) return null;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={id}
                      className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {meta.type}
                          </Badge>
                          <h4 className="font-semibold text-sm flex items-center gap-1">
                            {meta.title}
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
        </Card>

        {/* Per-class summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              Πρόοδος ανά Τμήμα
            </CardTitle>
            <CardDescription>
              Σύγκριση της προόδου challenges μεταξύ των τάξεων.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {classes.map((cls) => {
                const stats = getClassStats(cls.id);
                return (
                  <div
                    key={cls.id}
                    className={`rounded-lg border px-4 py-3 ${
                      currentClassId === cls.id ? "border-primary bg-primary/5" : "bg-card/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{cls.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {stats.completed}/{totalChallenges} challenges
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-secondary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${stats.percent}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground text-right">
                      {stats.percent}% ολοκληρωμένο
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Unlocked Achievement Badges */}
        {unlockedAchievements.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Badges Επιτυχίας Μαθητών
              </CardTitle>
              <CardDescription>
                Πρόσφατα επιτεύγματα από τις δραστηριότητες challenges.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {unlockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-3 rounded-lg border bg-card/80 px-3 py-2 shadow-sm"
                >
                  <div className="mt-0.5">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{ach.title}</p>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recommended Chapter */}
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Προτεινόμενο Chapter</CardTitle>
            <CardDescription>Συνιστώμενο για την εβδομάδα</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Ιδέες & Δημιουργικότητα</h3>
                <p className="text-muted-foreground mb-4">
                  Βοηθήστε τους μαθητές να ανακαλύψουν τη δημιουργική τους σκέψη
                </p>
                <Link to="/chapters">
                  <Button variant="secondary" className="group">
                    Εξερεύνηση
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
