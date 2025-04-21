"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletContextState } from '../types';

// Create wallet context
const WalletContext = createContext<WalletContextState>({
  wallet: null,
  publicKey: null,
  connected: false,
  connecting: false,
  disconnect: async () => {},
  select: async () => {},
  connect: async () => {}
});

// Custom hook to use wallet context
export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    // Check if Phantom wallet exists in window
    const checkForPhantom = () => {
      if ('solana' in window) {
        console.log('Phantom wallet detected');
        const solanaProvider = (window as any).solana;
        if (solanaProvider.isPhantom) {
          setWallet(solanaProvider);
          
          // Setup listeners for wallet changes
          solanaProvider.on('connect', (publicKey: any) => {
            console.log('Connected to wallet:', publicKey.toString());
            setPublicKey(publicKey.toString());
            setConnected(true);
          });
          
          solanaProvider.on('disconnect', () => {
            console.log('Disconnected from wallet');
            setPublicKey(null);
            setConnected(false);
          });
          
          // If wallet is already connected, update state
          if (solanaProvider.isConnected) {
            setPublicKey(solanaProvider.publicKey.toString());
            setConnected(true);
          }
        }
      } else {
        console.log('Phantom wallet not detected');
      }
    };    
    checkForPhantom();
    
    // Clean up listeners when component unmounts
    return () => {
      if (wallet) {
        wallet.off('connect');
        wallet.off('disconnect');
      }
    };
  }, []);

  // Real connect function
  const connect = async (): Promise<void> => {
    if (!wallet) {
      console.error('Phantom wallet not available');
      return;
    }
    
    setConnecting(true);
    
    try {
      // Request connection to the wallet
      const response = await wallet.connect();
      setPublicKey(response.publicKey.toString());
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  // Real disconnect function
  const disconnect = async (): Promise<void> => {
    if (!wallet) {
      console.error('Phantom wallet not available');
      return;
    }
    
    try {
      await wallet.disconnect();
      setPublicKey(null);
      setConnected(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Real select function - for Phantom, this is same as connect
  const select = async (): Promise<void> => {
    await connect();
  };

  const value = {
    wallet,
    publicKey,
    connected,
    connecting,
    disconnect,
    select,
    connect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;