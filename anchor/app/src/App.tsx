import React, { useState } from "react";
import "./App.css";
import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, Wallet, web3 } from "@project-serum/anchor";
import idl from "./idl.json";

import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";

import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [getPhantomWallet()];

const { SystemProgram, Keypair } = web3;

const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed",
};
const programId = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(
      network,
      opts.preflightCommitment as Commitment
    );

    // @ts-ignore
    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  async function createCounter() {
    const provider = await getProvider();
    // @ts-ignore
    const program = new Program(idl, programId, provider);
    try {
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      });

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("account: ", account);
      setValue(account.count.toString());
    } catch (error) {
      console.log("Transaction error: ", error);
    }
  }

  async function increment() {
    const provider = await getProvider();
    // @ts-ignore
    const program = new Program(idl, programId, provider);
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("account: ", account);
    setValue(account.count.toString());
  }

  if (!wallet.connected) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <WalletMultiButton />
      </div>
    );
  } else {
    return (
      <div className="App">
        <div>
          {!value && <button onClick={createCounter}>Create counter</button>}
          {value && <button onClick={increment}>Increment counter</button>}
          {value && value >= Number(0) ? (
            <h2>{value}</h2>
          ) : (
            <h3>Please create the counter.</h3>
          )}
        </div>
      </div>
    );
  }
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint="https://api.devnet.solana.com">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;
