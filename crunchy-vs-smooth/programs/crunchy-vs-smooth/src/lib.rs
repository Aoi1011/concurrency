use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;
use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod crunchy_vs_smooth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        instructions::initialize::handler(ctx)
    }

    pub fn 
}
