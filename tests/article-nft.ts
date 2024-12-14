import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ArticleNft } from "../target/types/article_nft";
import type NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { Keypair, Transaction, SystemProgram } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createAssociatedTokenAccountInstruction } from '@solana/spl-token';

describe("article-nft", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ArticleNft as Program<ArticleNft>;
  const payer = provider.wallet as anchor.Wallet;

  it('Creates a new NFT collection', async () => {
    // Generate keypairs for mint and other accounts
    const mintKeypair = Keypair.generate();
    const masterEditionKeypair = Keypair.generate();
    const metadataKeypair = Keypair.generate();

    // Derive associated token account address
    const associatedTokenAddress = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);

    // Create transaction to create associated token account if needed
    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            payer.publicKey,
            associatedTokenAddress,
            payer.publicKey,
            mintKeypair.publicKey
        )
    );

    // Send transaction to create associated token account
    await provider.sendAndConfirm(transaction, [payer.payer]);

    // Call the create_collection method
    const txSignature = await program.methods
        .createCollection()
        .accounts({
            user: payer.publicKey,
            mint: mintKeypair.publicKey,
            masterEdition: masterEditionKeypair.publicKey,
            metadata: metadataKeypair.publicKey,
            // destination: associatedTokenAddress,
            // mintAuthority: payer.publicKey,
            // systemProgram: anchor.web3.SystemProgram.programId,
            // tokenProgram: TOKEN_PROGRAM_ID,
            // tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID, // Ensure this points to your metadata program
        })
        .signers([mintKeypair, masterEditionKeypair, metadataKeypair])
        .rpc();

    console.log('Transaction signature:', txSignature);

    // Verify that the NFT was minted and accounts were created correctly
    // You can add assertions here to check the state of the accounts after the transaction
});
  
});
