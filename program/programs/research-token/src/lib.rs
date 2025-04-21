use anchor_lang::prelude::*;
use anchor_spl::token::Token;

declare_id!("DT26J4zGoT1DU9amN4UzyBTxPKwBEEe9t7C7cDLUzong");

#[program]
pub mod research_token {
    use super::*;

    pub fn initialize_research(
        ctx: Context<InitializeResearch>,
        title: String,
        authors: Vec<String>,
        doi: String,
        impact_score: f64,
        funding_goal: u64,
    ) -> Result<()> {
        let research = &mut ctx.accounts.research;
        research.title = title;
        research.authors = authors;
        research.doi = doi;
        research.impact_score = impact_score;
        research.token_supply = 0;
        research.funding_goal = funding_goal;
        research.current_funding = 0;
        research.is_active = true;
        research.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn fund_research(ctx: Context<FundResearch>, amount: u64) -> Result<()> {
        let research = &mut ctx.accounts.research;
        require!(research.is_active, ResearchError::NotActive);

        research.current_funding = research.current_funding.checked_add(amount)
            .ok_or(ResearchError::Overflow)?;
        Ok(())
    }

    pub fn mint_tokens(ctx: Context<MintTokens>, amount: u64) -> Result<()> {
        let research = &mut ctx.accounts.research;
        require!(research.is_active, ResearchError::NotActive);

        research.token_supply = research.token_supply.checked_add(amount)
            .ok_or(ResearchError::Overflow)?;
        Ok(())
    }

    pub fn update_research_status(ctx: Context<UpdateResearchStatus>, is_active: bool) -> Result<()> {
        let research = &mut ctx.accounts.research;
        research.is_active = is_active;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeResearch<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ResearchAccount::LEN
    )]
    pub research: Account<'info, ResearchAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundResearch<'info> {
    #[account(mut)]
    pub research: Account<'info, ResearchAccount>,
    #[account(mut)]
    pub funder: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub research: Account<'info, ResearchAccount>,
    /// CHECK: Token account validated in program
    #[account(mut)]
    pub token_account: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateResearchStatus<'info> {
    #[account(
        mut,
        constraint = research.authority == authority.key()
    )]
    pub research: Account<'info, ResearchAccount>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct ResearchAccount {
    pub authority: Pubkey,
    pub title: String,
    pub authors: Vec<String>,
    pub doi: String,
    pub impact_score: f64,
    pub token_supply: u64,
    pub funding_goal: u64,
    pub current_funding: u64,
    pub is_active: bool,
}

impl ResearchAccount {
    pub const LEN: usize = 32 + // authority
        4 + 100 + // title (with length prefix)
        4 + 10 * (4 + 50) + // authors vec (max 10 authors, 50 chars each)
        4 + 50 + // doi
        8 + // impact_score
        8 + // token_supply
        8 + // funding_goal
        8 + // current_funding
        1; // is_active
}

#[error_code]
pub enum ResearchError {
    #[msg("Research is not active")]
    NotActive,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Invalid authority")]
    InvalidAuthority,
}

