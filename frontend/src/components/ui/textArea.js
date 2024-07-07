import React from 'react';

const TextArea = ({ value, onChange, placeholder, readOnly }) => {
    return (
        <textarea
            placeholder={placeholder}
            className="placeholder:text-white placeholder:text-opacity-50 placeholder:text-m w-80 p-4 mb-6 bg-[#323232] text-white rounded-lg"
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            rows={10}
        />
    );
};

export default TextArea;
