const MINING_DIFFICULTY = process.env.MINING_DIFFICULTY || 3;
const MINE_RATE = process.env.MINE_RATE || 3000;
const INITIAL_BALANCE = process.env.INITIAL_BALANCE || 500;
const MINING_REWARD = process.env.MINING_REWARD || 50;
const P2P_PORT = process.env.P2P_PORT || 5001;
const PEERS = process.env.PEERS ? process.env.PEERS.split(",") : [];
const HTTP_PORT = process.env.HTTP_PORT || 3001;

module.exports = {
    MINING_DIFFICULTY,
    MINE_RATE,
    INITIAL_BALANCE,
    MINING_REWARD,
    P2P_PORT,
    PEERS,
    HTTP_PORT
};