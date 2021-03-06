const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');


class Blockchain{

    constructor(){
        this.chain = [Block.genesis()];
    }

    /*
     Adds a new block to the chain by calling the mineBlock function
     and pushing the resulting block to the chain.
    */
    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });
        this.chain.push(newBlock);
    }

    /*
     Verifies that the incoming chain is valid and updates the chain in the network by replacing
     the previous chain with a new valid chain.
    */
    replaceChain(chain, validateTransactions, onSuccess){
        if(chain.length <= this.chain.length){
            console.error('The incoming chain must be longer');
            return;
        }
        if(! Blockchain.isValidChain(chain)){
            console.error('The incoming chain must be valid');
            return;
        }

        if(validateTransactions && !this.validTransactionData({ chain })){
            console.error('The incoming chain has invalid data');
            return;
        }

        if(onSuccess) onSuccess();
        console.log('replacing chain with', chain);
        this.chain = chain;
    }

    /*
    Iterates through all of the blockchain and verifies that the rewards for mining and 
    transaction amounts are valid and that there are no identical transactions in the chain.
    */
    validTransactionData({ chain }){
        for(let i = 1; i < chain.length; i++){
            const block = chain[i];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;

            for(let transaction of block.data){
                if(transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount += 1;

                    if(rewardTransactionCount > 1){
                        console.error('Miner rewards exceed limit');
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] != MINING_REWARD){
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                }else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error('Invalid Transaction');
                        return false;
                    }
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance){
                        console.error('Invalid input amount');
                        return false;
                    }

                    if(transactionSet.has(transaction)){
                        console.error('An identical transaction appears more than once in the block');
                        return false;
                    }else{
                        transactionSet.add(transaction);
                    }
                }
            }

        }
        return true;
    }

    /*
     Receives a chain and verifies if it is valid by verifying each block with the previous block.
     Returns true if the chain is valid.
    */
    static isValidChain(chain){
        //If the first block of the chain is not the genesis block, return false
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            return false;
        };
        //Loop through the chain
        for(let i = 1; i < chain.length; i++){
            //JS destructure syntax
            const {timestamp, lastHash, hash, nonce, difficulty, data} = chain[i];

            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            
            if(lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            //Verifies that the hash is valid
            if (hash !== validatedHash) return false;

            if (Math.abs(lastDifficulty - difficulty) > 1 ) return false;

        }
        return true;



    }

}
module.exports = Blockchain;