const PubNub = require('pubnub');

//Pub Nub Service crdentials. Pub Nub provides service to implement a Publisher-Subscriber method.
const credentials = {
    publishKey: 'pub-c-4a727a82-1f8a-4750-a141-6fefbea361b1',
    subscribeKey: 'sub-c-2b8d304c-a54b-11ec-94c0-bed45dbe0fe1',
    secretKey: 'sec-c-MDFkNjg3ZWEtMmE4OC00ZmQ4LTlmZGQtODdjMDU1MmYzMDE3'

};
//Channels that a publisher publishes to, and a subscriber listens to.
const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub{

constructor({blockchain, transactionPool, wallet}){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;

    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channels: Object.values(CHANNELS)});

    this.pubnub.addListener(this.listener());


}
// Listener for the communication of messages.
listener(){
    return {
        message: messageObject => {
            const { channel, message } = messageObject;

            console.log(`Message received. Channel: ${channel}. Message: ${message}`);
            const parsedMessage = JSON.parse(message);
            
            switch(channel){
                case CHANNELS.BLOCKCHAIN:
                    this.blockchain.replaceChain(parsedMessage, true, () => {
                        this.transactionPool.clearBlockchainTransactions({
                            chain: parsedMessage 
                        });
                    });
                    break;
                case CHANNELS.TRANSACTION:
                    if(!this.transactionPool.existingTransaction({
                        inputAddress: this.wallet.publicKey
                    })){
                        this.transactionPool.setTransaction(parsedMessage);
                    }
                    
                    break;
                default:
                    return;
            }

        }
    };
}
//Function for publishing a message to the specified channel.
publish({channel, message}){

    this.pubnub.publish({channel, message});

}
// Broadcasts the blockchain to all the nodes in the network.
broadcastChain(){
    this.publish({
        channel: CHANNELS.BLOCKCHAIN,
        message: JSON.stringify(this.blockchain.chain) 
    });

}
//Broadcasts a transaction to all the nodes in the network.
broadcastTransaction(transaction){
    this.publish({
        channel: CHANNELS.TRANSACTION,
        message: JSON.stringify(transaction)
    });
}

}


module.exports = PubSub;
