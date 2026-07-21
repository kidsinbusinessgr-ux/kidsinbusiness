import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Users, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PROGRAMS } from "@/config/programsConfig";
import { useState } from "react";

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [openChapter, setOpenChapter] = useState<number | null>(0);

  const program = PROGRAMS.find((p) => p.id === id);

  if (!program) return <Navigate to="/programs" replace />;

  // Business Plan program already has its own page
  if (program.route === "/chapters") return <Navigate to="/chapters" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back */}
        <Link to="/programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {language === "el" ? "Όλα τα Προγράμματα" : "All Programs"}
        </Link>

        {/* Hero */}
        <div className={`bg-gradient-to-r ${program.color} rounded-2xl p-8 text-white mb-8`}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-5xl">{program.emoji}</span>
                {program.badge && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    {program.badge}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {language === "el" ? program.titleEl : program.titleEn}
              </h1>
              <p className="text-white/80 text-base font-medium mb-3">
                {language === "el" ? program.taglineEl : program.taglineEn}
              </p>
              <p className="text-white/70 max-w-xl">
                {language === "el" ? program.descriptionEl : program.descriptionEn}
              </p>
            </div>
            <div className="text-white/80 text-sm space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{language === "el" ? `Ηλικία ${program.ageRange}` : `Ages ${program.ageRange}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{program.chaptersCount} {language === "el" ? "κεφάλαια" : "chapters"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{program.lessonsCount} {language === "el" ? "μαθήματα" : "lessons"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{language === "el" ? program.durationEl : program.durationEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <h2 className="text-xl font-bold mb-4">
          {language === "el" ? "Περιεχόμενο Προγράμματος" : "Program Content"}
        </h2>
        <div className="space-y-3">
          {program.chapters.map((ch, idx) => (
            <Card key={ch.id} className="overflow-hidden border">
              <button
                className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/40 transition-colors"
                onClick={() => setOpenChapter(openChapter === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ch.emoji}</span>
                  <div>
                    <div className="font-semibold">
                      {language === "el" ? `Κεφάλαιο ${ch.id}: ${ch.titleEl}` : `Chapter ${ch.id}: ${ch.titleEn}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "el" ? ch.descriptionEl : ch.descriptionEn}
                    </div>
                  </div>
                </div>
                {openChapter === idx ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
              </button>

              {openChapter === idx && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t pt-3 space-y-2">
                    {ch.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                            {lesson.id}
                          </span>
                          <span>{language === "el" ? lesson.titleEl : lesson.titleEn}</span>
                        </div>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.durationMin}'
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center border border-primary/20">
          <h2 className="text-xl font-bold mb-2">
            {language === "el" ? "Ενδιαφέρεστε για αυτό το πρόγραμμα;" : "Interested in this program?"}
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm">
            {language === "el"
              ? "Επικοινωνήστε μαζί μας για να μάθετε πώς μπορείτε να το εντάξετε στο σχολείο σας."
              : "Contact us to find out how to bring this program to your school."}
          </p>
          <a href="mailto:info@kidsinbusiness.gr">
            <Button size="lg">
              {language === "el" ? "Επικοινωνία" : "Contact Us"}
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
};

export default ProgramDetail;
