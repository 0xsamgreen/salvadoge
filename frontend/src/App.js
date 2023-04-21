import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIGeneratedNFT_ABI from './AIGeneratedNFT.json';
import { initializeWeb3Client } from './web3Util';
import './App.css';
import './spinner.css'; 

const contractAddress = '0x411e067FCc1dc372F43f38C35549DEcF6C05026a'; 

function App() {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  
  useEffect(() => {
    async function init() {
      const { account } = await initializeWeb3Client();
      setAccount(account);
    }
    
    setDescription("banana");
    init();
  }, []);
  
  const generateImages = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/generate-images', {
        description: description,
      });

      const newImages = response.data.map((image) => ({
        id: image.id,
        url: image.url,
      }));

      setImages(newImages);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);
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
      const contractInstance = new web3.eth.Contract(AIGeneratedNFT_ABI.abi, contractAddress);
  
      // Call the backend API to get the message hash and nonce
      const response = await fetch('http://localhost:3001/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageId: image.id,
          account: account,
        }),
      });
 
      if (response.ok) {
        const data = await response.json();
        const { metadataUrl, nonce, signature } = data;
  
        // Use the signature returned by the backend
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
      {account && <div className="wallet-info">Connected to: {account.slice(0, 10)}...</div>}
      <div className="inputs">
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={generateImages}>Generate</button>
      <div className="images">
        {images.map((image, index) => (
          <div key={index} className="image-wrapper">
            {loading && <div className="spinner"></div>}
            <img src={image.url || ''} alt={`Generated image ${index + 1}`} />
            <button onClick={() => mintNFT(image)}>Mint</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;   
      
      
      