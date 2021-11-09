import { Program } from "@project-serum/anchor";
import { Anchor } from "../target/types/anchor";

import assert from "assert";
import anchor from "@project-serum/anchor";

const SystemProgram = anchor.web3.SystemProgram;

describe("anchor", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Anchor as Program<Anchor>;

  let _baseAccount;

  it("It initialize the account", async () => {
    // Call the create function via RPC
    const baseAccount = anchor.web3.Keypair.generate();

    await program.rpc.initialize("Hello World", {
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
    console.log("Data: ", account.data);
    assert.ok(account.data === "Hello World");
    _baseAccount = baseAccount;
  });

  it("Updates a previous created account", async () => {
    const baseAccount = _baseAccount;

    await program.rpc.update("Some new data", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("Updated data: ", account.data);
    assert.ok(account.data === "Some new data");
    console.log("all account data: ", account);
    console.log("All data: ", account.dataList);
    assert.ok((account.dataList as any).length === 2);
  });
});
