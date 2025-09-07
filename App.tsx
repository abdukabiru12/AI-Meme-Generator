import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { MemeDisplay } from './components/MemeDisplay';
import { Loader } from './components/Loader';
import { createMeme } from './services/geminiService';
import { StyleSelector, MemeStyle } from './components/StyleSelector';

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      if (!base64) {
        reject(new Error("Failed to read file as base64"));
        return;
      }
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const memeStyles: MemeStyle[] = [
  { id: 'fun', name: 'Fun', emoji: '🤣' },
  { id: 'tech', name: 'Tech', emoji: '💻' },
  { id: 'power', name: 'Power', emoji: '⚡️' },
  { id: 'curiosity', name: 'Curiosity', emoji: '🤔' },
  { id: 'vintage', name: 'Vintage', emoji: '📜' },
  { id: 'futuristic', name: 'Futuristic', emoji: '🚀' },
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(memeStyles[0].id);
  
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setGeneratedMemeUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateMeme = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setGeneratedMemeUrl(null);
    setError(null);

    try {
      const imageData = await fileToBase64(imageFile);
      const memeBase64 = await createMeme(imageData, selectedStyle);
      setGeneratedMemeUrl(`data:image/png;base64,${memeBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during meme generation.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, selectedStyle]);
  
  const isButtonDisabled = !imageFile || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-4xl mt-8">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Uploader and Form */}
          <div className="flex flex-col space-y-6">
            <ImageUploader onImageSelect={handleImageSelect} imagePreviewUrl={imagePreviewUrl} />
            
            <StyleSelector 
              styles={memeStyles}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />

            <button
              onClick={handleGenerateMeme}
              disabled={isButtonDisabled}
              className={`w-full text-lg font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center ${
                isButtonDisabled 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Generating...</span>
                </>
              ) : "✨ Generate Meme"}
            </button>
          </div>
          
          {/* Right Column: Display Area */}
          <div className="bg-gray-900 rounded-lg flex items-center justify-center p-4 min-h-[300px] lg:min-h-full border-2 border-dashed border-gray-600">
            {isLoading && (
              <div className="text-center">
                <Loader large={true} />
                <p className="mt-4 text-gray-400">The AI is working its magic...</p>
              </div>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {!isLoading && !error && generatedMemeUrl && <MemeDisplay memeUrl={generatedMemeUrl} />}
            {!isLoading && !error && !generatedMemeUrl && (
              <div className="text-center text-gray-500">
                <p>Your generated meme will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
       <footer className="w-full max-w-4xl text-center mt-8 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Create and share responsibly.</p>
      </footer>
    </div>
  );
};

export default App;
