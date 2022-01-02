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
  return account?.lamports ?? 0;
}

function expectBalance(actual, expected, message, slack = 20000) {
  expect(actual, message).within(expected - slack, expected + slack);
}

async function createUser(airdropBalance?: number): Promise<Owner> {
  airdropBalance = airdropBalance ?? 10 * LAMPORTS_PER_SOL;
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

function createUsers(numUsers) {
  let promisses = [];
  for (let i = 0; i < numUsers; i++) {
    promisses.push(createUser());
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

async function addItem({ list, user, name, bounty }) {
  const itemAccount = anchor.web3.Keypair.generate();
  let program = programForUser(user);
  await program.rpc.add(list.data.name, name, new BN(bounty), {
    accounts: {
      list: list.publicKey,
      listOwner: list.data.listOwner,
      item: itemAccount.publicKey,
      user: user.key.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [user.key, itemAccount],
  });

  let [listData, itemData] = await Promise.all([
    program.account.todoList.fetch(list.publicKey),
    program.account.listItem.fetch(itemAccount.publicKey),
  ]);

  return {
    list: {
      publicKey: list.publicKey,
      data: listData,
    },
    item: {
      publicKey: itemAccount.publicKey,
      data: itemData,
    },
  };
}

async function cancelItem({ list, item, itemCreator, user }) {
  let program = programForUser(user);
  await program.rpc.cancel(list.data.name, {
    accounts: {
      list: list.publicKey,
      listOwner: list.data.listOwner,
      item: item.publicKey,
      itemCreator: itemCreator.key.publicKey,
      user: user.key.publicKey,
    },
  });

  let listData = await program.account.todoList.fetch(list.publicKey);
  return {
    list: {
      publicKey: list.publicKey,
      data: listData,
    },
  };
}

describe("New list", () => {
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

describe("Add", () => {
  it("Anyone can add an item to a list", async () => {
    const [owner, adder] = await createUsers(2);

    const adderStartingBalance = await getAccountBalance(adder.key.publicKey);
    const list = await createList(owner, "list");
    const result = await addItem({
      list,
      user: adder,
      name: "Do something",
      bounty: 1 * LAMPORTS_PER_SOL,
    });

    expect(result.list.data.lines, "Item is added").deep.equals([
      result.item.publicKey,
    ]);
    expect(
      result.item.data.creattor.toString(),
      "Item marked with creator"
    ).equals(adder.key.publicKey.toString());
    expect(result.item.data.creatorFinshed, "creator_finished is false").equals(
      false
    );
    expect(
      result.item.data.listOwnerFinshed,
      "list_owner_finished is false"
    ).equals(false);
    expect(result.item.data.name, "Name is set").equals("Do something");
    expect(
      await getAccountBalance(result.item.publicKey),
      "List account balance"
    ).equals(1 * LAMPORTS_PER_SOL);

    let adderNewBalance = await getAccountBalance(adder.key.publicKey);
    expectBalance(
      adderStartingBalance - adderNewBalance,
      LAMPORTS_PER_SOL,
      "Number of lamports removed from adder is equal to bounty"
    );

    // Test that another add works
    const again = await addItem({
      list,
      user: adder,
      name: "Another item",
      bounty: 1 * LAMPORTS_PER_SOL,
    });
    expect(again.list.data.lines, "Item is added").deep.equals([
      result.item.publicKey,
      again.item.publicKey,
    ]);
  });

  it("fails if the list is full", async () => {
    const MAX_LIST_SIZE = 4;
    const owner = await createUser();
    const list = await createList(owner, "list", MAX_LIST_SIZE);

    // Add 4 items, in parallel for speed
    await Promise.all(
      new Array(MAX_LIST_SIZE).fill(0).map((_, i) => {
        return addItem({
          list,
          user: owner,
          name: `Item ${i}`,
          bounty: 1 * LAMPORTS_PER_SOL,
        });
      })
    );

    const adderStartingBalance = await getAccountBalance(owner.key.publicKey);

    // Now the list should be full.
    try {
      let addResult = await addItem({
        list,
        user: owner,
        name: "Full item",
        bounty: 1 * LAMPORTS_PER_SOL,
      });

      console.log(addResult, { depth: null });
      expect.fail("Adding to full list should be have failed");
    } catch (e) {
      expect(e.toString()).contains("This list is full");
    }

    let adderNewBalance = await getAccountBalance(owner.key.publicKey);
    expect(adderStartingBalance, "Adder balance is unchanged").equals(
      adderNewBalance
    );
  });
});

describe("Cancel", () => {
  it("List owner can cacel item", async () => {
    const [owner, adder] = await createUsers(2);
    const list = await createList(owner, "list");

    const adderStartingBalance = await getAccountBalance(adder.key.publicKey);

    const result = await addItem({
      list,
      user: adder,
      bounty: LAMPORTS_PER_SOL,
      name: "An item",
    });

    const adderBalanceAfterAdd = await getAccountBalance(adder.key.publicKey);

    expect(result.list.data.lines, "Item is added to the list").deep.equals([
      result.item.publicKey,
    ]);
    expect(adderBalanceAfterAdd, "Bounty is removed from adder").lt(
      adderStartingBalance
    );

    const cancelResult = await cancelItem({
      list,
      item: result.item,
      itemCreator: adder,
      user: owner,
    });

    const adderBalanceAfterCancel = await getAccountBalance(
      adder.key.publicKey
    );
    expectBalance(
      adderBalanceAfterCancel,
      adderBalanceAfterAdd + LAMPORTS_PER_SOL,
      "Cancel returns bounty to adder"
    );
    expect(
      cancelResult.list.data.lines,
      "Cancel removes data from list"
    ).deep.equals([]);
  });
});
