use anchor_lang::error;
// use solana_program::program_error::ProgramError;

#[error]
pub enum ErrorCode {
    #[msg("CrowdFunding is over")]
    CrowdFundingOver,
}

impl From<math::Error> for ErrorCode {
    fn from(_: math::Error) -> ErrorCode {
        ErrorCode::CrowdFundingOver
    }
}
