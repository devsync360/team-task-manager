import React from 'react';

interface AuthToggleProps {
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ mode, setMode }) => {
  const tabs: { id: 'login' | 'signup'; label: string }[] = [
    { id: 'login', label: 'Sign In' },
    { id: 'signup', label: 'Sign Up' }
  ];

  return (
    <div className="flex border-b border-gray-100">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setMode(tab.id)}
          className={`flex-1 py-4 text-sm font-medium transition-all relative ${
            mode === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
          {mode === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      ))}
    </div>
  );
};