const { TokenListProvider } = require("@solana/spl-token-registry");
const { getMint } = require("@solana/spl-token");
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const nconf = require('nconf');

const homedir = require('os').homedir();

let tokens = [];
let tokenListPromise = new TokenListProvider().resolve();
tokenListPromise.then(x => {
    tokens = x.getList();
});

exports.HOME = homedir;
exports.CONFIG_PATH = `${homedir}/.config/solcli/solcli.json`;
exports.CONFIG_DIR = `${homedir}/.config/solcli`;

nconf.file({ file: `${homedir}/.config/solcli/solcli.json` });
exports.RPC_URL = nconf.get("rpc");
exports.getConfig = nconf.get.bind(nconf);

exports.toPubKey = (s) => {
    return new PublicKey(s);
}
exports.resolveTokenSymbol = async function (conn, symbol) {
    await tokenListPromise;
    // try to resolve the mint as a symbol
    let tokenInfo = tokens.filter(x => x.symbol == symbol && x.chainId === 101)[0];
    if (tokenInfo === undefined) {
        // find token by address
        tokenInfo = tokens.filter(x => x.address == symbol && x.chainId === 101)[0];
    }
    if (tokenInfo === undefined) {
        // resolve on chain
        const mint = await getMint(conn, symbol);
        tokenInfo = {address: symbol, decimals: mint.decimals};
    }
    return tokenInfo;
}
exports.readKeypairFromFile = function (path) {
    let keypair = fs.readFileSync(path.replace(/\$([A-Z_]+[A-Z\d_]*)|\${([A-Z\d_]*)}/ig, (_, a, b) => process.env[a || b]));
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypair)));
}
exports.rpcConnection = new Connection(
    exports.RPC_URL,
    "confirmed",
);
let keypairFile = nconf.get("wallets")[nconf.get("wallet")];
exports.signer = exports.readKeypairFromFile(keypairFile);