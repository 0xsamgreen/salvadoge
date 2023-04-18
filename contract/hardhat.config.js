require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-dependency-compiler");
require('dotenv').config();

const {PRIVATE_KEY, API_KEY} = process.env;

module.exports = {
  solidity: "0.8.1",
  networks: {
    hardhat: {},
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  dependencyCompiler: {
    paths: ["@openzeppelin/contracts/token/ERC1155/IERC1155.sol"],
  },
};
