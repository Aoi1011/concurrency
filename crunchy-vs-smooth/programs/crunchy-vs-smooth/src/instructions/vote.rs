use anchor_lang::prelude::*;

use crate::state::*;

#[derive(Accounts)]
pub struct Vote<'info> {
    /// Merking accounts as mut persits any changes made upon 
    /// existring the program, allowing our votes to be recorded
    #[account(mut)]
    pub vote_account: Account<'info, VoteAccount>,
}