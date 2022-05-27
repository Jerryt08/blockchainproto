const crypto = require('crypto');

//Encrypts the provided inputs using the SHA 256 hashing algorithm and returns the hash value.
const cryptoHash=(...inputs)=>{
    const hash = crypto.createHash('sha256');

    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash;