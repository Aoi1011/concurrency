//@ts-ignore
export class WalletAdapterPhantom {
    constructor() {
        //@ts-ignore
        if(!window.solana.isConnected) throw new Error("Connect to Phantom first");
        return;
        //@ts-ignore
		this.publicKey = window.solana.publicKey;
	}

    //@ts-ignore
	async signTransaction(tx: Transaction): Promise<Transaction> {
        //@ts-ignore
		const signedTransaction = await window.solana.signTransaction(tx);
		return signedTransaction;
	}

    //@ts-ignore
	async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
        //@ts-ignore
		const signedTransactions = await window.solana.signAllTransactions(transactions);
		return signedTransactions;
	}

    //@ts-ignore
	get publicKey(): PublicKey {
        //@ts-ignore
		return window.solana.publicKey;
	}
}
