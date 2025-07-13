import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Filter, Search, ChevronDown, Video, ChevronUp } from 'lucide-react';
import PageContainer from '../components/Layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchPredictionHistory } from '../services/predictionService';
import { PredictionResult } from '../types/prediction';

const HistoryPage: React.FC = () => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'timestamp' | 'accuracy'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        // In a real app, this would be an actual API call
        const history = await fetchPredictionHistory();
        setPredictions(history);
        
        // Extract unique labels for filtering
        const labels = Array.from(new Set(history.map(p => p.label)));
        setAvailableLabels(labels);
      } catch (error) {
        console.error('Error loading prediction history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  const handleSort = (field: 'timestamp' | 'accuracy') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredPredictions = predictions
    .filter(prediction => {
      const matchesSearch = searchTerm === '' || 
                           prediction.videoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.label.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLabel = filterLabel === null || prediction.label === filterLabel;
      
      return matchesSearch && matchesLabel;
    })
    .sort((a, b) => {
      if (sortField === 'timestamp') {
        return sortDirection === 'asc' 
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return sortDirection === 'asc' 
          ? a.accuracy - b.accuracy
          : b.accuracy - a.accuracy;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterLabel(null);
    setSortField('timestamp');
    setSortDirection('desc');
  };

  return (
    <PageContainer
      title="Prediction History"
      subtitle="View your past video predictions and results"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle>Your Predictions</CardTitle>
          <div className="flex mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              className="mr-2"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search predictions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 py-1 h-9"
              />
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <div className="px-6 pb-2 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-2 py-2">
              <div className="font-medium text-sm text-gray-700">Filter by:</div>
              
              <div className="flex flex-wrap gap-2">
                {availableLabels.map(label => (
                  <Button
                    key={label}
                    variant={filterLabel === label ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setFilterLabel(filterLabel === label ? null : label)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={clearFilters}
                className="ml-auto"
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <LoadingSpinner size="large" />
            </div>
          ) : filteredPredictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-700">
                    <th className="text-left py-3 px-6 font-semibold">Video</th>
                    <th className="text-left py-3 px-6 font-semibold">Label</th>
                    <th 
                      className="text-left py-3 px-6 font-semibold cursor-pointer hover:text-primary-600"
                      onClick={() => handleSort('accuracy')}
                    >
                      <div className="flex items-center">
                        Accuracy
                        {sortField === 'accuracy' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="text-left py-3 px-6 font-semibold cursor-pointer hover:text-primary-600"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'timestamp' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="ml-1 h-4 w-4" /> : 
                            <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPredictions.map((prediction) => (
                    <tr 
                      key={prediction.id} 
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center mr-3">
                            <Video className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="font-medium truncate max-w-xs">
                            {prediction.videoName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {prediction.label}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              prediction.accuracy > 80 
                                ? 'bg-success-500' 
                                : prediction.accuracy > 50 
                                  ? 'bg-accent-500' 
                                  : 'bg-error-500'
                            }`}
                          ></div>
                          <span>{prediction.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm">
                        {format(new Date(prediction.timestamp), 'MMM d, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Video className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No predictions found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm || filterLabel 
                  ? 'Try adjusting your search or filters'
                  : 'Make your first prediction to see results here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default HistoryPage;