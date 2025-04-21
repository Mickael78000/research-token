import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Publication } from '../../types';
import tarsAIService from '../../services/tarsAI';
import { motion } from 'framer-motion';

interface SearchSectionProps {
  onSearchStart: () => void;
  onSearchComplete: (publications: Publication[]) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ 
  onSearchStart, 
  onSearchComplete 
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    onSearchStart();
    
    try {
      const results = await tarsAIService.searchScientificPublications(query);
      onSearchComplete(results.publications);
    } catch (error) {
      console.error('Search failed:', error);
      onSearchComplete([]);
    }
  };

  const exampleQueries = [
    'quantum computing',
    'climate change',
    'RNA sequencing',
    'perovskite solar cells',
    'brain-computer interface'
  ];

  const handleExampleQuery = (example: string) => {
    setQuery(example);
  };

  return (
    <motion.section 
      className="mb-10 bg-gradient-to-r from-primary-800 to-primary-900 rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">
          Search Scientific Research with TARS AI
        </h2>
        <p className="text-primary-100 mb-6">
          Discover groundbreaking research across various scientific domains
        </p>
        
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, keyword, author..."
              className="w-full px-5 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Search size={20} />
            </button>
          </div>
        </form>
        
        <div className="mt-4">
          <p className="text-primary-100 text-sm mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleQuery(example)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SearchSection;