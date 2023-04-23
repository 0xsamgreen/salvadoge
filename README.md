# Salvadoge

Salvadoge is an open-source generative AI NFT project that allows users to create and mint NFTs based on generated images using user-provided descriptions.

## Prerequisites

Make sure you have the following tools installed on your system:

1. Node.js (v16.0.0): You can download and install the specific version from the [official Node.js website](https://nodejs.org/en/download/releases/) or use a version manager like `nvm` or `n` to manage multiple Node.js versions on your machine. To install Node.js v16.0.0 using `nvm`, you can run:

```
nvm install 16.0.0
nvm use 16.0.0
```

## Installation

1. Clone the repository:

```
git clone git@github.com:0xsamgreen/web3-nft-ai.git
cd salvadoge
```

2. Install dependencies for the backend, contract, and frontend:

```
cd backend
yarn install

cd ../contract
yarn install

cd ../frontend
yarn install
```

## Running the Project

1. Start the backend server:

```
cd backend
yarn start
```

2. Deploy the smart contract:

In a separate terminal, navigate to the `contract` directory and deploy the smart contract using Hardhat:

```
cd contract
npx hardhat run scripts/deploy.js --network localhost
```

Note the contract address output after deployment.

3. Update the frontend with the deployed contract address:

Open `frontend/src/App.js` in your favorite code editor and update the `contractAddress` constant with the address obtained in the previous step.

4. Start the frontend development server:

```
cd frontend
yarn start
```

The frontend should now be running on `http://localhost:3000`.

5. Connect your MetaMask wallet to the app and start generating and minting NFTs!


## License

This project is open-source and available under the [MIT License](LICENSE).

## Disclaimer

This code is provided for educational purposes only and is not intended for production use. The code may contain vulnerabilities or issues that could lead to loss of funds or other unintended consequences. It is strongly recommended that you do not use this code with non-testnet tokens or deploy it in any environment where real-world assets are involved. Use this code at your own risk.
