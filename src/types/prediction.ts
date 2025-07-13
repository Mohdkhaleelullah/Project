export interface PredictionResult {
  id: string;
  userId: string;
  videoName: string;
  label: string;
  accuracy: number;
  timestamp: string;
}