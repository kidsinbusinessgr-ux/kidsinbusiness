import { Link, useLocation } from "react-router-dom";
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

  const navItems = [
    { path: "/chapters", label: translations.navigation.chapters[language], icon: BookOpen },
    { path: "/actions", label: translations.navigation.actions[language], icon: Zap },
    { path: "/teachers", label: translations.navigation.teachers[language], icon: GraduationCap },
    { path: "/community", label: translations.navigation.community[language], icon: Users },
    
    // Updated: Teacher Portal using translations
    { path: "/teacher-portal", label: translations.teachers.breadcrumbLabel[language], icon: GraduationCap },
    
    // Updated: Wallet using translations
    { path: "/wallet", label: translations.wallet.pageTitle[language], icon: Coins }, 
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
                className={`px-2 py-0.5 rounded-full ${language === "en" ? "bg-primary text-primary-foreground
