import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, Users, Layers, ChevronDown, ChevronUp, Target, Zap, CheckCircle, Lightbulb, MessageCircle } from "lucide-react";
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
  const [openLesson, setOpenLesson] = useState<string | null>(null);

  const program = PROGRAMS.find((p) => p.id === id);

  if (!program) return <Navigate to="/programs" replace />;
  if (program.route === "/chapters") return <Navigate to="/chapters" replace />;

  const el = language === "el";

  const toggleLesson = (key: string) => {
    setOpenLesson(openLesson === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Back */}
        <Link
          to="/programs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {el ? "Όλα τα Προγράμματα" : "All Programs"}
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
                {el ? program.titleEl : program.titleEn}
              </h1>
              <p className="text-white/80 text-base font-medium mb-3">
                {el ? program.taglineEl : program.taglineEn}
              </p>
              <p className="text-white/70 max-w-xl text-sm">
                {el ? program.descriptionEl : program.descriptionEn}
              </p>
            </div>
            <div className="text-white/80 text-sm space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{el ? `Ηλικία ${program.ageRange}` : `Ages ${program.ageRange}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{program.chaptersCount} {el ? "κεφάλαια" : "chapters"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{program.lessonsCount} {el ? "μαθήματα" : "lessons"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{el ? program.durationEl : program.durationEn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters & Lessons */}
        <h2 className="text-xl font-bold mb-4">
          {el ? "Περιεχόμενο Προγράμματος" : "Programme Content"}
        </h2>

        <div className="space-y-6">
          {program.chapters.map((ch) => (
            <div key={ch.id} className="border rounded-xl overflow-hidden">
              {/* Chapter header */}
              <div className="bg-muted/50 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">{ch.emoji}</span>
                <div>
                  <div className="font-bold text-base">
                    {el ? `Κεφάλαιο ${ch.id}: ${ch.titleEl}` : `Chapter ${ch.id}: ${ch.titleEn}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {el ? ch.descriptionEl : ch.descriptionEn}
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="divide-y">
                {ch.lessons.map((lesson) => {
                  const key = `${ch.id}-${lesson.id}`;
                  const isOpen = openLesson === key;
                  const hasDetail = !!(lesson.objectiveEl);

                  return (
                    <div key={lesson.id}>
                      <button
                        className="w-full text-left px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                        onClick={() => hasDetail && toggleLesson(key)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0">
                            {lesson.id}
                          </span>
                          <span className="font-medium text-sm">
                            {el ? lesson.titleEl : lesson.titleEn}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.durationMin}'</span>
                          {hasDetail && (
                            isOpen
                              ? <ChevronUp className="w-4 h-4 ml-1" />
                              : <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </button>

                      {/* Detailed lesson content */}
                      {isOpen && hasDetail && (
                        <div className="px-5 pb-5 pt-1 bg-muted/10 space-y-4">

                          {/* Objective */}
                          {lesson.objectiveEl && (
                            <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <Target className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wide">
                                  {el ? "Στόχος" : "Objective"}
                                </div>
                                <p className="text-sm text-blue-900">
                                  {el ? lesson.objectiveEl : lesson.objectiveEn}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Warmup */}
                          {lesson.warmupEl && (
                            <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                              <Zap className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wide">
                                  {el ? "Ζέσταμα" : "Warm-up"}
                                </div>
                                <p className="text-sm text-orange-900">
                                  {el ? lesson.warmupEl : lesson.warmupEn}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Activities */}
                          {lesson.activitiesEl && lesson.activitiesEl.length > 0 && (
                            <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <div className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wide">
                                  {el ? "Δραστηριότητες" : "Activities"}
                                </div>
                                <div className="space-y-2">
                                  {(el ? lesson.activitiesEl : lesson.activitiesEn)?.map((act, i) => (
                                    <p key={i} className="text-sm text-green-900">{act}</p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tip */}
                          {lesson.tipEl && (
                            <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                              <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-yellow-700 mb-1 uppercase tracking-wide">
                                  {el ? "Tip" : "Tip"}
                                </div>
                                <p className="text-sm text-yellow-900">
                                  {el ? lesson.tipEl : lesson.tipEn}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Reflection */}
                          {lesson.reflectionEl && (
                            <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <MessageCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-bold text-purple-600 mb-1 uppercase tracking-wide">
                                  {el ? "Ερώτηση αναστοχασμού" : "Reflection question"}
                                </div>
                                <p className="text-sm text-purple-900 italic">
                                  {el ? lesson.reflectionEl : lesson.reflectionEn}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center border border-primary/20">
          <h2 className="text-xl font-bold mb-2">
            {el ? "Ενδιαφέρεστε για αυτό το πρόγραμμα;" : "Interested in this programme?"}
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm">
            {el
              ? "Επικοινωνήστε μαζί μας για να μάθετε πώς μπορείτε να το εντάξετε στο σχολείο σας."
              : "Contact us to find out how to bring this programme to your school."}
          </p>
          <a href="mailto:info@kidsinbusiness.gr">
            <Button size="lg">
              {el ? "Επικοινωνία" : "Contact Us"}
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
};

export default ProgramDetail;
