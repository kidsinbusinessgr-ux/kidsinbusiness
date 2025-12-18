-- Create table for shared Δράσεις activities editable via UI
CREATE TABLE IF NOT EXISTS public.actions_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  duration text,
  chapter text,
  chapter_id text,
  difficulty text,
  participants text,
  complexity text,
  category text NOT NULL CHECK (category IN ('mini','class','project')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure updated_at is maintained automatically
DROP TRIGGER IF EXISTS actions_activities_set_updated_at ON public.actions_activities;
CREATE TRIGGER actions_activities_set_updated_at
BEFORE UPDATE ON public.actions_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS for safe access control
ALTER TABLE public.actions_activities ENABLE ROW LEVEL SECURITY;

-- Policy: anyone (even anonymous) can read activities (curriculum content, non-PII)
DROP POLICY IF EXISTS "Anyone can read activities" ON public.actions_activities;
CREATE POLICY "Anyone can read activities"
ON public.actions_activities
FOR SELECT
TO public
USING (true);

-- Policy: only authenticated users can create activities
DROP POLICY IF EXISTS "Authenticated can create activities" ON public.actions_activities;
CREATE POLICY "Authenticated can create activities"
ON public.actions_activities
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: only authenticated users can update activities
DROP POLICY IF EXISTS "Authenticated can update activities" ON public.actions_activities;
CREATE POLICY "Authenticated can update activities"
ON public.actions_activities
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: only authenticated users can delete activities
DROP POLICY IF EXISTS "Authenticated can delete activities" ON public.actions_activities;
CREATE POLICY "Authenticated can delete activities"
ON public.actions_activities
FOR DELETE
TO authenticated
USING (true);