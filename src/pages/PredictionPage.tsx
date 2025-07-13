import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, Video, AlertCircle } from 'lucide-react';
import PageContainer from '../components/Layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Alert from '../components/ui/Alert';
import { createPrediction } from '../services/predictionService';

const PredictionPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; accuracy: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's a video file
      if (!selectedFile.type.startsWith('video/')) {
        setError('Please select a valid video file');
        setFile(null);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };

  const submitPrediction = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (!file) {
        throw new Error('No video to analyze');
      }
      
      const result = await createPrediction(file, file.name);
      setPrediction(result);
      toast.success('Prediction completed successfully!');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process video');
      toast.error('Failed to process video');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPrediction = () => {
    setPrediction(null);
    setFile(null);
  };

  return (
    <PageContainer
      title="New Prediction"
      subtitle="Upload a video to get ML predictions"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Video Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xl">
                <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary-400 focus:outline-none">
                  <span className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-600">
                      {file ? file.name : 'Drop files to upload or click to browse'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Supported formats: MP4, WebM, MOV (max 50MB)
                    </span>
                  </span>
                  <input
                    type="file"
                    name="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
                {error && (
                  <Alert variant="error" className="mt-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {error}
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-3">
                <Button
                  variant="outline"
                  onClick={resetPrediction}
                  disabled={isSubmitting || !file}
                >
                  Reset
                </Button>
                <Button
                  onClick={submitPrediction}
                  loading={isSubmitting}
                  disabled={isSubmitting || !file}
                >
                  {isSubmitting ? 'Processing...' : 'Analyze Video'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitting ? (
                <div className="min-h-[200px] flex flex-col items-center justify-center">
                  <LoadingSpinner size="large" />
                  <p className="mt-4 text-gray-600 text-center">
                    Analyzing video and generating prediction...
                  </p>
                </div>
              ) : prediction ? (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-2 bg-primary-100 rounded-full mb-2">
                      <Video className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Analysis Complete</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Predicted Label</p>
                      <p className="text-lg font-semibold">{prediction.label}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Confidence Score</p>
                      <div className="mt-1 relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-lg font-semibold inline-block">
                              {prediction.accuracy}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${prediction.accuracy}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-success-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between gap-3">
                    <Button
                      variant="outline"
                      onClick={resetPrediction}
                      className="flex-1"
                    >
                      New Prediction
                    </Button>
                    <Button
                      onClick={() => navigate('/history')}
                      className="flex-1"
                    >
                      View History
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[200px] flex flex-col items-center justify-center text-center p-4">
                  <div className="rounded-full bg-gray-100 p-3 mb-3">
                    <Video className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Prediction Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Upload a video to see ML predictions here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default PredictionPage;