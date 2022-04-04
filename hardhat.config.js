/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-truffle5");
module.exports = {
  solidity: {
    compilers : [
      {
        version: "0.6.7",
      },
      {
        version: "0.6.0",
      },
    ],
  },
};
