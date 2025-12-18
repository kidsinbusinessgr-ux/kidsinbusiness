import { Users, Share2, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";

const Community = () => {
  const posts = [
    {
      author: "Μαρία Π.",
      role: "Εκπαιδευτικός",
      title: "Πώς προσάρμοσα το Chapter 2 για την τάξη μου",
      excerpt: "Οι μαθητές μου λάτρεψαν την προσθήκη μιας δραστηριότητας με lego...",
      likes: 24,
      comments: 8,
      badge: "Εμπνευσμένο",
    },
    {
      author: "Γιώργος Α.",
      role: "Διευθυντής",
      title: "5 τρόποι να ενθαρρύνετε τη συνεργασία",
      excerpt: "Μετά από 2 χρόνια διδασκαλίας επιχειρηματικότητας, αυτές είναι οι...",
      likes: 42,
      comments: 15,
      badge: "Δημοφιλές",
    },
    {
      author: "Ελένη Κ.",
      role: "Εκπαιδευτικός",
      title: "Mini Challenge: Επιχείρηση από ανακυκλώσιμα",
      excerpt: "Δημιούργησα ένα challenge που συνδυάζει περιβαλλοντική συνείδηση...",
      likes: 31,
      comments: 12,
      badge: "Νέο",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Κοινότητα" }]} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Κοινότητα Εκπαιδευτικών</h1>
          <p className="text-muted-foreground text-lg">
            Μοιραστείτε ιδέες και εμπνευστείτε από άλλους εκπαιδευτικούς
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Coming Soon Banner */}
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Έρχεται σύντομα! 🎉</h2>
                    <p className="text-muted-foreground mb-4">
                      Η πλήρης κοινότητα βρίσκεται υπό κατασκευή. Σύντομα θα μπορείτε να
                      συνδεθείτε με άλλους εκπαιδευτικούς, να μοιραστείτε τις δράσεις σας
                      και να ανακαλύψετε νέες ιδέες.
                    </p>
                    <Button>Ενημερώστε με</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Προεπισκόπηση Κοινότητας</h2>
              <div className="space-y-4">
                {posts.map((post, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                              {post.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{post.author}</p>
                            <p className="text-sm text-muted-foreground">{post.role}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{post.badge}</Badge>
                      </div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>👍 {post.likes} likes</span>
                        <span>💬 {post.comments} σχόλια</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <GlobalTip tip="Η κοινότητα θα σας επιτρέψει να μοιραστείτε τις επιτυχίες σας και να μάθετε από τις εμπειρίες άλλων!" />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Τι θα περιλαμβάνει;</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Μοιραστείτε Δράσεις</h4>
                    <p className="text-sm text-muted-foreground">
                      Δημοσιεύστε τις δικές σας δραστηριότητες
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ιδέες & Έμπνευση</h4>
                    <p className="text-sm text-muted-foreground">
                      Ανακαλύψτε τι κάνουν άλλοι
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Best Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Μάθετε από τους καλύτερους
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">Ενημερώσεις</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground mb-4">
                  Γίνετε από τους πρώτους που θα έχουν πρόσβαση στην κοινότητα. Θα σας
                  ειδοποιήσουμε μόλις είναι έτοιμη!
                </p>
                <Button variant="secondary" className="w-full">
                  Εγγραφή για ενημερώσεις
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
