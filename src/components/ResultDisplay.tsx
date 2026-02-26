import React from 'react';
import type { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult | null;
  onDownload: () => void;
  onRetry: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onDownload,
  onRetry,
}) => {
  if (!result) {
    return (
      <div className="bg-card rounded-xl p-8 border border-gray-700">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">✨</div>
          <p>이미지를 업로드하고 생성하기 버튼을 눌러주세요</p>
        </div>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (result.status) {
      case 'pending':
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-secondary">
            <div className="animate-spin">⏳</div>
            <span>생성 중...</span>
          </div>
        );
      case 'failed':
        return (
          <div className="text-red-400">
            ❌ 생성 실패: {result.error || '알 수 없는 오류'}
          </div>
        );
      case 'completed':
        return (
          <div className="text-green-400">
            ✅ 생성 완료
          </div>
        );
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">결과</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          {result.status === 'completed' && result.result_image ? (
            <img
              src={result.result_image}
              alt="Generated result"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">
                {result.status === 'failed' ? '❌' : '⏳'}
              </div>
              <p className="text-sm">
                {result.status === 'failed' ? '생성 실패' : '생성 중...'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-400">상태</div>
              <div className="font-medium">{getStatusDisplay()}</div>
            </div>

            {result.duration && (
              <div>
                <div className="text-sm text-gray-400">소요 시간</div>
                <div className="font-medium">{result.duration.toFixed(1)}초</div>
              </div>
            )}

            <div className="border-t border-gray-700 pt-3 mt-3">
              <div className="text-sm text-gray-400 mb-2">파라미터</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Steps:</span>
                  <span className="font-mono">{result.params.steps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Guidance:</span>
                  <span className="font-mono">{result.params.guidance_scale}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seed:</span>
                  <span className="font-mono">{result.params.seed}</span>
                </div>
              </div>
            </div>
          </div>

          {result.status === 'completed' && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={onDownload}
                className="
                  flex-1 px-4 py-3 rounded-lg bg-secondary text-white
                  font-medium hover:bg-secondary/80 transition-colors
                  flex items-center justify-center gap-2
                "
              >
                <span>💾</span>
                <span>다운로드</span>
              </button>
              <button
                onClick={onRetry}
                className="
                  flex-1 px-4 py-3 rounded-lg bg-primary text-white
                  font-medium hover:bg-primary/80 transition-colors
                  flex items-center justify-center gap-2
                "
              >
                <span>🔄</span>
                <span>재생성</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
