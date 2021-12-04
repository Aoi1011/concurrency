use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crowd_funding {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _new_project_id: u64) -> ProgramResult {
        
        Ok(())
    }

    pub fn createProject(ctx: Context<CreateProject>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(init, payer = authority)]
    pub state: Account<'info, State>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProject<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct State {
    authority: Pubkey,
    project_ids: Vec<u64>,
}

// #[account]
// pub struct Project {
//     pub authority: Pubkey,
//     pub project_ids: Vec<u64>,
// }

// #[derive(Clone)]
// pub struct IProject<'info> {
//     representative: Signer<'info>,
// }
