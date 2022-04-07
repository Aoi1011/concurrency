use crate::errors::TickTacToeError;
use anchor_lang::prelude::*;
use num_derive::*;
use num_traits::*;
use std::mem;

#[account]
pub struct Game {
    players: [Pubkey; 2],          // (32 * 2)
    turn: u8,                      // 1
    board: [[Option<Sign>; 3]; 3], // 9 * (1 + 1) = 18
    state: GameState,              // 32 + 1
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GameState {
    Active,
    Tie,
    Won { winner: Pubkey },
}

#[derive(
    AnchorSerialize, AnchorDeserialize, FromPrimitive, ToPrimitive, Copy, Clone, PartialEq, Eq,
)]
pub enum Sign {
    X,
    O,
}

impl Game {
    pub const MAXIMUM_SIZE: usize = (32 * 1) + 1 + (9 * (1 + 1)) + (32 + 1);

    pub fn start(&mut self, players: [Pubkey; 2]) -> Result<()> {
        require_eq!(self.turn, 0, TickTacToeError::GameAlreadyStarted);
        self.players = players;
        self.turn = 1;
        Ok(())
    }
}
