import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, PiggyBank, TrendingUp, Clock, Filter, ArrowUpRight } from "lucide-react";

import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_VENTURES, MarketplaceVenture } from "@/config/marketplaceVentures";

const LIKES_STORAGE_KEY = "kib_marketplace_likes_v1";
const WALLET_STORAGE_KEY = "kib_marketplace_wallet_v1";
const INVESTED_STORAGE_KEY = "kib_marketplace_invested_v1";
const INITIAL_COINS = 100;
const INVEST_COST = 5;

type SortMode = "trending" | "newest" | "industry";

const Marketplace = () => {
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [investedIds, setInvestedIds] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState<number>(INITIAL_COINS);
  const [walletAnimating, setWalletAnimating] = useState(false);

  useEffect(() => {
    try {
      const rawLikes = localStorage.getItem(LIKES_STORAGE_KEY);
      if (rawLikes) {
        const parsed = JSON.parse(rawLikes) as string[];
        setLikedIds(new Set(parsed));
      }
      const rawWallet = localStorage.getItem(WALLET_STORAGE_KEY);
      if (rawWallet) {
        const parsed = Number.parseInt(rawWallet, 10);
        if (!Number.isNaN(parsed)) setCoins(parsed);
      }
      const rawInvested = localStorage.getItem(INVESTED_STORAGE_KEY);
      if (rawInvested) {
        const parsed = JSON.parse(rawInvested) as string[];
        setInvestedIds(new Set(parsed));
      }
    } catch {
      // ignore corrupted local data
    }
  }, []);

  const sortedVentures = useMemo(() => {
    const ventures = [...MARKETPLACE_VENTURES];

    if (sortMode === "newest") {
      return ventures.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }

    if (sortMode === "industry") {
      return ventures.sort((a, b) => a.industry.localeCompare(b.industry));
    }

    // trending: base score + likes + investments
    return ventures.sort((a, b) => {
      const scoreA = a.baseTrendingScore + (likedIds.has(a.id) ? 5 : 0) + (investedIds.has(a.id) ? 10 : 0);
      const scoreB = b.baseTrendingScore + (likedIds.has(b.id) ? 5 : 0) + (investedIds.has(b.id) ? 10 : 0);
      return scoreB - scoreA;
    });
  }, [sortMode, likedIds, investedIds]);

  const handleToggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleInvest = (id: string) => {
    if (coins < INVEST_COST) return;

    setCoins((prev) => {
      const next = Math.max(0, prev - INVEST_COST);
      localStorage.setItem(WALLET_STORAGE_KEY, String(next));
      return next;
    });

    setInvestedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(INVESTED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });

    setWalletAnimating(true);
    window.setTimeout(() => setWalletAnimating(false), 450);
  };

  const handleOpenVenture = (id: string) => {
    navigate(`/marketplace/${id}`);
  };

  const renderSortButton = (mode: SortMode, label: string) => (
    <Button
      key={mode}
      type="button"
      size="sm"
      variant={sortMode === mode ? "default" : "outline"}
      className={
        sortMode === mode
          ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
          : "border-border bg-background/60 text-muted-foreground hover:bg-muted/60"
      }
      onClick={() => setSortMode(mode)}
    >
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">KidsInBusiness Marketplace</p>
            <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Student Ventures Gallery
              <Badge variant="outline" className="text-[0.65rem] uppercase tracking-wide">
                Live Beta
              </Badge>
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Browse real student ventures, practice "capital allocation" with virtual KIB Coins, and see how different
              business models come to life.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div
              className={`relative inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-2 text-xs shadow-sm transition-transform ${walletAnimating ? "scale-105" : "scale-100"}`}
            >
              <PiggyBank className="h-4 w-4 text-secondary" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">Student Wallet</span>
                <span className="text-sm font-semibold">
                  {coins} <span className="text-xs font-medium text-muted-foreground">KIB Coins</span>
                </span>
              </div>
            </div>
            <p className="max-w-xs text-right text-[0.7rem] text-muted-foreground">
              Pro tip: Use your coins to "back" ventures you believe in. No real money involved—just learning how investors
              think.
            </p>
          </div>
        </header>

        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Sort ventures by:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {renderSortButton("trending", "Trending")}
            {renderSortButton("newest", "Newest")}
            {renderSortButton("industry", "Industry")}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedVentures.map((venture) => {
            const isLiked = likedIds.has(venture.id);
            const isInvested = investedIds.has(venture.id);
            const canInvest = coins >= INVEST_COST;

            return (
              <Card
                key={venture.id}
                className="group flex h-full cursor-pointer flex-col border border-border/80 bg-card/95 shadow-md transition-shadow hover:shadow-lg animate-enter hover-scale"
                onClick={() => handleOpenVenture(venture.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="line-clamp-2 text-base font-semibold sm:text-lg">
                        {venture.ventureName}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        by <span className="font-medium text-foreground/80">{venture.founderName}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[0.65rem] uppercase tracking-wide">
                      {venture.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-3 pt-1 text-sm">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {venture.elevatorPitch}
                  </p>

                  <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>High student interest</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Added recently</span>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                      {venture.industry}
                    </span>
                    <div className="flex items-center gap-1 text-[0.65rem] text-muted-foreground">
                      <span className="hidden sm:inline">Tap for full Business Model Canvas</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      className={
                        "gap-1.5 text-xs" +
                        (isLiked
                          ? " bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                          : " border-border bg-background/70 text-muted-foreground hover:bg-muted/70")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(venture.id);
                      }}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
                      Support
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1.5 bg-gradient-to-r from-primary via-accent to-secondary text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg"
                      disabled={!canInvest}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!canInvest) return;
                        handleInvest(venture.id);
                      }}
                    >
                      <PiggyBank className="h-3.5 w-3.5" />
                      {isInvested ? "Invested" : `Virtual Invest (-${INVEST_COST})`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Marketplace;
