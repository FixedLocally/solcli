const utils = require('../utils.ts');
const { transfer, getAssociatedTokenAddress } = require('@solana/spl-token');
const { LAMPORTS_PER_SOL, KeyPair, SystemProgram, Transaction } = require('@solana/web3.js');

exports.command = "transfer <destination> <amount> [token]";
exports.describe = "Transfer SOL/tokens";
exports.builder = {};
exports.handler = async (argv) => {
    let signer = utils.signer;

    if (argv.token) {
        // send token
        let tokenInfo = await utils.resolveTokenSymbol(utils.rpcConnection, argv.token);
        let source = await getAssociatedTokenAddress(utils.toPubKey(tokenInfo.address), signer.publicKey);
        let dest = await getAssociatedTokenAddress(utils.toPubKey(tokenInfo.address), utils.toPubKey(argv.destination));
        console.log(`${signer.publicKey.toBase58()} send ${argv.amount} ${argv.token} to ${argv.destination}`);
        console.log(`Source account: ${source}`);
        console.log(`Destination account: ${dest}`);
        try {
            let tx = await transfer(utils.rpcConnection, signer, source, dest, signer, argv.amount * (10 ** tokenInfo.decimals));
            console.log("Transaction:", tx);
        } catch (e) {
            console.log(e.message);
        }
    } else {
        // send sol
        let transaction = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: signer.publicKey,
                toPubkey: utils.toPubKey(argv.destination),
                lamports: argv.amount * LAMPORTS_PER_SOL,
            })
        );
        console.log(`${signer.publicKey.toBase58()} send ${argv.amount} SOL to ${argv.destination}`);
        try {
            let tx = await utils.rpcConnection.sendTransaction(transaction, [signer]);
            console.log("Transaction:", tx);
        } catch (e) {
            console.log(e.message);
        }
    }
}