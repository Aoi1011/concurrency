// import * as anchor from "@project-serum/anchor";
// import { Connection, PublicKey } from "@solana/web3.js";
// import idl from "./idl/blog_tutorial.json";
// import { WalletAdapterPhantom } from "./helpers/wallet-adapter-phantom";
// import { Program } from "@project-serum/anchor";

// import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
// import {
//   useWallet,
//   WalletProvider,
//   ConnectionProvider,
// } from "@solana/wallet-adapter-react";
// import {
//   WalletModalProvider,
//   WalletConnectButton,
//   WalletMultiButton,
// } from "@solana/wallet-adapter-react-ui";

// declare global {
//   interface Window {
//     solana: any;
//   }
// }

// const { SystemProgram, Keypair } = anchor.web3;
// const opts = {
//   preflightCommitment: "processed",
// };

// // const wallet =
// //   window.solana.isConnected && window.solana?.isPhantom
// //     ? new WalletAdapterPhantom()
// //     : keypair
// //     ? new anchor.Wallet(keypair)
// //     : new anchor.Wallet(anchor.web3.Keypair.generate());
// const wallets = [getPhantomWallet()];

// // const provider = new anchor.Provider(connection, wallet, opts);
// // const program = new anchor.Program(idl, programId, provider);
// const programId = new PublicKey(idl.metadata.address);

// // export default class AnchorClient {
// //   constructor({ programId, config, keypair } = {}) {
// //     this.programId = programId;
// //     this.config = config;
// //     this.connection = new anchor.web3.Connection(
// //       this.config.httpUir,
// //       "confirmed"
// //     );
// //   }
// // }\

// async function getProvider() {
//   const network = "https://api.devnet.solana.com";
//   const connection = new Connection(network, "confirmed");

//   const provider = new anchor.Provider(
//     connection,
//     wallet,
//     // @ts-ignore
//     opts.preflightCommitment
//   );
//   return provider;
// }

// async function initialize() {
//   const blogAccount = anchor.web3.Keypair.generate();
//   const provider = await getProvider();
//   // @ts-ignore
//   const program = new Program(idl, programId, provider);
//   await program.rpc.initialize({
//     accounts: {},
//   });
// }
