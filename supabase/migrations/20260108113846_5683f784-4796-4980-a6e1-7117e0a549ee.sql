-- Mentor reviews table for teacher review history
CREATE TABLE public.mentor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  student_id text NOT NULL,
  student_name text NOT NULL,
  venture_name text NOT NULL,
  scores jsonb NOT NULL,
  selected_tags text[] NOT NULL DEFAULT '{}',
  feedback_text text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','finalized')),
  class_id uuid NULL REFERENCES public.classes(id) ON DELETE SET NULL,
  class_name text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One review per teacher/student pair
CREATE UNIQUE INDEX mentor_reviews_teacher_student_idx
  ON public.mentor_reviews(teacher_id, student_id);

-- Enable RLS
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Teachers can manage only their own reviews
CREATE POLICY "Teachers can view own reviews" ON public.mentor_reviews
FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert own reviews" ON public.mentor_reviews
FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own reviews" ON public.mentor_reviews
FOR UPDATE USING (auth.uid() = teacher_id) WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own reviews" ON public.mentor_reviews
FOR DELETE USING (auth.uid() = teacher_id);
