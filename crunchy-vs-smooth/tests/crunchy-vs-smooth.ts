import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CrunchyVsSmooth } from "../target/types/crunchy_vs_smooth";
import asset from "assert";

const { SystemProgram } = anchor.web3;

describe("crunchy-vs-smooth", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  // @ts-ignore
  const program = anchor.workspace.CrunchyVsSmooth as Program<CrunchyVsSmooth>;
  const voteAccount = anchor.web3.Keypair.generate();

  it("Initializes with 0 votes for crunchy and smooth", async () => {
    // Add your test here.
    console.log("Testing Initialize...");
    // The last element passed to RPC methods is always the
    // transaction options. Because voteAccount us being created here.
    // We are required to pass it as signers array
    await program.rpc.initialize({
      accounts: {
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [voteAccount],
    });

    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());

    asset.ok(
      account.crunchy.toString() == "0" && account.smooth.toString() == "0"
    );
  });
});
