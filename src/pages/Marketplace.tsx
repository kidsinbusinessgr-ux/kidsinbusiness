import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, PiggyBank, TrendingUp, Clock, Filter, ArrowUpRight, Rocket, QrCode, MessageCircle } from "lucide-react";

import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_VENTURES, MarketplaceVenture } from "@/config/marketplaceVentures";
import { PitchVideo } from "@/components/PitchVideo";

const LIKES_STORAGE_KEY = "kib_marketplace_likes_v1";
const WALLET_STORAGE_KEY = "kib_marketplace_wallet_v1";
const INVESTED_STORAGE_KEY = "kib_marketplace_invested_v1";
const INITIAL_COINS = 100;
const INVEST_COST = 5;

type SortMode = "trending" | "newest" | "industry";

type CategoryStyle = {
  border: string;
  glow: string;
  badge: string;
};

type ReactionCounts = {
  idea: number;
  moon: number;
  value: number;
};

const getCategoryStyle = (category: MarketplaceVenture["category"]): CategoryStyle => {
  switch (category) {
    case "Social Impact":
      return {
        border: "border-primary/50",
        glow: "shadow-[0_0_40px_rgba(217,119,89,0.35)]",
        badge: "bg-primary/20 text-primary-foreground/90",
      };
    case "Tech":
    case "FinTech":
      return {
        border: "border-secondary/60",
        glow: "shadow-[0_0_40px_rgba(56,189,248,0.4)]",
        badge: "bg-secondary/20 text-secondary-foreground/90",
      };
    case "Sustainability":
    case "Environment":
      return {
        border: "border-accent/60",
        glow: "shadow-[0_0_40px_rgba(74,222,128,0.35)]",
        badge: "bg-accent/20 text-accent-foreground/90",
      };
    case "Food":
    case "Education":
    default:
      return {
        border: "border-border/70",
        glow: "shadow-[0_0_32px_rgba(148,163,184,0.35)]",
        badge: "bg-muted text-muted-foreground",
      };
  }
};

const getLevelLabel = (score: number) => {
  if (score >= 90) return "Level 3: Builder";
  if (score >= 75) return "Level 2: Maker";
  return "Level 1: Explorer";
};

const Marketplace = () => {
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState<SortMode>("trending");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [investedIds, setInvestedIds] = useState<Set<string>>(new Set());
  const [coins, setCoins] = useState<number>(INITIAL_COINS);
  const [walletAnimating, setWalletAnimating] = useState(false);
  const [flippedId, setFlippedId] = useState<string | null>(null);
  const [reactions, setReactions] = useState<Record<string, ReactionCounts>>({});
  const [openMentorIds, setOpenMentorIds] = useState<Set<string>>(new Set());
  const [mentorNotes, setMentorNotes] = useState<Record<string, string>>({});

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

  const handleAddReaction = (id: string, key: keyof ReactionCounts) => {
    setReactions((prev) => {
      const current = prev[id] || { idea: 0, moon: 0, value: 0 };
      return {
        ...prev,
        [id]: {
          ...current,
          [key]: current[key] + 1,
        },
      };
    });
  };

  const toggleMentor = (id: string) => {
    setOpenMentorIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
            const categoryStyle = getCategoryStyle(venture.category);

            const launchDays = (() => {
              const created = new Date(venture.createdAt);
              const now = new Date();
              const diff = Math.max(0, now.getTime() - created.getTime());
              return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
            })();

            const likesCount = venture.baseTrendingScore % 30 + (isLiked ? 3 : 0);
            const investedCoins = (investedIds.has(venture.id) ? INVEST_COST : 0) + (venture.baseTrendingScore % 10);
            const ventureReactions = reactions[venture.id] || { idea: 0, moon: 0, value: 0 };
            const isMentorOpen = openMentorIds.has(venture.id);
            const isFlipped = flippedId === venture.id;

            return (
              <div key={venture.id} className="[perspective:1400px]">
                <Card
                  className={`group relative h-full cursor-pointer overflow-hidden rounded-2xl border bg-card/5 bg-clip-padding backdrop-blur-xl transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:rotate-[0.5deg] hover:shadow-xl animate-enter ${categoryStyle.border} ${categoryStyle.glow}`}
                  onClick={() => !isFlipped && handleOpenVenture(venture.id)}
                >
                  <div
                    className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                  >
                    {/* Front side */}
                    <div className="relative flex h-full flex-col p-4 sm:p-5 [backface-visibility:hidden]">
                      <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
                        <div className="absolute inset-[-40%] bg-[radial-gradient(circle_at_0%_0%,hsl(var(--primary)/0.2),transparent_55%),radial-gradient(circle_at_100%_0%,hsl(var(--secondary)/0.18),transparent_55%),radial-gradient(circle_at_0%_100%,hsl(var(--accent)/0.18),transparent_55%)]" />
                      </div>

                      <div className="relative flex flex-1 flex-col">
                        <header className="mb-3 flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h2 className="line-clamp-2 text-base font-semibold tracking-tight sm:text-lg">
                              {venture.ventureName}
                            </h2>
                            <p className="text-[0.75rem] text-muted-foreground">
                              by <span className="font-medium text-foreground/90">{venture.founderName}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className={`text-[0.6rem] uppercase tracking-wide backdrop-blur-sm ${categoryStyle.badge}`}
                            >
                              {venture.category}
                            </Badge>
                            <span className="rounded-full bg-background/60 px-2 py-0.5 text-[0.6rem] font-medium text-muted-foreground shadow-sm">
                              {getLevelLabel(venture.baseTrendingScore)}
                            </span>
                          </div>
                        </header>

                        <section className="mb-3 rounded-xl border border-border/60 bg-background/70 px-3 py-2.5 text-sm leading-relaxed shadow-sm">
                          <p className="line-clamp-3 text-[0.85rem] font-medium">
                            {venture.elevatorPitch}
                          </p>
                        </section>

                        <section className="mt-auto space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-xs font-semibold shadow-sm">
                                {venture.founderName.charAt(0).toUpperCase()}
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-medium text-foreground/90">{venture.founderName}</p>
                                <p className="text-[0.7rem] text-muted-foreground">Founder &amp; CEO</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="pointer-events-auto inline-flex items-center justify-center rounded-full border border-border/70 bg-background/70 p-1.5 text-[0.65rem] text-muted-foreground shadow-sm transition-colors hover:bg-muted/70"
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = `${window.location.origin}/marketplace/${venture.id}`;
                                if (navigator.share) {
                                  navigator
                                    .share({
                                      title: venture.ventureName,
                                      text: "Check out this student venture on KidsInBusiness Marketplace",
                                      url: shareUrl,
                                    })
                                    .catch(() => {});
                                } else if (navigator.clipboard) {
                                  navigator.clipboard.writeText(shareUrl).catch(() => {});
                                }
                              }}
                            >
                              <QrCode className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-background/60 px-2 py-1.5 text-center text-[0.7rem]">
                            <div className="flex flex-col items-center gap-0.5">
                              <Heart className="h-3.5 w-3.5 text-primary" />
                              <span className="font-semibold">{likesCount}</span>
                              <span className="text-[0.6rem] text-muted-foreground">Likes</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <PiggyBank className="h-3.5 w-3.5 text-secondary" />
                              <span className="font-semibold">{investedCoins}</span>
                              <span className="text-[0.6rem] text-muted-foreground">Coins raised</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <Rocket className="h-3.5 w-3.5 text-accent" />
                              <span className="font-semibold">{launchDays}</span>
                              <span className="text-[0.6rem] text-muted-foreground">Days live</span>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                type="button"
                                variant={isLiked ? "default" : "outline"}
                                size="sm"
                                className={
                                  "pointer-events-auto gap-1.5 text-xs" +
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
                                className="pointer-events-auto gap-1.5 bg-gradient-to-r from-primary via-accent to-secondary text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg"
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

                            {venture.pitchVideoId && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="pointer-events-auto inline-flex items-center gap-1.5 text-[0.7rem] text-muted-foreground transition-all duration-200 hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFlippedId(venture.id);
                                }}
                              >
                                <TrendingUp className="h-3 w-3" />
                                Watch Pitch
                              </Button>
                            )}
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Back side */}
                    {venture.pitchVideoId && (
                      <div className="absolute inset-0 flex h-full flex-col p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">Venture Pitch</p>
                            <h2 className="line-clamp-1 text-sm font-semibold tracking-tight">{venture.ventureName}</h2>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7 rounded-full border-border/70 bg-background/70 text-[0.7rem]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFlippedId(null);
                            }}
                          >
                            ←
                          </Button>
                        </div>

                        <PitchVideo
                          youtubeUrl={`https://www.youtube.com/watch?v=${venture.pitchVideoId}`}
                          title={`${venture.ventureName} pitch`}
                        />

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-[0.75rem]">
                            <p className="font-medium text-foreground">Pitch Feedback</p>
                            <span className="text-[0.65rem] text-muted-foreground">Tap to react</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="flex-1 rounded-full border border-border/70 bg-background/70 px-2 py-1 text-xs shadow-sm transition hover:bg-muted/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddReaction(venture.id, "idea");
                              }}
                            >
                              <span className="mr-1.5">💡</span>
                              <span className="font-medium">Smart Idea</span>
                              <span className="ml-auto text-[0.7rem] text-muted-foreground">{ventureReactions.idea}</span>
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-full border border-border/70 bg-background/70 px-2 py-1 text-xs shadow-sm transition hover:bg-muted/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddReaction(venture.id, "moon");
                              }}
                            >
                              <span className="mr-1.5">🚀</span>
                              <span className="font-medium">To the Moon</span>
                              <span className="ml-auto text-[0.7rem] text-muted-foreground">{ventureReactions.moon}</span>
                            </button>
                            <button
                              type="button"
                              className="flex-1 rounded-full border border-border/70 bg-background/70 px-2 py-1 text-xs shadow-sm transition hover:bg-muted/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddReaction(venture.id, "value");
                              }}
                            >
                              <span className="mr-1.5">💎</span>
                              <span className="font-medium">High Value</span>
                              <span className="ml-auto text-[0.7rem] text-muted-foreground">{ventureReactions.value}</span>
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-[0.75rem]">
                            <p className="font-medium text-foreground">Mentor Note</p>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMentor(venture.id);
                              }}
                            >
                              <MessageCircle className="h-3 w-3" />
                              Give Feedback
                            </Button>
                          </div>
                          {isMentorOpen && (
                            <textarea
                              className="min-h-[72px] w-full resize-none rounded-lg border border-border/70 bg-background/70 p-2 text-xs shadow-inner outline-none focus-visible:ring-1 focus-visible:ring-primary"
                              placeholder="Share a short mentor note or encouragement for this founder..."
                              value={mentorNotes[venture.id] || ""}
                              onChange={(e) =>
                                setMentorNotes((prev) => ({
                                  ...prev,
                                  [venture.id]: e.target.value,
                                }))
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Marketplace;
