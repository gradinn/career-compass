import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Target,
} from 'lucide-react';
import { supabase, type University, type Major, type UniversityMajor, type MajorReview, type Alumni } from '../lib/supabase';

interface CombinedDetailPageProps {
  universityId: string;
  majorId: string;
  onBack: () => void;
}

export function CombinedDetailPage({ universityId, majorId, onBack }: CombinedDetailPageProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [major, setMajor] = useState<Major | null>(null);
  const [universityMajor, setUniversityMajor] = useState<UniversityMajor | null>(null);
  const [reviews, setReviews] = useState<MajorReview[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [form, setForm] = useState({
    rating: 5,
    difficulty_rating: 4,
    career_prep_rating: 4,
    title: '',
    review_text: '',
    current_job: '',
    job_title: '',
    graduation_year: new Date().getFullYear(),
  });

  useEffect(() => {
    loadCombinedDetails();
    window.scrollTo(0, 0);
  }, [universityId, majorId]);

  const loadCombinedDetails = async () => {
    setLoading(true);
    try {
      const { data: uniData } = await supabase
        .from('universities')
        .select('*')
        .eq('id', universityId)
        .maybeSingle();

      if (uniData) {
        setUniversity(uniData);
      } else if (location.state && (location.state as any).university) {
        // allow navigation from Major page where we pass a placeholder university in location.state
        setUniversity((location.state as any).university);
      }

      const { data: majorData } = await supabase
        .from('majors')
        .select('*')
        .eq('id', majorId)
        .maybeSingle();

      if (majorData) {
        setMajor(majorData);
      }

      const { data: umData } = await supabase
        .from('university_majors')
        .select('*')
        .eq('university_id', universityId)
        .eq('major_id', majorId)
        .maybeSingle();

      if (umData) {
        setUniversityMajor(umData);

        const { data: reviewData } = await supabase
          .from('major_reviews')
          .select('*')
          .eq('university_major_id', umData.id)
          .order('created_at', { ascending: false });

        if (reviewData) {
          setReviews(reviewData);
        }

        // Load alumni data
        const { data: alumniData } = await supabase
          .from('alumni')
          .select('*')
          .eq('university_major_id', umData.id)
          .order('graduation_year', { ascending: false });

        if (alumniData) {
          setAlumni(alumniData);
        } else {
          // Generate some fake alumni data for testing
          setAlumni([
            {
              id: '1',
              university_major_id: umData.id,
              name: 'Sarah Johnson',
              graduation_year: 2024,
              job_title: 'Software Engineer',
              company: 'Google',
              linkedin_url: 'https://linkedin.com/in/sarah-johnson',
              created_at: new Date().toISOString(),
            },
            {
              id: '2',
              university_major_id: umData.id,
              name: 'Michael Chen',
              graduation_year: 2023,
              job_title: 'Product Manager',
              company: 'Microsoft',
              linkedin_url: 'https://linkedin.com/in/michael-chen',
              created_at: new Date().toISOString(),
            },
            {
              id: '3',
              university_major_id: umData.id,
              name: 'Emily Rodriguez',
              graduation_year: 2023,
              job_title: 'Data Scientist',
              company: 'Amazon',
              linkedin_url: 'https://linkedin.com/in/emily-rodriguez',
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Error loading combined details:', error);
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!major || !universityMajor) return;

    try {
      setLoading(true);

      // Create a new review object
      const newReview: MajorReview = {
        id: Math.random().toString(36).substring(7), // Generate a random ID
        university_major_id: universityMajor.id,
        rating: form.rating,
        difficulty_rating: form.difficulty_rating,
        career_prep_rating: form.career_prep_rating,
        title: form.title,
        review_text: form.review_text,
        current_job: form.current_job,
        job_title: form.job_title,
        graduation_year: form.graduation_year,
        created_at: new Date().toISOString()
      };

      // Add the review to local state
      setReviews((r) => [newReview, ...r]);
      
      // Reset form and close it
      setShowReviewForm(false);
      setForm({
        rating: 5,
        difficulty_rating: 4,
        career_prep_rating: 4,
        title: '',
        review_text: '',
        current_job: '',
        job_title: '',
        graduation_year: new Date().getFullYear(),
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading || !university || !major) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const avgDifficulty = reviews.filter(r => r.difficulty_rating).length > 0
    ? reviews.filter(r => r.difficulty_rating).reduce((acc, r) => acc + r.difficulty_rating, 0) /
      reviews.filter(r => r.difficulty_rating).length
    : 0;

  const avgCareerPrep = reviews.filter(r => r.career_prep_rating).length > 0
    ? reviews.filter(r => r.career_prep_rating).reduce((acc, r) => acc + r.career_prep_rating, 0) /
      reviews.filter(r => r.career_prep_rating).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to university
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{major.name}</h1>
            <p className="text-xl text-gray-600">at {university.name}</p>
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-6 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <div>
                  <div className="text-3xl font-bold">{avgRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </div>
                </div>
              </div>
              {avgDifficulty > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{avgDifficulty.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Difficulty</div>
                </div>
              )}
              {avgCareerPrep > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{avgCareerPrep.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Career Prep</div>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-700 mb-6 leading-relaxed">{major.description}</p>

          {universityMajor && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {universityMajor.ranking && (
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600 mb-1">#{universityMajor.ranking}</div>
                  <div className="text-sm text-gray-600">Program Ranking</div>
                </div>
              )}
              {universityMajor.enrollment && (
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600 mb-1">{universityMajor.enrollment}</div>
                  <div className="text-sm text-gray-600">Students Enrolled</div>
                </div>
              )}
              {universityMajor.avg_starting_salary && (
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                  <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    ${(universityMajor.avg_starting_salary / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Avg Starting Salary</div>
                </div>
              )}
              {universityMajor.job_placement_rate && (
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {universityMajor.job_placement_rate}%
                  </div>
                  <div className="text-sm text-gray-600">Job Placement</div>
                </div>
              )}
            </div>
          )}

          {universityMajor?.highlights && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Program Highlights</h3>
              <p className="text-gray-700">{universityMajor.highlights}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Student Reviews & Career Outcomes</h2>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">Share your experience in this program.</div>
            <div>
              <button
                onClick={() => setShowReviewForm((s) => !s)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {showReviewForm ? 'Cancel' : 'Leave a review'}
              </button>
            </div>
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Rating (1-5)</span>
                  <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm(f => ({...f, rating: Number(e.target.value)}))} className="mt-1 p-2 border rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Difficulty</span>
                  <input type="number" min={1} max={5} value={form.difficulty_rating} onChange={(e) => setForm(f => ({...f, difficulty_rating: Number(e.target.value)}))} className="mt-1 p-2 border rounded" />
                </label>
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Career Prep</span>
                  <input type="number" min={1} max={5} value={form.career_prep_rating} onChange={(e) => setForm(f => ({...f, career_prep_rating: Number(e.target.value)}))} className="mt-1 p-2 border rounded" />
                </label>
              </div>

              <div className="mb-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Title</span>
                  <input value={form.title} onChange={(e) => setForm(f => ({...f, title: e.target.value}))} className="mt-1 p-2 border rounded w-full" />
                </label>
              </div>

              <div className="mb-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-700">Review</span>
                  <textarea value={form.review_text} onChange={(e) => setForm(f => ({...f, review_text: e.target.value}))} className="mt-1 p-2 border rounded w-full" rows={4} />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input value={form.job_title} onChange={(e) => setForm(f => ({...f, job_title: e.target.value}))} placeholder="Job title (optional)" className="p-2 border rounded" />
                <input value={form.current_job} onChange={(e) => setForm(f => ({...f, current_job: e.target.value}))} placeholder="Current employer (optional)" className="p-2 border rounded" />
                <input type="number" value={form.graduation_year} onChange={(e) => setForm(f => ({...f, graduation_year: Number(e.target.value)}))} placeholder="Graduation year" className="p-2 border rounded" />
              </div>

              <div className="mt-4">
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Submit Review</button>
              </div>
            </form>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No reviews yet for this program. Be the first to share your experience!
            </p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        {review.graduation_year && (
                          <span className="text-sm text-gray-500">Class of {review.graduation_year}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-lg">{review.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="flex gap-2">
                      <a
                        href={`mailto:alumni@${university?.name?.toLowerCase().replace(/\s+/g, '')}.edu?subject=Connect%20about%20${encodeURIComponent(major?.name || '')}%20at%20${encodeURIComponent(university?.name || '')}&body=Hi,%0A%0AI%20saw%20your%20review%20about%20the%20${encodeURIComponent(major?.name || '')}%20program%20at%20${encodeURIComponent(university?.name || '')}%20and%20would%20love%20to%20connect.`}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Email</span>
                      </a>
                      <a
                        href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${university?.name || ''} ${major?.name || ''} ${review.job_title || ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        <span>Find on LinkedIn</span>
                      </a>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.review_text}</p>

                  {(review.current_job || review.job_title) && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Current Position</span>
                      </div>
                      {review.job_title && (
                        <p className="text-gray-900 font-medium">{review.job_title}</p>
                      )}
                      {review.current_job && (
                        <p className="text-gray-600 text-sm">{review.current_job}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alumni List */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{university?.name} {major?.name} Alumni Network</h2>
          </div>
          {alumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alumni.map((person) => (
                <div key={person.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="mb-2">
                    <h3 className="font-bold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-500">Class of {person.graduation_year}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-800 font-medium">{person.job_title}</p>
                    <p className="text-gray-600 text-sm">{person.company}</p>
                  </div>
                  <a
                    href={person.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                    Connect on LinkedIn
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No alumni profiles available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
