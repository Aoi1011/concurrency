import spwan from "cross-spawn";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import path from "path";
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const programAuthorityKeyfileName = `deploy/programauthority-keypair.json`;

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const programAuthorityKeypairFile = path.resolve(
  `${__dirname}${SLASH}${programAuthorityKeyfileName}`
);

(async () => {
  if (!fs.existsSync(programAuthorityKeypairFile)) {
    // does not exist, create it
    // use this to deploy
    spwan.sync("anchor", ["build"], { stdio: "inherit" });
    let prograAuthorityKeypair = new Keypair();

    let signature = await connection.requestAirdrop(
      prograAuthorityKeypair.publicKey,
      LAMPORTS_PER_SOL * 5
    );
    await connection.confirmTransaction(signature);

    console.log(`\n\n Created keypair.\n`);
    console.log(`\n\n Saving keypair. ${programAuthorityKeypairFile}\n`);

    fs.writeFileSync(
      programAuthorityKeypairFile,
      `[${Buffer.from(prograAuthorityKeypair.secretKey.toString())}]`
    );
  } else {
    // does exist, use it to upgrade
  }
});
