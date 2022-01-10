use anchor_lang::prelude::*;
/// Here we define what our VoteAccount looks like
/// We define a struct with two public properties: crunchy and
/// smooth
/// These properties will keep track of their respective votes
/// as unsigned 64-bit integers
/// This VoteAccount will be passed inside each Transaction
/// Instruction to record votes as they occurr
#[account]
pub struct VoteAccount {
    pub crunchy: u64,
    pub smooth: u64,
}
