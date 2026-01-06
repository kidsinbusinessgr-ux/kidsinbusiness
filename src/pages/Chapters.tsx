import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Lightbulb, Rocket, Users, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const chapters = [
  {
    id: 1,
    title: "Τι είναι η Επιχειρηματικότητα",
    description: "Εισαγωγή στον κόσμο της επιχειρηματικότητας και πώς συνδέεται με την καθημερινή ζωή",
    lessons: 4,
    duration: "45 λεπτά",
    icon: BookOpen,
    color: "from-primary to-accent",
    progress: 40,
  },
  {
    id: 2,
    title: "Ιδέες & Δημιουργικότητα",
    description: "Ανακαλύψτε πώς να εντοπίζετε ευκαιρίες και να αναπτύσσετε καινοτόμες ιδέες",
    lessons: 5,
    duration: "60 λεπτά",
    icon: Lightbulb,
    color: "from-accent to-secondary",
    progress: 0,
  },
  {
    id: 3,
    title: "Από την Ιδέα στη Δράση",
    description: "Μετατρέψτε τις ιδέες σε συγκεκριμένα βήματα και σχέδια δράσης",
    lessons: 6,
    duration: "75 λεπτά",
    icon: Rocket,
    color: "from-secondary to-primary",
    progress: 0,
  },
  {
    id: 4,
    title: "Συνεργασία & Ρόλοι",
    description: "Κατανοήστε τη σημασία της ομαδικής εργασίας και των διαφορετικών ρόλων",
    lessons: 5,
    duration: "60 λεπτά",
    icon: Users,
    color: "from-primary to-secondary",
    progress: 0,
  },
  {
    id: 5,
    title: "Παρουσιάζω την Ιδέα μου",
    description: "Αναπτύξτε δεξιότητες παρουσίασης και επικοινωνίας των ιδεών σας",
    lessons: 4,
    duration: "50 λεπτά",
    icon: Presentation,
    color: "from-accent to-primary",
    progress: 0,
  },
  {
    id: 6,
    title: "Χρηματοοικονομικός Γραμματισμός",
    description: "Μαθαίνουμε για έσοδα, έξοδα, κέρδη και βασικές οικονομικές αποφάσεις μέσα από παιχνίδι",
    lessons: 5,
    duration: "60 λεπτά",
    icon: BookOpen,
    color: "from-secondary to-accent",
    progress: 0,
  },
];

const Chapters = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: translations.chapters.breadcrumbLabel[language] }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {translations.chapters.pageTitle[language]}
          </h1>
          <p className="text-muted-foreground text-lg">
            {translations.chapters.pageSubtitle[language]}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-4">
            {chapters.map((chapter) => {
              const Icon = chapter.icon;
              return (
                <Card
                  key={chapter.id}
                  className="hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center text-2xl font-bold text-primary-foreground flex-shrink-0`}
                      >
                        {chapter.id}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-xl">{chapter.title}</CardTitle>
                          <Icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <CardDescription className="text-base">
                          {chapter.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">
                          {chapter.lessons} {language === "el" ? "μαθήματα" : "lessons"}
                        </Badge>
                        <span>
                          ⏱️ {chapter.duration}
                        </span>
                      </div>
                      
                      {chapter.progress > 0 && (
                        <div>
                          <div className="w-full bg-muted rounded-full h-2 mb-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${chapter.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {chapter.progress}% {language === "el" ? "ολοκληρωμένο" : "complete"}
                          </p>
                        </div>
                      )}

                      <Link to={`/chapter/${chapter.id}`}>
                        <Button className="w-full group-hover:bg-primary/90">
                          {chapter.progress > 0
                            ? language === "el"
                              ? "Συνέχεια"
                              : "Continue"
                            : language === "el"
                              ? "Έναρξη"
                              : "Start"}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-6">
            <GlobalTip tip={translations.chapters.globalTip[language]} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Πώς να χρησιμοποιήσετε τα Chapters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    1
                  </div>
                  <p className="text-muted-foreground">
                    Ξεκινήστε με μια εισαγωγική συζήτηση
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    2
                  </div>
                  <p className="text-muted-foreground">
                    Ακολουθήστε τα μαθήματα με τη σειρά
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    3
                  </div>
                  <p className="text-muted-foreground">
                    Ολοκληρώστε με τις δραστηριότητες
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

export default Chapters;
