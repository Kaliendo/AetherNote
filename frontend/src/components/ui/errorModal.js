import React from 'react';

const ErrorModal = ({ showError, message, onClose }) => {
    if (!showError) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-[#2b2b2b] bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="relative p-5 shadow-lg rounded-md bg-[#171717] w-full max-w-md mx-4 border-none">
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-bold text-white">Error</h3>
                    <div className="mt-2 px-7 py-3">
                        <p className="text-sm text-white">{message || "An unexpected error has occurred."}</p>
                    </div>
                    <div className="items-center px-4 py-3">
                        <button onClick={onClose}
                            className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;