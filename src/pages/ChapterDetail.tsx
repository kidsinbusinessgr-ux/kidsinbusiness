import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Circle, Clock, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";

const ChapterDetail = () => {
  const { id } = useParams();

  const lessons = [
    {
      id: "1.1",
      title: "Τι σημαίνει να είσαι επιχειρηματίας;",
      duration: "10 λεπτά",
      completed: true,
    },
    {
      id: "1.2",
      title: "Επιχειρηματίες στην καθημερινή ζωή",
      duration: "15 λεπτά",
      completed: false,
      current: true,
    },
    {
      id: "1.3",
      title: "Οι δεξιότητες ενός επιχειρηματία",
      duration: "12 λεπτά",
      completed: false,
    },
    {
      id: "1.4",
      title: "Αναλογισμός και συζήτηση",
      duration: "8 λεπτά",
      completed: false,
    },
  ];

  const currentLesson = lessons.find((l) => l.current) || lessons[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Μαθήματα", path: "/chapters" },
            { label: `Chapter ${id}` },
          ]}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground flex-shrink-0">
                {id}
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">
                  Chapter {id}
                </Badge>
                <h1 className="text-4xl font-bold mb-2">
                  Τι είναι η Επιχειρηματικότητα
                </h1>
                <p className="text-muted-foreground text-lg">
                  Εισαγωγή στον κόσμο της επιχειρηματικότητας και πώς συνδέεται με την
                  καθημερινή ζωή
                </p>
              </div>
            </div>

            {/* Current Lesson Content */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <Badge className="mb-2">Τρέχον μάθημα</Badge>
                    <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{currentLesson.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground">
                    Σε αυτό το μάθημα, οι μαθητές θα εξερευνήσουν παραδείγματα
                    επιχειρηματιών από την καθημερινή τους ζωή. Από τον ιδιοκτήτη του
                    τοπικού περιπτέρου μέχρι τους ιδρυτές γνωστών εταιρειών.
                  </p>

                  <h3 className="text-foreground font-bold mt-6 mb-3">Στόχοι Μαθήματος</h3>
                  <ul className="space-y-2 text-foreground">
                    <li>Αναγνώριση επιχειρηματικών δραστηριοτήτων στο περιβάλλον τους</li>
                    <li>Κατανόηση των βημάτων που ακολουθεί ένας επιχειρηματίας</li>
                    <li>Σύνδεση της θεωρίας με την πράξη</li>
                  </ul>

                  <h3 className="text-foreground font-bold mt-6 mb-3">
                    Δραστηριότητα: Βρες τον επιχειρηματία
                  </h3>
                  <div className="bg-accent/10 p-4 rounded-lg border border-accent/30 not-prose">
                    <p className="text-sm text-foreground mb-3">
                      Ζητήστε από τους μαθητές να σκεφτούν 3 επιχειρηματίες που γνωρίζουν
                      προσωπικά ή έχουν δει στην περιοχή τους.
                    </p>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Zap className="w-4 h-4" />
                      Δείτε τη δραστηριότητα
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline">Προηγούμενο</Button>
                  <Button className="flex-1">Επόμενο μάθημα</Button>
                </div>
              </CardContent>
            </Card>

            {/* Mini Challenge */}
            <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Mini Challenge</h3>
                    <p className="text-muted-foreground mb-4">
                      Ολοκληρώστε το Chapter με μια πρακτική άσκηση 5 λεπτών
                    </p>
                    <Link to="/actions">
                      <Button variant="secondary">Δείτε το Challenge</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlobalTip tip="Ενθαρρύνετε τις ερωτήσεις! Η καλύτερη μάθηση συμβαίνει όταν τα παιδιά αισθάνονται ελεύθερα να εκφράζουν τις απορίες τους." />

            {/* Progress */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Πρόοδος Chapter</h3>
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        lesson.current
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${
                            lesson.current ? "text-primary" : ""
                          }`}
                        >
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Note */}
            <Card className="bg-secondary/10 border-secondary/30">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  🎓 Σημείωση Εκπαιδευτικού
                </h3>
                <p className="text-sm text-muted-foreground">
                  Το Chapter 1 είναι θεμέλιο. Αφιερώστε επιπλέον χρόνο για παραδείγματα και
                  ερωτήσεις. Βοηθάει να δημιουργήσετε μια λίστα τοπικών επιχειρηματιών με
                  τους μαθητές.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterDetail;
