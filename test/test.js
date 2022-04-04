const { web3 } = require("hardhat");

const PuzzleWalletFactory = artifacts.require("PuzzleWalletFactory");

contract("puzzlefactory", (accounts) => {
    it("test deploym", async () => {
        let puzz = await PuzzleWalletFactory.deployed();
        await puzz.createInstance(accounts[0], {value: web3.utils.toWei(String(0.001), "ether")});
        //console.log(result);
    })
})