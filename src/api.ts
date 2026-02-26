import axios from 'axios';
import type { GenerationParams, GenerationResult, HistoryItem } from './types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const generateImage = async (
  modelImage: File,
  garmentImage: File,
  backgroundImage: File | null,
  backgroundText: string,
  params: GenerationParams
): Promise<GenerationResult> => {
  const formData = new FormData();
  formData.append('model_image', modelImage);
  formData.append('garment_image', garmentImage);
  
  if (backgroundImage) {
    formData.append('background_image', backgroundImage);
  } else if (backgroundText) {
    formData.append('background_text', backgroundText);
  }
  
  formData.append('steps', params.steps.toString());
  formData.append('guidance_scale', params.guidance_scale.toString());
  formData.append('seed', params.seed.toString());

  const response = await api.post<GenerationResult>('/generate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getGenerationStatus = async (id: string): Promise<GenerationResult> => {
  const response = await api.get<GenerationResult>(`/generate/${id}`);
  return response.data;
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  const response = await api.get<HistoryItem[]>('/history');
  return response.data;
};

export const retryGeneration = async (
  id: string,
  params: GenerationParams
): Promise<GenerationResult> => {
  const response = await api.post<GenerationResult>(`/generate/${id}/retry`, params);
  return response.data;
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  await api.delete(`/history/${id}`);
};
