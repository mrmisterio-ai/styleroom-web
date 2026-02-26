import React, { useEffect, useState } from 'react';
import type { HistoryItem } from '../types';
import { getHistory, deleteHistoryItem } from '../api';

interface HistoryGridProps {
  onSelect: (item: HistoryItem) => void;
  refresh: number;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ onSelect, refresh }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [refresh]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('이 항목을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteHistoryItem(id);
      setHistory(history.filter(item => item.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleSelect = (item: HistoryItem) => {
    setSelectedId(item.id);
    onSelect(item);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-8 border border-gray-700">
        <div className="text-center text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-xl p-8 border border-gray-700">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">📁</div>
          <p>아직 생성된 이미지가 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">히스토리</h2>
        <button
          onClick={loadHistory}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          🔄 새로고침
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`
              relative aspect-square rounded-lg overflow-hidden cursor-pointer
              border-2 transition-all group
              ${selectedId === item.id 
                ? 'border-primary shadow-lg shadow-primary/20' 
                : 'border-transparent hover:border-primary/50'
              }
            `}
          >
            <img
              src={item.result_image}
              alt={`History ${item.id}`}
              className="w-full h-full object-cover"
            />
            
            <div className="
              absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity
              flex flex-col justify-end p-2
            ">
              <div className="text-xs text-white/80 mb-1">
                {new Date(item.created_at).toLocaleDateString('ko-KR')}
              </div>
              <button
                onClick={(e) => handleDelete(item.id, e)}
                className="
                  px-2 py-1 bg-red-500 text-white text-xs rounded
                  hover:bg-red-600 transition-colors
                "
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
