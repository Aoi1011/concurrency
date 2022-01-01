use anchor_lang::prelude::*;

declare_id!("6NnowxYkaDjz7sto1RnuWgHreXZh7pNhHmNLL355m88U");

pub mod errors;

use errors::TodoListError;

#[program]
pub mod todo {
    use super::*;
    pub fn new_list(
        ctx: Context<NewList>,
        name: String,
        capacity: u16,
        account_bump: u8,
    ) -> ProgramResult {
        // create a new account
        let list = &mut ctx.accounts.list;
        list.list_owner = *ctx.accounts.user.to_account_info().key;
        list.bump = account_bump;
        list.name = name;
        list.capacity = capacity;
        Ok(())
    }
}

#[account]
pub struct TodoList {
    pub list_owner: Pubkey,
    pub bump: u8,
    pub capacity: u16,
    pub name: String,
    pub lines: Vec<Pubkey>,
}

impl TodoList {
    fn space(name: &str, capacity: u16) -> usize {
        // discriminator + owner pubkey + bump + capacity
        8 + 32 + 1 + 2 + 4 + name.len() + 4 + (capacity as usize) * std::mem::size_of::<Pubkey>()
    }
}

fn name_seed(name: &str) -> &[u8] {
    let b = name.as_bytes();
    if b.len() > 32 {
        &b[0..32]
    } else {
        b
    }
}

#[derive(Accounts)]
#[instruction(name: String, capacity: u16, list_bump: u8)]
pub struct NewList<'info> {
    #[account(init, payer = user, space = TodoList::space(&name, capacity), seeds=[b"todolist", user.to_account_info().key.as_ref(), name_seed(&name)], bump=list_bump)]
    pub list: Account<'info, TodoList>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ListItem {
    pub creattor: Pubkey,
    pub creator_finshed: bool,
    pub list_owner_finshed: bool,
    pub name: String,
}

impl ListItem {
    fn space(name: &str) -> usize {
        // discriminator + creator public key + 2 bools + name string
        8 + 32 + 1 + 1 + 4 + name.len()
    }
}

#[derive(Accounts)]
#[instruction(list_name: String, item_name: String, bounty: u64)]
pub struct Add<'info> {
    #[account(
        mut, 
        has_one=list_owner @ TodoListError::WrongListOwner, 
        seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), 
        name_seed(&list_name)], 
        bump=list.bump
    )]
    pub list: Account<'info, TodoList>,
    pub list_owner: AccountInfo<'info>,
    // 8 byte discriminator,
    #[account(init, payer=user, space=ListItem::space(&item_name))]
    pub item: Account<'info, ListItem>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
