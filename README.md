# Salvadoge

Salvadoge is a generative AI NFT project that allows users to create and mint NFTs based on generated images using user-provided descriptions.

## Prerequisites

Make sure you have the following tools installed on your system:

1. Node.js (v16.0.0): You can download and install the specific version from the [official Node.js website](https://nodejs.org/en/download/releases/) or use a version manager like `nvm` to manage multiple Node.js versions on your machine. To install Node.js v16.0.0 using `nvm`, you can run:

```
nvm install 16.0.0
nvm use 16.0.0
```

## External Services

This project relies on the following external services:

1. **Infura**: Used to store NFT images on IPFS.
2. **Alchemy**: Provides an RPC to connect to the Sepolia testnet.
3. **OpenAI DALL-E API**: Used for image generation based on the provided description.

It is possible to modify the code to run entirely on your local machine, but that is not how it is currently configured.

### API Keys

In order to use this project, you need to obtain API keys for Infura, Alchemy, and OpenAI's DALL-E. After collecting the keys, you should set them in a `.env` file in the project root directory.

You will also need to store your NFT project's private key on the backend. This will be used to sign the NFT metadata for the user to submit.

For example, your `.env` file should look like this:

```
CONTRACT_ADDRESS=
BACKEND_PRIVATE_KEY=
ALCHEMY_API_KEY=
ALCHEMY_RPC_URL=
INFURA_PROJECT_ID=
INFURA_PROJECT_SECRET=
OPENAI_API_KEY=
```

**Note**: Be sure to never share or expose your API keys publicly. Always keep them secure and treat them like passwords. Do not commit your `.env` file to the repository.


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
node index.mjs
```

2. Build and deploy the smart contract:

In a separate terminal, navigate to the `contract` directory and deploy the smart contract using Hardhat:

```
cd contract
npx hardhat compile
cp artifacts/contracts/AIGeneratedNFT.sol/AIGeneratedNFT.json ../frontend/src
cp artifacts/contracts/AIGeneratedNFT.sol/AIGeneratedNFT.json ../backend
npx hardhat run --network sepolia scripts/deploy.js
```

Note the contract address output after deployment and update the `contractAddress` variable in `frontend/Apps.js` and the `CONTRACT_ADDRESS variable` in your `.env` file.

3. Update the frontend with the deployed contract address:

Open `frontend/src/App.js` in your favorite code editor and update the `contractAddress` constant with the address obtained in the previous step.

4. Start the frontend development server:

```
cd frontend
yarn run start
```

The frontend should now be running on `http://localhost:3000`.

5. Connect your MetaMask wallet to the app and start generating and minting NFTs!


## License

This project is open-source and available under the [MIT License](LICENSE).

## Disclaimer

This project is for educational purposes only and should not be deployed or used in environments where real (non-testnet) tokens are involved. The code contains security vulnerabilities, including but not limited to:

- Front-end users can mint their images multiple times.
- The backend signing key is stored on the server, which is an insecure practice.
- There may be other unknown vulnerabilities.

By using this project, you acknowledge that you are doing so at your own risk and will not hold the authors or contributors liable for any potential security breaches or losses that may occur as a result of using this code.

