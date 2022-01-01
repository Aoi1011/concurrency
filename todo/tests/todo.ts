import * as anchor from "@project-serum/anchor";
import BN from "bn.js";
import { Program } from "@project-serum/anchor";
import { expect } from "chai";
// import { Todo } from "../target/types/todo";

interface Owner {
  key: anchor.web3.Keypair;
  wallet: anchor.Wallet;
  provider: anchor.Provider;
}

const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;

const provider = anchor.Provider.env();
anchor.setProvider(provider);
const mainProgram = anchor.workspace.Todo;

async function getAccountBalance(pubkey) {
  let account = await provider.connection.getAccountInfo(pubkey);
  return account.lamports ?? 0;
}

function expectBalance(actual, expected, message, slack = 20000) {
  expect(actual, message).within(expected - slack, expected + slack);
}

async function createUser(airdropBalance?: number): Promise<Owner> {
  airdropBalance = airdropBalance ?? 2 * LAMPORTS_PER_SOL;
  let user = anchor.web3.Keypair.generate();
  let sig1 = await provider.connection.requestAirdrop(
    user.publicKey,
    airdropBalance
  );
  await provider.connection.confirmTransaction(sig1);

  let wallet = new anchor.Wallet(user);
  let userProvider = new anchor.Provider(
    provider.connection,
    wallet,
    provider.opts
  );

  return {
    key: user,
    wallet,
    provider: userProvider,
  };
}

async function requestAirdrop(owner: Owner) {
  let signature = await provider.connection.requestAirdrop(
    owner.key.publicKey,
    2 * LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(signature);
}

function createUsers(numUsers) {
  let promisses = [];
  for (let i = 0; i < numUsers; i++) {
    promisses.push(createUser(1));
  }

  return Promise.all(promisses);
}

function programForUser(user) {
  return new anchor.Program(
    mainProgram.idl,
    mainProgram.programId,
    user.provider
  );
}

async function createList(owner: Owner, name, capacity = 16) {
  const [listAccount, bump] = await anchor.web3.PublicKey.findProgramAddress(
    ["todolist", owner.key.publicKey.toBytes(), name.slice(0, 32)],
    mainProgram.programId
  );

  let program = programForUser(owner);
  await program.rpc.newList(name, capacity, bump, {
    accounts: {
      list: listAccount,
      user: owner.key.publicKey,
      systemProgram: SystemProgram.programId,
    },
  });

  let list = await program.account.todoList.fetch(listAccount);
  return { publicKey: listAccount, data: list };
}

describe("new list", () => {
  // Configure the client to use the local cluster.

  it("creates a list", async () => {
    // Add your test here.
    const owner = await createUser();
    let list = await createList(owner, "A list");

    // await requestAirdrop(owner);

    expect(list.data.listOwner.toString(), "List owner is set").equals(
      owner.key.publicKey.toString()
    );
    expect(list.data.name, "List name is set").equals("A list");
    expect(list.data.lines.length, "List has not items").equals(0);
  });
});
