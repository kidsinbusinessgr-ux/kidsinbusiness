import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Target, Rocket, Clock, Users, CheckCircle2, Circle, Edit2, Trash2, Lock } from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import { Toaster } from "@/components/ui/toaster";
import { useAuthAndClasses } from "@/hooks/useAuthAndClasses";
import { supabase } from "@/integrations/supabase/client";
import { miniChallenges as seedMini, classActivities as seedClass, projects as seedProjects } from "@/config/actionsConfig";
import { normalizeNullable } from "@/lib/activityValidation";
import { ActivityEditForm, ActivityEditFormValues, ActivityCategory } from "@/components/actions/ActivityEditForm";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Activity = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration: string | null;
  chapter: string | null;
  chapterId: string | null;
  difficulty: string | null;
  participants: string | null;
  complexity: string | null;
  category: ActivityCategory;
  creatorId: string | null;
};

const Actions = () => {
  const { classes, loading, isAuthenticated, user } = useAuthAndClasses();
  const { language } = useLanguage();
  const [currentClassId, setCurrentClassId] = useState<string>("");
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const motivationalMessages = translations.actions.motivationalMessages[language];

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

  // Load completion state for current class
  useEffect(() => {
    const key = `completedChallenges_${currentClassId}`;
    const legacy = localStorage.getItem("completedChallenges");
    const saved = localStorage.getItem(key) ?? legacy;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setCompletedChallenges(new Set(parsed));
      } catch {
        setCompletedChallenges(new Set());
      }
    } else {
      setCompletedChallenges(new Set());
    }
  }, [currentClassId]);

  // Load activities from backend; if none exist, seed from current config
  useEffect(() => {
    const loadActivities = async () => {
      setActivitiesLoading(true);
      const { data, error } = await supabase
        .from("actions_activities")
        .select(
          "id, slug, title, description, duration, chapter, chapter_id, difficulty, participants, complexity, category, creator_id"
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading activities", error);
        toast({
          title: translations.actions.toastLoadErrorTitle[language],
          description: error.message,
          variant: "destructive",
        });
        setActivitiesLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        // Seed from existing config for first-time use (once per project)
        const seedPayload = [
          ...seedMini.map((m) => ({
            slug: m.id,
            title: m.title,
            description: m.description,
            duration: m.duration,
            chapter: m.chapter,
            chapter_id: m.chapterId,
            difficulty: m.difficulty,
            participants: null,
            complexity: null,
            category: "mini" as ActivityCategory,
          })),
          ...seedClass.map((c) => ({
            slug: c.id,
            title: c.title,
            description: c.description,
            duration: c.duration,
            chapter: c.chapter,
            chapter_id: c.chapterId,
            difficulty: null,
            participants: c.participants,
            complexity: null,
            category: "class" as ActivityCategory,
          })),
          ...seedProjects.map((p) => ({
            slug: p.id,
            title: p.title,
            description: p.description,
            duration: p.duration,
            chapter: p.chapter,
            chapter_id: p.chapterId,
            difficulty: null,
            participants: null,
            complexity: p.complexity,
            category: "project" as ActivityCategory,
          })),
        ];

        const { data: seeded, error: seedError } = await supabase
          .from("actions_activities")
          .insert(seedPayload)
          .select(
            "id, slug, title, description, duration, chapter, chapter_id, difficulty, participants, complexity, category, creator_id"
          );

        if (seedError) {
          console.error("Error seeding activities", seedError);
          toast({
            title: translations.actions.toastSeedErrorTitle[language],
            description: seedError.message,
            variant: "destructive",
          });
          setActivitiesLoading(false);
          return;
        }

        setActivities(
          (seeded || []).map((row) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            description: row.description,
            duration: row.duration,
            chapter: row.chapter,
            chapterId: row.chapter_id,
            difficulty: row.difficulty,
            participants: row.participants,
            complexity: row.complexity,
            category: row.category as ActivityCategory,
            creatorId: (row as any).creator_id ?? null,
          }))
        );
        setActivitiesLoading(false);
        return;
      }

      setActivities(
        data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          duration: row.duration,
          chapter: row.chapter,
          chapterId: row.chapter_id,
          difficulty: row.difficulty,
          participants: row.participants,
          complexity: row.complexity,
          category: row.category as ActivityCategory,
          creatorId: (row as any).creator_id ?? null,
        }))
      );
      setActivitiesLoading(false);
    };

    loadActivities();
  }, [toast, language]);

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const toggleChallenge = (id: string) => {
    const newCompleted = new Set(completedChallenges);
    const wasCompleted = newCompleted.has(id);

    if (wasCompleted) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
      // Trigger confetti only when completing (not uncompleting)
      triggerConfetti();

      // Show motivational toast
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      toast({
        title: translations.actions.toastChallengeCompletedTitle[language],
        description: randomMessage,
        duration: 3000,
      });
    }

    setCompletedChallenges(newCompleted);
    const completedArray = Array.from(newCompleted);
    const completedKey = `completedChallenges_${currentClassId}`;
    localStorage.setItem(completedKey, JSON.stringify(completedArray));

    if (!wasCompleted) {
      const historyKey = `completedChallengesHistory_${currentClassId}`;
      const rawHistory = localStorage.getItem(historyKey);
      let history: string[] = [];
      if (rawHistory) {
        try {
          history = JSON.parse(rawHistory) as string[];
        } catch {
          history = [];
        }
      }
      // keep unique order, newest at the end
      const filtered = history.filter((entryId) => entryId !== id);
      filtered.push(id);
      const trimmed = filtered.slice(-20);
      localStorage.setItem(historyKey, JSON.stringify(trimmed));
    }
  };

  const isCompleted = (id: string) => completedChallenges.has(id);

  const filterByStatus = <T extends { id: string }>(items: T[]): T[] => {
    if (statusFilter === "completed") {
      return items.filter((item) => isCompleted(item.id));
    }
    if (statusFilter === "incomplete") {
      return items.filter((item) => !isCompleted(item.id));
    }
    return items;
  };

  const resetProgress = () => {
    setCompletedChallenges(new Set());
    classes.forEach((cls) => {
      localStorage.removeItem(`completedChallenges_${cls.id}`);
      localStorage.removeItem(`completedChallengesHistory_${cls.id}`);
    });
    toast({
      title: translations.actions.toastResetProgressTitle[language],
      description: translations.actions.toastResetProgressDescription[language],
      duration: 3000,
    });
  };

  const handleDeleteActivity = async (id: string) => {
    if (!isAuthenticated) {
      toast({
        title: translations.actions.toastAuthRequiredTitle[language],
        description: translations.actions.toastAuthRequiredDeleteDescription[language],
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("actions_activities").delete().eq("id", id);

    if (error) {
      toast({
        title: translations.actions.toastDeleteFailureTitle[language],
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Remove from local state
    setActivities((prev) => prev.filter((a) => a.id !== id));

    // Remove any stored completion/history entries for this activity across classes
    classes.forEach((cls) => {
      const completedKey = `completedChallenges_${cls.id}`;
      const historyKey = `completedChallengesHistory_${cls.id}`;

      const completedRaw = localStorage.getItem(completedKey);
      if (completedRaw) {
        try {
          const parsed = JSON.parse(completedRaw) as string[];
          const filtered = parsed.filter((entryId) => entryId !== id);
          localStorage.setItem(completedKey, JSON.stringify(filtered));
        } catch {
          // ignore parse errors
        }
      }

      const historyRaw = localStorage.getItem(historyKey);
      if (historyRaw) {
        try {
          const parsed = JSON.parse(historyRaw) as string[];
          const filtered = parsed.filter((entryId) => entryId !== id);
          localStorage.setItem(historyKey, JSON.stringify(filtered));
        } catch {
          // ignore parse errors
        }
      }
    });

    // Also clear from current in-memory completed set
    setCompletedChallenges((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    toast({
      title: translations.actions.toastDeleteSuccessTitle[language],
      description: translations.actions.toastDeleteSuccessDescription[language],
    });
  };

  const handleEditActivity = (id: string) => {
    setEditingId(id);
  };
 
  const handleCancelEdit = () => {
    setEditingId(null);
  };
 
  const handleSaveEdit = async (
    id: string,
    values: ActivityEditFormValues,
    category: ActivityCategory
  ) => {
    if (!isAuthenticated) {
      toast({
        title: translations.actions.toastAuthRequiredTitle[language],
        description: translations.actions.toastAuthRequiredEditDescription[language],
        variant: "destructive",
      });
      return;
    }
 
    const payload = {
      title: values.title.trim(),
      description: normalizeNullable(values.description),
      duration: normalizeNullable(values.duration),
      chapter: normalizeNullable(values.chapter),
      chapter_id: normalizeNullable(values.chapterId),
      difficulty: normalizeNullable(values.difficulty),
      participants: normalizeNullable(values.participants),
      complexity: normalizeNullable(values.complexity),
    };
 
    const { error } = await supabase
      .from("actions_activities")
      .update(payload)
      .eq("id", id);
 
    if (error) {
      toast({
        title: translations.actions.toastUpdateFailureTitle[language],
        description: error.message,
        variant: "destructive",
      });
      return;
    }
 
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              title: payload.title,
              description: payload.description,
              duration: payload.duration,
              chapter: payload.chapter,
              chapterId: payload.chapter_id ?? null,
              difficulty: payload.difficulty,
              participants: payload.participants,
              complexity: payload.complexity,
            }
          : a
      )
    );
 
    setEditingId(null);
 
    toast({
      title: translations.actions.toastUpdateSuccessTitle[language],
      description: translations.actions.toastUpdateSuccessDescription[language],
    });
  };

  const handleCreateActivity = async (category: ActivityCategory) => {
    if (!isAuthenticated) {
      toast({
        title: translations.actions.toastAuthRequiredTitle[language],
        description: translations.actions.toastAuthRequiredCreateDescription[language],
        variant: "destructive",
      });
      return;
    }

    const now = Date.now();
    const slug = `${category}-${now}`;
    const defaultTitle =
      category === "mini"
        ? "Νέο Mini Challenge"
        : category === "class"
        ? "Νέα δραστηριότητα τάξης"
        : "Νέο project";

    const { data, error } = await supabase
      .from("actions_activities")
      .insert({
        slug,
        title: defaultTitle,
        category,
      })
      .select(
        "id, slug, title, description, duration, chapter, chapter_id, difficulty, participants, complexity, category, creator_id"
      )
      .single();

    if (error) {
      toast({
        title: translations.actions.toastCreateFailureTitle[language],
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setActivities((prev) => [
      ...prev,
      {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        duration: data.duration,
        chapter: data.chapter,
        chapterId: data.chapter_id,
        difficulty: data.difficulty,
        participants: data.participants,
        complexity: data.complexity,
        category: data.category as ActivityCategory,
        creatorId: (data as any).creator_id ?? user?.id ?? null,
      },
    ]);

    toast({
      title: translations.actions.toastCreateSuccessTitle[language],
      description: translations.actions.toastCreateSuccessDescription[language],
    });
  };

  // Derive activities per category from backend data
  const miniChallenges = activities.filter((a) => a.category === "mini");
  const classActivities = activities.filter((a) => a.category === "class");
  const projects = activities.filter((a) => a.category === "project");

  const totalChallenges = activities.length;
  const completedCount = completedChallenges.size;
  const completionPercentage = totalChallenges
    ? Math.round((completedCount / totalChallenges) * 100)
    : 0;

  // Calculate stats by category
  const miniCompleted = miniChallenges.filter((c) => isCompleted(c.id)).length;
  const classCompleted = classActivities.filter((c) => isCompleted(c.id)).length;
  const projectsCompleted = projects.filter((c) => isCompleted(c.id)).length;

  const stats = [
    {
      type: "Mini Challenges",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10",
      completed: miniCompleted,
      total: miniChallenges.length,
      percentage: Math.round((miniCompleted / miniChallenges.length) * 100),
    },
    {
      type: "Δραστηριότητες Τάξης",
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      completed: classCompleted,
      total: classActivities.length,
      percentage: Math.round((classCompleted / classActivities.length) * 100),
    },
    {
      type: "Projects",
      icon: Rocket,
      color: "text-accent",
      bgColor: "bg-accent/10",
      completed: projectsCompleted,
      total: projects.length,
      percentage: Math.round((projectsCompleted / projects.length) * 100),
    },
  ];

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
      unlocked: miniCompleted === miniChallenges.length && miniChallenges.length > 0,
    },
    {
      id: "all-class",
      title: "Όλες οι Δραστηριότητες Τάξης",
      description: "Ολοκλήρωσε όλες τις Δραστηριότητες Τάξης.",
      unlocked: classCompleted === classActivities.length && classActivities.length > 0,
    },
    {
      id: "all-projects",
      title: "Όλα τα Projects",
      description: "Ολοκλήρωσε όλα τα Projects.",
      unlocked: projectsCompleted === projects.length && projects.length > 0,
    },
    {
      id: "all-challenges",
      title: "Master of Challenges",
      description: "Ολοκλήρωσε όλα τα διαθέσιμα challenges.",
      unlocked: completedCount === totalChallenges && totalChallenges > 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            {
              label: translations.actions.breadcrumbLabel[language],
            },
          ]}
        />
        
        <div className="mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold">
                {translations.actions.pageTitle[language]}
              </h1>
              <p className="text-muted-foreground text-lg">
                {translations.actions.pageSubtitle[language]}
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-4 py-2">
                  {completedCount}/{totalChallenges} {language === "el" ? "ολοκληρώθηκε" : "completed"}
                </Badge>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {completionPercentage}%
                </Badge>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="self-end text-xs sm:text-sm">
                    {translations.actions.resetProgressButton[language]}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {translations.actions.resetDialogTitle[language]}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {translations.actions.resetDialogDescription[language]}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {language === "el" ? "Άκυρο" : "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={resetProgress}>
                      {language === "el" ? "Ναι, επαναφορά" : "Yes, reset"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {translations.actions.overallProgressLabel[language]}
              </span>
              <span className="text-muted-foreground">
                {completedCount} {translations.actions.overallProgressOfLabel[language]} {totalChallenges}{" "}
                {translations.actions.overallProgressActivitiesLabel[language]}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          {/* Financial Literacy Legend */}
          <div className="mt-3 inline-flex items-start gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs md:text-sm text-muted-foreground">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide mt-0.5">
              {translations.actions.financialLiteracyBadge[language]}
            </Badge>
            <span>
              {translations.actions.financialLiteracyDescription[language]}
            </span>
          </div>
        </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="mini" className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <TabsList className="grid w-full md:w-auto grid-cols-3">
                    <TabsTrigger value="mini">Mini Challenges</TabsTrigger>
                    <TabsTrigger value="class">
                      {language === "el" ? "Δραστηριότητες Τάξης" : "Class activities"}
                    </TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>

              {isAuthenticated && (
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={() => handleCreateActivity("mini")}>
                    + Mini
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCreateActivity("class")}>
                    + Τάξης
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleCreateActivity("project")}>
                    + Project
                  </Button>
                </div>
              )}

                <div className="flex flex-col gap-2 items-stretch sm:flex-row sm:items-center sm:gap-3">
                  {/* Class Selector */}
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

                  {/* Status Filter Buttons */}
                  <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 p-1 text-xs md:text-sm">
                    <Button
                      type="button"
                      variant={statusFilter === "all" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-full px-3 py-1 h-8"
                      onClick={() => setStatusFilter("all")}
                    >
                      {translations.actions.statusFilterAll[language]}
                    </Button>
                    <Button
                      type="button"
                      variant={statusFilter === "completed" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-full px-3 py-1 h-8"
                      onClick={() => setStatusFilter("completed")}
                    >
                      {translations.actions.statusFilterCompleted[language]}
                    </Button>
                    <Button
                      type="button"
                      variant={statusFilter === "incomplete" ? "default" : "ghost"}
                      size="sm"
                      className="rounded-full px-3 py-1 h-8"
                      onClick={() => setStatusFilter("incomplete")}
                    >
                      {translations.actions.statusFilterIncomplete[language]}
                    </Button>
                  </div>
                </div>
              </div>

              <TabsContent value="mini" className="space-y-4">
                {filterByStatus(miniChallenges).map((challenge) => {
                  const canModify = isAuthenticated && user && challenge.creatorId === user.id;
                  return (
                    <Card
                      key={challenge.id}
                      className={`hover:shadow-lg transition-all duration-300 group relative ${
                        isCompleted(challenge.id) ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Zap className="w-5 h-5 text-primary" />
                              {challenge.chapter && (
                                <Badge variant="secondary">{challenge.chapter}</Badge>
                              )}
                              {challenge.slug === "mini-4" && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                  Χρηματοοικονομικός Γραμματισμός
                                </Badge>
                              )}
                              {isCompleted(challenge.id) && (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ολοκληρώθηκε
                                </Badge>
                              )}
                            </div>
                            <CardTitle>{challenge.title}</CardTitle>
                            {editingId === challenge.id ? null : (
                              challenge.description && (
                                <CardDescription className="mt-2">
                                  {challenge.description}
                                </CardDescription>
                              )
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => toggleChallenge(challenge.id)}
                              className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95"
                              aria-label={
                                isCompleted(challenge.id)
                                  ? "Mark as incomplete"
                                  : "Mark as complete"
                              }
                            >
                              {isCompleted(challenge.id) ? (
                                <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-300" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>
                            {canModify ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditActivity(challenge.id)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              isAuthenticated &&
                              user &&
                              challenge.creatorId && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Lock className="w-3 h-3" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === "el"
                                        ? "Μόνο ο/η δημιουργός μπορεί να επεξεργαστεί αυτή τη δράση."
                                        : "Only the creator can edit this activity."}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingId === challenge.id ? (
                          <ActivityEditForm
                            category={challenge.category}
                            initialValues={{
                              title: challenge.title,
                              description: challenge.description,
                              duration: challenge.duration,
                              chapter: challenge.chapter,
                              chapterId: challenge.chapterId,
                              difficulty: challenge.difficulty,
                              participants: challenge.participants,
                              complexity: challenge.complexity,
                            }}
                            onSubmit={(values) => handleSaveEdit(challenge.id, values, challenge.category)}
                            onCancel={handleCancelEdit}
                          />
                        ) : (
                          <>
                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                              {challenge.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {challenge.duration}
                                </div>
                              )}
                              {challenge.difficulty && (
                                <Badge variant="outline">{challenge.difficulty}</Badge>
                              )}
                            </div>
                            {challenge.chapterId && (
                              <Link to={`/chapters/${challenge.chapterId}`}>
                                <Button className="w-full">Ξεκινήστε το Challenge</Button>
                              </Link>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="class" className="space-y-4">
                {filterByStatus(classActivities).map((activity) => {
                  const canModify = isAuthenticated && user && activity.creatorId === user.id;
                  return (
                    <Card
                      key={activity.id}
                      className={`hover:shadow-lg transition-all duration-300 group relative ${
                        isCompleted(activity.id) ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-5 h-5 text-secondary" />
                              {activity.chapter && (
                                <Badge variant="secondary">{activity.chapter}</Badge>
                              )}
                              {activity.slug === "class-3" && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                  Χρηματοοικονομικός Γραμματισμός
                                </Badge>
                              )}
                              {isCompleted(activity.id) && (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ολοκληρώθηκε
                                </Badge>
                              )}
                            </div>
                            <CardTitle>{activity.title}</CardTitle>
                            {editingId === activity.id ? null : (
                              activity.description && (
                                <CardDescription className="mt-2">
                                  {activity.description}
                                </CardDescription>
                              )
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => toggleChallenge(activity.id)}
                              className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95"
                              aria-label={
                                isCompleted(activity.id)
                                  ? "Mark as incomplete"
                                  : "Mark as complete"
                              }
                            >
                              {isCompleted(activity.id) ? (
                                <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-300" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>
                            {canModify ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditActivity(activity.id)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Διαγραφή δραστηριότητας;
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Αυτή η ενέργεια θα αφαιρέσει τη δραστηριότητα από όλες τις
                                        τάξεις και θα διαγράψει τυχόν πρόοδο που έχει γίνει σε αυτήν.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteActivity(activity.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Ναι, διαγραφή
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ) : (
                              isAuthenticated &&
                              user &&
                              activity.creatorId && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Lock className="w-3 h-3" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === "el"
                                        ? "Μόνο ο/η δημιουργός μπορεί να επεξεργαστεί ή να διαγράψει αυτή τη δραστηριότητα."
                                        : "Only the creator can edit or delete this activity."}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {editingId === activity.id ? (
                          <ActivityEditForm
                            category={activity.category}
                            initialValues={{
                              title: activity.title,
                              description: activity.description,
                              duration: activity.duration,
                              chapter: activity.chapter,
                              chapterId: activity.chapterId,
                              difficulty: activity.difficulty,
                              participants: activity.participants,
                              complexity: activity.complexity,
                            }}
                            onSubmit={(values) => handleSaveEdit(activity.id, values, activity.category)}
                            onCancel={handleCancelEdit}
                          />
                        ) : (
                          <>
                            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                              {activity.duration && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {activity.duration}
                                </div>
                              )}
                              {activity.participants && (
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {activity.participants}
                                </div>
                              )}
                            </div>
                            {activity.chapterId && (
                              <Link to={`/chapters/${activity.chapterId}`}>
                                <Button variant="secondary" className="w-full">
                                  Δείτε τη δραστηριότητα
                                </Button>
                              </Link>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {filterByStatus(projects).map((project) => {
                  const canModify = isAuthenticated && user && project.creatorId === user.id;
                  return (
                    <Card
                      key={project.id}
                      className={`hover:shadow-lg transition-all duration-300 group relative ${
                        isCompleted(project.id) ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Rocket className="w-5 h-5 text-accent" />
                              {project.chapter && (
                                <Badge variant="secondary">{project.chapter}</Badge>
                              )}
                              {project.slug === "project-3" && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                  Χρηματοοικονομικός Γραμματισμός
                                </Badge>
                              )}
                              {isCompleted(project.id) && (
                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Ολοκληρώθηκε
                                </Badge>
                              )}
                            </div>
                            <CardTitle>{project.title}</CardTitle>
                            {project.description && (
                              <CardDescription className="mt-2">
                                {project.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => toggleChallenge(project.id)}
                              className="p-2 rounded-full hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95"
                              aria-label={
                                isCompleted(project.id)
                                  ? "Mark as incomplete"
                                  : "Mark as complete"
                              }
                            >
                              {isCompleted(project.id) ? (
                                <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-300" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>
                            {canModify ? (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditActivity(project.id)}
                                >
                                  <Edit2 className="w-3 h-3" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Διαγραφή project;
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Αυτή η ενέργεια θα αφαιρέσει το project από όλες τις τάξεις και
                                        θα διαγράψει τυχόν πρόοδο που έχει γίνει σε αυτό.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Άκυρο</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteActivity(project.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Ναι, διαγραφή
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ) : (
                              isAuthenticated &&
                              user &&
                              project.creatorId && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Lock className="w-3 h-3" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {language === "el"
                                        ? "Μόνο ο/η δημιουργός μπορεί να επεξεργαστεί ή να διαγράψει αυτό το project."
                                        : "Only the creator can edit or delete this project."}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          {project.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {project.duration}
                            </div>
                          )}
                          {project.complexity && (
                            <Badge variant="outline">
                              Πολυπλοκότητα: {project.complexity}
                            </Badge>
                          )}
                        </div>
                        {project.chapterId && (
                          <Link to={`/chapters/${project.chapterId}`}>
                            <Button variant="default" className="w-full">
                              Ξεκινήστε το Project
                            </Button>
                          </Link>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <GlobalTip tip="Οι Mini Challenges είναι ιδανικά για warm-up ή για γεμίσματα χρόνου. Τα Projects απαιτούν προγραμματισμό και συνέχεια." />

            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Στατιστικά Προόδου</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                            <Icon className={`w-4 h-4 ${stat.color}`} />
                          </div>
                          <span className="text-sm font-medium">{stat.type}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {stat.completed}/{stat.total}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <Progress value={stat.percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">
                          {stat.percentage}% ολοκληρωμένο
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Badges Επιτυχίας</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                      ach.unlocked ? "bg-primary/5 border-primary/40" : "bg-muted/40 border-dashed"
                    }`}
                  >
                    <div className="mt-0.5">
                      {ach.unlocked ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          ach.unlocked ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {ach.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Actions;
