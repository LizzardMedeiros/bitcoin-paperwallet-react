import secureRandom from 'secure-random';
import { ec } from 'elliptic';
import sha256 from 'js-sha256';
import ripemd160 from 'ripemd160';
import base58 from 'bs58';

const Wallet = {
  createPublicAddress: function(publicKeyHash) {
    const step = Buffer.from("00" + publicKeyHash, 'hex');

    const checksum = sha256(
      Buffer.from(sha256(step), 'hex')
    ).substring(0, 8);

    return base58.encode(Buffer.from(
      step.toString('hex') + checksum,
    'hex'));
  },
  generateKey: function() {
    const ecdsa = new ec('secp256k1');
    const max = Buffer.from(
      'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140',
      'hex'
    );
    let privateKey = secureRandom.randomBuffer(32);
    let isInvalid = !(Buffer.compare(max, privateKey) === 1);
    while(isInvalid) {
      privateKey = secureRandom.randomBuffer(32);
      isInvalid = !(Buffer.compare(max, privateKey) === 1);
    }
    const pKey = ecdsa.keyFromPrivate(privateKey);
    const hash = sha256(Buffer.from(pKey.getPublic('hex'), 'hex'));
    
    const publicKeyHash = new ripemd160().update(Buffer.from(
      hash,
      'hex'
    ))
      .digest()
      .toString('hex');

    return {
      publicKey: this.createPublicAddress(publicKeyHash),
      privateKey: privateKey.toString('hex')
    };
  }
};

export default Wallet;
