import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
// import { TradingFarm } from "../target/types/trading_farm";
import * as assert from "assert";
import * as spl from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/provider";
import { PublicKey } from "@solana/web3.js";
// import workspace from "@project-serum/anchor/src/workspace";

const provider = anchor.Provider.env();
anchor.setProvider(provider);
// @ts-ignore
const mainProgram = anchor.workspace.TradingFarm;

describe("trading-farm", () => {
  // Configure the client to use the local cluster.

  let offerMakerPigTokenAccount: anchor.web3.PublicKey;
  let offerTakerCowTokenAccount: anchor.web3.PublicKey;
  let offerTakerPigTokenAccount: anchor.web3.PublicKey;
  let offerMakerCowTokenAccount: anchor.web3.PublicKey;

  let cowMint: spl.Token;
  let pigMint: spl.Token;

  let offerTaker = anchor.web3.Keypair.generate();

  before(async () => {
    const wallet = mainProgram.provider.wallet;

    cowMint = await spl.Token.createMint(
      mainProgram.provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0,
      spl.TOKEN_PROGRAM_ID
    );

    pigMint = await spl.Token.createMint(
      mainProgram.provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0,
      spl.TOKEN_PROGRAM_ID
    );

    offerMakerCowTokenAccount = await cowMint.createAssociatedTokenAccount(
      mainProgram.provider.wallet.publicKey
    );

    offerMakerPigTokenAccount = await pigMint.createAssociatedTokenAccount(
      mainProgram.provider.wallet.publicKey
    );

    offerTakerCowTokenAccount = await cowMint.createAssociatedTokenAccount(
      offerTaker.publicKey
    );

    offerTakerPigTokenAccount = await pigMint.createAssociatedTokenAccount(
      offerTaker.publicKey
    );

    await cowMint.mintTo(
      offerMakerCowTokenAccount,
      mainProgram.provider.wallet.publicKey,
      [],
      100
    );
    await pigMint.mintTo(
      offerTakerPigTokenAccount,
      mainProgram.provider.wallet.publicKey,
      [],
      100
    );
  });

  it("It let you place and accept offers for toekns", async () => {
    // Add your test here.
    const offer = anchor.web3.Keypair.generate();
    const [escrowedTokensOfferMaker, escrowedTokensOfOfferMakerBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [offer.publicKey.toBuffer()],
        mainProgram.programId
      );

    await mainProgram.rpc.makeOffer(
      escrowedTokensOfOfferMakerBump,
      new anchor.BN(2),
      new anchor.BN(4),
      {
        accounts: {
          offer: offer.publicKey,
          whoMadeTheOffer: mainProgram.provider.wallet.publicKey,
          tokenAccountFromWhoMadeTheOffer: offerMakerCowTokenAccount,
          escrowedTokensOfOfferMaker: escrowedTokensOfferMaker,
          kindOfTokenOffered: cowMint.publicKey,
          kindOfTokenWantedInReturn: pigMint.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [offer],
      }
    );

    assert.equal(
      2,
      (await cowMint.getAccountInfo(escrowedTokensOfferMaker)).amount.toNumber()
    );

    const offerMakerCurrentCowAmounts = (
      await cowMint.getAccountInfo(offerMakerCowTokenAccount)
    ).amount.toNumber();
    const offerMakerCurrentPigAmounts = (
      await pigMint.getAccountInfo(offerMakerPigTokenAccount)
    ).amount.toNumber();

    const offerReceiveCuurentPigAmounts = (
      await pigMint.getAccountInfo(offerTakerPigTokenAccount)
    ).amount.toNumber();

    await mainProgram.rpc.acceptOffer({
      accounts: {
        offer: offer.publicKey,
        whoMadeTheOffer: mainProgram.provider.wallet.publicKey,
        whoIsTakingTheOffer: offerTaker.publicKey,
        escrowedTokensOfOfferMaker: escrowedTokensOfferMaker,
        accountHoldingWhatMakerWillGet: offerMakerPigTokenAccount,
        accountHoldingWhatReceiverWillGive: offerTakerPigTokenAccount,
        accountHoldingWhatReceiverWillGet: offerTakerCowTokenAccount,
        kindOfTokenWantedInReturn: pigMint.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      },
      signers: [offerTaker],
    });

    assert.equal(offerMakerCurrentPigAmounts + 4, (await pigMint.getAccountInfo(offerMakerPigTokenAccount)).amount.toNumber());
    assert.equal(offerReceiveCuurentPigAmounts - 4, (await pigMint.getAccountInfo(offerTakerPigTokenAccount)).amount.toNumber());

    // accounts closed after transactions completed (e.g. accepted)
    assert.equal(null, await mainProgram.provider.connection.getAccountInfo(offer.publicKey));
    assert.equal(null, await mainProgram.provider.connection.getAccountInfo(escrowedTokensOfferMaker));
  });
});
