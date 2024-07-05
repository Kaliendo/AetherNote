import "./App.css";
import React, { useState } from 'react';
import { ReactComponent as LogoSVG } from './logo.svg';

function AESKeyGenerator() {
  const [hexKey, setHexKey] = useState('');

  const generateAESKey = async () => {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const keyBuffer = await window.crypto.subtle.exportKey("raw", key);

    const keyHex = Array.from(new Uint8Array(keyBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');

    setHexKey(keyHex);
  };

  return (
    <div>
      <button onClick={generateAESKey}>Generate AES Key</button>
      <p>Generated AES Key (Hex): {hexKey}</p>
    </div>
  );
}

const App = () => {
  const [text, setText] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');

  const encryptText = async () => {
    try {
      const keyBuffer = Uint8Array.from(encryptionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
      );

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        new TextEncoder().encode(text)
      );

      const encryptedBytes = new Uint8Array(encrypted);
      const result = [...iv, ...encryptedBytes];
      setEncodedText(btoa(String.fromCharCode(...result)));
    } catch (error) {
      console.error("Encryption failed", error);
      setEncodedText("Encryption failed. Check the encryption key and data.");
    }
  };

  const decryptText = async () => {
    try {
      const dataBytes = Uint8Array.from(atob(encodedText), c => c.charCodeAt(0));
      const iv = dataBytes.slice(0, 12);
      const encryptedData = dataBytes.slice(12);

      const keyBuffer = Uint8Array.from(encryptionKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const key = await window.crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv
        },
        key,
        encryptedData
      );

      const decryptedString = new TextDecoder().decode(decrypted);
      setDecryptedText(decryptedString);
    } catch (error) {
      console.error("Decryption failed", error);
      setDecryptedText("Decryption failed. Check the encryption key and data.");
    }
  };

  return (
    <div className="bg-[#171717] min-h-screen flex flex-col items-center justify-center">
      <LogoSVG className="w-[4%] h-[4%] rounded mb-5 fill-white " />
      <h1 className="text-white text-3xl mb-2 font-semibold">AETHERNOTE</h1>
      <p className="text-white mb-3">Send encrypted notes with ease</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Enter your text here"
        className="placeholder:text-black placeholder:text-m bg-[#d7d7d7] text-black text-lg p-4 rounded mb-4"
      />
      <input
        type="text"
        value={encryptionKey}
        onChange={e => setEncryptionKey(e.target.value)}
        placeholder="Enter encryption key here"
        className="bg-[#d7d7d7] text-black text-lg p-2 rounded mb-4"
      />
      <button
        onClick={encryptText}
        className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 px-8 rounded focus:outline-none mt-4 mr-2">
        ENCRYPT
      </button>
      <button
        onClick={decryptText}
        className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-3 px-8 rounded focus:outline-none mt-4">
        DECRYPT
      </button>
      <textarea
        value={encodedText}
        rows="4"
        cols="50"
        readOnly
        placeholder="Encrypted text will appear here in Base64"
        className="bg-[#d7d7d7] text-black text-lg p-4 rounded mb-4"
      />
      <textarea
        value={decryptedText}
        rows="4"
        cols="50"
        readOnly
        className="bg-[#d7d7d7] text-black text-lg p-4 rounded mb-4"
      />
      <AESKeyGenerator />
    </div>
  );
};

export default App;
