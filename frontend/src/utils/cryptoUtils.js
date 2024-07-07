const CryptoJS = require('crypto-js');

const generateAESKey = () => {
    const key = CryptoJS.lib.WordArray.random(32);
    return key.toString(CryptoJS.enc.Hex);
};

const aesEncrypt = (text, keyHex) => {
    const key = CryptoJS.enc.Hex.parse(keyHex);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv });
    const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const ivHex = iv.toString(CryptoJS.enc.Hex);
    return ivHex + encryptedBase64;
};

const aesDecrypt = (cipherTextWithIv, keyHex) => {
    const key = CryptoJS.enc.Hex.parse(keyHex);

    const ivHex = cipherTextWithIv.slice(0, 32);
    const encryptedBase64 = cipherTextWithIv.slice(32);

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const cipherText = CryptoJS.enc.Base64.parse(encryptedBase64);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: cipherText },
        key,
        { iv: iv }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}

const deriveKeyFromPassword = (password) => {
    const fixedSalt = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef');
    const key = CryptoJS.PBKDF2(password, fixedSalt, {
        keySize: 256 / 32,
        iterations: 100000,
    });
    return key.toString(CryptoJS.enc.Hex);
};

export {
    generateAESKey,
    aesEncrypt,
    aesDecrypt,
    deriveKeyFromPassword,
}