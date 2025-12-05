import { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SearchFilters } from '../components/SearchFilters';
import { UniversityCard } from '../components/UniversityCard';
import { MajorCard } from '../components/MajorCard';
import { supabase, type University, type Major } from '../lib/supabase';

interface HomePageProps {
  onUniversityClick: (id: string) => void;
  onMajorClick: (id: string) => void;
  onCombinedClick: (universityId: string, majorId: string) => void;
}

export function HomePage({ onUniversityClick, onMajorClick }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'university' | 'major'>('all');
  const [universities, setUniversities] = useState<(University & { avg_rating?: number; review_count?: number })[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    window.scrollTo(0, 0);
  }, [searchQuery, searchType]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (searchType === 'all' || searchType === 'university') {
        let query = supabase
          .from('universities')
          .select('*')
          .order('name');

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: uniData } = await query.limit(20);

        if (uniData) {
          const universitiesWithRatings = await Promise.all(
            uniData.map(async (uni) => {
              const { data: reviews } = await supabase
                .from('university_reviews')
                .select('rating')
                .eq('university_id', uni.id);

              const avg_rating = reviews && reviews.length > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                : 0;

              return {
                ...uni,
                avg_rating: avg_rating || undefined,
                review_count: reviews?.length || 0,
              };
            })
          );

          setUniversities(universitiesWithRatings);
        }
      }

      if (searchType === 'all' || searchType === 'major') {
        let query = supabase
          .from('majors')
          .select('*')
          .order('name');

        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: majorData } = await query.limit(20);
        if (majorData) {
          setMajors(majorData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = searchType === 'major' ? [] : universities;
  const filteredMajors = searchType === 'university' ? [] : majors;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img
              src="/cc2.png"
              alt="Career Compass Logo"
              className="w-24 h-24 object-contain"
              style={{ cursor: "pointer" }}
            />
          </div>

          <h1 className="text-5xl font-bold text-gray-900">Career Compass</h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            Discover your perfect university and career path. Research programs, read student reviews,
            and explore career outcomes.
          </p>
        </div>


        <div className="mb-8 space-y-6">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search universities, majors, or both..."
            />
          </div>
          <SearchFilters searchType={searchType} onSearchTypeChange={setSearchType} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredUniversities.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Universities</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {filteredUniversities.map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                      onClick={() => onUniversityClick(university.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredMajors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Majors</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMajors.map((major) => (
                    <MajorCard
                      key={major.id}
                      major={major}
                      onClick={() => onMajorClick(major.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredUniversities.length === 0 && filteredMajors.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No results found. Try a different search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
