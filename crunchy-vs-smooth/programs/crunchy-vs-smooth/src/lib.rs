use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("DoQuqMVDohK2yMPxuZqLcS8KP2aDrbaStuto37Ce7FYR");

#[program]
pub mod crunchy_vs_smooth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        instructions::initialize::handler(ctx)
    }

    pub fn vote_crunchy(ctx: Context<VoteCrunchy>) -> ProgramResult {
        instructions::vote_crunchy::handler(ctx)
    }

    pub fn vote_smooth(ctx: Context<VoteSmooth>) -> ProgramResult {
        instructions::vote_smooth::handler(ctx)
    }
}
