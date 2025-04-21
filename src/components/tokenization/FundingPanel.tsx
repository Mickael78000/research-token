import React, { useState } from 'react';
import { Publication, ResearchImpactScore } from '../../types';
import { calculateTokenAmount } from '../../utils/researchScoreCalculator';
import { useWallet } from '../../providers/WalletProvider';
import { useToast } from '../../providers/ToastProvider';
import solanaService from '../../services/solanaService';
import { Coins, AlertTriangle, FileCheck, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface FundingPanelProps {
  publication: Publication;
  risScore: ResearchImpactScore;
}

const FundingPanel: React.FC<FundingPanelProps> = ({ publication, risScore }) => {
  const [fundAmount, setFundAmount] = useState<string>('1.0');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'fiat'>('crypto');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number | null>(null);
  
  const { connected, publicKey, connect } = useWallet();
  const { addToast } = useToast();
  
  const handleFund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fundAmount || isNaN(parseFloat(fundAmount)) || parseFloat(fundAmount) <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid amount',
        message: 'Please enter a valid funding amount'
      });
      return;
    }
    
    if (!connected) {
      try {
        await connect();
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Connection failed',
          message: 'Failed to connect wallet. Please try again.'
        });
        return;
      }
    }
    
    setProcessing(true);
    
    try {
      if (paymentMethod === 'crypto') {
        // Mock wallet for demo purposes
        const mockWallet = {
          publicKey: publicKey || '',
          signTransaction: async (tx: any) => tx,
          signAllTransactions: async (txs: any[]) => txs
        };
        
        // Call tokenization service
        const result = await solanaService.tokenizeResearch(
          publication.id,
          risScore.score,
          parseFloat(fundAmount),
          mockWallet
        );
        
        if (result.success) {
          setSuccess(true);
          setTxSignature(result.txSignature || null);
          setTokenAmount(result.tokenAmount || null);
          
          addToast({
            type: 'success',
            title: 'Funding successful',
            message: `You've successfully funded this research and earned ${result.tokenAmount} RES tokens!`
          });
        } else {
          throw new Error(result.message);
        }
      } else {
        // Simulate fiat payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const estimatedTokens = calculateTokenAmount(risScore.score, parseFloat(fundAmount));
        
        setSuccess(true);
        setTokenAmount(estimatedTokens);
        
        addToast({
          type: 'success',
          title: 'Funding successful',
          message: `You've successfully funded this research with fiat and earned ${estimatedTokens} RES tokens!`
        });
      }
    } catch (error) {
      console.error('Funding failed:', error);
      
      addToast({
        type: 'error',
        title: 'Funding failed',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setFundAmount(value);
    }
  };
  
  // Calculate estimated token amount
  const estimatedTokens = !fundAmount || isNaN(parseFloat(fundAmount)) || parseFloat(fundAmount) <= 0
    ? 0
    : calculateTokenAmount(risScore.score, parseFloat(fundAmount));

  return (
    <div className="max-w-3xl mx-auto">
      {!success ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fund Scientific Research
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{publication.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {publication.authors.join(', ')} • {publication.journal} ({publication.year})
              </p>
              
              <div className="flex items-center mt-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  risScore.eligibleForTokenization 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Research Impact Score: {risScore.score.toFixed(1)}
                </div>
              </div>
            </div>
            
            <form onSubmit={handleFund}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="crypto"
                      checked={paymentMethod === 'crypto'}
                      onChange={() => setPaymentMethod('crypto')}
                      className="mr-2"
                    />
                    <span>Cryptocurrency (SOL)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fiat"
                      checked={paymentMethod === 'fiat'}
                      onChange={() => setPaymentMethod('fiat')}
                      className="mr-2"
                    />
                    <span>Fiat Currency (USD)</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                  Amount to Fund
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="amount"
                    value={fundAmount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {paymentMethod === 'crypto' ? 'SOL' : 'USD'}
                  </div>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Estimated RES Tokens:</span>
                  <span className="text-lg font-semibold text-primary-700">
                    {estimatedTokens.toFixed(2)} RES
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Token amount calculated based on Research Impact Score and funding amount.
                  Higher RIS values yield more tokens per SOL/USD.
                </p>
              </div>
              
              {!connected && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                  <AlertTriangle size={20} className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-700 font-medium">Wallet Not Connected</p>
                    <p className="text-sm text-yellow-600">
                      You need to connect your wallet before funding research.
                      The wallet will be connected automatically when you click Fund.
                    </p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={processing || !fundAmount || parseFloat(fundAmount) <= 0}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  processing || !fundAmount || parseFloat(fundAmount) <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Coins size={20} className="mr-2" />
                    Fund Research
                  </span>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Research Impact Score Breakdown
            </h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Novelty</span>
                <span className="text-sm font-medium">{risScore.breakdown.novelty.toFixed(1)}/4.0</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-500 h-full"
                  style={{ width: `${(risScore.breakdown.novelty / 4) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Citations</span>
                <span className="text-sm font-medium">{risScore.breakdown.citations.toFixed(1)}/3.0</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary-500 h-full"
                  style={{ width: `${(risScore.breakdown.citations / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Peer Reviews</span>
                <span className="text-sm font-medium">{risScore.breakdown.peerReviews.toFixed(1)}/2.0</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-accent-500 h-full"
                  style={{ width: `${(risScore.breakdown.peerReviews / 2) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Journal Impact</span>
                <span className="text-sm font-medium">{risScore.breakdown.journalImpact.toFixed(1)}/1.0</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gray-500 h-full"
                  style={{ width: `${(risScore.breakdown.journalImpact / 1) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600">
              <p>
                Research with an RIS score of 7.5 or higher is eligible for tokenization.
                This research has a score of {risScore.score.toFixed(1)}.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <FileCheck size={32} className="text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Funding Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            You have successfully funded the research "{publication.title}" and earned RES tokens
            as a reward for your contribution to science.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">Amount Funded:</span>
              <span className="font-semibold">{fundAmount} {paymentMethod === 'crypto' ? 'SOL' : 'USD'}</span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-700">RES Tokens Earned:</span>
              <span className="font-semibold text-primary-700">{tokenAmount?.toFixed(2)} RES</span>
            </div>
            
            {txSignature && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Transaction:</span>
                <a
                  href={solanaService.getExplorerUrl(txSignature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline flex items-center"
                >
                  View on Explorer
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            These tokens represent your stake in this research and its potential impact.
            You can hold them, trade them, or use them to fund more research in the future.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Discover More Research
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FundingPanel;