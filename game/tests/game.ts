import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Game } from "../target/types/game";

describe("game", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Game as Program<Game>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
