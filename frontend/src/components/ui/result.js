import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const ResultComponent = ({ noteLink, privateKey, customPassword, onBack }) => {
    const copyToClipboard = () => {
        const textToCopy = customPassword ? noteLink : `${noteLink}#${privateKey}`;
        navigator.clipboard.writeText(textToCopy)
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#171717] text-white">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Your Encrypted Note</h2>
                <div className="mb-4">
                    <label className="block mb-2">Note Link</label>
                    <input
                        type="text"
                        value={noteLink}
                        readOnly
                        className="w-full px-4 py-2 bg-[#323232] rounded-lg"
                        title={noteLink}
                    />
                </div>
                {!customPassword && (
                    <div className="mb-4">
                        <label className="block mb-2">Private Key</label>
                        <input
                            type="text"
                            value={privateKey}
                            readOnly
                            className="w-full px-4 py-2 bg-[#323232] rounded-lg"
                            title={privateKey}
                        />
                    </div>
                )}
                <button
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center"
                    onClick={copyToClipboard}
                >
                    <FontAwesomeIcon icon={faCopy} className="mr-2" />
                    {customPassword ? 'Copy Link' : 'Copy Link + Key'}
                </button>
                <button
                    className="w-full py-2 mt-4 bg-purple-900 hover:bg-purple-950 rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ResultComponent;
