import React from 'react';

export interface MemeStyle {
  id: string;
  name: string;
  emoji: string;
}

interface StyleSelectorProps {
  styles: MemeStyle[];
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onStyleChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Choose a Meme Style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className={`w-full p-3 border rounded-lg text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
              selectedStyle === style.id
                ? 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-400'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500'
            }`}
            aria-pressed={selectedStyle === style.id}
          >
            <span className="text-2xl" aria-hidden="true">{style.emoji}</span>
            <span>{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
