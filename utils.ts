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
nconf.defaults({
    "wallets": {
        "default": `${homedir}/.config/solana/id.json`
    },
    "wallet": "default",
    "rpc": "https://api.mainnet-beta.solana.com/"
});
exports.RPC_URL = nconf.get("rpc");
exports.getConfig = nconf.get.bind(nconf);

function readKeypairFromFile(path) {
    let keypair = fs.readFileSync(path.replace(/\$([A-Z_]+[A-Z\d_]*)|\${([A-Z\d_]*)}/ig, (_, a, b) => process.env[a || b]));
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypair)));
}
async function resolveTokenSymbol(conn, symbol) {
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
function resolveWalletSlug(slug) {
    const wallets = nconf.get("wallets");
    const path = wallets[slug];
    if (!path) return slug;
    return exports.readKeypairFromFile(path).publicKey.toBase58();
}
function toPubKey(s) {
    return new PublicKey(resolveWalletSlug(s));
}
exports.rpcConnection = new Connection(
    exports.RPC_URL,
    "confirmed",
);
exports.resolveWalletSlug = resolveWalletSlug;
exports.resolveTokenSymbol = resolveTokenSymbol;
exports.readKeypairFromFile = readKeypairFromFile;
exports.toPubKey = toPubKey;

let keypairFile = nconf.get("wallets")[nconf.get("wallet")];
exports.signer = exports.readKeypairFromFile(keypairFile);