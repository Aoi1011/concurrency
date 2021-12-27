import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CrowdFunding } from "../target/types/crowd_funding";
import BN from "bn.js";

import { PublicKey } from "@solana/web3.js";

interface Project {
  time_stamp: BN;
  record_id: BN;
  project_creater: PublicKey;
  current_amount: BN;
  goal_amount: BN;
  deadline: BN;
  achieved: boolean;
}

describe("CrowdFunding", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CrowdFunding as Program<CrowdFunding>;

  it("Is initialized!", async () => {
    // Add your test here.
    // const newProject = new Project {
    //   time_stamp: new BN(0),
    //  record_id: 0,
    //  project_creater: PublicKey,
    //  current_amount: BN,
    //  goal_amount: BN,
    //  deadline: BN,
    //  achieved: boolean,
    // }
    let goalAmount = 1;
    let deadline = 1;
    const projectRecord = anchor.web3.Keypair.generate();
    const tx = await program.rpc.createProject({
      accounts: {
        projectHistory: projectRecord.publicKey,
        contractSinger: provider.wallet.publicKey,
      },
    });
    console.log("Your transaction signature", tx);
  });
});
