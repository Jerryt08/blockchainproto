const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util');


class Block{

/*
 Constructor for the Block class. Defines the timestamp, lastHash, hash, data, nonce 
 and difficulty for a specific block.
*/
constructor({timestamp, lastHash, hash, data, nonce, difficulty}){
    
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
    
}
//Returns the data for the first block in the blockchain.
static genesis(){
    return new this(GENESIS_DATA);

}
/*
 Receives the reference to the last block and data to encrypt in the block. Mines the block 
 by encrypting the data, lastHash, timestamp by calling the cryptoHash class for encryption. 
 Returns the new block with its unique properties.
*/
static mineBlock({lastBlock, data}){

    const lastHash = lastBlock.hash;
    let hash, timestamp;
    let {difficulty} = lastBlock;
    let nonce = 0;

    do{
        nonce++;
        timestamp = Date.now();
        difficulty = Block.adjustDifficulty( { originalBlock: lastBlock, timestamp } );
        hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while(hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this({ timestamp, lastHash, data, difficulty, nonce, hash});
}
/*
 Receives a block and timestamp. Makes sure the blocks are being mined at the established mine rate.
 It will return a new dificulty level for the mining of a future block.

*/
static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    if ((timestamp - originalBlock.timestamp) > MINE_RATE ) return difficulty - 1;

    return difficulty + 1;
}

}
module.exports = Block;

