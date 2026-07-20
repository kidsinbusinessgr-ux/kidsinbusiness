import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Users, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PROGRAMS } from "@/config/programsConfig";

const Programs = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            {language === "el" ? "Προγράμματα" : "Programs"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "el"
              ? "Ολοκληρωμένα εκπαιδευτικά προγράμματα για σχολεία στην Ελλάδα και το Ηνωμένο Βασίλειο"
              : "Complete educational programmes for schools in Greece and the UK"}
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid gap-6">
          {PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="overflow-hidden border-2 hover:border-primary/40 transition-colors"
            >
              <div className={`bg-gradient-to-r ${program.color} p-6 text-white`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-4xl">{program.emoji}</span>
                      {program.badge && (
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">
                          {program.badge}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold mb-1">
                      {language === "el" ? program.titleEl : program.titleEn}
                    </h2>
                    <p className="text-white/80 text-sm font-medium">
                      {language === "el" ? program.taglineEl : program.taglineEn}
                    </p>
                  </div>
                  <div className="text-right text-white/70 text-sm space-y-1">
                    <div className="flex items-center gap-1 justify-end">
                      <Users className="w-4 h-4" />
                      <span>{language === "el" ? `Ηλικία ${program.ageRange}` : `Ages ${program.ageRange}`}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Layers className="w-4 h-4" />
                      <span>
                        {program.chaptersCount}{" "}
                        {language === "el" ? "κεφάλαια" : "chapters"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {program.lessonsCount}{" "}
                        {language === "el" ? "μαθήματα" : "lessons"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Clock className="w-4 h-4" />
                      <span>{language === "el" ? program.durationEl : program.durationEn}</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-5">
                  {language === "el" ? program.descriptionEl : program.descriptionEn}
                </p>

                {/* Chapters list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {program.chapters.map((ch) => (
                    <div
                      key={ch.id}
                      className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-2 text-sm"
                    >
                      <span>{ch.emoji}</span>
                      <span className="font-medium truncate">
                        {language === "el" ? ch.titleEl : ch.titleEn}
                      </span>
                    </div>
                  ))}
                </div>

                <Link to={program.route}>
                  <Button className="group">
                    {language === "el" ? "Ξεκινώ το Πρόγραμμα" : "Start Program"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* School sales pitch */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center border border-primary/20">
          <h2 className="text-2xl font-bold mb-3">
            {language === "el" ? "Για Ιδιωτικά Σχολεία" : "For Private Schools"}
          </h2>
          <p className="text-muted-foreground mb-5 max-w-xl mx-auto">
            {language === "el"
              ? "Προσφέρουμε πλήρη πακέτα για σχολεία με δικό τους πίνακα ελέγχου, παρακολούθηση προόδου μαθητών και υλικό για καθηγητές."
              : "We offer complete packages for schools with their own dashboard, student progress tracking and teacher materials."}
          </p>
          <a href="mailto:info@kidsinbusiness.gr">
            <Button variant="outline" size="lg">
              {language === "el" ? "Επικοινωνία με τη Σχολή" : "Contact Us for Schools"}
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Programs;
