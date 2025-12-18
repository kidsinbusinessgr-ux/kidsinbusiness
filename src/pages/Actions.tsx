import { Link } from "react-router-dom";
import { Zap, Target, Rocket, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";

const Actions = () => {
  const miniChallenges = [
    {
      title: "Ιδέα σε 5 λεπτά",
      description: "Brainstorming δραστηριότητα για γρήγορη παραγωγή ιδεών",
      duration: "5 λεπτά",
      chapter: "Chapter 2",
      chapterId: "2",
      difficulty: "Εύκολο",
    },
    {
      title: "Λύσε το πρόβλημα",
      description: "Εντοπίστε προβλήματα και προτείνετε λύσεις",
      duration: "10 λεπτά",
      chapter: "Chapter 1",
      chapterId: "1",
      difficulty: "Μέτριο",
    },
    {
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
      title: "Ο ρόλος του ηγέτη",
      description: "Ομαδική δραστηριότητα για κατανόηση ηγεσίας",
      duration: "30 λεπτά",
      chapter: "Chapter 4",
      chapterId: "4",
      participants: "4-6 μαθητές",
    },
    {
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
      title: "Business Plan Junior",
      description: "Πλήρες επιχειρηματικό σχέδιο για παιδιά",
      duration: "3-5 μέρες",
      chapter: "Chapters 3-5",
      chapterId: "3",
      complexity: "Υψηλό",
    },
    {
      title: "Παρουσίαση ομάδας",
      description: "Τελική παρουσίαση επιχειρηματικής ιδέας",
      duration: "2-3 μέρες",
      chapter: "Chapter 5",
      chapterId: "5",
      complexity: "Μέτριο",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Δράσεις" }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Δράσεις & Challenges</h1>
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
                {miniChallenges.map((challenge, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary" />
                            <Badge variant="secondary">{challenge.chapter}</Badge>
                          </div>
                          <CardTitle>{challenge.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {challenge.description}
                          </CardDescription>
                        </div>
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
                {classActivities.map((activity, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-secondary" />
                            <Badge variant="secondary">{activity.chapter}</Badge>
                          </div>
                          <CardTitle>{activity.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {activity.description}
                          </CardDescription>
                        </div>
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
                {projects.map((project, idx) => (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-all duration-300 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Rocket className="w-5 h-5 text-accent" />
                            <Badge variant="secondary">{project.chapter}</Badge>
                          </div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {project.description}
                          </CardDescription>
                        </div>
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
