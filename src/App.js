import React from 'react';
import Wallet from './utils/Wallet'
import './App.css';

function App() {
  const {publicKey, privateKey} = Wallet.generateKey();
  return (
    <div className="App">
      <p>Public: { publicKey }</p>
      <p>Private: { privateKey }</p>
    </div>
  );
}

export default App;
