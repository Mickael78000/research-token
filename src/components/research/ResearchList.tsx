import React from 'react';
import { Publication } from '../../types';
import ResearchCard from './ResearchCard';
import { motion } from 'framer-motion';

interface ResearchListProps {
  publications: Publication[];
  onFund: (publication: Publication) => void;
}

const ResearchList: React.FC<ResearchListProps> = ({ publications, onFund }) => {
  if (publications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No publications found.</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Research Publications</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {publications.map((publication, index) => (
          <motion.div
            key={publication.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ResearchCard
              publication={publication}
              onFund={() => onFund(publication)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ResearchList;