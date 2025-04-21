import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import WalletProvider from '@/providers/WalletProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scientific Research Tokenization DApp',
  description: 'A decentralized application for tokenizing scientific research using TARS AI and Solana blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
              {children}
            </div>
          </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}