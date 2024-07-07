import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { retrieveNote } from '../api/api.js';
import { aesDecrypt, deriveKeyFromPassword } from '../utils/cryptoUtils.js';
import ErrorModal from '../components/ui/errorModal.js';
import DecryptionModal from '../components/ui/decryptionModal.js';
import TextArea from '../components/ui/textArea.js';
import { ReactComponent as LogoSVG } from '../logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

function Note() {
    const { noteId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const [customPassword, setCustomPassword] = useState(false);
    const [encryptedData, setEncryptedData] = useState(null);
    const [decryptionKey, setDecryptionKey] = useState('');
    const [decryptionError, setDecryptionError] = useState('');
    const [showDecryptionModal, setShowDecryptionModal] = useState(false);
    const dataFetchedRef = useRef(false);

    useEffect(() => {
        const fetchNoteData = async () => {
            try {
                const result = await retrieveNote(noteId);
                setCustomPassword(result.customPassword);
                setEncryptedData(result.data);
            } catch (err) {
                setError('The note does not exist or has expired.');
                setShowError(true);
            }
        };

        if (!dataFetchedRef.current) {
            fetchNoteData();
            setDecryptionKey(location.hash.substring(1));
            dataFetchedRef.current = true;
        }
    }, [noteId, location.hash]);

    useEffect(() => {
        const privKey = location.hash.substring(1);
        if (encryptedData) {
            if (privKey) {
                decryptNoteData(privKey);
            } else {
                setShowDecryptionModal(true);
            }
        }
    }, [location.hash, encryptedData]);

    const decryptNoteData = (key) => {
        try {
            let derivedKey = key;
            if (customPassword) {
                derivedKey = deriveKeyFromPassword(key);
            }
            const decryptedData = aesDecrypt(encryptedData, derivedKey);
            if (!decryptedData) {
                throw new Error('Decryption failed');
            }
            setContent(decryptedData);
            setShowDecryptionModal(false);
        } catch (err) {
            setDecryptionError(`Decryption failed with the key: ${key}`);
            setShowDecryptionModal(true);
        }
    };

    const handleCopy = () => {
        if (content) {
            navigator.clipboard.writeText(content);
        }
    };

    const handleCloseError = () => {
        setShowError(false);
        navigate('/');
    };

    const handleDecrypt = () => {
        decryptNoteData(decryptionKey);
    };

    const handleCancel = () => {
        setShowDecryptionModal(false);
        navigate('/');
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#171717] text-white">
            <header className="flex flex-col items-center">
                <div className="flex items-center mb-6">
                    <LogoSVG className="w-16 h-16 bg-white p-2 rounded-full" />
                    <h1 className="ml-4 text-2xl font-bold">AETHERNOTE</h1>
                </div>
                <h2 className="mb-4 text-lg">Decrypted Note</h2>
                <TextArea
                    value={content}
                    placeholder="Decrypted content will appear here"
                    readOnly
                />
                <button
                    className="w-full py-2 mt-4 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center"
                    onClick={handleCopy}
                >
                    <FontAwesomeIcon icon={faCopy} className="mr-2" />
                    Copy content
                </button>
                <button
                    className="w-full py-2 mt-4 bg-purple-900 hover:bg-purple-950 rounded-lg flex items-center justify-center"
                    onClick={handleBack}
                >
                    Back
                </button>
                <ErrorModal showError={showError} message={error} onClose={handleCloseError} />
                <DecryptionModal
                    showModal={showDecryptionModal}
                    decryptionError={decryptionError}
                    decryptionKey={decryptionKey}
                    setDecryptionKey={setDecryptionKey}
                    handleDecrypt={handleDecrypt}
                    handleCancel={handleCancel}
                />
            </header>
        </div>
    );
}

export default Note;
