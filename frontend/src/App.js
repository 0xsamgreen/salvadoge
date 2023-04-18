import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import './App.css';
import AIGeneratedNFT from './AIGeneratedNFT.json';
import { ethers } from 'ethers';



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
  
  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const account = await signer.getAddress();
        return { provider, signer, account };
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }
  
    return null;
  };
  

  const mintNFT = async (image) => {
    const { provider, signer, account } = await initializeWeb3();
  
    if (!provider || !signer || !account) {
      console.error('Error initializing Web3 or MetaMask account.');
      return;
    }
  
    try {
      // Here, we'll call the backend API to mint the NFT
      const response = await axios.post('http://localhost:5000/api/mint', { image, account });
      const { tokenId, contractAddress } = response.data;
  
      // Now, we'll ask the user to confirm the minting transaction in MetaMask
      const contract = new ethers.Contract(contractAddress, AIGeneratedNFT.abi, signer);
  
      const gas = await contract.estimateGas.mint(account, tokenId);
      const result = await contract.mint(account, tokenId, { gasLimit: gas });
  
      if (result.status) {
        console.log('Successfully minted NFT with token ID:', tokenId);
      } else {
        console.error('Error minting NFT:', result);
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };  
  
  return (
    <div className="App">
      <h1>AI-Generated NFTs</h1>
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
          <img src={image.url} alt={`Generated image ${index + 1}`} />
          <button onClick={() => mintNFT(image)}>Mint</button>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
