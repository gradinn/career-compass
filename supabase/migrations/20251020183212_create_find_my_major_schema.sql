/*
  # Career Compass Database Schema

  ## Overview
  This migration creates the complete database schema for a career and major research platform
  similar to Rate My Professors, but focused on helping students find their ideal major and university.

  ## New Tables

  ### 1. `universities`
  Stores information about colleges and universities
  - `id` (uuid, primary key)
  - `name` (text) - University name
  - `location` (text) - City, State
  - `type` (text) - Public/Private
  - `size` (text) - Small/Medium/Large
  - `acceptance_rate` (numeric) - Percentage
  - `average_gpa` (numeric)
  - `average_sat` (integer)
  - `tuition` (integer) - Annual tuition
  - `graduation_rate` (numeric) - Percentage
  - `student_faculty_ratio` (text)
  - `description` (text) - Overview of the university
  - `website` (text) - University website
  - `image_url` (text) - University image
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `majors`
  Stores information about majors and industries
  - `id` (uuid, primary key)
  - `name` (text) - Major/industry name
  - `category` (text) - STEM, Business, Arts, etc.
  - `description` (text) - Overview of the major
  - `median_salary` (integer) - Starting salary
  - `mid_career_salary` (integer)
  - `unemployment_rate` (numeric) - Percentage
  - `job_growth_rate` (numeric) - Percentage
  - `required_education` (text) - Degree level needed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `university_majors`
  Junction table linking universities to their offered majors with specific stats
  - `id` (uuid, primary key)
  - `university_id` (uuid, foreign key)
  - `major_id` (uuid, foreign key)
  - `ranking` (integer) - Program ranking
  - `enrollment` (integer) - Students enrolled
  - `avg_starting_salary` (integer) - For graduates from this program
  - `job_placement_rate` (numeric) - Percentage
  - `highlights` (text) - Special features of the program
  - `created_at` (timestamptz)

  ### 4. `university_reviews`
  Student reviews of universities
  - `id` (uuid, primary key)
  - `university_id` (uuid, foreign key)
  - `rating` (integer) - 1-5 stars
  - `academic_rating` (integer) - 1-5 stars
  - `campus_rating` (integer) - 1-5 stars
  - `social_rating` (integer) - 1-5 stars
  - `title` (text) - Review title
  - `review_text` (text) - Detailed review
  - `pros` (text) - What's great
  - `cons` (text) - What needs improvement
  - `student_year` (text) - Freshman, Sophomore, etc.
  - `created_at` (timestamptz)

  ### 5. `major_reviews`
  Reviews of majors/career paths at specific universities
  - `id` (uuid, primary key)
  - `university_major_id` (uuid, foreign key)
  - `rating` (integer) - 1-5 stars
  - `difficulty_rating` (integer) - 1-5 stars
  - `career_prep_rating` (integer) - 1-5 stars
  - `title` (text) - Review title
  - `review_text` (text) - Detailed review
  - `current_job` (text) - Where they work now
  - `job_title` (text) - Current position
  - `graduation_year` (integer)
  - `created_at` (timestamptz)

  ### 6. `job_outcomes`
  Common jobs and outcomes for each major
  - `id` (uuid, primary key)
  - `major_id` (uuid, foreign key)
  - `job_title` (text)
  - `average_salary` (integer)
  - `percentage` (numeric) - % of graduates in this role
  - `description` (text)
  - `created_at` (timestamptz)

  ### 7. `industry_news`
  Latest news and trends for majors/industries
  - `id` (uuid, primary key)
  - `major_id` (uuid, foreign key)
  - `title` (text)
  - `summary` (text)
  - `source` (text)
  - `url` (text)
  - `published_date` (date)
  - `created_at` (timestamptz)

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - All tables are publicly readable (no authentication required for viewing)
  - Future: Add authenticated user policies for submitting reviews

  ## Indexes
  - Add indexes on foreign keys and commonly searched fields
  - Add text search indexes for university and major names
*/

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  type text DEFAULT 'Public',
  size text DEFAULT 'Medium',
  acceptance_rate numeric,
  average_gpa numeric,
  average_sat integer,
  tuition integer,
  graduation_rate numeric,
  student_faculty_ratio text,
  description text,
  website text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create majors table
CREATE TABLE IF NOT EXISTS majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  median_salary integer,
  mid_career_salary integer,
  unemployment_rate numeric,
  job_growth_rate numeric,
  required_education text DEFAULT 'Bachelor''s Degree',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create university_majors junction table
CREATE TABLE IF NOT EXISTS university_majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  major_id uuid NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  ranking integer,
  enrollment integer,
  avg_starting_salary integer,
  job_placement_rate numeric,
  highlights text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(university_id, major_id)
);

-- Create university_reviews table
CREATE TABLE IF NOT EXISTS university_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  academic_rating integer CHECK (academic_rating >= 1 AND academic_rating <= 5),
  campus_rating integer CHECK (campus_rating >= 1 AND campus_rating <= 5),
  social_rating integer CHECK (social_rating >= 1 AND social_rating <= 5),
  title text NOT NULL,
  review_text text NOT NULL,
  pros text,
  cons text,
  student_year text,
  created_at timestamptz DEFAULT now()
);

-- Create major_reviews table
CREATE TABLE IF NOT EXISTS major_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_major_id uuid NOT NULL REFERENCES university_majors(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  difficulty_rating integer CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  career_prep_rating integer CHECK (career_prep_rating >= 1 AND career_prep_rating <= 5),
  title text NOT NULL,
  review_text text NOT NULL,
  current_job text,
  job_title text,
  graduation_year integer,
  created_at timestamptz DEFAULT now()
);

-- Create job_outcomes table
CREATE TABLE IF NOT EXISTS job_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major_id uuid NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  average_salary integer,
  percentage numeric,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create industry_news table
CREATE TABLE IF NOT EXISTS industry_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  major_id uuid NOT NULL REFERENCES majors(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  source text,
  url text,
  published_date date,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_university_majors_university ON university_majors(university_id);
CREATE INDEX IF NOT EXISTS idx_university_majors_major ON university_majors(major_id);
CREATE INDEX IF NOT EXISTS idx_university_reviews_university ON university_reviews(university_id);
CREATE INDEX IF NOT EXISTS idx_major_reviews_university_major ON major_reviews(university_major_id);
CREATE INDEX IF NOT EXISTS idx_job_outcomes_major ON job_outcomes(major_id);
CREATE INDEX IF NOT EXISTS idx_industry_news_major ON industry_news(major_id);

-- Enable Row Level Security
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_majors ENABLE ROW LEVEL SECURITY;
ALTER TABLE university_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE major_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_news ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Universities are publicly readable"
  ON universities FOR SELECT
  USING (true);

CREATE POLICY "Majors are publicly readable"
  ON majors FOR SELECT
  USING (true);

CREATE POLICY "University majors are publicly readable"
  ON university_majors FOR SELECT
  USING (true);

CREATE POLICY "University reviews are publicly readable"
  ON university_reviews FOR SELECT
  USING (true);

CREATE POLICY "Major reviews are publicly readable"
  ON major_reviews FOR SELECT
  USING (true);

CREATE POLICY "Job outcomes are publicly readable"
  ON job_outcomes FOR SELECT
  USING (true);

CREATE POLICY "Industry news is publicly readable"
  ON industry_news FOR SELECT
  USING (true);