import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type University = {
  id: string;
  name: string;
  location: string;
  type: string;
  size: string;
  acceptance_rate: number;
  average_gpa: number;
  average_sat: number;
  tuition: number;
  graduation_rate: number;
  student_faculty_ratio: string;
  description: string;
  website: string;
  image_url: string;
  university_logo: string;
  university_image: string;
  created_at: string;
  updated_at: string;
};

export type Major = {
  id: string;
  name: string;
  category: string;
  description: string;
  median_salary: number;
  mid_career_salary: number;
  unemployment_rate: number;
  job_growth_rate: number;
  required_education: string;
  created_at: string;
  updated_at: string;
};

export type UniversityMajor = {
  id: string;
  university_id: string;
  major_id: string;
  ranking: number;
  enrollment: number;
  avg_starting_salary: number;
  job_placement_rate: number;
  highlights: string;
  created_at: string;
};

export type UniversityReview = {
  id: string;
  university_id: string;
  rating: number;
  academic_rating: number;
  campus_rating: number;
  social_rating: number;
  title: string;
  review_text: string;
  pros: string;
  cons: string;
  student_year: string;
  created_at: string;
};

export type MajorReview = {
  id: string;
  university_major_id: string;
  rating: number;
  difficulty_rating: number;
  career_prep_rating: number;
  title: string;
  review_text: string;
  current_job: string;
  job_title: string;
  graduation_year: number;
  created_at: string;
};

export type JobOutcome = {
  id: string;
  major_id: string;
  job_title: string;
  average_salary: number;
  percentage: number;
  description: string;
  created_at: string;
};

export type IndustryNews = {
  id: string;
  major_id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  published_date: string;
  created_at: string;
};

export type Alumni = {
  id: string;
  university_major_id: string;
  name: string;
  graduation_year: number;
  job_title: string;
  company: string;
  linkedin_url: string;
  created_at: string;
};
