import React, { useState } from "react";
import logo from "./logo.svg";
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
require("@solana/wallet-adapter-react-ui/style.css");

const wallets = [getPhantomWallet()];

const { SystemProgram, Keypair } = web3;

const baseAccount = Keypair.generate();
const opts = {
  preflightCommitment: "processed",
};
const programId = new PublicKey(idl.metadata.address);

function App() {
  const [value, setValue ] = useState(null);
  const wallet = useWallet();

  async function getProvider() {
    const network = "https://api.devnet.solana.com";
    const connection  = new Connection(network, (opts.preflightCommitment) as Commitment);

    // @ts-ignore
    const provider = new Provider(connection, wallet, opts.preflightCommitment);
    return provider;
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
