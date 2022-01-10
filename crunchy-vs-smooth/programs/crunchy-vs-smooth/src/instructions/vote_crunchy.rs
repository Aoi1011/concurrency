use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct VoteCrunchy<'info> {
    /// Merking accounts as mut persits any changes made upon
    /// existring the program, allowing our votes to be recorded
    #[account(mut)]
    pub vote_account: Account<'info, VoteAccount>,
}

pub fn handler(ctx: Context<VoteCrunchy>) -> ProgramResult {
    let vote_account = &mut ctx.accounts.vote_account;
    vote_account.crunchy += 1;
    Ok(())
}


