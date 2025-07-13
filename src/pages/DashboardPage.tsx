import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Video, History, Award, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/Layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { fetchRecentPredictions, fetchPredictionStats } from '../services/predictionService';
import { PredictionResult } from '../types/prediction';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentPredictions, setRecentPredictions] = useState<PredictionResult[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    highAccuracy: 0,
    mostCommonLabel: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        const predictions = await fetchRecentPredictions();
        const statsData = await fetchPredictionStats();
        
        setRecentPredictions(predictions);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard: React.FC<{ 
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <Card className="col-span-1">
      <CardContent className="flex flex-col items-center p-6">
        <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );

  return (
    <PageContainer
      title={`Welcome, ${user?.username}`}
      subtitle="Track your video predictions and analytics"
    >
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Upload a video file or record from your webcam to get instant ML predictions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/predict')}
                  className="flex items-center justify-center"
                >
                  <Video className="mr-2 h-5 w-5" />
                  New Prediction
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/history')}
                  className="flex items-center justify-center"
                >
                  <History className="mr-2 h-5 w-5" />
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>

          {!loading && recentPredictions.length === 0 && (
            <Alert 
              variant="info" 
              title="No predictions yet"
              className="mt-6"
            >
              You haven't made any predictions yet. Get started by uploading a video or recording from your webcam.
            </Alert>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            title="Total Predictions"
            value={stats.total}
            icon={<BarChart2 className="h-6 w-6 text-white" />}
            color="bg-primary-600"
          />
          <StatCard
            title="High Accuracy"
            value={`${stats.highAccuracy}%`}
            icon={<Award className="h-6 w-6 text-white" />}
            color="bg-accent-500"
          />
        </div>
      </div>

      {/* Recent predictions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Predictions</h2>
          {recentPredictions.length > 0 && (
            <Button 
              variant="ghost" 
              size="small"
              onClick={() => navigate('/history')}
              className="flex items-center"
            >
              View all
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-40 flex flex-col justify-between p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentPredictions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPredictions.map((prediction) => (
              <Card key={prediction.id} hover onClick={() => navigate(`/history`)}>
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-2 truncate">{prediction.videoName}</h3>
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {prediction.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    Accuracy: <span className="font-medium text-gray-900">{prediction.accuracy}%</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(prediction.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">No predictions available yet. Start by making your first prediction!</p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default DashboardPage;