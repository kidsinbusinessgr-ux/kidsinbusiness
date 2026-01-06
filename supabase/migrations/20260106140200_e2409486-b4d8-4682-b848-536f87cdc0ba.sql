-- Add creator_id column to track ownership of activities
ALTER TABLE public.actions_activities
ADD COLUMN IF NOT EXISTS creator_id uuid;

-- Create or replace function to automatically set creator_id to the authenticated user on insert
CREATE OR REPLACE FUNCTION public.set_actions_creator_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.creator_id IS NULL THEN
    NEW.creator_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to call the function before inserting new activities
DROP TRIGGER IF EXISTS set_actions_creator_id_trigger ON public.actions_activities;
CREATE TRIGGER set_actions_creator_id_trigger
BEFORE INSERT ON public.actions_activities
FOR EACH ROW
EXECUTE FUNCTION public.set_actions_creator_id();

-- Tighten RLS policies on actions_activities to enforce ownership on writes
DROP POLICY IF EXISTS "Authenticated can create activities" ON public.actions_activities;
DROP POLICY IF EXISTS "Authenticated can update activities" ON public.actions_activities;
DROP POLICY IF EXISTS "Authenticated can delete activities" ON public.actions_activities;

-- Only authenticated users can create activities; creator_id is set to auth.uid() by trigger
CREATE POLICY "Users can create own activities"
ON public.actions_activities
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Only the owner of an activity can update it
CREATE POLICY "Users can update own activities"
ON public.actions_activities
FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- Only the owner of an activity can delete it
CREATE POLICY "Users can delete own activities"
ON public.actions_activities
FOR DELETE
TO authenticated
USING (creator_id = auth.uid());
