const DIFFICULTY = 3;
const MINE_RATE = 3000;
const INITIAL_BALANCE = 500;
const MINING_REWARD = 50;
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];
const HTTP_PORT = process.env.HTTP_PORT || 3001;

module.exports = {
    DIFFICULTY,
    MINE_RATE,
    INITIAL_BALANCE,
    MINING_REWARD,
    P2P_PORT,
    PEERS,
    HTTP_PORT
};