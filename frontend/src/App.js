import React, { useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import './App.css';
import AIGeneratedNFT from './AIGeneratedNFT.json';

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
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        return { web3, account };
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }

    return null;
  };

  const mintNFT = async (image) => { const { web3, account } = await initializeWeb3();

    if (!web3 || !account) {
      console.error('Error initializing Web3 or MetaMask account.');
      return;
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
          <img src={image.url} alt={`Generated image ${index + 1}`} />
          <button onClick={() => mintNFT(image)}>Mint</button>
        </div>
      ))}
      </div>
    </div>
  );
}

export default App;
