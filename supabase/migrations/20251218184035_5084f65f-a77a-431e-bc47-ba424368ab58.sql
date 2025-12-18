-- Create classes table for teachers
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  school text,
  grade text,
  year text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Teachers can view only their own classes
CREATE POLICY "Teachers can view own classes"
  ON public.classes
  FOR SELECT
  USING (auth.uid() = teacher_id);

-- Teachers can insert their own classes
CREATE POLICY "Teachers can insert own classes"
  ON public.classes
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own classes
CREATE POLICY "Teachers can update own classes"
  ON public.classes
  FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can delete their own classes
CREATE POLICY "Teachers can delete own classes"
  ON public.classes
  FOR DELETE
  USING (auth.uid() = teacher_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();