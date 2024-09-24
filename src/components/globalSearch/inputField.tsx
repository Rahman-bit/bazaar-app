import React from 'react';

interface InputFieldProps {
  onChange: (value: string) => void;
  placeholder?: string;
  type : string;
  value: string; 
}

const InputField: React.FC<InputFieldProps> = ({ onChange, type, placeholder = 'Search...', value }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
    />
  );
};

export default InputField;
