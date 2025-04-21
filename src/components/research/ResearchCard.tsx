import React, { useState } from 'react';
import { Publication } from '../../types';
import { calculateRIS, isEligibleForTokenization } from '../../utils/researchScoreCalculator';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Award, Book, Users, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResearchCardProps {
  publication: Publication;
  onFund: () => void;
}

const ResearchCard: React.FC<ResearchCardProps> = ({ publication, onFund }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate RIS for this publication
  const risResult = calculateRIS(publication);
  const { score: ris, eligibleForTokenization } = risResult;
  
  // Format score for display
  const formatScore = (score: number): string => score.toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{publication.title}</h3>
            <p className="text-gray-600 text-sm mb-2">
              {publication.authors.join(', ')}
            </p>
            <p className="text-gray-500 text-xs">
              {publication.journal} ({publication.year})
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
              eligibleForTokenization 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              RIS: {formatScore(ris)}
            </div>
            
            {eligibleForTokenization ? (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle size={14} className="mr-1" />
                Eligible for Tokenization
              </div>
            ) : (
              <div className="flex items-center text-xs text-gray-500">
                <AlertCircle size={14} className="mr-1" />
                Below Tokenization Threshold
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-700 text-sm line-clamp-3">
            {publication.abstract}
          </p>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Research Impact Metrics
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      <Award size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Novelty Score</p>
                      <p className="text-sm font-medium">{publication.noveltyScore}/100</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                      <Book size={16} className="text-secondary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Citation Count</p>
                      <p className="text-sm font-medium">{publication.citationCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center mr-3">
                      <Users size={16} className="text-accent-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Peer Reviews</p>
                      <p className="text-sm font-medium">{publication.peerReviewCount}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <BarChart2 size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Journal Impact Factor</p>
                      <p className="text-sm font-medium">{publication.journalImpactFactor}</p>
                    </div>
                  </div>
                </div>
                
                {publication.doi && (
                  <div className="mt-4 text-sm">
                    <span className="text-gray-500">DOI: </span>
                    <a 
                      href={`https://doi.org/${publication.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {publication.doi}
                    </a>
                  </div>
                )}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {publication.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Show More
              </>
            )}
          </button>
          
          <button
            onClick={onFund}
            disabled={!eligibleForTokenization}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              eligibleForTokenization
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Fund Research
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchCard;