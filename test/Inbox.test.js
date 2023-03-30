// contract test code will go here

const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let accounts;
let inbox;
const DEFAULT_MESSAGE = "Hi there!";

beforeEach(async () => {
  // --- Get list of all accounts ---
  /*
  // Instead of promise, use async-await
  web3.eth
    .getAccounts()
    .then((fetchedAccounts) => console.log(fetchedAccounts));
    */
  accounts = await web3.eth.getAccounts();

  // --- Use an account to deploy the contract ---
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [DEFAULT_MESSAGE],
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("When contract `Inbox` is deployed", () => {
  it("Deployment should be success.", () => {
    assert.ok(inbox._address);
  });

  it("Has default value set.", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, DEFAULT_MESSAGE);
  });

  it("Should be able to set new message.", async () => {
    await inbox.methods.setMessage("Bye bye !!!").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "Bye bye !!!");
  });
});
