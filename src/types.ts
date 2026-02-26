export interface GenerationParams {
  steps: number;
  guidance_scale: number;
  seed: number;
}

export interface GenerationRequest extends GenerationParams {
  model_image: File;
  garment_image: File;
  background_image?: File;
  background_text?: string;
}

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface GenerationResult {
  id: string;
  status: GenerationStatus;
  result_image?: string;
  error?: string;
  created_at: string;
  completed_at?: string;
  duration?: number;
  params: GenerationParams;
  model_image: string;
  garment_image: string;
  background_image?: string;
  background_text?: string;
}

export interface HistoryItem {
  id: string;
  result_image: string;
  created_at: string;
  params: GenerationParams;
  model_image: string;
  garment_image: string;
  background_image?: string;
  background_text?: string;
}
