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
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return keyHex;
};

const encryptData = async (text, encryptionKey) => {
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
        return btoa(String.fromCharCode(...result));
    } catch (error) {
        console.error("Encryption failed", error);
        return false
    }
};

const decryptData = async (encodedText, encryptionKey) => {
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
        return decryptedString;
    } catch (error) {
        console.error("Decryption failed", error);
        return false;
    }
};

export { generateAESKey, encryptData, decryptData };
