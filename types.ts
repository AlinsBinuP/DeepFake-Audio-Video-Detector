export interface AnalysisResult {
  score: number; // 0-100, where 100 is definitely Real
  verdict: 'REAL' | 'DEEPFAKE DETECTED' | 'UNCERTAIN';
  reasoning: string;
}

export interface DragState {
  isDragging: boolean;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
