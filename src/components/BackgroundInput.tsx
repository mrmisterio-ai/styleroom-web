import React, { useState, useRef } from 'react';

interface BackgroundInputProps {
  onImageChange: (file: File | null) => void;
  onTextChange: (text: string) => void;
  imagePreview?: string;
  textValue: string;
}

export const BackgroundInput: React.FC<BackgroundInputProps> = ({
  onImageChange,
  onTextChange,
  imagePreview,
  textValue,
}) => {
  const [mode, setMode] = useState<'image' | 'text'>('text');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModeChange = (newMode: 'image' | 'text') => {
    setMode(newMode);
    if (newMode === 'text') {
      onImageChange(null);
    } else {
      onTextChange('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (mode === 'image') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (mode === 'image') {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
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

    onImageChange(file);
  };

  const handleClick = () => {
    if (mode === 'image') {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-gray-300">배경</label>
      
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => handleModeChange('text')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${mode === 'text' 
              ? 'bg-primary text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}
        >
          텍스트 입력
        </button>
        <button
          onClick={() => handleModeChange('image')}
          className={`
            flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${mode === 'image' 
              ? 'bg-primary text-white' 
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }
          `}
        >
          사진 업로드
        </button>
      </div>

      {mode === 'text' ? (
        <textarea
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="예: 화이트 스튜디오 배경, 소프트 조명"
          className="
            w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600
            focus:outline-none focus:border-primary transition-colors
            resize-none h-32 text-sm
          "
        />
      ) : (
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
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Background preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
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
      )}
    </div>
  );
};
