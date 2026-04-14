import React from 'react';

interface AuthInputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder: string;
  icon: React.ElementType; // Fixed Type here
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  label, name, type, value, onChange, onBlur, placeholder, icon: Icon, error, touched, disabled, rightElement
}) => {
  const getBorderClass = () => {
    if (!touched) return 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500';
    return error 
      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
      : 'border-green-300 focus:ring-green-500/20 focus:border-green-500';
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
          touched && value ? (error ? 'text-red-400' : 'text-blue-500') : 'text-gray-400'
        }`} />
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white disabled:bg-gray-50 ${getBorderClass()}`}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
      </div>
      {touched && error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};