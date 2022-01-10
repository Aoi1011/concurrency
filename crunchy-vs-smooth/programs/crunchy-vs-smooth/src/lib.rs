use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;


declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crunchy_vs_smooth {
    use super::*;
    
}


#[derive(Accounts)]
pub struct Vote<'info> {
    /// Marking accounts as mut persits any changes made upon
    /// existing the program, allowing our votes to be recorded
    #[account(mut)]
    pub vote_account: Account<'info, VoteAccount>,
}
