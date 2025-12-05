import { MapPin, Users, Star, TrendingUp } from 'lucide-react';
import type { University } from '../lib/supabase';

interface UniversityCardProps {
  university: University & { avg_rating?: number; review_count?: number };
  onClick: () => void;
}

export function UniversityCard({ university, onClick }: UniversityCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
    >
      <div className="flex gap-4">
        {university.university_logo && (
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={university.university_logo}
              alt={university.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{university.name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{university.location}</span>
            </div>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              {university.type}
            </span>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{university.size}</span>
            </div>
          </div>
          {university.avg_rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">{university.avg_rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500">
                ({university.review_count} {university.review_count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {university.acceptance_rate && (
              <div>
                <span className="text-gray-500">Acceptance:</span>
                <span className="ml-1 font-semibold text-gray-900">
                  {university.acceptance_rate}%
                </span>
              </div>
            )}
            {university.graduation_rate && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-500">Graduation:</span>
                <span className="ml-1 font-semibold text-gray-900">
                  {university.graduation_rate}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
