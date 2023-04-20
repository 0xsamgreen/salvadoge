import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import './App.css';
import AIGeneratedNFT from './AIGeneratedNFT.json';
import { initializeWeb3Client } from './web3Util';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your actual contract address

function App() {
  const [setting, setSetting] = useState('');
  const [verb, setVerb] = useState('');
  const [images, setImages] = useState([]);

  const generateImages = async () => {
    try {
      const response = await axios.post('http://localhost:3001/generate-images', {
        setting: setting,
        verb: verb,
      });
  
      const newImages = response.data.map((image) => ({
        id: image.id,
        url: image.url,
      }));
  
      setImages(newImages);
    } catch (error) {
      console.error('Error generating images:', error);
    }
  };

  const mintNFT = async (image) => {
    const { web3, account } = await initializeWeb3Client();

    if (!web3 || !account) {
      console.error('Error initializing Web3 or MetaMask account.');
      return;
    }

    try {
      // Fetch the contract instance
      const contractInstance = new web3.eth.Contract(AIGeneratedNFT, contractAddress);

      // Call the backend API to mint the NFT
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: image.id,
          account: account,
          contractABI: AIGeneratedNFT,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { metadataUrl, signature, nonce, messageHash } = data;

        // Call the smart contract mintWithSignature method with the signed data
        await contractInstance.methods
          .mintWithSignature(account, metadataUrl, signature, nonce)
          .send({ from: account, gas: 500000 });

        console.log('NFT minted! Metadata URL:', metadataUrl);
      } else {
        console.error('Error minting NFT:', response.statusText);
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div className="App">
      <h1>Salvadoge 0.1</h1>
      <div className="inputs">
        <input
          type="text"
          placeholder="Setting"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
        />
        <input
          type="text"
          placeholder="Verb"
          value={verb}
          onChange={(e) => setVerb(e.target.value)}
        />
      </div>
      <button onClick={generateImages}>Generate</button>
      <div className="images">
        {images.map((image, index) => (
          <div key={index}>
          <img src={image.url} alt={'Generated image ${index + 1}'} />
          <button onClick={() => mintNFT(image)}>Mint</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;