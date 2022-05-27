const Transaction = require('./transaction');
class TransactionPool{
    constructor() {
        this.transactionMap = {};
    }
    //Empties the transaction pool.
    clear(){
        this.transactionMap = {};
    }
    // Set the given transaction in the transaction map.
    setTransaction(transaction){
        this.transactionMap[transaction.id] = transaction;
    }
    // Sets the transaction map.
    setMap(transactionMap){
        this.transactionMap = transactionMap;
    }
    // Verifies if there is an existing transaction in the transaction map.
    existingTransaction({ inputAddress }){
        const transactions = Object.values(this.transactionMap);

        return transactions.find(transaction => transaction.input.address == inputAddress);
    }
    // Validates the transactions in the map by calling the validTransaction function.
    validTransactions(){
        return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
        );


    }
    // Deletes transactions from the transaction pool.
    clearBlockchainTransactions({ chain }){
        for(let i=1; i<chain.length; i++){
            const block = chain[i];

            for(let transaction of block.data){
                if(this.transactionMap[transaction.id]){
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = TransactionPool;