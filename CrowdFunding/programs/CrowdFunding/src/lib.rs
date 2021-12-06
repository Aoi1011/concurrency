use anchor_lang::prelude::*;
use std::collections::HashMap;

extern crate static_assertions;

pub mod errors;

use errors::ErrorCode;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crowd_funding {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _new_project: IProject) -> ProgramResult {
        let state = &mut ctx.accounts.state;
        // let copy_project_ids = old_project_ids.project_ids.clone();
        state.projects.insert(0, _new_project);
        // old_project_ids.account.project_ids
        Ok(())
    }

    pub fn create_project(ctx: Context<CreateProject>, _new_project: IProject) -> ProgramResult {
        let state = &mut ctx.accounts.state;
        let current_project = &mut state.number_of_project;
        let next_project_id = *current_project + 1;

        state.projects.insert(next_project_id, _new_project);
        Ok(())
    }

    pub fn support_project(
        ctx: Context<SupportProject>,
        project_id: u64,
        amount: u64,
    ) -> ProgramResult {
        let state = &mut ctx.accounts.state;
        let all_projects = &mut state.projects;

        let now = Clock::get().unwrap().unix_timestamp;

        if all_projects[&project_id].deadline < now {
            msg!("The project is over!");
            // return Err(ProgramError::);
        }

        let rent_exemption = Rent::get()?.minimum_balance(ctx.accounts.authority.data_len());
        if **ctx.accounts.authority.lamports.borrow() - rent_exemption < amount {
            msg!("Insufficient balance");
            return Err(ProgramError::InsufficientFunds);
        }

        // **ctx.accounts.authority.try_borrow_mut_lamports()? -= amount;
        // **ctx.try_borrow_mut_lamports()? += amount;
        anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.authority.key,
            ctx.program_id,
            amount,
        );
        if let Some(x) = all_projects.get_mut(&project_id) {
            x.current_amount += amount
        }

        Ok(())
    }

    pub fn achieve_project(ctx: Context<AchieveProject>, project_id: u64) -> ProgramResult {
        let state = &mut ctx.accounts.state;
        let all_projects = &state.projects;

        let now = Clock::get().unwrap().unix_timestamp;

        if all_projects[&project_id].deadline > now {
            msg!("The project is under");
            // return Err(ProgramError::);
        }

        if all_projects[&project_id].goal_amount >= all_projects[&project_id].current_amount {}

        // if all_projects
        Ok(())
    }

    pub fn delete_project(ctx: Context<CreateProject>, _new_project: IProject) -> ProgramResult {
        let state = &mut ctx.accounts.state;
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

#[derive(Accounts)]
pub struct SupportProject<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct AchieveProject<'info> {
    #[account(mut)]
    pub state: Account<'info, State>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(Default)]
pub struct State {
    pub authority: Pubkey,
    pub number_of_project: u64,
    pub projects: HashMap<u64, IProject>,
}

// #[account]
// pub struct Project {
//     pub authority: Pubkey,
//     pub project_ids: Vec<u64>,
// }

#[account]
pub struct IProject {
    project_id: u64,
    representative: Pubkey,
    current_amount: u64,
    goal_amount: u64,
    deadline: i64,
    achieved: bool,
}
