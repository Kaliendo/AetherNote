import React from 'react';

const InputField = ({ type, name, placeholder, value, onChange, min }) => {
    return (
        <input
            type={type}
            name={name}
            className="w-full p-2 mb-2 bg-[#323232] text-white rounded-md"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={min}
        />
    );
};

export default InputField;
