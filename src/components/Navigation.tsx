import { Link, useLocation } from "react-router-dom";
// 1. ADD "Coins" HERE:
import { BookOpen, Zap, GraduationCap, Users, Menu, LogIn, LogOut, Coins } from "lucide-react";
import { useAuthAndClasses } from "@/hooks/useAuthAndClasses";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import logo from "@/assets/kids-in-business-logo.png";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuthAndClasses();
  const { language, setLanguage } = useLanguage();

  // 2. ADD YOUR NEW BUTTONS HERE:
  const navItems = [
    { path: "/chapters", label: translations.navigation.chapters[language], icon: BookOpen },
    { path: "/actions", label: translations.navigation.actions[language], icon: Zap },
    { path: "/teachers", label: translations.navigation.teachers[language], icon: GraduationCap },
    { path: "/community", label: translations.navigation.community[language], icon: Users },
    
    // The Teacher Portal (using your translation)
    { path: "/teacher-portal", label: translations.navigation.teacherPortal[language], icon: GraduationCap },
    
    // The Student Wallet (Direct text for now so it works instantly)
    { path: "/wallet", label: "My Wallet", icon: Coins }, 
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt={translations.navigation.logoAlt[language]}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 border rounded-full px-2 py-1 text-xs">
              <button
                type="button"
                className={`px-2 py-0.5 rounded-full ${language === "el" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setLanguage("el")}
              >
                GR
              </button>
              <button
                type="button"
                className={`px-2 py-0.5 rounded-full ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <Button variant="ghost" className="gap-2" onClick={signOut}>
                <LogOut className="w-4 h-4" />
                {translations.navigation.signOut[language]}
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {translations.navigation.signIn[language]}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    {translations.navigation.signOut[language]}
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <LogIn className="w-4 h-4" />
                      {translations.navigation.signIn[language]}
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs border ${language === "el" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}<br>                    onClick={() => setLanguage("el")}
                  >
                    GR
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-full text-xs border ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                    onClick={() => setLanguage("en")}
                  >
                    EN
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
