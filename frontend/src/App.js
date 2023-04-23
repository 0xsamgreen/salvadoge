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
  const [generated, setGenerated] = useState(false);
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [web3AccountInfo, setWeb3AccountInfo] = useState(null);

  const appendToConsole = (message) => {
    setConsoleMessages((prevMessages) => [message, ...prevMessages]);
  };

  useEffect(() => {
    async function init() {
      const web3AccountInfo = await initializeWeb3Client();
      setWeb3AccountInfo(web3AccountInfo);
      setAccount(web3AccountInfo.account);
      appendToConsole(`> Connected to: ${web3AccountInfo.account}`);
    }

    setDescription("shiba inu");
    init();
  }, []);

  // Needed this to prevent double generation of images on page load
  useEffect(() => {
    if (!account) {
      return;
    }
    generateImages();
  }, [account]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const generateImages = async () => {
    setLoading(true);
    try {
      appendToConsole(`> Generating images with description: "${description}"`); 
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
      appendToConsole(`> Error generating images: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async (image) => {
    const { web3, account } = web3AccountInfo;
  
    if (!web3 || !account) {
      appendToConsole(`> Error initializing Web3 or MetaMask account.`)
      return;
    }
  
    try {
      // Fetch the contract instance
      appendToConsole(`> Getting contract ABI.`)
      const contractInstance = new web3.eth.Contract(AIGeneratedNFT_ABI.abi, contractAddress);
  
      // Call the backend API to get the message hash and nonce
      appendToConsole(`> Requesting that backend stores the NFT to IPFS.`);
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
  
        appendToConsole(`> Submitting transaction to blockchain.`);
        const txReceipt = await contractInstance.methods
          .mintWithSignature(account, metadataUrl, signature, nonce)
          .send({ from: account, gas: 500000 });
      
        appendToConsole(`> NFT minted: ${response.statusText}`)

        const txUrl = `https://sepolia.etherscan.io/tx/${txReceipt.transactionHash}`;
        appendToConsole(`> Blockchain explorer result: ${txUrl}`);
      } else {
        appendToConsole(`> Error minting NFT: ${response.statusText}`)
      }
    } catch (error) {
      appendToConsole(`> Error minting NFT: ${error}`)
    }
  };  

  const ConsoleArea = () => {
    return (
      <div className="console">
        {consoleMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    );
  };  

  return (
    <div className="App">
      <h1>Salvadoge</h1>
      <p className="subtitle">
        An <a href="https://github.com/0xsamgreen/web3-nft-ai" target="_blank" rel="noopener noreferrer">open-source</a> generative AI NFT project.
      </p>

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
      <ConsoleArea />
    </div>
  );
}

export default App;   
      
      
      