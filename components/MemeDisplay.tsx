
import React from 'react';

interface MemeDisplayProps {
  memeUrl: string;
}

export const MemeDisplay: React.FC<MemeDisplayProps> = ({ memeUrl }) => {
  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <img src={memeUrl} alt="Generated Meme" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg" />
      <a
        href={memeUrl}
        download="ai-meme.png"
        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Meme
      </a>
    </div>
  );
};
