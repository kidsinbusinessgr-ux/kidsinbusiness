-- Club Schema: Entrepreneurship Club Platform

CREATE TABLE IF NOT EXISTS club_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  school_year TEXT NOT NULL DEFAULT '2025-2026',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  class_id UUID REFERENCES club_classes(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('sales','marketing','technical','finance','operations')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES club_classes(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  material_url TEXT,
  material_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES club_classes(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES club_lessons(id) ON DELETE SET NULL,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES club_students(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES club_challenges(id) ON DELETE CASCADE,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, challenge_id)
);

CREATE TABLE IF NOT EXISTS club_lean_canvas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES club_students(id) ON DELETE CASCADE UNIQUE,
  problem TEXT,
  solution TEXT,
  unique_value_prop TEXT,
  customer_segments TEXT,
  channels TEXT,
  revenue_streams TEXT,
  cost_structure TEXT,
  key_metrics TEXT,
  unfair_advantage TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_pitches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES club_students(id) ON DELETE CASCADE UNIQUE,
  content TEXT,
  logo_url TEXT,
  logo_name TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE club_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_lean_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_pitches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage own classes" ON club_classes
  USING (teacher_id = auth.uid());

CREATE POLICY "Anyone can read classes" ON club_classes
  FOR SELECT USING (true);

CREATE POLICY "Open student access" ON club_students
  USING (true) WITH CHECK (true);

CREATE POLICY "Open lessons read" ON club_lessons
  FOR SELECT USING (true);

CREATE POLICY "Teachers manage lessons" ON club_lessons
  USING (EXISTS (SELECT 1 FROM club_classes c WHERE c.id = club_lessons.class_id AND c.teacher_id = auth.uid()));

CREATE POLICY "Open challenges read" ON club_challenges
  FOR SELECT USING (true);

CREATE POLICY "Teachers manage challenges" ON club_challenges
  USING (EXISTS (SELECT 1 FROM club_classes c WHERE c.id = club_challenges.class_id AND c.teacher_id = auth.uid()));

CREATE POLICY "Open submissions access" ON club_submissions
  USING (true) WITH CHECK (true);

CREATE POLICY "Open lean canvas access" ON club_lean_canvas
  USING (true) WITH CHECK (true);

CREATE POLICY "Open pitches access" ON club_pitches
  USING (true) WITH CHECK (true);
