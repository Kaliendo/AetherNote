import React, { useState } from 'react';
import { generateAESKey, aesEncrypt, deriveKeyFromPassword } from '../utils/cryptoUtils';
import { createNote } from '../api/api';
import { prettifyError } from '../utils/helper';
import { ReactComponent as LogoSVG } from '../logo.svg';
import ErrorModal from '../components/ui/errorModal';
import TextArea from '../components/ui/textArea';
import OptionsSection from '../components/ui/options';
import ResultComponent from '../components/ui/result';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Host = process.env.REACT_APP_HOST || 'http://localhost:3000';

function Index() {
    const [text, setText] = useState('');
    const [key, setKey] = useState('');
    const [encryptedData, setEncryptedData] = useState('');
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [options, setOptions] = useState({
        customExpiration: false,
        customViewsLimit: false,
        customPassword: false
    });
    const [inputs, setInputs] = useState({
        expirationTime: '',
        viewsLimit: '',
        customPassword: ''
    });
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [noteLink, setNoteLink] = useState('');

    const raiseError = (messages) => {
        setError(true);
        setErrorMessages(messages);
    };

    const handleSecure = async () => {
        if (!text) {
            raiseError("Please enter some text to secure.");
            return;
        }

        if (options.customExpiration && (!inputs.expirationTime || inputs.expirationTime < 1)) {
            raiseError("Expiration time must be a number and at least 1.");
            return;
        }

        if (options.customViewsLimit && (!inputs.viewsLimit || inputs.viewsLimit < 1)) {
            raiseError("Views limit must be a number and at least 1.");
            return;
        }

        const encKey = options.customPassword ? await deriveKeyFromPassword(inputs.customPassword) : await generateAESKey();
        setKey(encKey);

        const data = await aesEncrypt(text, encKey);
        if (!data) {
            raiseError("Encryption failed!");
            return;
        }

        console.log(data);
        console.log(encKey);
        setEncryptedData(data);

        const payload = {
            data: data,
            views: options.customViewsLimit ? parseInt(inputs.viewsLimit, 10) : 1,
            expiration: options.customExpiration ? parseInt(inputs.expirationTime, 10) : 0,
        };

        try {
            const noteId = await createNote(payload);
            setNoteLink(`${Host}/note/${noteId}`);
            setIsEncrypted(true);
        } catch (error) {
            raiseError(prettifyError(error));
        }
    };

    const handleCheckboxChange = (option) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [option]: !prevOptions[option]
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }));
    };

    const handleBack = () => {
        setIsEncrypted(false);
        setText('');
        setKey('');
        setEncryptedData('');
        setNoteLink('');
    };

    if (isEncrypted) {
        return (
            <ResultComponent
                noteLink={noteLink}
                privateKey={key}
                onBack={handleBack}
            />
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#171717] text-white">
            <header className="flex flex-col items-center">
                <div className="flex items-center mb-6">
                    <LogoSVG className="w-16 h-16 bg-white p-2 rounded-full" />
                    <h1 className="ml-4 text-2xl font-bold">AETHERNOTE</h1>
                </div>
                <TextArea
                    placeholder="Enter your text here"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    rows={6}
                />
                <OptionsSection
                    options={options}
                    inputs={inputs}
                    handleCheckboxChange={handleCheckboxChange}
                    handleInputChange={handleInputChange}
                />
                <button className="w-32 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center" onClick={handleSecure}>
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Secure
                </button>
                <ErrorModal showError={error} message={errorMessages} onClose={() => setError(false)} />
            </header>
        </div>
    );
}

export default Index;
