import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-pink-500">
        AI Meme Generator
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Re-imagine your photos with AI-powered styles.
      </p>
    </header>
  );
};
