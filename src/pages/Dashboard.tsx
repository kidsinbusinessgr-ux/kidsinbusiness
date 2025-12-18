import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Zap, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import GlobalTip from "@/components/GlobalTip";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Καλώς ήρθατε στο Kids in Business</h1>
          <p className="text-muted-foreground text-lg">
            Εμπνεύστε τους μαθητές σας να γίνουν οι επιχειρηματίες του αύριο
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Continue Learning */}
          <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Συνέχισε το μάθημα
              </CardTitle>
              <CardDescription>Επιστροφή στο Chapter 1 - Lesson 1.2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Τι είναι η Επιχειρηματικότητα;</h3>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: "40%" }}></div>
                    </div>
                    <p className="text-sm text-muted-foreground">40% ολοκληρωμένο</p>
                  </div>
                </div>
                <Link to="/chapter/1">
                  <Button className="w-full group">
                    Συνέχεια
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Tip of the Week */}
          <div>
            <GlobalTip tip="Ξεκινήστε κάθε μάθημα με ένα παράδειγμα από την καθημερινή ζωή των παιδιών - η σύνδεση με την πραγματικότητα κάνει τη μάθηση πιο ουσιαστική!" />
          </div>
        </div>

        {/* Recent Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Πρόσφατες Δράσεις
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Ιδέα σε 5 λεπτά", type: "Mini Challenge", icon: Star },
                { title: "Ο ρόλος του ηγέτη", type: "Δραστηριότητα", icon: TrendingUp },
                { title: "Παρουσίαση ομάδας", type: "Project", icon: BookOpen },
              ].map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {action.type}
                        </Badge>
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Chapter */}
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Προτεινόμενο Chapter</CardTitle>
            <CardDescription>Συνιστώμενο για την εβδομάδα</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Ιδέες & Δημιουργικότητα</h3>
                <p className="text-muted-foreground mb-4">
                  Βοηθήστε τους μαθητές να ανακαλύψουν τη δημιουργική τους σκέψη
                </p>
                <Link to="/chapters">
                  <Button variant="secondary" className="group">
                    Εξερεύνηση
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
