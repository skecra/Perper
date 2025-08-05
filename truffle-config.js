const HDWalletProvider = require('@truffle/hdwallet-provider');

// Tvoj Metamask seed (12 riječi tačno onako kako pišu, odvojene razmacima)
const mnemonic = "breeze oblige april planet penalty acid very van barely bulb jungle margin";

// Tvoj Alchemy RPC URL
const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/V6GAqWTo2VvfxpLiykza9";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, alchemyUrl),
      network_id: 11155111,
      gas: 4000000,          // manji gas limit
      gasPrice: 20000000000, // 20 Gwei
      confirmations: 1,
      timeoutBlocks: 200,
      skipDryRun: true
    }

  },
  compilers: {
    solc: {
      version: "0.5.16",
    },
  },
};
