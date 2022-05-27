const Transaction = require('./transaction');
const {STARTING_BALANCE} = require('../config');
const {ec, cryptoHash } = require('../util');


class Wallet{
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    // Signs and returns the encrypted data.
    sign(data) {
        return this.keyPair.sign(cryptoHash(data))//
    }
    // Receives a recipient, amount and chain.
    //Creates a new transaction if the amount to send is not greater than the wallet balance.
    createTransaction({ recipient, amount, chain }){

        if(chain){
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }

        if (amount > this.balance){
            throw new Error('Amount exceeds balance');
        }
        return new Transaction({ senderWallet: this, recipient, amount });
    }
    /*
     Calculates and returns the total balance of the given address by
     iterating through all of the blocks in the chain and verifying the transaction outputs.
    */
    static calculateBalance({ chain, address }){
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for(let i=chain.length - 1 ; i>0; i--){
            const block = chain[i];

            for(let transaction of block.data){

                if(transaction.input.address === address){
                    hasConductedTransaction = true;
                }
                const addressOutput = transaction.outputMap[address];

                if(addressOutput){
                    outputsTotal = outputsTotal + addressOutput;
                }
            }
            if(hasConductedTransaction){
                break;
            }

        }

        return hasConductedTransaction ?
        outputsTotal:
         STARTING_BALANCE + outputsTotal;

    }
};
module.exports = Wallet;