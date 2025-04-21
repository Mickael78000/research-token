// Wallet Types
export interface WalletContextState {
  wallet: any | null;
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void>;
  select: () => Promise<void>;
  connect: () => Promise<void>;
}

// Research Publication Types
export interface Publication {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  citationCount: number;
  noveltyScore: number;
  peerReviewCount: number;
  journalImpactFactor: number;
  keywords: string[];
  fundingAmount?: number;
}

export interface ResearchImpactScore {
  publication: Publication;
  score: number;
  eligibleForTokenization: boolean;
  breakdown: {
    novelty: number;
    citations: number;
    peerReviews: number;
    journalImpact: number;
  };
}

// TARS AI API Types
export interface SearchFilters {
  year?: number | [number, number];
  journal?: string;
  author?: string;
  topic?: string;
}

export interface SearchResponse {
  publications: Publication[];
  totalResults: number;
  page: number;
  totalPages: number;
}

// Tokenization Types
export interface TokenizationResult {
  success: boolean;
  message: string;
  txSignature?: string;
  tokenAmount?: number;
}

// Toast Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  autoDismiss?: boolean;
}