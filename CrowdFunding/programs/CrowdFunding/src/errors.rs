use anchor_lang::error;

#[error]
pub enum ErrorCode {
    #[error("CrowdFunding is over")]
    CrowdFundingOver,
}

impl From<CrowdFundingError> for ErrorCode {
    fn from(e: CrowdFundingError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
