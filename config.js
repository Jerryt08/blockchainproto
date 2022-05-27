// Average time that the blockchain wants the blocks to be mined at.
const MINE_RATE = 1000;

// Adjustable difficulty for the miners
const INITIAL_DIFFICULTY = 3;

// Default genesis block data
const GENESIS_DATA = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []

};

// Starting amount of coins for new wallets.
const STARTING_BALANCE = 1000;

// Address that rewards the miners.
const REWARD_INPUT = { address: '*authorized-reward*' };

// Reward for mining blocks
const MINING_REWARD = 50;

module.exports = { 
    GENESIS_DATA, 
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};