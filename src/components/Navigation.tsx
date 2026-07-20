import { Link, useLocation } from "react-router-dom";
import {
  BookOpen, Zap, GraduationCap, Users, Menu,
  LogIn, LogOut, Coins, LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { useAuthAndClasses } from "@/hooks/useAuthAndClasses";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/kids-in-business-logo.png";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";

const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuthAndClasses();
  const { language, setLanguage } = useLanguage();

  // Core nav — visible to everyone
  const coreItems = [
    { path: "/programs", label: language === "el" ? "Προγράμματα" : "Programs", icon: LayoutGrid },
    { path: "/chapters", label: translations.navigation.chapters[language], icon: BookOpen },
    { path: "/actions", label: translations.navigation.actions[language], icon: Zap },
    { path: "/community", label: translations.navigation.community[language], icon: Users },
  ];

  // Teacher items — always visible (platform is currently teacher-facing)
  const teacherItems = [
    { path: "/teachers", label: translations.navigation.teachers[language], icon: GraduationCap },
    { path: "/teacher-portal", label: language === "el" ? "Αξιολόγηση" : "Reviews", icon: GraduationCap },
  ];

  // Items only for authenticated users
  const authItems = [
    { path: "/wallet", label: translations.wallet.pageTitle[language], icon: Coins },
  ];

  const navItems = [
    ...coreItems,
    ...teacherItems,
    ...(isAuthenticated ? authItems : []),
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
          <div className="hidden md:flex items-center gap-4">
            {/* Language switcher */}
            <div className="flex items-center gap-1 border rounded-full px-2 py-1 text-xs">
              <button
                type="button"
                className={`px-2 py-0.5 rounded-full transition-colors ${language === "el" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                onClick={() => setLanguage("el")}
              >
                GR
              </button>
              <button
                type="button"
                className={`px-2 py-0.5 rounded-full transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs ml-2"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" />
                  {translations.navigation.signOut[language]}
                </Button>
              ) : (
                <Button asChild size="sm" className="gap-2 text-xs ml-2">
                  <Link to="/auth">
                    <LogIn className="w-4 h-4" />
                    {translations.navigation.signIn[language]}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setLanguage(language === "el" ? "en" : "el")}
            >
              <span className="text-xs font-semibold">{language.toUpperCase()}</span>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col gap-4 pt-10">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${
                        isActive(item.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto">
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs w-full"
                      onClick={() => { signOut(); setOpen(false); }}
                    >
                      <LogOut className="w-4 h-4" />
                      {translations.navigation.signOut[language]}
                    </Button>
                  ) : (
                    <Button asChild size="sm" className="gap-2 text-xs w-full" onClick={() => setOpen(false)}>
                      <Link to="/auth">
                        <LogIn className="w-4 h-4" />
                        {translations.navigation.signIn[language]}
                      </Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
