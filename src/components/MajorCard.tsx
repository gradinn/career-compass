import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import type { Major } from '../lib/supabase';

interface MajorCardProps {
  major: Major;
  onClick: () => void;
}

export function MajorCard({ major, onClick }: MajorCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
    >
      <div className="mb-3">
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          {major.category}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{major.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{major.description}</p>

      <div className="space-y-2">
        {major.median_salary && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Starting Salary:</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${(major.median_salary / 1000).toFixed(0)}k
            </span>
          </div>
        )}

        {major.mid_career_salary && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Mid-Career:</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${(major.mid_career_salary / 1000).toFixed(0)}k
            </span>
          </div>
        )}

        {major.job_growth_rate !== null && major.job_growth_rate !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="w-4 h-4" />
              <span>Job Growth:</span>
            </div>
            <span className={`font-semibold ${major.job_growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {major.job_growth_rate > 0 ? '+' : ''}{major.job_growth_rate}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
