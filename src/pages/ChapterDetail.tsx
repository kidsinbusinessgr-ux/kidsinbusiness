import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";

const chapterTitles: Record<string, string> = {
  "1": "Τι είναι η Επιχειρηματικότητα;",
  "2": "Ιδέες & Δημιουργικότητα",
  "3": "Από την Ιδέα στη Δράση",
  "4": "Συνεργασία & Ρόλοι",
  "5": "Παρουσιάζω την Ιδέα μου",
};

const ChapterDetail = () => {
  const { id } = useParams();
  const chapterId = id ?? "1";
  const chapterTitle = chapterTitles[chapterId] ?? `Chapter ${chapterId}`;

  const sectionAnchors = [
    { id: "opening", label: "Opening / Brand Intro" },
    { id: "lesson-1-1", label: "Lesson 1.1" },
    { id: "what-is-entrepreneurship", label: "Τι είναι η επιχειρηματικότητα;" },
    { id: "lesson-1-2", label: "Lesson 1.2" },
    { id: "lesson-1-3", label: "Lesson 1.3" },
    { id: "mini-challenge", label: "Mini Challenge" },
    { id: "closing-ritual", label: "Closing Ritual" },
    { id: "reflection", label: "Chapter Reflection" },
  ];

  const isFirstChapter = chapterId === "1";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Μαθήματα", path: "/chapters" },
            { label: `Chapter ${chapterId}` },
          ]}
        />

        {/* Page Header */}
        <header className="mb-8 flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground flex-shrink-0">
            {chapterId}
          </div>
          <div>
            <Badge variant="secondary" className="mb-2">
              Chapter {chapterId}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">
              Chapter {chapterId} – {chapterTitle}
            </h1>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* SECTION 1 – Opening / Brand Intro */}
            <section id="opening">
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardHeader>
                  <CardTitle>Καλωσήρθες στο Kids in Business</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-base text-foreground">
                  {isFirstChapter ? (
                    <>
                      <p>
                        Στο Kids in Business μαθαίνουμε να σκεφτόμαστε σαν μικροί επιχειρηματίες.
                        Αυτό σημαίνει ότι παρατηρούμε τον κόσμο γύρω μας, βρίσκουμε προβλήματα
                        και σκεφτόμαστε λύσεις που βοηθούν ανθρώπους.
                      </p>
                      <p>
                        Δεν ψάχνουμε την τέλεια ιδέα. <br />
                        Ψάχνουμε μια ιδέα που βοηθά.
                      </p>
                    </>
                  ) : (
                    <p>
                      Αυτό το Chapter ακολουθεί τη δομή του Chapter 1, με άνοιγμα που συστήνει στα
                      παιδιά το θέμα: {chapterTitle}.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* SECTION 2 – Lesson 1.1 | Story */}
            <section id="lesson-1-1" className="space-y-4">
              <h2 className="text-2xl font-bold">
                Lesson 1.1 – Η Μαρία και το πρόβλημα της αυλής
              </h2>

              <Card>
                <CardContent className="pt-6 space-y-3 text-base text-foreground">
                  {isFirstChapter ? (
                    <>
                      <p>
                        Η Μαρία αγαπάει το σχολείο της. Όμως κάθε διάλειμμα βαριέται. Η αυλή δεν έχει
                        παιχνίδια και τα παιδιά συχνά τσακώνονται για το τι θα κάνουν.
                      </p>
                      <p>
                        Μια μέρα η Μαρία σκέφτηκε: «Κάτι δεν πάει καλά εδώ. Πώς θα μπορούσαμε να το
                        κάνουμε καλύτερο;»
                      </p>
                      <p>
                        Μίλησε με τους φίλους της, ζωγράφισαν ιδέες και σκέφτηκαν παιχνίδια που θα
                        μπορούσαν να φτιάξουν όλοι μαζί. Η αυλή δεν άλλαξε αμέσως. Όμως η ιδέα είχε
                        γεννηθεί.
                      </p>
                    </>
                  ) : (
                    <p>
                      Εδώ θα μπει μια σύντομη ιστορία/παράδειγμα για το {chapterTitle}, όπως η ιστορία
                      της Μαρίας στο Chapter 1.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-secondary/10 border-secondary/40">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>🎓 Για τον εκπαιδευτικό</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {isFirstChapter ? (
                    <p>
                      Μην εξηγήσεις την ιστορία. Ρώτησε τα παιδιά τι πρόβλημα είδαν και τι θα έκαναν
                      εκείνα.
                    </p>
                  ) : (
                    <p>
                      Χρησιμοποίησε ερωτήσεις αντί για εξηγήσεις. Ζήτησε από τα παιδιά να εντοπίσουν το
                      πρόβλημα και να προτείνουν λύσεις.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* SECTION 3 – Τι είναι η επιχειρηματικότητα; */}
            <section id="what-is-entrepreneurship" className="space-y-4">
              <h2 className="text-2xl font-bold">Τι είναι η επιχειρηματικότητα;</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Για τα παιδιά</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base text-foreground">
                    {isFirstChapter ? (
                      <p>
                        Επιχειρηματικότητα είναι όταν βρίσκουμε ένα πρόβλημα και σκεφτόμαστε μια ιδέα
                        για να το λύσουμε.
                      </p>
                    ) : (
                      <p>
                        Εδώ εξηγούμε με απλά λόγια το βασικό μήνυμα του Chapter στα παιδιά.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Για τον εκπαιδευτικό</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base text-foreground">
                    {isFirstChapter ? (
                      <p>
                        Απέφυγε λέξεις όπως «χρήματα» ή «εταιρεία». Εστίασε στη σκέψη, στη λύση και
                        στον άνθρωπο.
                      </p>
                    ) : (
                      <p>
                        Σημείωσε τις λέξεις-κλειδιά που θέλεις να ακούνε τα παιδιά σε αυτό το Chapter
                        και απόφυγε τεχνικούς όρους.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* SECTION 4 – Lesson 1.2 | Πρόβλημα & Λύση */}
            <section id="lesson-1-2" className="space-y-4">
              <h2 className="text-2xl font-bold">Lesson 1.2 – Τι είναι πρόβλημα; Τι είναι λύση;</h2>

              <Card>
                <CardContent className="pt-6 space-y-3 text-base text-foreground">
                  {isFirstChapter ? (
                    <>
                      <p>Πρόβλημα είναι κάτι που μας δυσκολεύει ή μας στεναχωρεί.</p>
                      <p>Λύση είναι μια ιδέα που κάνει τα πράγματα καλύτερα.</p>
                    </>
                  ) : (
                    <p>
                      Ορίζουμε τους βασικούς όρους του Chapter με απλές φράσεις που μπορούν να
                      επαναλάβουν τα παιδιά.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-dashed border-accent/60">
                <CardHeader>
                  <CardTitle className="text-base">🧩 Βρες το πρόβλημα – Βρες τη λύση</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-base text-foreground">
                    <li>Σκεφτόμαστε προβλήματα στο σχολείο, στο σπίτι ή στη γειτονιά</li>
                    <li>Διαλέγουμε ένα πρόβλημα</li>
                    <li>Σκεφτόμαστε μια λύση</li>
                    <li>Ζωγραφίζουμε την ιδέα μας</li>
                    <li>Παρουσιάζουμε στην τάξη</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-secondary/10 border-secondary/40">
                <CardHeader>
                  <CardTitle className="text-base">🎓 Για τον εκπαιδευτικό</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Δεν υπάρχει σωστό ή λάθος. Στόχος είναι η σκέψη, όχι το αποτέλεσμα.
                </CardContent>
              </Card>
            </section>

            {/* SECTION 5 – Lesson 1.3 | Ποιον βοηθά η ιδέα μου; */}
            <section id="lesson-1-3" className="space-y-4">
              <h2 className="text-2xl font-bold">Lesson 1.3 – Ποιον βοηθά η ιδέα μου;</h2>

              <Card>
                <CardContent className="pt-6 space-y-2 text-base text-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ποιον βοηθά η ιδέα σου;</li>
                    <li>Πώς θα νιώσει αυτός που βοηθάς;</li>
                    <li>Πώς νιώθεις εσύ όταν βοηθάς;</li>
                  </ul>

                  <p className="mt-4">
                    Στο Kids in Business πιστεύουμε ότι οι ιδέες έχουν αξία όταν βοηθούν ανθρώπους.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* SECTION 6 – Mini Challenge */}
            <section id="mini-challenge" className="space-y-4">
              <h2 className="text-2xl font-bold">Mini Challenge – Γίνε μικρός επιχειρηματίας για 1 μέρα</h2>

              <Card className="bg-accent/10 border-accent/40">
                <CardContent className="pt-6 space-y-2 text-base text-foreground">
                  <p className="font-medium">Οδηγίες για τα παιδιά:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Βρες ένα μικρό πρόβλημα γύρω σου</li>
                    <li>Σκέψου μια λύση</li>
                    <li>Ζωγράφισε την ιδέα</li>
                    <li>Παρουσίασέ τη στην τάξη</li>
                  </ul>

                  <Link to="/actions">
                    <Button variant="secondary" className="mt-4 gap-2">
                      Δες σχετικές δράσεις
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>

            {/* SECTION 7 – Closing Ritual */}
            <section id="closing-ritual" className="space-y-4">
              <h2 className="text-2xl font-bold">Kids in Business Moment</h2>

              <Card className="bg-primary/5 border-primary/40">
                <CardContent className="pt-6 text-base text-foreground">
                  <p>
                    Σήμερα μάθαμε ότι η επιχειρηματικότητα ξεκινά από μια ιδέα που βοηθά. Στο Kids in
                    Business πιστεύουμε ότι κάθε παιδί μπορεί να αλλάξει κάτι γύρω του.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* SECTION 8 – Chapter Reflection */}
            <section id="reflection" className="space-y-4 mb-4">
              <h2 className="text-2xl font-bold">Chapter Reflection</h2>

              <Card>
                <CardContent className="pt-6 space-y-2 text-base text-foreground">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Τι μάθαμε σήμερα;</li>
                    <li>Μπορούν μόνο οι μεγάλοι να είναι επιχειρηματίες;</li>
                    <li>Τι πρόβλημα θα ήθελες να λύσεις εσύ;</li>
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <GlobalTip tip="Κάθε Chapter ακολουθεί την ίδια ροή: ιστορία, έννοιες, δραστηριότητα, mini challenge και αναστοχασμός." />

            {/* Section navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Πλοήγηση Chapter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {sectionAnchors.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-3 py-2 rounded-md hover:bg-muted/80 transition-colors"
                  >
                    {section.label}
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Teacher Note */}
            <Card className="bg-secondary/10 border-secondary/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>🎓 Σημείωση Εκπαιδευτικού</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Χρησιμοποίησε το ίδιο τελετουργικό σε κάθε Chapter. Αυτό βοηθά τα παιδιά να νιώθουν
                  ασφάλεια και να καταλαβαίνουν τη ροή του προγράμματος.
                </p>
                <p>
                  Μπορείς να προσαρμόσεις τα παραδείγματα στην πραγματικότητα της δικής σου τάξης.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ChapterDetail;

