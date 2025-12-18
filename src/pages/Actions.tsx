import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Target, Rocket, Clock, Users, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";

const Actions = () => {
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('completedChallenges');
    if (saved) {
      setCompletedChallenges(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleChallenge = (id: string) => {
    const newCompleted = new Set(completedChallenges);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedChallenges(newCompleted);
    localStorage.setItem('completedChallenges', JSON.stringify(Array.from(newCompleted)));
  };

  const isCompleted = (id: string) => completedChallenges.has(id);
  const miniChallenges = [
    {
      id: "mini-1",
      title: "Ιδέα σε 5 λεπτά",
      description: "Brainstorming δραστηριότητα για γρήγορη παραγωγή ιδεών",
      duration: "5 λεπτά",
      chapter: "Chapter 2",
      chapterId: "2",
      difficulty: "Εύκολο",
    },
    {
      id: "mini-2",
      title: "Λύσε το πρόβλημα",
      description: "Εντοπίστε προβλήματα και προτείνετε λύσεις",
      duration: "10 λεπτά",
      chapter: "Chapter 1",
      chapterId: "1",
      difficulty: "Μέτριο",
    },
    {
      id: "mini-3",
      title: "Pitch σε 30 δευτερόλεπτα",
      description: "Παρουσιάστε μια ιδέα με σαφήνεια και ταχύτητα",
      duration: "15 λεπτά",
      chapter: "Chapter 5",
      chapterId: "5",
      difficulty: "Προχωρημένο",
    },
  ];

  const classActivities = [
    {
      id: "class-1",
      title: "Ο ρόλος του ηγέτη",
      description: "Ομαδική δραστηριότητα για κατανόηση ηγεσίας",
      duration: "30 λεπτά",
      chapter: "Chapter 4",
      chapterId: "4",
      participants: "4-6 μαθητές",
    },
    {
      id: "class-2",
      title: "Η επιχείρησή μου",
      description: "Δημιουργήστε μια επιχειρηματική ιδέα ως ομάδα",
      duration: "45 λεπτά",
      chapter: "Chapter 3",
      chapterId: "3",
      participants: "Όλη η τάξη",
    },
  ];

  const projects = [
    {
      id: "project-1",
      title: "Business Plan Junior",
      description: "Πλήρες επιχειρηματικό σχέδιο για παιδιά",
      duration: "3-5 μέρες",
      chapter: "Chapters 3-5",
      chapterId: "3",
      complexity: "Υψηλό",
    },
    {
      id: "project-2",
      title: "Παρουσίαση ομάδας",
      description: "Τελική παρουσίαση επιχειρηματικής ιδέας",
      duration: "2-3 μέρες",
      chapter: "Chapter 5",
      chapterId: "5",
      complexity: "Μέτριο",
    },
  ];

  const totalChallenges = miniChallenges.length + classActivities.length + projects.length;
  const completedCount = completedChallenges.size;
  const completionPercentage = Math.round((completedCount / totalChallenges) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Δράσεις" }]} />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Δράσεις & Challenges</h1>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {completedCount}/{totalChallenges} ολοκληρώθηκε
              </Badge>
              <Badge variant="outline" className="text-base px-4 py-2">
                {completionPercentage}%
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Πρακτικές δραστηριότητες για εφαρμογή της γνώσης
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="mini" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mini">Mini Challenges</TabsTrigger>
                <TabsTrigger value="class">Δραστηριότητες Τάξης</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="mini" className="space-y-4">
                {miniChallenges.map((challenge) => (
                  <Card
                    key={challenge.id}
                    className={`hover:shadow-lg transition-all duration-300 group relative ${
                      isCompleted(challenge.id) ? 'bg-primary/5 border-primary/30' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <Badge variant="secondary">{challenge.chapter}</Badge>
                            {isCompleted(challenge.id) && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ολοκληρώθηκε
                              </Badge>
                            )}
                          </div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {challenge.description}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => toggleChallenge(challenge.id)}
                          className="ml-2 p-2 rounded-full hover:bg-muted transition-colors"
                          aria-label={isCompleted(challenge.id) ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {isCompleted(challenge.id) ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {challenge.duration}
                        </div>
                        <Badge variant="outline">{challenge.difficulty}</Badge>
                      </div>
                      <Link to={`/chapters/${challenge.chapterId}`}>
                        <Button className="w-full">Ξεκινήστε το Challenge</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="class" className="space-y-4">
                {classActivities.map((activity) => (
                  <Card
                    key={activity.id}
                    className={`hover:shadow-lg transition-all duration-300 group relative ${
                      isCompleted(activity.id) ? 'bg-primary/5 border-primary/30' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-secondary" />
                            <Badge variant="secondary">{activity.chapter}</Badge>
                            {isCompleted(activity.id) && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ολοκληρώθηκε
                              </Badge>
                            )}
                          </div>
                          <CardTitle>{activity.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {activity.description}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => toggleChallenge(activity.id)}
                          className="ml-2 p-2 rounded-full hover:bg-muted transition-colors"
                          aria-label={isCompleted(activity.id) ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {isCompleted(activity.id) ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {activity.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.participants}
                        </div>
                      </div>
                      <Link to={`/chapters/${activity.chapterId}`}>
                        <Button variant="secondary" className="w-full">
                          Δείτε τη δραστηριότητα
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`hover:shadow-lg transition-all duration-300 group relative ${
                      isCompleted(project.id) ? 'bg-primary/5 border-primary/30' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Rocket className="w-5 h-5 text-accent" />
                            <Badge variant="secondary">{project.chapter}</Badge>
                            {isCompleted(project.id) && (
                              <Badge className="bg-primary/20 text-primary border-primary/30">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Ολοκληρώθηκε
                              </Badge>
                            )}
                          </div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <button
                          onClick={() => toggleChallenge(project.id)}
                          className="ml-2 p-2 rounded-full hover:bg-muted transition-colors"
                          aria-label={isCompleted(project.id) ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {isCompleted(project.id) ? (
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                          ) : (
                            <Circle className="w-6 h-6 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.duration}
                        </div>
                        <Badge variant="outline">Πολυπλοκότητα: {project.complexity}</Badge>
                      </div>
                      <Link to={`/chapters/${project.chapterId}`}>
                        <Button variant="default" className="w-full">
                          Ξεκινήστε το Project
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <GlobalTip tip="Οι Mini Challenges είναι ιδανικά για warm-up ή για γεμίσματα χρόνου. Τα Projects απαιτούν προγραμματισμό και συνέχεια." />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Πώς να επιλέξετε</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Mini Challenges
                  </h4>
                  <p className="text-muted-foreground">
                    Γρήγορες δράσεις για άμεση εμπέδωση
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-secondary" />
                    Δραστηριότητες Τάξης
                  </h4>
                  <p className="text-muted-foreground">
                    Ομαδική εργασία με συγκεκριμένους στόχους
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-accent" />
                    Projects
                  </h4>
                  <p className="text-muted-foreground">
                    Ολοκληρωμένα έργα πολλών ημερών
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Actions;
