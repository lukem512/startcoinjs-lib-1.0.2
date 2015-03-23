// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

var networks = {
  startcoin: {
    magicPrefix: '\x24StartCOIN Signed Message:\n', // length (of magic bytes) then magic bytes
    bip32: {
      public: 0x0291b71e,
      private: 0x0291a3e4
    },
    pubKeyHash: 0x7D,
    scriptHash: 0x05,
    wif: 0xb0,
    dustThreshold: 0, // https://github.com/litecoin-project/startcoin/blob/master/src/main.cpp#L360-L365
    dustSoftThreshold: 100000, // https://github.com/startcoin-project/startcoin/blob/master/src/main.h#L53
    feePerKb: 100000, // https://github.com/startcoin-project/startcoin/blob/master/src/main.cpp#L55
    estimateFee: estimateFee('startcoin')
  }
}

function estimateFee(type) {
  return function(tx) {
    var network = networks[type]
    var baseFee = network.feePerKb
    var byteSize = tx.toBuffer().length

    var fee = baseFee * Math.ceil(byteSize / 1000)
    if (network.dustSoftThreshold == undefined) return fee

    tx.outs.forEach(function(e){
      if (e.value < network.dustSoftThreshold) {
        fee += baseFee
      }
    })

    return fee
  }
}

module.exports = networks
