// deploy code will go here

const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider(
  "<Account mnemonic from Metamask>",
  "Testnet URL from Infura account"
);
const Web3 = require("web3");
const web3 = new Web3(provider);
const { abi, evm } = require("./compile");

let DEFAULT_MESSAGE = "Hi there !!!";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from Metamask account:", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [DEFAULT_MESSAGE],
    })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("Contract deployed at address:", result._address);
  provider.engine.stop();
};
deploy();
