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
      } else {
        console.log('Phantom wallet not detected');
      }
    };
    
    checkForPhantom();
  }, []);

  // Mock connect function
  const connect = async (): Promise<void> => {
    setConnecting(true);
    
    try {
      // In a real implementation, this would connect to Phantom wallet
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate connection delay
      
      // Mock successful connection
      setWallet({
        name: 'Phantom',
        icon: '👻',
      });
      setPublicKey('5FAB1xA3B8oUKrGvY4pqK4fjQTKNuBubgz4p2hc6jrZb'); // Mock public key
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  // Mock disconnect function
  const disconnect = async (): Promise<void> => {
    try {
      // In a real implementation, this would disconnect from Phantom wallet
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate disconnect delay
      
      // Reset wallet state
      setWallet(null);
      setPublicKey(null);
      setConnected(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  // Mock select function
  const select = async (): Promise<void> => {
    // In a real implementation, this would allow selecting from available wallets
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