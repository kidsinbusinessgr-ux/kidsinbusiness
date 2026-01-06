import { BookOpen, HelpCircle, Compass, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import GlobalTip from "@/components/GlobalTip";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const Teachers = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            {
              label: translations.teachers.breadcrumbLabel[language],
            },
          ]}
        />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {translations.teachers.pageTitle[language]}
          </h1>
          <p className="text-muted-foreground text-lg">
            {translations.teachers.pageSubtitle[language]}
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
                  <CardTitle>{translations.teachers.howItWorksTitle[language]}</CardTitle>
                </div>
                <CardDescription>
                  {translations.teachers.howItWorksDescription[language]}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>
                    {translations.teachers.howItWorksIntro[language]}
                  </p>
                  <h3 className="font-bold mt-6 mb-3">
                    {translations.teachers.programStructureTitle[language]}
                  </h3>
                  <ul className="space-y-2">
                    <li>{translations.teachers.programStructureItem1[language]}</li>
                    <li>{translations.teachers.programStructureItem2[language]}</li>
                    <li>{translations.teachers.programStructureItem3[language]}</li>
                  </ul>

                  <h3 className="font-bold mt-6 mb-3">
                    {translations.teachers.includesTitle[language]}
                  </h3>
                  <ul className="space-y-2">
                    <li>{translations.teachers.includesItem1[language]}</li>
                    <li>{translations.teachers.includesItem2[language]}</li>
                    <li>{translations.teachers.includesItem3[language]}</li>
                    <li>{translations.teachers.includesItem4[language]}</li>
                    <li>{translations.teachers.includesItem5[language]}</li>
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
                  <CardTitle>{translations.teachers.philosophyTitle[language]}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>
                    {translations.teachers.philosophyIntro[language]}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 not-prose mt-4">
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">
                        {translations.teachers.philosophyPillar1Title[language]}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {translations.teachers.philosophyPillar1Description[language]}
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">
                        {translations.teachers.philosophyPillar2Title[language]}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {translations.teachers.philosophyPillar2Description[language]}
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border">
                      <h4 className="font-bold mb-2">
                        {translations.teachers.philosophyPillar3Title[language]}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {translations.teachers.philosophyPillar3Description[language]}
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
                  <CardTitle>{translations.teachers.faqTitle[language]}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      {translations.teachers.faqItem1Question[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {translations.teachers.faqItem1Answer[language]}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      {translations.teachers.faqItem2Question[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {translations.teachers.faqItem2Answer[language]}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      {translations.teachers.faqItem3Question[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {translations.teachers.faqItem3Answer[language]}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      {translations.teachers.faqItem4Question[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {translations.teachers.faqItem4Answer[language]}
                    </AccordionContent>
                  </AccordionItem>
 
                  <AccordionItem value="item-5">
                    <AccordionTrigger>
                      {translations.teachers.faqItem5Question[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      {translations.teachers.faqItem5Answer[language]}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <GlobalTip tip={translations.teachers.globalTip[language]} />

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">
                    {translations.teachers.classGuideTitle[language]}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">
                    {translations.teachers.classGuideBeforeTitle[language]}
                  </h4>
                  <p className="text-muted-foreground">
                    {translations.teachers.classGuideBeforeText[language]}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    {translations.teachers.classGuideDuringTitle[language]}
                  </h4>
                  <p className="text-muted-foreground">
                    {translations.teachers.classGuideDuringText[language]}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    {translations.teachers.classGuideAfterTitle[language]}
                  </h4>
                  <p className="text-muted-foreground">
                    {translations.teachers.classGuideAfterText[language]}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {translations.teachers.helpTitle[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {translations.teachers.helpIntro[language]}
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <div>{translations.teachers.helpEmail[language]}</div>
                  <div>{translations.teachers.helpCommunity[language]}</div>
                  <div>{translations.teachers.helpLibrary[language]}</div>
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
