use anchor_lang::prelude::*;

use crate::state::project::ProjectHistory;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32)]
    pub admin: Account<'info, SoundFundingAdmin>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub project_history: Account<'info, ProjectHistory>,
    pub contract_singer: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct SupportProject<'info> {
    #[account(mut)]
    pub project_history: Account<'info, ProjectHistory>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AchieveProject<'info> {
    #[account(mut)]
    pub project_history: Account<'info, ProjectHistory>,
    pub authority: Signer<'info>,
}

#[account]
pub struct SoundFundingAdmin {
    pub authority: Pubkey,
}