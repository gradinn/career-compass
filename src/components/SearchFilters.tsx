interface SearchFiltersProps {
  searchType: 'all' | 'university' | 'major';
  onSearchTypeChange: (type: 'all' | 'university' | 'major') => void;
}

export function SearchFilters({ searchType, onSearchTypeChange }: SearchFiltersProps) {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      <button
        onClick={() => onSearchTypeChange('all')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          searchType === 'all'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onSearchTypeChange('university')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          searchType === 'university'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        Universities
      </button>
      <button
        onClick={() => onSearchTypeChange('major')}
        className={`px-6 py-2 rounded-full font-medium transition-all ${
          searchType === 'major'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
        }`}
      >
        Majors & Careers
      </button>
    </div>
  );
}
