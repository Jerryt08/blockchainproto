//Cryptography library to apply digital signatures, public and private keys.
const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

//Elliptic curve cryptography
const ec = new EC('secp256k1');

//Verifies the signature with the Elliptic Curve Cryptography.
const verifySignature = ({publicKey, data, signature}) => {
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = {ec, verifySignature, cryptoHash };