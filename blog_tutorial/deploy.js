import spwan from "cross-spawn";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { Keypair, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import fs from "fs";

const projectName = "blog_tutorial";

const SLASH = path.sep;

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const programAuthorityKeyfileName = `deploy/programauthority-keypair.json`;
const programAuthorityKeypairFile = path.resolve(
  `${__dirname}${SLASH}${programAuthorityKeyfileName}`
);

const programKeyfileName = `target/deploy/${projectName}-keypair.json`
const programKeypairFile = path.resolve(
  `${__dirname}${SLASH}${programKeyfileName}`
);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

function readKeyfile(keypairfile) {
  let kf = fs.readFileSync(keypairfile)
  let parsed = JSON.parse(kf.toString()) // [1,1,2,2,3,4]
  kf = new Uint8Array(parsed)
  const keypair = Keypair.fromSecretKey(kf)
  return keypair
}

; (async () => {
  let method;
  let programAuthorityKeypair;
  let programId;
  let programKeypair;

  programKeypair = readKeyfile(programKeypairFile)
  console.log({ publicKey: programKeypair.publicKey })
  programId = programKeypair.publicKey.toString()

  if (!fs.existsSync(programAuthorityKeypairFile)) {
    // does not exist, create it
    // use this to deploy
    spwan.sync("anchor", ["build"], { stdio: "inherit" });

    let prograAuthorityKeypair = new Keypair(process.env.PROGRAM_AUTHORITY_KEYPAIR);
    // let prograAuthorityKeypair = process.env.PROGRAM_AUTHORITY_KEYPAIR;
    let signature1 = await connection.requestAirdrop(
      prograAuthorityKeypair.publicKey,
      LAMPORTS_PER_SOL * 2
    );
    await connection.confirmTransaction(signature1);

    console.log(`\n\n Created keypair.\n`);
    console.log(`\n\n Saving keypair. ${programAuthorityKeypairFile}\n`);

    fs.writeFileSync(
      programAuthorityKeypairFile,
      `[${Buffer.from(prograAuthorityKeypair.secretKey.toString())}]`
    );

    method = ["deploy"];
  } else {
    // does exist, use it to upgrade
    programAuthorityKeypair = readKeyfile(programAuthorityKeypairFile)

    console.log(`\n\n  Upgrading program.\n`)

    method = [
      "upgrade",
      `target/deploy/${projectName}.so`,
      "--program-id",
      programId,
    ]
  }

  console.log({ method })

  spwan.sync(
    "anchor",
    [
      ...method,
      "--provider.cluster",
      "devnet",
      "--provider.wallet",
      `${programAuthorityKeypairFile}`,
    ],
    {
      stdio: "inherit",
    }
  );

  // fs.copyFile(
  //   `target/idl/${projectName}.json`,
  //   `app/src/lib/idl/${projectName}.json`,
  //   (err) => {
  //     if (err) throw err;
  //     console.log(`${projectName}.json was copied to ./app`);
  //   }
  // );
})();
