const express = require("express");
const bodyParser = require("body-parser");
const Blockchain =  require("../blockchain");
const P2pServer = require("./p2p-server");
const Wallet = require("../wallet");
const TransactionPool  = require("../wallet/transaction-pool");
const Miner = require("./miner");

const { HTTP_PORT, P2P_PORT, PEERS } = require("../config");

const app = express();

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
    res.json(bc.chain);
});

app.post("/mine", (req, res) => {
   const block = bc.addBlock(req.body.data);
   console.log(`New block added: ${block.toString()}`);
   p2pServer.syncChains();
   res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
    res.json(tp.transactions);
});

app.post("/transact", (req, res) => {
    const { recipient, amount, fee } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, fee, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect("/transactions");
});

app.get("/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

app.post("/mine-transactions", (req, res) => {
    const { feeCollector } = req.body
    const block = miner.mine(feeCollector);
    console.log(`New block added: ${block.toString()}`);
    res.redirect("/blocks");
});

app.get("/balance", (req, res) => {
    res.json({ publicKey: wallet.publicKey, "balance": wallet.calculateBalance(bc) });

    console.log(wallet.toString());
});


app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen(P2P_PORT, PEERS);