import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: translations.auth.toastLoginFailedTitle[language],
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: translations.auth.toastWelcomeBackTitle[language],
            description: translations.auth.toastWelcomeBackDescription[language],
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          toast({
            title: translations.auth.toastSignupFailedTitle[language],
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: translations.auth.toastAccountCreatedTitle[language],
            description: translations.auth.toastAccountCreatedDescription[language],
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: translations.auth.toastGenericErrorTitle[language],
        description: translations.auth.toastGenericErrorDescription[language],
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isLogin
              ? translations.auth.pageTitleLogin[language]
              : translations.auth.pageTitleSignup[language]}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? translations.auth.pageSubtitleLogin[language]
              : translations.auth.pageSubtitleSignup[language]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{translations.auth.emailLabel[language]}</Label>
              <Input
                id="email"
                type="email"
                placeholder={translations.auth.emailPlaceholder[language]}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{translations.auth.passwordLabel[language]}</Label>
              <Input
                id="password"
                type="password"
                placeholder={translations.auth.passwordPlaceholder[language]}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translations.auth.loadingButton[language]}
                </>
              ) : isLogin ? (
                translations.auth.submitLogin[language]
              ) : (
                translations.auth.submitSignup[language]
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            {isLogin
              ? translations.auth.toggleToSignup[language]
              : translations.auth.toggleToLogin[language]}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary underline-offset-4 hover:underline"
              disabled={loading}
            >
              {isLogin
                ? translations.auth.toggleSignupButton[language]
                : translations.auth.toggleLoginButton[language]}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
