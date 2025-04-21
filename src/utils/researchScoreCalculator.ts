import { Publication, ResearchImpactScore } from '../types';

// Constants for score calculation
const NOVELTY_WEIGHT = 0.4;
const CITATIONS_WEIGHT = 0.3;
const PEER_REVIEWS_WEIGHT = 0.2;
const JOURNAL_IMPACT_WEIGHT = 0.1;
const TOKENIZATION_THRESHOLD = 6.0; // Lowered from 7.5 to 6.0

// Normalize a score to a 0-10 scale
export const normalizeScore = (
  score: number,
  minPossible = 0,
  maxPossible = 100
): number => {
  // Constrain the score within min and max bounds
  const constrainedScore = Math.max(minPossible, Math.min(score, maxPossible));
  
  // Normalize to 0-10 scale
  return ((constrainedScore - minPossible) / (maxPossible - minPossible)) * 10;
};

// Calculate Research Impact Score (RIS)
export const calculateRIS = (publication: Publication): ResearchImpactScore => {
  // Normalize inputs to a 0-10 scale
  const normalizedNovelty = normalizeScore(publication.noveltyScore, 0, 100);
  const normalizedCitations = normalizeScore(publication.citationCount, 0, 500);
  const normalizedPeerReviews = normalizeScore(publication.peerReviewCount, 0, 20);
  const normalizedJIF = normalizeScore(publication.journalImpactFactor, 0, 50);
  
  // Calculate weighted components
  const noveltyComponent = NOVELTY_WEIGHT * normalizedNovelty;
  const citationsComponent = CITATIONS_WEIGHT * normalizedCitations;
  const peerReviewsComponent = PEER_REVIEWS_WEIGHT * normalizedPeerReviews;
  const journalImpactComponent = JOURNAL_IMPACT_WEIGHT * normalizedJIF;
  
  // Calculate total RIS
  const risScore = noveltyComponent + citationsComponent + peerReviewsComponent + journalImpactComponent;
  
  // Format to 2 decimal places
  const finalScore = parseFloat(risScore.toFixed(2));
  
  return {
    publication,
    score: finalScore,
    eligibleForTokenization: finalScore >= TOKENIZATION_THRESHOLD,
    breakdown: {
      novelty: parseFloat(noveltyComponent.toFixed(2)),
      citations: parseFloat(citationsComponent.toFixed(2)),
      peerReviews: parseFloat(peerReviewsComponent.toFixed(2)),
      journalImpact: parseFloat(journalImpactComponent.toFixed(2))
    }
  };
};

// Calculate token amount based on RIS and funding amount
export const calculateTokenAmount = (
  risScore: number, 
  fundingAmount: number
): number => {
  if (risScore < TOKENIZATION_THRESHOLD) return 0;
  
  // Simple formula: 10 tokens per SOL × (RIS / threshold)
  const tokenMultiplier = 10 * (risScore / TOKENIZATION_THRESHOLD);
  return parseFloat((fundingAmount * tokenMultiplier).toFixed(2));
};

// Check if a publication is eligible for tokenization
export const isEligibleForTokenization = (risScore: number): boolean => {
  return risScore >= TOKENIZATION_THRESHOLD;
};