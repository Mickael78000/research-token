import { expect } from 'chai';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { ResearchToken } from '../target/types/research_token';
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';

describe('Research Token Program', () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ResearchToken as Program<ResearchToken>;
  const authority = provider.wallet;
  
  let research: Keypair;
  let funder: Keypair;

  beforeEach(() => {
    research = Keypair.generate();
    funder = Keypair.generate();
  });

  describe('Initialize Research', () => {
    it('should successfully initialize research with valid parameters', async () => {
      // Arrange
      const title = 'Test Research';
      const authors = ['Author 1', 'Author 2'];
      const doi = '10.1234/test';
      const impactScore = 8.5;
      const fundingGoal = new anchor.BN(1_000_000_000); // 1 SOL

      // Act
      await program.methods
        .initializeResearch(
          title,
          authors,
          doi,
          impactScore,
          fundingGoal
        )
        .accounts({
          research: research.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([research])
        .rpc();

      // Assert
      const researchAccount = await program.account.researchAccount.fetch(
        research.publicKey
      );

      expect(researchAccount.title).to.equal(title);
      expect(researchAccount.authors).to.deep.equal(authors);
      expect(researchAccount.doi).to.equal(doi);
      expect(researchAccount.impactScore).to.equal(impactScore);
      expect(researchAccount.fundingGoal.toNumber()).to.equal(fundingGoal.toNumber());
      expect(researchAccount.isActive).to.be.true;
      expect(researchAccount.currentFunding.toNumber()).to.equal(0);
      expect(researchAccount.tokenSupply.toNumber()).to.equal(0);
    });

    it('should fail to initialize with invalid parameters', async () => {
      // Arrange
      const invalidTitle = '';
      const authors: string[] = [];
      const doi = '10.1234/test';
      const impactScore = -1;
      const fundingGoal = new anchor.BN(0);

      // Act & Assert
      try {
        await program.methods
          .initializeResearch(
            invalidTitle,
            authors,
            doi,
            impactScore,
            fundingGoal
          )
          .accounts({
            research: research.publicKey,
            authority: authority.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([research])
          .rpc();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe('Fund Research', () => {
    beforeEach(async () => {
      // Initialize research before each funding test
      await program.methods
        .initializeResearch(
          'Test Research',
          ['Author'],
          '10.1234/test',
          8.5,
          new anchor.BN(1_000_000_000)
        )
        .accounts({
          research: research.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([research])
        .rpc();
    });

    it('should successfully fund active research', async () => {
      // Arrange
      const fundingAmount = new anchor.BN(500_000_000); // 0.5 SOL

      // Act
      await program.methods
        .fundResearch(fundingAmount)
        .accounts({
          research: research.publicKey,
          funder: funder.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([funder])
        .rpc();

      // Assert
      const researchAccount = await program.account.researchAccount.fetch(
        research.publicKey
      );
      expect(researchAccount.currentFunding.toNumber()).to.equal(fundingAmount.toNumber());
    });

    it('should fail to fund inactive research', async () => {
      // Arrange
      await program.methods
        .updateResearchStatus(false)
        .accounts({
          research: research.publicKey,
          authority: authority.publicKey,
        })
        .rpc();

      // Act & Assert
      try {
        await program.methods
          .fundResearch(new anchor.BN(500_000_000))
          .accounts({
            research: research.publicKey,
            funder: funder.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([funder])
          .rpc();
        expect.fail('Should have thrown NotActive error');
      } catch (error) {
        expect(error.toString()).to.include('NotActive');
      }
    });
  });

  describe('Update Research Status', () => {
    beforeEach(async () => {
      // Initialize research before each status update test
      await program.methods
        .initializeResearch(
          'Test Research',
          ['Author'],
          '10.1234/test',
          8.5,
          new anchor.BN(1_000_000_000)
        )
        .accounts({
          research: research.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([research])
        .rpc();
    });

    it('should successfully update research status', async () => {
      // Act
      await program.methods
        .updateResearchStatus(false)
        .accounts({
          research: research.publicKey,
          authority: authority.publicKey,
        })
        .rpc();

      // Assert
      const researchAccount = await program.account.researchAccount.fetch(
        research.publicKey
      );
      expect(researchAccount.isActive).to.be.false;
    });

    it('should fail to update status with invalid authority', async () => {
      // Arrange
      const invalidAuthority = Keypair.generate();

      // Act & Assert
      try {
        await program.methods
          .updateResearchStatus(false)
          .accounts({
            research: research.publicKey,
            authority: invalidAuthority.publicKey,
          })
          .signers([invalidAuthority])
          .rpc();
        expect.fail('Should have thrown InvalidAuthority error');
      } catch (error) {
        expect(error.toString()).to.include('InvalidAuthority');
      }
    });
  });
});