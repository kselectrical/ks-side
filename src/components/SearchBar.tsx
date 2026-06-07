import React from 'react';

interface SearchBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  categories
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-10 select-none">
      {/* Category Pills Filter */}
      <div className="flex flex-wrap gap-2.5 justify-center font-sans">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4.5 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98 ${
            selectedCategory === 'ALL'
              ? 'border-brand-blue text-brand-blue bg-blue-50/40 font-extrabold ring-1 ring-blue-100'
              : 'border-gray-250 text-gray-650 hover:text-gray-900 hover:border-gray-400 bg-white'
          }`}
        >
          All Services
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4.5 py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-98 ${
              selectedCategory === category
                ? 'border-brand-blue text-brand-blue bg-blue-50/40 font-extrabold ring-1 ring-blue-100'
                : 'border-gray-250 text-gray-650 hover:text-gray-900 hover:border-gray-400 bg-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
