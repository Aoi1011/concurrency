import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Game } from "../target/types/game";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("game", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Game as Program<Game>;

  it("Sets and changes name!", async () => {
    const [userStatsPDA, _] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("user-stats"),
        anchor.getProvider().wallet.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .createUserStats("brian")
      .accounts({
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "brian"
    );

    await program.methods
      .changeUserName("tom")
      .accounts({
        user: anchor.getProvider().wallet.publicKey,
        userStats: userStatsPDA,
      })
      .rpc();

    expect((await program.account.userStats.fetch(userStatsPDA)).name).to.equal(
      "tom"
    );
  });
});
