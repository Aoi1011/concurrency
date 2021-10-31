use crate::error::MailError::NotWritable;
use crate::instruction::MailInstruction;
use solana_program::{
    account_info::AccountInfo, entrypoint::ProgramResult, msg, program_error::ProgramError,
    pubkey::Pubkey,
};

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = MailInstruction::unpack(instruction_data)?;

        match instruction {
            MailInstruction::InitAccount => {
                msg!("Instruction: InitAccount");
                Self::process_init_account(accounts, program_id)
            }
        }
    }

    fn process_init_account(accout: &AccountInfo, program_id: &Pubkey) -> ProgramResult {
        if !accout.is_writable {
            return Err(NotWritable.into());
        }

        if accout.owner != program_id {
            return Err(ProgramError::IncorrectProgramId);
        }
        
        Ok(())
    }
}
