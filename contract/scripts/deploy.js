require('dotenv').config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying the contract with the account:", deployer.address);

  const royaltyFee = 1000; // Set the royalty fee here, e.g. 1000 for 10% royalty fee

  const ContractFactory = await ethers.getContractFactory("AIGeneratedNFT");
  const contract = await ContractFactory.deploy(process.env.METADATA_URI, royaltyFee);

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
