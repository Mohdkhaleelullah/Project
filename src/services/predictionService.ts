import axios from 'axios';
import { PredictionResult } from '../types/prediction';

const API_BASE_URL = 'http://localhost:5000/api';

// Function to create a new prediction
export const createPrediction = async (videoBlob: Blob, videoName: string): Promise<{ label: string; accuracy: number }> => {
  const formData = new FormData();
  formData.append('video', videoBlob, videoName);
  formData.append('userId', localStorage.getItem('userId') || '');

  try {
    const response = await axios.post(`${API_BASE_URL}/predictions/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prediction:', error);
    throw new Error('Failed to process video');
  }
};

// Function to fetch prediction history
export const fetchPredictionHistory = async (): Promise<PredictionResult[]> => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/predictions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw new Error('Failed to fetch prediction history');
  }
};

// Function to fetch recent predictions for the dashboard
export const fetchRecentPredictions = async (): Promise<PredictionResult[]> => {
  const predictions = await fetchPredictionHistory();
  return predictions.slice(0, 3);
};

// Function to fetch prediction stats
export const fetchPredictionStats = async () => {
  const predictions = await fetchPredictionHistory();
  
  const total = predictions.length;
  const highAccuracyCount = predictions.filter(p => p.accuracy > 85).length;
  const highAccuracyPercentage = Math.round((highAccuracyCount / total) * 100);
  
  const labelCounts: Record<string, number> = {};
  predictions.forEach(p => {
    labelCounts[p.label] = (labelCounts[p.label] || 0) + 1;
  });
  
  let mostCommonLabel = '';
  let highestCount = 0;
  
  Object.entries(labelCounts).forEach(([label, count]) => {
    if (count > highestCount) {
      mostCommonLabel = label;
      highestCount = count;
    }
  });
  
  return {
    total,
    highAccuracy: highAccuracyPercentage,
    mostCommonLabel,
  };
};