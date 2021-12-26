use anchor_lang::error;

pub type CrowdfundingResult<T = ()> = std::result::Result<T, ErrorCode>;

#[error]
pub enum ErrorCode {
    #[msg("CrowdFunding is over")]
    CrowdFundingOver,
    #[msg("Insufficient goal amount")]
    InsufficientGoalAmount,
}

// impl From<math::Error> for ErrorCode {
//     fn from(_: math::Error) -> ErrorCode {
//         ErrorCode::CrowdFundingOver
//     }
// }
