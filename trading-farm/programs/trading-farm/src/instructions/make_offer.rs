use anchor_lang::prelude::*;

use crate::state::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(escrow_bump: u8)]
pub struct MakeOffer<'info> {
    #[account(
        init, 
        payer = who_made_the_offer, 
        space = 8 + 32 + 32 + 8 + 1
    )]
    pub offer: Account<'info, Offer>,

    #[account(mut)]
    pub who_made_the_offer: Signer<'info>,

    #[account(
        mut,
        constraint = token_account_from_who_made_the_offer.mint == kind_of_token_offered.key()
    )]
    pub token_account_from_who_made_the_offer: Account<'info, TokenAccount>,

    #[account(
        init, 
        payer = who_made_the_offer,
        seeds = [offer.key().as_ref()],
        bump = escrow_bump,
        token::mint = kind_of_token_offered,
        token::authority = escrowed_tokens_of_offer_maker,
    )]
    pub escrowed_tokens_of_offer_maker: Account<'info, TokenAccount>,

    pub kind_of_token_offered: Account<'info, Mint>,

    pub kind_of_token_wanted_in_return: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
