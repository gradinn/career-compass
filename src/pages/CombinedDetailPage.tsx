import { useState, useEffect } from 'react';
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
import { supabase, type University, type Major, type UniversityMajor, type MajorReview } from '../lib/supabase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCombinedDetails();
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
      }
    } catch (error) {
      console.error('Error loading combined details:', error);
    } finally {
      setLoading(false);
    }
  };

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
                      {review.graduation_year && (
                        <span className="text-sm text-gray-500">Class of {review.graduation_year}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{review.rating}</span>
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
      </div>
    </div>
  );
}
