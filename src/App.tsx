import { useState, useEffect } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { BackgroundInput } from './components/BackgroundInput';
import { ParameterSlider } from './components/ParameterSlider';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryGrid } from './components/HistoryGrid';
import type { GenerationParams, GenerationResult, HistoryItem } from './types';
import { generateImage, getGenerationStatus, retryGeneration } from './api';

function App() {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [modelPreview, setModelPreview] = useState<string>('');
  
  const [garmentImage, setGarmentImage] = useState<File | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string>('');
  
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string>('');
  const [backgroundText, setBackgroundText] = useState<string>('');
  
  const [params, setParams] = useState<GenerationParams>({
    steps: 12,
    guidance_scale: 2.5,
    seed: 42,
  });
  
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  useEffect(() => {
    if (modelImage) {
      const url = URL.createObjectURL(modelImage);
      setModelPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [modelImage]);

  useEffect(() => {
    if (garmentImage) {
      const url = URL.createObjectURL(garmentImage);
      setGarmentPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [garmentImage]);

  useEffect(() => {
    if (backgroundImage) {
      const url = URL.createObjectURL(backgroundImage);
      setBackgroundPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [backgroundImage]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const generateRandomSeed = () => {
    setParams({
      ...params,
      seed: Math.floor(Math.random() * 1000000),
    });
  };

  const startPolling = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await getGenerationStatus(id);
        setResult(status);

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          setIsGenerating(false);
          if (status.status === 'completed') {
            setHistoryRefresh(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    setPollingInterval(interval);
  };

  const handleGenerate = async () => {
    if (!modelImage || !garmentImage) {
      alert('모델 사진과 옷 사진을 모두 업로드해주세요.');
      return;
    }

    if (!backgroundImage && !backgroundText) {
      alert('배경 사진을 업로드하거나 텍스트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedResult = await generateImage(
        modelImage,
        garmentImage,
        backgroundImage,
        backgroundText,
        params
      );

      setResult(generatedResult);
      startPolling(generatedResult.id);
    } catch (error) {
      console.error('Generation error:', error);
      alert('생성 요청에 실패했습니다.');
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result?.result_image) return;

    const link = document.createElement('a');
    link.href = result.result_image;
    link.download = `styleroom-${result.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = async () => {
    if (!result?.id) return;

    setIsGenerating(true);
    
    try {
      const retryResult = await retryGeneration(result.id, params);
      setResult(retryResult);
      startPolling(retryResult.id);
    } catch (error) {
      console.error('Retry error:', error);
      alert('재생성 요청에 실패했습니다.');
      setIsGenerating(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    // Convert HistoryItem to GenerationResult format
    const historyResult: GenerationResult = {
      id: item.id,
      status: 'completed',
      result_image: item.result_image,
      created_at: item.created_at,
      params: item.params,
      model_image: item.model_image,
      garment_image: item.garment_image,
      background_image: item.background_image,
      background_text: item.background_text,
    };
    
    setResult(historyResult);
    setParams(item.params);
    
    // Scroll to result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StyleRoom
          </h1>
          <p className="text-gray-400 text-lg">AI Virtual Try-On</p>
        </header>

        {/* Main Generation Section */}
        <div className="bg-card rounded-xl p-6 md:p-8 border border-gray-700 mb-8">
          <h2 className="text-2xl font-semibold mb-6">이미지 생성</h2>
          
          {/* Image Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ImageUpload
              label="모델 사진"
              icon="📷"
              onChange={setModelImage}
              preview={modelPreview}
            />
            <ImageUpload
              label="옷 사진"
              icon="👔"
              onChange={setGarmentImage}
              preview={garmentPreview}
            />
            <BackgroundInput
              onImageChange={setBackgroundImage}
              onTextChange={setBackgroundText}
              imagePreview={backgroundPreview}
              textValue={backgroundText}
            />
          </div>

          {/* Parameters */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">파라미터 조정</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <ParameterSlider
                label="Steps"
                value={params.steps}
                onChange={(value) => setParams({ ...params, steps: value })}
                min={1}
                max={50}
                step={1}
              />
              <ParameterSlider
                label="Guidance Scale"
                value={params.guidance_scale}
                onChange={(value) => setParams({ ...params, guidance_scale: value })}
                min={1}
                max={10}
                step={0.5}
              />
            </div>

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Seed
                </label>
                <input
                  type="number"
                  value={params.seed}
                  onChange={(e) => setParams({ ...params, seed: parseInt(e.target.value) || 0 })}
                  className="
                    w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600
                    focus:outline-none focus:border-primary transition-colors
                    font-mono
                  "
                />
              </div>
              <button
                onClick={generateRandomSeed}
                className="
                  px-4 py-2 rounded-lg bg-gray-800 border border-gray-600
                  hover:border-primary transition-colors text-xl
                "
                title="랜덤 시드 생성"
              >
                🎲
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`
              w-full px-6 py-4 rounded-lg font-semibold text-lg
              transition-all transform hover:scale-[1.02] active:scale-[0.98]
              flex items-center justify-center gap-3
              ${isGenerating 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/20'
              }
            `}
          >
            <span className="text-2xl">🚀</span>
            <span>{isGenerating ? '생성 중...' : '생성하기'}</span>
          </button>
        </div>

        {/* Result Display */}
        <div className="mb-8">
          <ResultDisplay
            result={result}
            onDownload={handleDownload}
            onRetry={handleRetry}
          />
        </div>

        {/* History Grid */}
        <HistoryGrid
          onSelect={handleHistorySelect}
          refresh={historyRefresh}
        />
      </div>
    </div>
  );
}

export default App;
