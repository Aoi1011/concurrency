import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/blog_tutorial.json";
import { WalletAdapterPhantom } from "./helpers/wallet-adapter-phantom";
import { Program } from "@project-serum/anchor";

import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletConnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

declare global {
  interface Window {
    solana: any;
  }
}

const { SystemProgram, Keypair } = anchor.web3;
const opts = {
  preflightCommitment: "processed",
};

const wallets = [getPhantomWallet()];
const programId = new PublicKey(idl.metadata.address);

function App() {
  const wallet = useWallet();

  const getProvider = async () => {
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, "confirmed");

    const provider = new anchor.Provider(
      connection,
      // @ts-ignore
      wallet,
      // @ts-ignore
      opts.preflightCommitment
    );
    return provider;
  };

  const initialize = async () => {
    const blogAccount = anchor.web3.Keypair.generate();
    const provider = getProvider();
    // @ts-ignore
    const program = new Program(idl, programId, provider);

    const tx = await program.rpc.initialize({
      accounts: {
        blogAccount: blogAccount.publicKey, 
        // @ts-ignore
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [blogAccount]
    });

    // @ts-ignore
    console.log(`Successfully initialized Blog ID: ${blogAccount.publicKey} for Blogger ${provider.wallet.publicKey}`, tx);
  }

  const makePost = async (post: any, blogAccountStr: string) => {
    // @ts-ignore
    const program = new Program(idl, programId, provider);
    const provider = getProvider();

    const blogAccount = new anchor.web3.PublicKey(blogAccountStr);

    const utf8encoded = Buffer.from(post);

    const tx = await program.rpc.makePost(
      utf8encoded, 
      {
        accounts: {
          // @ts-ignore
          blogAcccount: blogAccount.pubklicKey,
          // @ts-ignore 
          authority: provider.wallet.publicKey,
        }, 
        // @ts-ignore
        signers: [provider.wallet.payer]
      }
    );

    console.log(`Successfully posted ${post} to `);

    return tx;
  }

  let utf8decoder = new TextDecoder();

  const getLatestPost = async (blogAccount: any) => {
    // @ts-ignore
    const program = new Program(idl, programId, provider);
    const account = await program.account.blogAccount.fetch(new anchor.web3.PublicKey(blogAccount.publicKey));
    return utf8decoder.decode(account.latestPost);
  }

  const getBlogAuthority = async (blogId: any) => {
    // @ts-ignore
    const program = new Program(idl, programId, provider);
    const account = await program.account.blogAccount.fetch(new anchor.web3.PublicKey(blogId.publicKey));
    return account.authority.toString();
  }

  const getLastPost = async (blogId: any, limit = 100) => {
    const accountpublicKey = new anchor.web3.PublicKey(blogId);

    const parsedConfirmedTransactions = await getTransactionForAddress(accountpublicKey);

    const filtered = parsedConfirmedTransactions.filter((tx) => {
      // @ts-ignore
      tx.meta.logMessages.some((msg) => msg.startsWith("Program log: "));
    });

    const postDetails = filtered.map((tx) => {
      // @ts-ignore
      const timestamp = new Date(tx.blockTime * 1000).toString();
      // @ts-ignore
      const programLogs = tx.meta?.logMessages?.filter((msg) => msg.startsWith("Program log: "));

      const content = programLogs?.map(log => log.substring("Program log: ".length));
      console.log({tx});
      return {
        content, 
        timestamp, 
        signature: tx?.transaction.signatures[0]
      }
    });

    return postDetails;
  }

  const getTransactionForAddress = async (publicKey: any, limit = 2000) => {
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, "confirmed");

    const confirmedSignaturesInfo = await connection.getSignaturesForAddress(new anchor.web3.PublicKey(publicKey), {limit});

    const transactionSignature = confirmedSignaturesInfo.map((signInfo) => signInfo.signature);
    const parsedConfirmedTransactions = await connection.getParsedConfirmedTransactions(transactionSignature);

    return parsedConfirmedTransactions;
  }

  const getBlogAccounts = async (publicKey: any) => {
    // blogger = publickey
    const parsedConfirmTransactions = await getTransactionForAddress(publicKey);

    let blogAccounts = [];

    parsedConfirmTransactions.forEach((tx) => {
      // @ts-ignore
      let instr = tx?.meta?.innerInstructions[0].instructions[0].parsed;

      // @ts-ignore
      if (!instr || !(instr.type === 'createAccount') && instr.info.owner === programId.toString()) {
        return;
      }

      // @ts-ignore
      blogAccounts.push(tx?.meta?.innerInstructions[0].instructions[0].parsed.info.newAccount);
    });


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
