import { useState } from "react";
import { Rocket, Sparkles, Lightbulb, Store, GraduationCap } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const founderLevels = [
  {
    id: "idea",
    label: "Idea Phase",
    description: "You have a spark and a problem you care about.",
    threshold: 20,
  },
  {
    id: "research",
    label: "Market Research",
    description: "You are talking to potential customers and testing assumptions.",
    threshold: 45,
  },
  {
    id: "mvp",
    label: "MVP Build",
    description: "You are prototyping and testing a simple version of your solution.",
    threshold: 70,
  },
  {
    id: "launch",
    label: "Launch & Iterate",
    description: "You are in the wild, learning from real users.",
    threshold: 100,
  },
] as const;

type FounderSection = "venture" | "marketplace" | "learning";

function generateBusinessIdeas(interest: string) {
  const topic = interest.trim() || "youth";
  return [
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Experience Box`,
      type: "Subscription / Kits",
      description: `Curated monthly boxes with activities, guides and small products around ${topic} for kids and families.`,
    },
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Pop-up Events`,
      type: "Services / Events",
      description: `Organise weekend workshops or pop-up events where young people can try ${topic} in a fun, low-risk way.`,
    },
    {
      title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Digital Hub`,
      type: "Online Platform",
      description: `Create a simple website or social channel sharing tips, challenges and mini-courses about ${topic}. Monetise with partnerships or products.`,
    },
  ];
}

const FounderDashboard = () => {
  const [activeSection, setActiveSection] = useState<FounderSection>("venture");
  const [progress, setProgress] = useState(35); // simulated overall venture progress
  const [interest, setInterest] = useState("");
  const [ideas, setIdeas] = useState(() => generateBusinessIdeas("entrepreneurship"));
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerateIdeas = () => {
    const nextIdeas = generateBusinessIdeas(interest || "entrepreneurship");
    setIdeas(nextIdeas);
    setHasGenerated(true);
  };

  const currentLevelIndex = founderLevels.findIndex((lvl) => progress <= lvl.threshold);
  const currentLevel = currentLevelIndex === -1 ? founderLevels[founderLevels.length - 1] : founderLevels[currentLevelIndex];

  const renderMainSection = () => {
    if (activeSection === "marketplace") {
      return (
        <Card className="border border-border/80 bg-card/90 shadow-lg animate-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Store className="h-5 w-5 text-primary" />
              Marketplace (coming soon)
            </CardTitle>
            <CardDescription>
              Here you will be able to showcase your venture, discover other student projects and exchange value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">
              For now, focus on shaping a strong idea and validating it with your classmates and community. This space will
              become your mini startup fair.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (activeSection === "learning") {
      return (
        <Card className="border border-border/80 bg-card/90 shadow-lg animate-enter">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <GraduationCap className="h-5 w-5 text-secondary" />
              Learning Hub (coming soon)
            </CardTitle>
            <CardDescription>
              A focused space with playbooks, mini-lessons and tools to support every step of your founder journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">
              You will soon find bite-sized guides, templates and examples here. Until then, use your Chapter activities and
              teacher guidance as your main learning path.
            </p>
          </CardContent>
        </Card>
      );
    }

    // My Venture
    return (
      <div className="space-y-6 animate-enter">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.6fr)] items-start">
          {/* Levels / Progress */}
          <Card className="border border-border/80 bg-card/95 shadow-lg hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Rocket className="h-5 w-5 text-primary" />
                Founder Level
              </CardTitle>
              <CardDescription>Track how far your venture has progressed on the startup journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div>
                <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{currentLevel.label}</span>
                  <span>{progress}% complete</span>
                </div>
                <Progress value={progress} className="h-2.5 bg-muted" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {founderLevels.map((level, index) => {
                  const reached = progress >= level.threshold;
                  const isCurrent = currentLevel.id === level.id;
                  return (
                    <div
                      key={level.id}
                      className={
                        "rounded-lg border border-border/70 bg-background/40 px-3 py-2.5 text-xs sm:text-sm transition-all" +
                        (reached
                          ? " bg-primary/5 border-primary/50"
                          : isCurrent
                            ? " border-primary/50 bg-primary/10"
                            : " hover:bg-muted/40")
                      }
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">Level {index + 1}</span>
                        <Badge variant={reached || isCurrent ? "default" : "outline"} className="text-[0.65rem]">
                          {level.label}
                        </Badge>
                      </div>
                      <p className="text-[0.7rem] sm:text-xs text-muted-foreground leading-snug">{level.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[0.7rem] text-muted-foreground">
                <span className="font-medium text-xs text-foreground">Tip:</span>
                <span>
                  Move one level at a time. Celebrate when you complete a level and write down what you learned.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Business Idea Generator */}
          <Card className="border border-border/80 bg-card/95 shadow-lg hover-scale">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="h-5 w-5 text-accent" />
                Business Idea Generator
              </CardTitle>
              <CardDescription>
                Describe something you care about. The AI (simulated) suggests 3 possible business models you could explore.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="interest">
                  I&apos;m interested in...
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="e.g. sports, animals, gaming, sustainability"
                    className="bg-background/70 border-border/70"
                  />
                  <Button type="button" onClick={handleGenerateIdeas} className="sm:self-stretch">
                    Generate
                  </Button>
                </div>
                <p className="text-[0.7rem] text-muted-foreground">
                  No internet is used here. Ideas are generated locally as examples to help you think.
                </p>
              </div>

              <div className="grid gap-3">
                {ideas.map((idea, idx) => (
                  <div
                    key={idea.title + idx}
                    className="rounded-lg border border-border/60 bg-background/40 px-3 py-2.5 text-xs sm:text-sm animate-enter"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <p className="font-semibold leading-snug">{idea.title}</p>
                      </div>
                      <Badge variant="outline" className="text-[0.65rem] whitespace-nowrap">
                        {idea.type}
                      </Badge>
                    </div>
                    <p className="text-[0.7rem] sm:text-xs text-muted-foreground leading-snug">{idea.description}</p>
                  </div>
                ))}
              </div>

              {hasGenerated && (
                <p className="text-[0.7rem] text-muted-foreground">
                  Choose one idea to develop in your Chapter activities. You can always come back and rerun the generator
                  when your interests change.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_hsl(var(--background))_0,_hsl(var(--background))_40%,_hsl(var(--card))_100%)] text-foreground">
        <div className="flex w-full min-h-screen">
          <Sidebar variant="inset" collapsible="icon" className="border-r bg-sidebar/95">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold tracking-tight">
                  <Rocket className="h-4 w-4 text-primary" />
                  <span className="truncate">Founder Dashboard</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeSection === "venture"}
                        onClick={() => setActiveSection("venture")}
                        className="text-xs sm:text-sm"
                      >
                        <Rocket className="h-4 w-4" />
                        <span>My Venture</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeSection === "marketplace"}
                        onClick={() => setActiveSection("marketplace")}
                        className="text-xs sm:text-sm"
                      >
                        <Store className="h-4 w-4" />
                        <span>Marketplace</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={activeSection === "learning"}
                        onClick={() => setActiveSection("learning")}
                        className="text-xs sm:text-sm"
                      >
                        <GraduationCap className="h-4 w-4" />
                        <span>Learning Hub</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="bg-gradient-to-br from-background via-background/95 to-card/95">
            <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/60 bg-background/60 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Student View</p>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
                  Founder Dashboard
                  <Badge variant="outline" className="text-[0.65rem] uppercase tracking-wide">
                    Beta
                  </Badge>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden md:inline-flex" />
              </div>
            </header>

            <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto w-full space-y-6">
              <section className="space-y-2 animate-enter">
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl">
                  This space is your personal cockpit as a young founder. Track your progress, generate fresh business ideas
                  and connect what happens in class with your own venture.
                </p>
              </section>

              {renderMainSection()}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default FounderDashboard;
