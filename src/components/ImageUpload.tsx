import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  icon: string;
  onChange: (file: File | null) => void;
  preview?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  icon,
  onChange,
  preview,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
      alert('지원하는 이미지 형식: JPG, PNG, WEBP');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('최대 파일 크기: 10MB');
      return;
    }

    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 cursor-pointer
          transition-all duration-200 aspect-square flex items-center justify-center
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-600 hover:border-primary/50 hover:bg-gray-800/50'
          }
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">{icon}</div>
            <p className="text-sm text-gray-400">
              드래그 앤 드롭 또는 클릭
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WEBP (최대 10MB)
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
