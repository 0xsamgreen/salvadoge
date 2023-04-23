import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AIGeneratedNFT_ABI from './AIGeneratedNFT.json';
import { initializeWeb3Client } from './web3Util';
import './App.css';
import './spinner.css'; 

const contractAddress = '0x319D0c95f06499f29775D370a042a4f72dAb885d'; 

function App() {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([
    { id: null, url: null },
    { id: null, url: null },
    { id: null, url: null }
  ]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [mintingStatus, setMintingStatus] = useState('');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    async function init() {
      const { account } = await initializeWeb3Client();
      setAccount(account);
    }
    
    setDescription("shiba inu");
    init();
  }, []);

  useEffect(() => {
    if (!account) {
      return;
    }
    generateImages();
  }, [account]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const generateImages = async () => {
    setLoading(true);
    setMintingStatus('');
    try {
      const response = await axios.post('http://localhost:3001/generate-images', {
        description: description,
      });
  
      const newImages = response.data.map((image) => ({
        id: image.id,
        url: image.url,
      }));
  
      setImages(newImages);
      setGenerated(true); // Add this line
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
  
        const txReceipt = await contractInstance.methods
          .mintWithSignature(account, metadataUrl, signature, nonce)
          .send({ from: account, gas: 500000 });
      
        const txUrl = `https://sepolia.etherscan.io/tx/${txReceipt.transactionHash}`;
        setMintingStatus(`${txUrl}`);

        console.log('NFT minted:', response.statusText);
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
      <p className="subtitle">
        An <a href="https://github.com/0xsamgreen/web3-nft-ai" target="_blank" rel="noopener noreferrer">open-source</a> experimental NFT project by <a href="https://semiotic.ai/" target="_blank" rel="noopener noreferrer">Semiotic Labs</a>.
      </p>
      {account && <div className="wallet-info">Connected to: {account.slice(0, 10)}...</div>}

      <div className="inputs">
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={generateImages}>Generate</button> 
      </div>

      <div className="images">
        {images.map((image, index) => (
          <div key={index} className="image-wrapper">
            {loading && <div className="spinner"></div>}
            {image.url ? (
              <img src={image.url} alt={`Generated ${index + 1}`} />
            ) : (
              <div className="default"></div>
            )}
            {generated && <button onClick={() => mintNFT(image)}>Mint</button>}
          </div>
        ))}
      </div>

      <a className="minting-status" href={mintingStatus} target="_blank" rel="noopener noreferrer">
        {mintingStatus}
      </a>
    </div>
  );
}

export default App;   
      
      
      