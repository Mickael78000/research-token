import React, { useState } from 'react';
import SearchSection from '../components/research/SearchSection';
import ResearchList from '../components/research/ResearchList';
import FundingPanel from '../components/tokenization/FundingPanel';
import { Publication, ResearchImpactScore } from '../types';
import { calculateRIS } from '../utils/researchScoreCalculator';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Publication[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [selectedRIS, setSelectedRIS] = useState<ResearchImpactScore | null>(null);
  const [showFundingPanel, setShowFundingPanel] = useState(false);
  
  const handleSearchResults = (publications: Publication[]) => {
    setSearchResults(publications);
    setSelectedPublication(null);
    setSelectedRIS(null);
    setShowFundingPanel(false);
  };
  
  const handleFundResearch = (publication: Publication) => {
    const risResult = calculateRIS(publication);
    setSelectedPublication(publication);
    setSelectedRIS(risResult);
    setShowFundingPanel(true);
  };
  
  const handleBackToResults = () => {
    setShowFundingPanel(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scientific Research Tokenization Platform
        </h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Discover groundbreaking scientific research, fund valuable studies, and earn RES tokens 
          through our innovative platform powered by TARS AI and Solana blockchain.
        </p>
      </motion.div>
      
      {!showFundingPanel ? (
        <>
          <SearchSection 
            onSearchStart={() => setIsSearching(true)}
            onSearchComplete={(publications) => {
              setIsSearching(false);
              handleSearchResults(publications);
            }}
          />
          
          {isSearching && (
            <div className="mt-8 text-center">
              <div className="inline-block animate-pulse-slow">
                <p className="text-primary-600 font-medium">
                  Searching for research using TARS AI...
                </p>
              </div>
            </div>
          )}
          
          {!isSearching && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ResearchList 
                publications={searchResults} 
                onFund={handleFundResearch}
              />
            </motion.div>
          )}
          
          {!isSearching && searchResults.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-gray-500">
                No research publications found. Try refining your search.
              </p>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={handleBackToResults}
            className="mb-4 flex items-center text-primary-600 hover:text-primary-800 transition-colors"
          >
            <span className="mr-1">←</span> Back to search results
          </button>
          
          {selectedPublication && selectedRIS && (
            <FundingPanel 
              publication={selectedPublication}
              risScore={selectedRIS}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;