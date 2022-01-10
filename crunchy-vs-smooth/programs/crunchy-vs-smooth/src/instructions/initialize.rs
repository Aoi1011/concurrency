use crate::state::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// We mark vote_account with the init attribute, which
    /// creates a new account owned by the program
    /// When using init, we must also provide:
    /// payer, which funds the account creation
    /// space, which defines how large the account should be
    /// and the system_program which is required by the runtime
    /// This enforces that our vote_account must be owned by the
    /// currently executing program, and that it should be deserialized
    /// to the VoteAccount struct below at #[account]
    #[account(init, payer = user, space = 16 + 16)]
    pub vote_account: Account<'info, VoteAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
    let vote_account = &mut ctx.accounts.vote_account;
    vote_account.crunchy = 0;
    vote_account.smooth = 0;
    Ok(())
}
