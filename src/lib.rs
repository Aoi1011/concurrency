pub mod entrypoint;
pub mod error;
pub mod instruction;
pub mod processor;
pub mod state;

use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
