import { BookOpen, HelpCircle, Compass, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import { useLanguage } from "@/context/LanguageContext";

const Teachers = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            {
              label: language === "el" ? "Για Εκπαιδευτικούς" : "For Teachers",
            },
          ]}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {language === "el" ? "Υποστήριξη Εκπαιδευτικών" : "Teacher Support"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "el"
              ? "Όλα όσα χρειάζεστε για να διδάξετε επιχειρηματικότητα με εμπιστοσύνη"
              : "Everything you need to teach entrepreneurship with confidence"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* How it Works */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Compass className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle>Πώς λειτουργεί το Kids in Business</CardTitle>
                </div>
                <CardDescription>
                  Μια πλήρης πλατφόρμα για τη διδασκαλία επιχειρηματικότητας
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>
                    Το Kids in Business είναι σχεδιασμένο να κάνει τη διδασκαλία της
                    επιχειρηματικότητας εύκολη και αποτελεσματική, ακόμα κι αν δεν έχετε
                    προηγούμενη εμπειρία στον τομέα.
                  </p>
                  
                  <h3 className="font-bold mt-6 mb-3">Δομή Προγράμματος</h3>
                  <ul className="space-y-2">
                    <li><strong>5 Chapters</strong> - Κάθε ένα καλύπτει βασική έννοια</li>
                    <li><strong>Πρακτικές δραστηριότητες</strong> - Άμεση εφαρμογή της γνώσης</li>
                    <li><strong>Ευέλικτος ρυθμός</strong> - Προσαρμόστε το στις ανάγκες σας</li>
                  </ul>

                  <h3 className="font-bold mt-6 mb-3">Τι περιλαμβάνεται</h3>
                  <ul className="space-y-2">
                    <li>Έτοιμα σχέδια μαθημάτων</li>
                    <li>Οδηγίες βήμα προς βήμα</li>
                    <li>Δραστηριότητες και challenges</li>
                    <li>Υλικό παρουσίασης</li>
                    <li>Υποστήριξη και tips</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Philosophy */}
            <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle>Παιδαγωγική Φιλοσοφία</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>
                    Η προσέγγισή μας βασίζεται σε τρεις πυλώνες:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 not-prose mt-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">Βιωματική Μάθηση</h4>
                      <p className="text-sm text-muted-foreground">
                        Τα παιδιά μαθαίνουν κάνοντας, όχι ακούγοντας
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">Ομαδική Εργασία</h4>
                      <p className="text-sm text-muted-foreground">
                        Συνεργασία και ανταλλαγή ιδεών
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">Δημιουργικότητα</h4>
                      <p className="text-sm text-muted-foreground">
                        Ενθάρρυνση της ελεύθερης σκέψης
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <CardTitle>Συχνές Ερωτήσεις</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Πόσος χρόνος χρειάζεται ανά εβδομάδα;
                    </AccordionTrigger>
                    <AccordionContent>
                      Συνιστούμε 2-3 ώρες την εβδομάδα, αλλά μπορείτε να προσαρμόσετε το
                      πρόγραμμα ανάλογα με το ωρολόγιό σας. Κάθε μάθημα είναι σχεδιασμένο να
                      διαρκεί 45-60 λεπτά.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      Χρειάζομαι εμπειρία στην επιχειρηματικότητα;
                    </AccordionTrigger>
                    <AccordionContent>
                      Όχι! Το πρόγραμμα είναι σχεδιασμένο για εκπαιδευτικούς όλων των
                      επιπέδων. Κάθε μάθημα περιλαμβάνει αναλυτικές οδηγίες και υποστήριξη.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      Για ποιες ηλικίες είναι κατάλληλο;
                    </AccordionTrigger>
                    <AccordionContent>
                      Το πρόγραμμα είναι σχεδιασμένο για μαθητές δημοτικού (8-12 ετών), αλλά
                      μπορεί να προσαρμοστεί και για μεγαλύτερες ηλικίες.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      {language === "el" ? "Τι υλικά χρειάζομαι;" : "What materials do I need?"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {language === "el"
                        ? "Τα περισσότερα μαθήματα χρειάζονται μόνο βασικά υλικά (χαρτί, μαρκαδόροι, post-its). Συγκεκριμένα υλικά αναφέρονται σε κάθε δραστηριότητα."
                        : "Most lessons only need basic materials (paper, markers, post-its). Specific materials are listed in each activity."}
                    </AccordionContent>
                  </AccordionItem>
 
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      {language === "el" ? "Μπορώ να προσαρμόσω το περιεχόμενο;" : "Can I adapt the content?"}
                    </AccordionTrigger>
                    <AccordionContent>
                      {language === "el"
                        ? "Απολύτως! Ενθαρρύνουμε την προσαρμογή του περιεχομένου στις ανάγκες και τα ενδιαφέροντα της τάξης σας."
                        : "Absolutely! We encourage you to adapt the content to your class needs and interests."}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <GlobalTip tip="Η καλύτερη συμβουλή για νέους εκπαιδευτικούς: Ξεκινήστε απλά! Δεν χρειάζεται να είστε expert - το πάθος και η περιέργεια είναι αρκετά." />

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Οδηγός Τάξης</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">Πριν το μάθημα</h4>
                  <p className="text-muted-foreground">
                    Διαβάστε το μάθημα και προετοιμάστε τα υλικά
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Κατά τη διάρκεια</h4>
                  <p className="text-muted-foreground">
                    Ακολουθήστε τις οδηγίες και προσαρμόστε αν χρειάζεται
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Μετά το μάθημα</h4>
                  <p className="text-muted-foreground">
                    Κάντε αναλογισμό με τους μαθητές
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Χρειάζεστε βοήθεια;</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Επικοινωνήστε μαζί μας για υποστήριξη και συμβουλές:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <div>📧 support@kidsinbusiness.gr</div>
                  <div>💬 Community Forum</div>
                  <div>📚 Βιβλιοθήκη Πόρων</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Teachers;
