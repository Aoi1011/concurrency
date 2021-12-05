use anchor_lang::*;

#[derive(Clone, Debug, Eq, Error)]
pub enum CrowdFundingError {
    #[error("CrowdFunding is over")]
    CrowdFundingOver,
}

impl PrintProgramError for CrowdFundingError {
    fn print<E>(&self) {
        msg!(&self.to_string());
    }
}

impl From<CrowdFundingError> for ProgramError {
    fn from(e: CrowdFundingError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
