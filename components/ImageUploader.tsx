
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imagePreviewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-500 hover:bg-gray-700/50 transition-all duration-300"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
      />
      {imagePreviewUrl ? (
        <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
      ) : (
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2">Click to upload an image</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP</p>
        </div>
      )}
    </div>
  );
};
