const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, '../src/AIGeneratedNFT.json');
const artifactPath = path.resolve(__dirname, './artifacts/contracts/nft.sol/AIGeneratedNFT.json');

fs.copyFile(artifactPath, srcPath, (err) => {
  if (err) {
    console.error('Error copying ABI:', err);
  } else {
    console.log('ABI successfully copied to src directory.');
  }
});
