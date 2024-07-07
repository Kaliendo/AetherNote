import React from 'react';
import CheckboxWithLabel from './checkbox';
import InputField from './inputfield';

const OptionsSection = ({ options, inputs, handleCheckboxChange, handleInputChange }) => {
    return (
        <div className="flex flex-col items-start mb-6">
            <CheckboxWithLabel
                label="Custom expiration time"
                checked={options.customExpiration}
                onChange={() => handleCheckboxChange('customExpiration')}
                color="bg-purple-600 border-purple-600"
            />
            {options.customExpiration && (
                <InputField
                    type="number"
                    name="expirationTime"
                    placeholder="Enter expiration time in seconds"
                    value={inputs.expirationTime}
                    onChange={handleInputChange}
                    min="1"
                />
            )}

            <CheckboxWithLabel
                label="Custom views limit"
                checked={options.customViewsLimit}
                onChange={() => handleCheckboxChange('customViewsLimit')}
                color="bg-purple-600 border-purple-600"
            />
            {options.customViewsLimit && (
                <InputField
                    type="number"
                    name="viewsLimit"
                    placeholder="Enter views limit"
                    value={inputs.viewsLimit}
                    onChange={handleInputChange}
                    min="1"
                />
            )}

            <CheckboxWithLabel
                label="Custom password"
                checked={options.customPassword}
                onChange={() => handleCheckboxChange('customPassword')}
                color="bg-purple-600 border-purple-600"
            />
            {options.customPassword && (
                <InputField
                    type="password"
                    name="customPassword"
                    placeholder="Enter custom password"
                    value={inputs.customPassword}
                    onChange={handleInputChange}
                />
            )}
        </div>
    );
};

export default OptionsSection;
