use anchor_lang::prelude::*;
use context::*;
use errors::*;
use state::project::ProjectRecord;

extern crate static_assertions;

pub mod context;
pub mod errors;
pub mod state;

// use errors::ErrorCode;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crowd_funding {

    use super::*;

    pub fn init_admin(ctx: Context<Initialize>, _authority: Pubkey) -> ProgramResult {
        msg!("InitAdmin");
        let admin = &mut ctx.accounts.admin;
        admin.authority = _authority;
        Ok(())
    }

    pub fn create_project(
        ctx: Context<CreateProject>,
        goal_amount: u64,
        deadline: i64,
    ) -> ProgramResult {
        let user = ctx.accounts.contract_singer.key();
        let clock = Clock::get()?;
        let now = clock.unix_timestamp;

        if goal_amount == 0 {
            return Err(ErrorCode::InsufficientGoalAmount.into());
        }

        let project_history = &mut ctx.accounts.project_history;
        let record_id = project_history.next_record_id();
        project_history.append(ProjectRecord {
            time_stamp: now,
            record_id,
            project_creater: user,
            current_amount: 0,
            goal_amount,
            deadline,
            achieved: false,
        });

        Ok(())
    }

    // pub fn support_project(
    //     ctx: Context<SupportProject>,
    //     project_id: u64,
    //     amount: u64,
    // ) -> ProgramResult {
    //     let state = &mut ctx.accounts.state;
    //     let all_projects = &mut state.projects;

    //     let now = Clock::get().unwrap().unix_timestamp;

    //     if all_projects[&project_id].deadline < now {
    //         msg!("The project is over!");
    //         // return Err(ErrorCode::CrowdFundingOver.into());
    //     }

    //     let rent_exemption = Rent::get()?.minimum_balance(ctx.accounts.authority.data_len());
    //     if **ctx.accounts.authority.lamports.borrow() - rent_exemption < amount {
    //         msg!("Insufficient balance");
    //         return Err(ProgramError::InsufficientFunds);
    //     }

    //     anchor_lang::solana_program::system_instruction::transfer(
    //         ctx.accounts.authority.key,
    //         ctx.program_id,
    //         amount,
    //     );
    //     if let Some(x) = all_projects.get_mut(&project_id) {
    //         x.current_amount += amount
    //     }

    //     Ok(())
    // }

    // pub fn achieve_project(ctx: Context<AchieveProject>, project_id: u64) -> ProgramResult {
    //     let state = &mut ctx.accounts.state;
    //     let all_projects = &state.projects;

    //     let now = Clock::get().unwrap().unix_timestamp;

    //     if all_projects[&project_id].deadline > now {
    //         msg!("The project is under");
    //         // return Err(ProgramError::);
    //     }

    //     if all_projects[&project_id].goal_amount >= all_projects[&project_id].current_amount {}

    //     // if all_projects
    //     Ok(())
    // }

    // pub fn delete_project(ctx: Context<CreateProject>, _new_project: IProject) -> ProgramResult {
    //     let state = &mut ctx.accounts.state;
    //     Ok(())
    // }
}

// #[account]
// #[derive(Default)]
// pub struct State {
//     pub authority: Pubkey,
//     pub number_of_project: u64,
//     pub projects: Vec<IProject>,
// }

// #[account]
// pub struct IProject {
//     project_id: u64,
//     representative: Pubkey,
//     current_amount: u64,
//     goal_amount: u64,
//     deadline: i64,
//     achieved: bool,
// }
