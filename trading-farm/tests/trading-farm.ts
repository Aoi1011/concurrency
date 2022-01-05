import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
// import { TradingFarm } from "../target/types/trading_farm";
import * as assert from "assert";
import * as spl from "@solana/spl-token";
import NodeWallet from "@project-serum/anchor/dist/cjs/provider";
import { PublicKey } from "@solana/web3.js";

const provider = anchor.Provider.env();
anchor.setProvider(provider);
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
    const wallet = program.provider.wallet as NodeWallet;

    cowMint = await spl.Token.createMint(
      program.provider.connection,
      wallet.payer,
      wallet.publicKey,
      wallet.publicKey,
      0,
      spl.TOKEN_PROGRAM_ID
    );
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
