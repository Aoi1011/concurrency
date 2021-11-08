import { Program } from "@project-serum/anchor";
import { Anchor } from "../target/types/anchor";

import assert from "assert";
import anchor from "@project-serum/anchor";

const { SystemProgram } = anchor.web3;

describe("anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Anchor as Program<Anchor>;

  let _baseAccount;

  it("Creates a counter", async () => {
    // Call the create function via RPC
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    // Fetch the account and check the value of count
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Count 0: ", account.count.toString());
    assert.ok(account.count.toString() === "0");
    _baseAccount = baseAccount;
  });

  it("Increments the counter", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Count 1: ", account.count.toString());
    assert.ok(account.count.toString() === "1");
  });
});
