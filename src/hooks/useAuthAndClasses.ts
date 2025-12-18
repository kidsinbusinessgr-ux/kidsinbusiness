import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export type ClassItem = {
  id: string;
  name: string;
  school?: string;
  grade?: string;
  year?: string;
};

const LOCAL_CLASS_IDS = ["class-a", "class-b", "class-c"];

const getDefaultLocalClassNames = (): Record<string, string> => ({
  "class-a": "Τμήμα Α",
  "class-b": "Τμήμα Β",
  "class-c": "Τμήμα Γ",
});

export const useAuthAndClasses = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load classes from localStorage (for anonymous users)
  const loadLocalClasses = (): ClassItem[] => {
    const storedNames = localStorage.getItem("classNames");
    const classNames = storedNames ? JSON.parse(storedNames) : getDefaultLocalClassNames();

    return LOCAL_CLASS_IDS.map((id) => ({
      id,
      name: classNames[id] || id,
    }));
  };

  // Load classes from backend (for authenticated users)
  const loadBackendClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name, school, grade, year")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading classes:", error);
      toast({
        title: "Failed to load classes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    return data || [];
  };

  // Initialize auth state and classes
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const backendClasses = await loadBackendClasses();
        setClasses(backendClasses);
      } else {
        setClasses(loadLocalClasses());
      }

      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const backendClasses = await loadBackendClasses();
          setClasses(backendClasses);
        } else {
          setClasses(loadLocalClasses());
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Rename a class
  const renameClass = async (classId: string, newName: string) => {
    if (user) {
      // Backend mode
      const { error } = await supabase
        .from("classes")
        .update({ name: newName })
        .eq("id", classId);

      if (error) {
        toast({
          title: "Failed to rename class",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setClasses((prev) =>
        prev.map((cls) => (cls.id === classId ? { ...cls, name: newName } : cls))
      );
      return true;
    } else {
      // Local mode
      const storedNames = localStorage.getItem("classNames");
      const classNames = storedNames ? JSON.parse(storedNames) : getDefaultLocalClassNames();
      classNames[classId] = newName;
      localStorage.setItem("classNames", JSON.stringify(classNames));

      setClasses((prev) =>
        prev.map((cls) => (cls.id === classId ? { ...cls, name: newName } : cls))
      );
      return true;
    }
  };

  // Create a new class (backend only)
  const createClass = async (name: string, school?: string, grade?: string, year?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: user.id,
        name,
        school,
        grade,
        year,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Failed to create class",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setClasses((prev) => [...prev, data]);
    return data;
  };

  // Delete a class (backend only)
  const deleteClass = async (classId: string) => {
    if (!user) return false;

    const { error } = await supabase.from("classes").delete().eq("id", classId);

    if (error) {
      toast({
        title: "Failed to delete class",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }

    setClasses((prev) => prev.filter((cls) => cls.id !== classId));
    return true;
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setClasses(loadLocalClasses());
  };

  return {
    user,
    session,
    classes,
    loading,
    isAuthenticated: !!user,
    renameClass,
    createClass,
    deleteClass,
    signOut,
  };
};
