import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LayoutTemplate, PiggyBank } from "lucide-react";

import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_VENTURES } from "@/config/marketplaceVentures";

const MarketplaceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const venture = useMemo(() => MARKETPLACE_VENTURES.find((v) => v.id === id), [id]);

  if (!venture) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" size="sm" type="button" onClick={() => navigate(-1)} className="mb-4 gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <p className="text-sm text-muted-foreground">We couldn&apos;t find that venture. It may have been moved.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => navigate(-1)}
              className="mb-1 inline-flex items-center gap-1.5 px-0 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to marketplace
            </Button>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {venture.ventureName}
              <Badge variant="secondary" className="text-[0.65rem] uppercase tracking-wide">
                {venture.category}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground">
              Founded by <span className="font-medium text-foreground/80">{venture.founderName}</span> · {venture.industry}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-secondary" />
              <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                Marketplace Insight
              </span>
            </div>
            <p className="max-w-xs text-right text-[0.7rem] text-muted-foreground">
              This is a learning space. KIB Coins are virtual only—no real investments, just practice making confident
              decisions.
            </p>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)] lg:items-start">
          <Card className="border border-border/80 bg-card/95 shadow-md animate-enter">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                Business Model Canvas Snapshot
              </CardTitle>
              <CardDescription>
                A focused summary pulled from the student&apos;s Venture Builder canvas: the problem, solution, and how money
                flows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Problem</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{venture.canvas.problem}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Solution</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{venture.canvas.solution}</p>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Revenue Streams
                </p>
                <p className="mt-1 text-sm leading-relaxed text-foreground/90">{venture.canvas.revenueStreams}</p>
              </div>

              <div className="mt-1 rounded-lg border border-dashed border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
                <p>
                  Teachers can use this page to run quick "investor-style" Q&amp;A: ask students how they might improve the
                  model, reduce risk, or test their assumptions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/80 bg-card/95 shadow-md animate-enter">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Elevator Pitch</CardTitle>
              <CardDescription>Here&apos;s how the founder explains their idea in one sentence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="rounded-lg border border-border/70 bg-background/60 p-3 text-sm leading-relaxed text-foreground/90">
                {venture.elevatorPitch}
              </p>
              <div className="rounded-lg border border-dashed border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
                <p>
                  Challenge: Could you pitch this idea in 30 seconds using only the Problem, Solution, and Revenue Streams
                  sections above?
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default MarketplaceDetail;
