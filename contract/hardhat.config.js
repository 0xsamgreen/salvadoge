require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-dependency-compiler");
require('dotenv').config({ path: '../.env' });

const {ALCHEMY_API_KEY, BACKEND_PRIVATE_KEY} = process.env;

module.exports = {
  solidity: "0.8.1",
  networks: {
    hardhat: {
      ensAddress: false, // Disable ENS support
    },
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${BACKEND_PRIVATE_KEY}`]
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
  "scripts": {
    "test": "npx hardhat test"
  },
  dependencyCompiler: {
    paths: ["@openzeppelin/contracts/token/ERC1155/IERC1155.sol"],
  },
};
