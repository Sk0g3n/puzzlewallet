const PuzzleWalletFactory = artifacts.require("PuzzleWalletFactory");

module.exports = function (deployer, network, accounts) {
    deployer.deploy(PuzzleWalletFactory);
}