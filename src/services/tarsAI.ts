import { Publication, SearchFilters, SearchResponse } from '../types';
//import { GUIAgent } from '@ui-tars/sdk';

// Mock publications for fallback when API is not configured
const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: '1',
    title: 'Novel Cancer Treatment Using CRISPR Gene Editing',
    authors: ['Sarah Johnson', 'Michael Chen'],
    abstract: 'This groundbreaking study demonstrates a new approach to treating various types of cancer using CRISPR-Cas9 gene editing technology.',
    journal: 'Nature Medicine',
    year: 2024,
    doi: '10.1038/nm.2024.0123',
    url: 'https://nature.com/articles/nm.2024.0123',
    citationCount: 156,
    noveltyScore: 89,
    peerReviewCount: 7,
    journalImpactFactor: 32.4,
    keywords: ['cancer', 'CRISPR', 'gene therapy', 'oncology']
  },
  {
    id: '2',
    title: 'Machine Learning Approaches to Climate Change Prediction',
    authors: ['Maria Garcia', 'Ahmed Hassan'],
    abstract: 'We demonstrate how advanced machine learning models can improve climate change prediction accuracy by up to 37% compared to traditional methods.',
    journal: 'Science',
    year: 2023,
    doi: '10.1126/science.abd5483',
    citationCount: 183,
    noveltyScore: 78,
    peerReviewCount: 12,
    journalImpactFactor: 47.8,
    keywords: ['climate change', 'machine learning', 'prediction models']
  }
];
/*
class GUIAgentService {
  private client: GUIAgent | null = null;
  private isConfigured: boolean = false;

  constructor() {
    // Only initialize if API key is available
    const apiKey = import.meta.env.VITE_TARS_API_KEY;
    const baseUrl = import.meta.env.VITE_TARS_API_URL || 'https://api.tars.ai/v1';

    if (apiKey && apiKey !== 'your_tars_api_key_here') {
     this.client = new GUIAgent({
        model: {
          apiKey,
          baseURL,
          // model: 'your-model-name', // Optional: specify model if needed
        },
        // operator: ... // Optional: add operator if you want GUI automation
      });
      this.isConfigured = true;
    } else {
      console.warn('TARS AI API key not configured, using mock data');
    }
  }
  
*/

export class PublicationService {
  async searchScientificPublications(
    query: string,
    filters: SearchFilters = {}
  ): Promise<SearchResponse> {
    // Use mock data, since no Tars API integration is possible
    return this.getMockSearchResults(query);
  }

async analyzeResearchImpact(publicationId: string): Promise<any> {
    return this.getMockAnalysis(publicationId);
  }

 private getMockSearchResults(query: string): SearchResponse {
    const lowercaseQuery = query.toLowerCase();
    const filteredPublications = MOCK_PUBLICATIONS.filter(pub =>
      pub.title.toLowerCase().includes(lowercaseQuery) ||
      pub.abstract.toLowerCase().includes(lowercaseQuery) ||
      pub.authors.some(author => author.toLowerCase().includes(lowercaseQuery)) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );

    return {
      publications: filteredPublications,
      totalResults: filteredPublications.length,
      page: 1,
      totalPages: 1
    };
  }

    private getMockAnalysis(publicationId: string) {
    const publication = MOCK_PUBLICATIONS.find(p => p.id === publicationId);
    return {
      publication,
      impactAnalysis: {
        innovation: 8.5,
        methodQuality: 7.8,
        potentialImpact: 9.2,
        reproducibility: 8.0
      }
    };
  }
}

export default new PublicationService();