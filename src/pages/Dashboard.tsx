import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Zap, TrendingUp, Star, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import GlobalTip from "@/components/GlobalTip";

const MINI_IDS = ["mini-1", "mini-2", "mini-3"] as const;
const CLASS_IDS = ["class-1", "class-2"] as const;
const PROJECT_IDS = ["project-1", "project-2"] as const;
const ALL_IDS = [...MINI_IDS, ...CLASS_IDS, ...PROJECT_IDS];

const Dashboard = () => {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("completedChallenges");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setCompletedIds(new Set(parsed.filter((id) => ALL_IDS.includes(id as any))));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const completedCount = completedIds.size;
  const totalChallenges = ALL_IDS.length;
  const miniCompleted = MINI_IDS.filter((id) => completedIds.has(id)).length;
  const classCompleted = CLASS_IDS.filter((id) => completedIds.has(id)).length;
  const projectsCompleted = PROJECT_IDS.filter((id) => completedIds.has(id)).length;

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Καλώς ήρθατε στο Kids in Business</h1>
          <p className="text-muted-foreground text-lg">
            Εμπνεύστε τους μαθητές σας να γίνουν οι επιχειρηματίες του αύριο
          </p>
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
                <Link to="/chapter/1">
                  <Button className="w-full group">
                    Συνέχεια
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
              {[
                { title: "Ιδέα σε 5 λεπτά", type: "Mini Challenge", icon: Star },
                { title: "Ο ρόλος του ηγέτη", type: "Δραστηριότητα", icon: TrendingUp },
                { title: "Παρουσίαση ομάδας", type: "Project", icon: BookOpen },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {action.type}
                        </Badge>
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                      </div>
                    </div>
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
