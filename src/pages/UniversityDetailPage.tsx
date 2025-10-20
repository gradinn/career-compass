import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  TrendingUp,
  DollarSign,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Award,
} from 'lucide-react';
import { supabase, type University, type UniversityReview, type UniversityMajor, type Major } from '../lib/supabase';

interface UniversityDetailPageProps {
  universityId: string;
  onBack: () => void;
  onMajorClick: (universityId: string, majorId: string) => void;
}

export function UniversityDetailPage({ universityId, onBack, onMajorClick }: UniversityDetailPageProps) {
  const [university, setUniversity] = useState<University | null>(null);
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [topMajors, setTopMajors] = useState<(UniversityMajor & { major: Major })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUniversityDetails();
  }, [universityId]);

  const loadUniversityDetails = async () => {
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

      const { data: reviewData } = await supabase
        .from('university_reviews')
        .select('*')
        .eq('university_id', universityId)
        .order('created_at', { ascending: false });

      if (reviewData) {
        setReviews(reviewData);
      }

      const { data: majorData } = await supabase
        .from('university_majors')
        .select('*, major:majors(*)')
        .eq('university_id', universityId)
        .order('ranking', { ascending: true, nullsFirst: false })
        .limit(6);

      if (majorData) {
        setTopMajors(majorData as any);
      }
    } catch (error) {
      console.error('Error loading university details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !university) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const avgAcademic = reviews.filter(r => r.academic_rating).length > 0
    ? reviews.filter(r => r.academic_rating).reduce((acc, r) => acc + r.academic_rating, 0) /
      reviews.filter(r => r.academic_rating).length
    : 0;

  const avgCampus = reviews.filter(r => r.campus_rating).length > 0
    ? reviews.filter(r => r.campus_rating).reduce((acc, r) => acc + r.campus_rating, 0) /
      reviews.filter(r => r.campus_rating).length
    : 0;

  const avgSocial = reviews.filter(r => r.social_rating).length > 0
    ? reviews.filter(r => r.social_rating).reduce((acc, r) => acc + r.social_rating, 0) /
      reviews.filter(r => r.social_rating).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to search
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {university.image_url && (
            <img
              src={university.image_url}
              alt={university.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{university.name}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{university.location}</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {university.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{university.size} Campus</span>
                  </div>
                </div>
              </div>
              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
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
                {avgAcademic > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{avgAcademic.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Academics</div>
                  </div>
                )}
                {avgCampus > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{avgCampus.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Campus</div>
                  </div>
                )}
                {avgSocial > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{avgSocial.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Social Life</div>
                  </div>
                )}
              </div>
            )}

            <p className="text-gray-700 mb-8 leading-relaxed">{university.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {university.acceptance_rate && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{university.acceptance_rate}%</div>
                  <div className="text-sm text-gray-600">Acceptance Rate</div>
                </div>
              )}
              {university.graduation_rate && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600 mb-1">{university.graduation_rate}%</div>
                  <div className="text-sm text-gray-600">Graduation Rate</div>
                </div>
              )}
              {university.tuition && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${(university.tuition / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm text-gray-600">Annual Tuition</div>
                </div>
              )}
              {university.student_faculty_ratio && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{university.student_faculty_ratio}</div>
                  <div className="text-sm text-gray-600">Student:Faculty</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {topMajors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Top Programs</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topMajors.map((um) => (
                <div
                  key={um.id}
                  onClick={() => onMajorClick(universityId, um.major_id)}
                  className="p-4 border-2 border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{um.major.name}</h3>
                    {um.ranking && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        #{um.ranking}
                      </span>
                    )}
                  </div>
                  {um.avg_starting_salary && (
                    <div className="text-sm text-gray-600 mb-1">
                      Avg Salary: <span className="font-semibold text-gray-900">
                        ${(um.avg_starting_salary / 1000).toFixed(0)}k
                      </span>
                    </div>
                  )}
                  {um.job_placement_rate && (
                    <div className="text-sm text-gray-600">
                      Placement: <span className="font-semibold text-green-600">{um.job_placement_rate}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{review.title}</h3>
                      <span className="text-sm text-gray-500">{review.student_year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{review.review_text}</p>
                  {review.pros && (
                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-green-700 font-medium mb-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Pros</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div>
                      <div className="flex items-center gap-2 text-red-700 font-medium mb-1">
                        <ThumbsDown className="w-4 h-4" />
                        <span>Cons</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{review.cons}</p>
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
