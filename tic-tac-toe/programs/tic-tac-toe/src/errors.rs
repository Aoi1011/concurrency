use anchor_lang::error_code;

#[error_code]
pub enum TickTacToeError {
    TileOutOfBounds,
    TileAlreadySet,
    GameAlreadyOver,
    NotPlayersTurn,
    GameAlreadyStarted,
}
