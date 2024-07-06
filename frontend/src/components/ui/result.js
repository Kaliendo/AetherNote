import React from 'react';

const ResultComponent = ({ noteLink, privateKey, onBack }) => {
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
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Private Key</label>
                    <input
                        type="text"
                        value={privateKey}
                        readOnly
                        className="w-full px-4 py-2 bg-[#323232] rounded-lg"
                    />
                </div>
                <button
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                    onClick={() => {
                        navigator.clipboard.writeText(`${noteLink}$${privateKey}`);
                    }}
                >
                    Copy Link + Key
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
