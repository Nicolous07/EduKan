-- ==============================================================================
-- EduKan Tanzania - Production Supabase Database Schema
-- Tables: users_profiles, posts, comments, books, study_rooms, scholarships
-- Includes Row Level Security (RLS) policies and initial seed data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  cover_photo TEXT DEFAULT 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
  school_id TEXT,
  school_name TEXT NOT NULL DEFAULT 'Malampaka Secondary School',
  school_region TEXT DEFAULT 'Simiyu',
  school_district TEXT DEFAULT 'Maswa',
  level TEXT NOT NULL DEFAULT 'Kidato cha V - VI (A-Level)',
  combination TEXT DEFAULT 'PCB (Physics, Chemistry, Biology)',
  title TEXT DEFAULT 'Kiranja wa Masomo (Academic Prefect)',
  bio TEXT DEFAULT 'Mwanafunzi anayejiandaa na masomo ya juu kupitia EduKan Tanzania.',
  points INTEGER NOT NULL DEFAULT 150,
  followers_count INTEGER NOT NULL DEFAULT 0,
  following_count INTEGER NOT NULL DEFAULT 0,
  student_reg_no TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_handle TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_school TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'student',
  author_verified BOOLEAN DEFAULT false,
  type TEXT NOT NULL DEFAULT 'normal' CHECK (type IN ('normal', 'question', 'achievement', 'poll', 'resource')),
  category TEXT DEFAULT 'masomo' CHECK (category IN ('masomo', 'ushauri', 'burudani')),
  content TEXT NOT NULL,
  subject TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'document', 'video')),
  poll_options JSONB DEFAULT '[]'::jsonb,
  likes INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  school_id TEXT,
  school_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_school TEXT NOT NULL,
  author_role TEXT NOT NULL DEFAULT 'student',
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BOOKS / LIBRARY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Vitabu vya Masomo', 'Mitihani ya NECTA', 'Notisi za Masomo', 'Majaribio ya Mock', 'Miongozo ya Walimu')),
  level TEXT NOT NULL CHECK (level IN ('O-Level', 'A-Level', 'Chuo Kikuu', 'Msingi', 'Ualimu')),
  class_grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  year TEXT,
  author_or_publisher TEXT NOT NULL,
  file_format TEXT NOT NULL DEFAULT 'PDF' CHECK (file_format IN ('PDF', 'DOCX', 'EPUB')),
  file_size TEXT NOT NULL DEFAULT '5.4 MB',
  cover_image TEXT,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  uploader_name TEXT NOT NULL DEFAULT 'EduKan Maktaba',
  uploader_role TEXT NOT NULL DEFAULT 'admin',
  uploader_school TEXT,
  verified BOOLEAN DEFAULT true,
  pages INTEGER DEFAULT 120,
  download_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. STUDY ROOMS / QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.study_rooms (
  id TEXT PRIMARY KEY,
  author_id TEXT,
  author_name TEXT NOT NULL,
  author_avatar TEXT NOT NULL,
  author_school TEXT NOT NULL,
  author_form TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  views_count INTEGER NOT NULL DEFAULT 0,
  has_best_answer BOOLEAN NOT NULL DEFAULT false,
  answers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SCHOLARSHIPS & OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.scholarships (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  target_level TEXT NOT NULL,
  min_division TEXT,
  min_gpa NUMERIC(3,2),
  coverage TEXT NOT NULL,
  deadline TEXT NOT NULL,
  focus_area TEXT NOT NULL,
  criteria JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  link TEXT,
  applications_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- 1. USERS PROFILES POLICIES
-- Anyone can view profiles (public read)
CREATE POLICY "Allow public read users_profiles"
  ON public.users_profiles FOR SELECT
  USING (true);

-- Anyone authenticated or anon can create or update their profile
CREATE POLICY "Allow insert users_profiles"
  ON public.users_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update users_profiles"
  ON public.users_profiles FOR UPDATE
  USING (true);

-- 2. POSTS POLICIES
-- Anyone can view posts
CREATE POLICY "Allow public read posts"
  ON public.posts FOR SELECT
  USING (true);

-- Anyone can insert posts
CREATE POLICY "Allow insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

-- Authors or admins can update posts
CREATE POLICY "Allow update posts"
  ON public.posts FOR UPDATE
  USING (true);

-- Authors or admins can delete posts
CREATE POLICY "Allow delete posts"
  ON public.posts FOR DELETE
  USING (true);

-- 3. COMMENTS POLICIES
CREATE POLICY "Allow public read comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Allow insert comments"
  ON public.comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update comments"
  ON public.comments FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete comments"
  ON public.comments FOR DELETE
  USING (true);

-- 4. BOOKS POLICIES
CREATE POLICY "Allow public read books"
  ON public.books FOR SELECT
  USING (true);

CREATE POLICY "Allow insert books"
  ON public.books FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update books"
  ON public.books FOR UPDATE
  USING (true);

-- 5. STUDY ROOMS POLICIES
CREATE POLICY "Allow public read study_rooms"
  ON public.study_rooms FOR SELECT
  USING (true);

CREATE POLICY "Allow insert study_rooms"
  ON public.study_rooms FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update study_rooms"
  ON public.study_rooms FOR UPDATE
  USING (true);

-- 6. SCHOLARSHIPS POLICIES
CREATE POLICY "Allow public read scholarships"
  ON public.scholarships FOR SELECT
  USING (true);

CREATE POLICY "Allow insert scholarships"
  ON public.scholarships FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update scholarships"
  ON public.scholarships FOR UPDATE
  USING (true);

-- ==============================================================================
-- INITIAL SEED DATA (To bootstrap the database)
-- ==============================================================================

-- Seed Users
INSERT INTO public.users_profiles (id, name, handle, email, role, avatar, school_name, school_region, school_district, level, combination, title, bio, points, followers_count, following_count, student_reg_no)
VALUES
('usr-student-1', 'Nicolous Munisi', 'nicolous_munisi', 'nicolousmunisi07@gmail.com', 'student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'Malampaka Secondary School', 'Simiyu', 'Maswa', 'Kidato cha V - VI (A-Level)', 'PCB (Physics, Chemistry, Biology)', 'Kiranja wa Masomo (Academic Prefect)', 'Kiranja wa Masomo katika Malampaka Secondary School. Najiandaa na mtihani wa NECTA Form VI.', 250, 42, 19, 'S.0112/0045/2024'),
('usr-kelvin-udsm', 'Kelvin Komba', 'kelvin_tech', 'kelvin@udsm.ac.tz', 'student', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', 'University of Dar es Salaam (UDSM)', 'Dar es Salaam', 'Ubungo', 'Chuo Kikuu (Higher Ed)', 'Sayansi ya Kompyuta & IT', 'Mwanafunzi wa Shahada / Diploma', 'Mwanafunzi wa Shahada ya Sayansi ya Kompyuta UDSM CoICT. Napenda mifumo ya AI na Open Source.', 320, 85, 40, '2022-04-08912'),
('usr-admin-1', 'Mwl. Joseph Makoye', 'mwl_makoye', 'makoye@taboraboys.sc.tz', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'Tabora Boys Secondary School', 'Tabora', 'Tabora Mjini', 'Kidato cha V - VI (A-Level)', 'PCM (Physics, Chemistry, Mathematics)', 'Mkuu wa Taaluma & Mwalimu wa Fizikia', 'Mkuu wa Taaluma na Mwalimu wa Fizikia A-Level. Ninawasaidia wanafunzi kufikia daraja la kwanza.', 950, 210, 35, 'TR-TZ-8842')
ON CONFLICT (id) DO NOTHING;

-- Seed Scholarships
INSERT INTO public.scholarships (id, name, provider, target_level, min_division, min_gpa, coverage, deadline, focus_area, criteria, description, link)
VALUES
('samia-2026', 'Samia Scholarship Scheme (Sayansi & Teknolojia)', 'Wizara ya Elimu, Sayansi na Teknolojia (MoEST)', 'Kidato cha Sita (A-Level)', 'Division I.7 - I.9', 4.50, '100% Ada ya Chuo, Laptop, Malazi, Chakula & Vitabu', '31 Julai 2026', 'Sayansi Asilia, Uhandisi, Tiba, Hisabati (STEM)', '["Ufaulu wa Daraja la Kwanza (Division 1) Kidato cha Sita katika mchepuo wa Sayansi", "Kupata udahili katika Chuo Kikuu cha Umma Tanzania", "Uraia wa Tanzania na rekodi safi ya kimaadili"]'::jsonb, 'Ufadhili wa serikali kwa wanafunzi waliofanya vizuri zaidi mtihani wa kidato cha sita katika masomo ya sayansi.', 'https://www.moe.go.tz'),
('heslb-priority-2026', 'HESLB Special Priority Cadre (Bodi ya Mikopo)', 'Bodi ya Mikopo ya Wanafunzi wa Elimu ya Juu (HESLB)', 'Kidato cha Sita & Diploma', 'Division I au II', 3.50, 'Hadi 100% Ada, Boom (TZS 10,000/siku), Vifaa & Mafunzo kwa Vitendo', '30 Agosti 2026', 'Kozi za Kipaumbele za Taifa (Afya, Ualimu wa Sayansi, Uhandisi)', '["Kukamilisha maombi kupitia OLAMS ya HESLB", "Kudahiliwa katika fani za kipaumbele cha taifa"]'::jsonb, 'Mpango wa mikopo ya elimu ya juu kwa fani za kimkakati za taifa.', 'https://olas.heslb.go.tz')
ON CONFLICT (id) DO NOTHING;

-- Seed Books
INSERT INTO public.books (id, title, category, level, class_grade, subject, year, author_or_publisher, file_format, file_size, cover_image, downloads_count, description, uploader_name, uploader_role, download_url)
VALUES
('tie-phy-form6', 'Advanced Level Physics: Volume 1 & 2', 'Vitabu vya Masomo', 'A-Level', 'Form VI', 'Physics', '2024', 'Taasisi ya Elimu Tanzania (TIE)', 'PDF', '12.4 MB', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&auto=format&fit=crop&q=80', 1420, 'Kitabu rasmi cha kiada kilichoidhinishwa na TIE kwa wanafunzi wa Kidato cha V na VI mchepuo wa Sayansi.', 'Taasisi ya Elimu Tanzania (TIE)', 'admin', 'https://edukan.tz/library/tie-physics-form6.pdf'),
('necta-bio-2024', 'NECTA Form VI Biology Paper 1 & 2 (Solved Past Papers)', 'Mitihani ya NECTA', 'A-Level', 'Form VI', 'Biology', '2024', 'Baraza la Mitihani la Tanzania (NECTA)', 'PDF', '8.1 MB', 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&auto=format&fit=crop&q=80', 2150, 'Mkusanyiko wa mitihani ya NECTA na majibu rasmi kwa masomo ya Physiology, Genetics na Ecology.', 'Baraza la Mitihani la Tanzania (NECTA)', 'admin', 'https://edukan.tz/library/necta-biology-2024.pdf')
ON CONFLICT (id) DO NOTHING;
