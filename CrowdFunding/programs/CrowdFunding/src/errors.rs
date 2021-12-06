use anchor_lang::error;

#[error]
pub enum ErrorCode {
    #[error("CrowdFunding is over")]
    CrowdFundingOver,
}

impl From<math::Error> for ErrorCode {
    fn from(_: math::Error) -> ErrorCode {
        ErrorCode::CrowdFundingOver
    }
}
