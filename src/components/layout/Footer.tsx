import React from 'react';
import { Github, Twitter, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © 2025 ResearchToken | Powered by TARS AI and Solana Blockchain
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Website"
            >
              <Globe size={20} />
            </a>
          </div>
          
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">FAQ</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;