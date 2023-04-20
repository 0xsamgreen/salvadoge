import Web3 from 'web3';

export async function initializeWeb3Client() {
  if (window.ethereum) {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      return { web3, account };
    } catch (error) {
      console.error('Error initializing Web3:', error);
    }
  } else {
    console.error('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  return { web3: null, account: null };
}
