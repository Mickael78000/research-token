import React from 'react';
import { useWallet } from '../../providers/WalletProvider';
import { Brain, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();

  const handleConnectWallet = async () => {
    if (connected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary-600 text-white p-2 rounded-lg mr-3 flex items-center justify-center">
              <Brain size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                ResearchToken <Microscope size={18} className="ml-2" />
              </h1>
              <p className="text-xs text-gray-500">Powered by TARS AI & Solana</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              onClick={handleConnectWallet}
              disabled={connecting}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                connected
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {connecting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : connected ? (
                <span className="flex items-center">
                  <span className="bg-green-500 h-2 w-2 rounded-full mr-2"></span>
                  {publicKey?.substring(0, 4)}...{publicKey?.substring(publicKey.length - 4)}
                </span>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;