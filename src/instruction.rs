use crate::error::MailError::InvalidInstruction;
use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum MailInstruction {
    InitAccount,
}

impl MailInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::InitAccount,
            _ => return Err(InvalidInstruction.into()),
        })
    }
}
