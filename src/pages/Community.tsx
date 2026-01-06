import { Users, Share2, Lightbulb, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const Community = () => {
  const { language } = useLanguage();

  const posts = [
    {
      author: "Μαρία Π.",
      role: language === "el" ? "Εκπαιδευτικός" : "Teacher",
      title:
        language === "el"
          ? "Πώς προσάρμοσα το Chapter 2 για την τάξη μου"
          : "How I adapted Chapter 2 for my class",
      excerpt:
        language === "el"
          ? "Οι μαθητές μου λάτρεψαν την προσθήκη μιας δραστηριότητας με lego..."
          : "My students loved adding a Lego-based activity...",
      likes: 24,
      comments: 8,
      badge: language === "el" ? "Εμπνευσμένο" : "Inspired",
    },
    {
      author: "Γιώργος Α.",
      role: language === "el" ? "Διευθυντής" : "Principal",
      title:
        language === "el"
          ? "5 τρόποι να ενθαρρύνετε τη συνεργασία"
          : "5 ways to encourage collaboration",
      excerpt:
        language === "el"
          ? "Μετά από 2 χρόνια διδασκαλίας επιχειρηματικότητας, αυτές είναι οι..."
          : "After 2 years of teaching entrepreneurship, these are my top learnings...",
      likes: 42,
      comments: 15,
      badge: language === "el" ? "Δημοφιλές" : "Popular",
    },
    {
      author: "Ελένη Κ.",
      role: language === "el" ? "Εκπαιδευτικός" : "Teacher",
      title:
        language === "el"
          ? "Mini Challenge: Επιχείρηση από ανακυκλώσιμα"
          : "Mini Challenge: Business from recyclables",
      excerpt:
        language === "el"
          ? "Δημιούργησα ένα challenge που συνδυάζει περιβαλλοντική συνείδηση..."
          : "I created a challenge that combines environmental awareness with entrepreneurship...",
      likes: 31,
      comments: 12,
      badge: language === "el" ? "Νέο" : "New",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            {
              label: translations.community.breadcrumbLabel[language],
            },
          ]}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {translations.community.pageTitle[language]}
          </h1>
          <p className="text-muted-foreground text-lg">
            {translations.community.pageSubtitle[language]}
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
                    <h2 className="text-2xl font-bold mb-2">
                      {translations.community.comingSoonTitle[language]}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {translations.community.comingSoonDescription[language]}
                    </p>
                    <Button>
                      {translations.community.comingSoonButton[language]}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Posts */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                {translations.community.previewTitle[language]}
              </h2>
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
                        <span>
                          👍 {post.likes} {translations.community.likesLabel[language]}
                        </span>
                        <span>
                          💬 {post.comments} {translations.community.commentsLabel[language]}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <GlobalTip
              tip={translations.community.globalTip[language]}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {translations.community.whatWillIncludeTitle[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Share2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {translations.community.shareActivitiesTitle[language]}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {translations.community.shareActivitiesDescription[language]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {translations.community.ideasInspirationTitle[language]}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {translations.community.ideasInspirationDescription[language]}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      {translations.community.bestPracticesTitle[language]}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {translations.community.bestPracticesDescription[language]}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">
                  {translations.community.updatesTitle[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="text-muted-foreground mb-4">
                  {translations.community.updatesDescription[language]}
                </p>
                <Button variant="secondary" className="w-full">
                  {translations.community.updatesButton[language]}
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
