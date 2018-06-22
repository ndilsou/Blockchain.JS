const WebSocket = require("ws");

const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS',
    list_peers: "LIST_PEERS"
};


class P2pServer {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
        this.server = null
    }

    listen(p2p_port, peers) {
        this.server = new WebSocket.Server({ port: p2p_port });
        this.server.on("connection", socket => this.connectSocket(socket));

        this.connectToPeers(peers);

        console.log(`Listening for peer-to-peer connections on: ${p2p_port}`)
    }

    connectToPeers(peers) {
        peers.forEach(peer => {
            const socket = new WebSocket(peer);

            socket.on("open", () => this.connectSocket((socket)));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log("Socket connected");

        this.messageHandler(socket);

        this.sendChain(socket)
    }

    messageHandler(socket) {
        socket.on("message", message => {
           const data = JSON.parse(message);

           switch (data.type) {
               case MESSAGE_TYPES.chain:
                   this.blockchain.replaceChain(data.chain);
                   break;

               case MESSAGE_TYPES.transaction:
                   this.transactionPool.updateOrAddTransaction(data.transaction);
                   break;

               case MESSAGE_TYPES.clear_transactions:
                   this.transactionPool.clear();
                   break;

           }

        });
    }



    sendTransaction(socket, transaction) {
        P2pServer.send(socket, JSON.stringify({
                type: MESSAGE_TYPES.transaction,
                transaction
        }));
    }

    sendChain(socket) {
        /* TODO: implement heartbeat check ->*/
        P2pServer.send(socket, JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
        }));


    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => {
            P2pServer.send(socket, JSON.stringify({type: MESSAGE_TYPES.clear_transactions}));
        });
    }

    static errorHandler(error) {
        if (error !== undefined) {
            console.log(error);
        }
    }

    static send(socket, message) {
        if (socket !== this.server && socket.readyState === WebSocket.OPEN) {
            socket.send(message, P2pServer.errorHandler);
        }
    }
}

module.exports = P2pServer;
