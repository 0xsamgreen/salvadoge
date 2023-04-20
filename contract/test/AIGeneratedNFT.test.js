const { expect } = require("chai");
const { ethers } = require("hardhat");

const BASE_URI = "https://bafybeia5rgv7bty6pu2kko3fhwi4jc6fl3tvz3g7uhiefkfedg2m6my6cy.ipfs.nftstorage.link/ipfs/bafybeia5rgv7bty6pu2kko3fhwi4jc6fl3tvz3g7uhiefkfedg2m6my6cy/";

describe("AIGeneratedNFT", () => {
  let AIGeneratedNFT;
  let nft;
  let owner;
  let addr1;

  beforeEach(async () => {
    AIGeneratedNFT = await ethers.getContractFactory("AIGeneratedNFT");
    [owner, addr1] = await ethers.getSigners();
    nft = await AIGeneratedNFT.deploy("/", 1000);
  });

  it("Should mint a new token", async () => {
    await nft.connect(owner).mint(addr1.address, `${BASE_URI}0`);
  
    // Check if the token was minted and assigned to addr1
    const balance = await nft.balanceOf(addr1.address, 0);
    expect(balance).to.equal(1);
  
    // Check the token URI
    const tokenURI = await nft.uri(0);
    expect(tokenURI).to.equal(`${BASE_URI}0`);
  });
 
  it("Should set royalty fee", async () => {
    await nft.connect(owner).setRoyaltyFee(2000);
  
    // Perform a royaltyInfo query
    const [, royaltyAmount] = await nft.royaltyInfo(0, 10000);
    expect(royaltyAmount).to.equal(2000); // 2000 basis points = 20% of 10000
  });
  
  it("Should return the correct token URI", async () => {
    await nft.connect(owner).mint(addr1.address, `${BASE_URI}0`);
  
    const tokenURI = await nft.uri(0);
    expect(tokenURI).to.equal(`${BASE_URI}0`);
  });

  it("Should mint a token using a meta transaction", async () => {
    // Sign a message for minting a new token
    const nonce = 0;
    const messageHash = ethers.utils.solidityKeccak256(
      ["address", "string", "uint256", "address"],
      [addr1.address, `${BASE_URI}0`, nonce, nft.address]
    );
    const signature = await owner.signMessage(ethers.utils.arrayify(messageHash));
  
    // Mint the token with the meta transaction
    await nft.mintWithMetaTransaction(addr1.address, `${BASE_URI}0`, nonce, signature);
  
    // Check if the token was minted and assigned to addr1
    const balance = await nft.balanceOf(addr1.address, 0);
    expect(balance).to.equal(1);
  
    // Check the token URI
    const tokenURI = await nft.uri(0);
    expect(tokenURI).to.equal(`${BASE_URI}0`);
  });
  
  
});
