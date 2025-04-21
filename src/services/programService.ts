import { Program, AnchorProvider, web3, utils, BN } from '@project-serum/anchor';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { ResearchData } from '../types';

export class ProgramService {
  private program: Program;
  private provider: AnchorProvider;

  constructor(connection: Connection, wallet: any) {
    this.provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    // Initialize program here with your IDL
  }

  async initializeResearch(
    research: ResearchData,
    authority: PublicKey
  ): Promise<string> {
    const researchAccount = web3.Keypair.generate();
    
    try {
      const tx = await this.program.methods
        .initializeResearch({
          title: research.title,
          authors: research.authors,
          doi: research.doi,
          impactScore: new BN(Math.floor(research.noveltyScore * 100)),
          fundingGoal: new BN(research.fundingAmount || 0)
        })
        .accounts({
          researchAccount: researchAccount.publicKey,
          authority,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([researchAccount])
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error initializing research:', error);
      throw error;
    }
  }

  async fundResearch(
    researchAccount: PublicKey,
    amount: number,
    funder: PublicKey
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .fundResearch({
          amount: new BN(amount)
        })
        .accounts({
          researchAccount,
          funder,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error funding research:', error);
      throw error;
    }
  }

  async mintTokens(
    researchAccount: PublicKey,
    recipient: PublicKey,
    amount: number,
    authority: PublicKey
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .mintTokens({
          recipient,
          amount: new BN(amount)
        })
        .accounts({
          researchAccount,
          tokenAccount: recipient,
          authority,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw error;
    }
  }

  async updateResearchStatus(
    researchAccount: PublicKey,
    isActive: boolean,
    authority: PublicKey
  ): Promise<string> {
    try {
      const tx = await this.program.methods
        .updateResearchStatus({
          isActive
        })
        .accounts({
          researchAccount,
          authority,
        })
        .rpc();

      return tx;
    } catch (error) {
      console.error('Error updating research status:', error);
      throw error;
    }
  }
}