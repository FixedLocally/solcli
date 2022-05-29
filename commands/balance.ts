const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getAccount, getAssociatedTokenAddress } = require('@solana/spl-token');
const utils = require('../utils.ts');

exports.command = "balance [address] [spl-mint]";
exports.describe = "Show the [token] balance of an address";
exports.builder = {};
exports.handler = async (argv) => {
    const conn = utils.rpcConnection;
    let address = argv.address;
    if (!address) {
        address = utils.signer.publicKey;
    }
    const addr = utils.toPubKey(address);
    if (!argv.splMint) {
        // get sol balance
        conn.getBalance(addr).then((lamports) => {
            console.log(lamports / LAMPORTS_PER_SOL, "SOL");
        });
    } else {
        // get token balance
        let tokenInfo = await utils.resolveTokenSymbol(conn, argv.splMint);
        let mintKey = utils.toPubKey(tokenInfo.address);
        const ata = await getAssociatedTokenAddress(mintKey, addr);
        try {
            const acct = await getAccount(conn, ata);
            if (tokenInfo) {
                console.log(Number(acct.amount) / (10 ** tokenInfo.decimals), tokenInfo.symbol);
            } else {
                console.log(Number(acct.amount) / (10 ** tokenInfo.decimals));
            }
            if (acct.delegate !== null) {
                console.log(`Delegation: ${Number(acct.delegatedAmount) / (10 ** tokenInfo.decimals)} to ${acct.delegate}`);
            }
        } catch (e) {
            console.log("Could not get token account", e);
        }
    }
}