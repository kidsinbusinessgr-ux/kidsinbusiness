import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{translations.generic.indexTitle[language]}</h1>
        <p className="text-xl text-muted-foreground">
          {translations.generic.indexSubtitle[language]}
        </p>
      </div>
    </div>
  );
};

export default Index;
