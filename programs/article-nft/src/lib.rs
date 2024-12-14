use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod contexts;

pub use contexts::*;

#[program]
pub mod article_nft {
    use super::*;

    pub fn create_collection(ctx: Context<CreateCollection>) -> Result<()> {
        ctx.accounts.create_collection(&ctx.bumps)
    }
    
    pub fn mint_nft(ctx: Context<MintNFT>) -> Result<()> {
        ctx.accounts.mint_nft(&ctx.bumps)
    }

    pub fn verify_collection(ctx: Context<VerifyCollectionMint>) -> Result<()> {
        ctx.accounts.verify_collection(&ctx.bumps)
    }
}


// 错误枚举
#[error_code]
pub enum ArticleError {
    #[msg("Title length must be between 4 and 50 characters")]
    InvalidTitleLength,
    #[msg("URI length must be between 4 and 200 characters")]
    InvalidURILength,
}
