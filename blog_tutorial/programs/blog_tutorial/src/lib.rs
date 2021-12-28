use anchor_lang::prelude::*;
use std::str::from_utf8;

declare_id!("HEJAcC7cBSr9g1Wt2yPJikJ8LqutFYx7ZxJcKizskcWx");

#[program]
pub mod blog_tutorial {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let blog_acc = &mut ctx.accounts.blog_account;
        blog_acc.authority = *ctx.accounts.authority.key;
        Ok(())
    }

    pub fn make_post(ctx: Context<MakePost>, new_post: Vec<u8>) -> ProgramResult {
        // post detail
        // convert it from the array of bytets to a string slice in post
        let post = from_utf8(&new_post).map_err(|err| {
             msg!("Invalid utf-8, from byte {}", err.valid_up_to());
             ProgramError::InvalidAccountData
         })?;
        msg!(post);

        let blog_acc = &mut ctx.accounts.blog_account;
        blog_acc.latest_post = new_post;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = authority,
        space = 8 // account discriminator
        + 32 // pubkey
        + 566 // make the post max 566 bytes long 
    )]
    pub blog_account: Account<'info, BlogAccount>, 
    pub authority: Signer<'info>, // readable
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct MakePost<'info> {
    #[account(mut, has_one = authority)]
    pub blog_account: Account<'info, BlogAccount>,
    pub authority: Signer<'info>,  // check the authority
}

#[account]
pub struct BlogAccount {
    pub latest_post: Vec<u8>,
    pub authority: Pubkey,
}
