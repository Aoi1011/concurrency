use anchor_lang::prelude::*;

#[error]
pub enum TodoListError {
    #[msg("This list is full")]
    ListFull,
    #[msg("Bounty must be enough to mark account rent-exempt")]
    BountyTooSmall,
    #[msg("Only the list owner or item creator may cancel an item")]
    CancelPermissions,
    #[msg("Only the list owner or item creator may finish an item")]
    FinishPermissions,
    #[msg("Item does not belong to this todo list")]
    ItemNotFound,
    #[msg("Specified list owner does not match the pubkey in the list")]
    WrongListOwner,
    #[msg("Specified item creator does not match the pubkey in the item")]
    WrongItemCreator,
}
