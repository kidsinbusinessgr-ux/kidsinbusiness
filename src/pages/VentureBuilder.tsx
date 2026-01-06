import { useEffect, useMemo, useState } from "react";
import { Lightbulb, ArrowRight, ArrowLeft, Save, Sparkles, LayoutTemplate } from "lucide-react";
import confetti from "canvas-confetti";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STEPS = [
  {
    id: "problem",
    title: "Step 1: The Problem",
    label: "The Problem",
    description: "What frustration, need, or challenge are you solving for your customers?",
    placeholder: "e.g. People walking home from school are thirsty and don’t have a fun, affordable drink option.",
    aiExample:
      "If you are building a lemonade stand, your Problem could be: People are hot and thirsty after school, but don’t have a fun, affordable drink nearby.",
    fieldKey: "problem" as const,
  },
  {
    id: "solution",
    title: "Step 2: The Solution",
    label: "The Solution",
    description: "How does your venture solve the problem in a simple, clear way?",
    placeholder: "e.g. A colourful lemonade stand near school that sells cold, flavoured drinks made by students.",
    aiExample:
      "For a lemonade stand, your Solution could be: Set up a bright stand near school that sells cold lemonade in different flavours and sizes.",
    fieldKey: "solution" as const,
  },
  {
    id: "revenue",
    title: "Step 3: Revenue Streams",
    label: "Revenue Streams",
    description: "How will your venture make money? Think about prices, add-ons, and repeat customers.",
    placeholder:
      "e.g. Sell cups of lemonade, offer a loyalty card (buy 5, get 1 free), and upsell snacks like cookies.",
    aiExample:
      "For a lemonade stand, Revenue Streams could be: Selling cups of lemonade, offering refills at a lower price, and selling snacks.",
    fieldKey: "revenueStreams" as const,
  },
];

type VentureFormState = {
  ventureName: string;
  problem: string;
  solution: string;
  revenueStreams: string;
};

const STORAGE_KEY = "ventureBuilderDraft";

function triggerConfetti() {
  const duration = 1600;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

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
}

const VentureBuilder = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [form, setForm] = useState<VentureFormState>(() => ({
    ventureName: "",
    problem: "",
    solution: "",
    revenueStreams: "",
  }));
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { form?: VentureFormState; lastSavedAt?: string };
      if (parsed.form) {
        setForm(parsed.form);
        const completed: string[] = [];
        if (parsed.form.problem.trim()) completed.push("problem");
        if (parsed.form.solution.trim()) completed.push("solution");
        if (parsed.form.revenueStreams.trim()) completed.push("revenue");
        setCompletedStepIds(completed);
      }
      if (parsed.lastSavedAt) {
        setLastSavedAt(parsed.lastSavedAt);
      }
    } catch {
      // ignore corrupted drafts
    }
  }, []);

  const currentStep = STEPS[currentStepIndex];

  const completedCount = useMemo(() => completedStepIds.length, [completedStepIds]);
  const totalSteps = STEPS.length;
  const progressPercent = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  const handleFieldChange = (field: keyof VentureFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markStepCompleted = (stepId: string, shouldTriggerConfetti = false) => {
    setCompletedStepIds((prev) => {
      if (prev.includes(stepId)) return prev;
      if (shouldTriggerConfetti) {
        triggerConfetti();
      }
      return [...prev, stepId];
    });
  };

  const handleNext = () => {
    const step = STEPS[currentStepIndex];
    const value = form[step.fieldKey].trim();
    if (value) {
      markStepCompleted(step.id, true);
    }
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSaveDraft = () => {
    const payload = {
      form,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setLastSavedAt(payload.lastSavedAt);
  };

  const formattedLastSaved = useMemo(() => {
    if (!lastSavedAt) return null;
    const d = new Date(lastSavedAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });
  }, [lastSavedAt]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background/95 to-card/95 text-foreground">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:flex-row lg:items-start">
        <section className="w-full space-y-6 lg:w-3/5 animate-enter">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Venture Builder</p>
              <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Business Model Canvas
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                  Guided
                </span>
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Move through each step to turn your idea into a simple, clear business story. Your summary updates in real
                time on the right.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    className="text-muted"
                    stroke="currentColor"
                    strokeWidth={8}
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                  />
                  <circle
                    className="text-primary"
                    stroke="hsl(var(--primary))"
                    strokeWidth={8}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{
                      strokeDasharray: `${circumference} ${circumference}`,
                      strokeDashoffset,
                      transition: "stroke-dashoffset 0.4s ease-out",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs">
                  <span className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">Progress</span>
                  <span className="text-lg font-semibold">{progressPercent}%</span>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {completedCount}/{totalSteps} steps
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="rounded-xl border border-border/70 bg-card/95 p-3 sm:p-4 shadow-md">
            <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
              {STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = completedStepIds.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStepIndex(index)}
                    className={
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                      (isActive
                        ? "border-primary bg-primary/10 text-primary-foreground/80"
                        : isCompleted
                          ? "border-primary/60 bg-primary/5 text-primary"
                          : "border-border bg-background/40 text-muted-foreground hover:bg-muted/50")
                    }
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-[0.7rem] font-semibold">
                      {index + 1}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="inline sm:hidden">{index + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/60 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
                    <Sparkles className="h-5 w-5 text-accent" />
                    {currentStep.title}
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">{currentStep.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span>{currentStep.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-border/70 bg-background/80 text-[0.65rem] text-muted-foreground hover:bg-muted/60"
                        >
                          <Lightbulb className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6} className="max-w-xs text-xs leading-snug">
                        <p>{currentStep.aiExample}</p>
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <Textarea
                    rows={5}
                    value={form[currentStep.fieldKey]}
                    onChange={(e) => handleFieldChange(currentStep.fieldKey, e.target.value)}
                    placeholder={currentStep.placeholder}
                    className="bg-background/80 text-sm"
                  />
                </div>

                {currentStepIndex === 0 && (
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span>Venture Name (optional)</span>
                    </label>
                    <Input
                      value={form.ventureName}
                      onChange={(e) => handleFieldChange("ventureName", e.target.value)}
                      placeholder="e.g. Cool Breeze Lemonade Co."
                      className="bg-background/80 text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={handleBack} disabled={currentStepIndex === 0}>
                    <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                    Back
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={handleNext}
                    disabled={currentStepIndex === STEPS.length - 1 && !form[currentStep.fieldKey].trim()}
                  >
                    {currentStepIndex === STEPS.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" type="button" onClick={handleSaveDraft}>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    Save draft
                  </Button>
                  {formattedLastSaved && (
                    <span className="text-[0.7rem] text-muted-foreground">Last saved at {formattedLastSaved}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-2/5 animate-enter">
          <Card className="sticky top-4 border border-border/80 bg-card/95 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <LayoutTemplate className="h-5 w-5 text-secondary" />
                Executive Summary
              </CardTitle>
              <CardDescription>
                A live snapshot of your venture that updates as you type. Use it to pitch your idea in 60 seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Venture</p>
                <p className="mt-1 text-base font-semibold">
                  {form.ventureName.trim() || "Untitled venture"}
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Problem
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">
                    {form.problem.trim() ||
                      "Describe who is struggling and what feels annoying, unfair, or inefficient in their day."}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Solution
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">
                    {form.solution.trim() ||
                      "Explain how your venture makes life better, easier, or more fun for the people you serve."}
                  </p>
                </div>

                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Revenue Streams
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">
                    {form.revenueStreams.trim() ||
                      "Share the main ways money will flow into your venture: what you sell, who pays, and how often."}
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-lg border border-dashed border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
                <p>
                  Tip: When all three sections feel clear and exciting, you&apos;re ready to share this summary with your
                  teacher or classmates for feedback.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default VentureBuilder;
