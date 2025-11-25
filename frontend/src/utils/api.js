// API utility functions for backend communication

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for fetch requests
const fetchWithHeaders = async (url, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Disease Analysis APIs
export const analyzeDiseaseImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/disease/analyze`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Image analysis error:', error);
    return {
      success: false,
      message: 'Failed to analyze image'
    };
  }
};

// Get Disease Risk Prediction
export const getDiseaseRiskPrediction = async (location, cropType) => {
  return fetchWithHeaders(`${API_BASE_URL}/prediction/risk`, {
    method: 'POST',
    body: JSON.stringify({ location, cropType }),
  });
};

// Get Weather Data (simulated)
export const getWeatherData = async (location) => {
  return fetchWithHeaders(`${API_BASE_URL}/weather/${location}`);
};

// Crop Twin APIs
export const getCropTwinData = async (farmerId, cropType) => {
  return fetchWithHeaders(`${API_BASE_URL}/croptwin/${farmerId}/${cropType}`);
};

export const updateCropTwin = async (farmerId, cropData) => {
  return fetchWithHeaders(`${API_BASE_URL}/croptwin/update`, {
    method: 'POST',
    body: JSON.stringify({ farmerId, cropData }),
  });
};

// Disease Heatmap Data
export const getDiseaseHeatmapData = async (region) => {
  return fetchWithHeaders(`${API_BASE_URL}/heatmap/${region}`);
};

// Submit Farmer Report (Crowdsourcing)
export const submitFarmerReport = async (reportData) => {
  return fetchWithHeaders(`${API_BASE_URL}/reports/submit`, {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
};

// Get Treatment Recommendations
export const getTreatmentRecommendations = async (diseaseType, severity) => {
  return fetchWithHeaders(`${API_BASE_URL}/treatment/recommend`, {
    method: 'POST',
    body: JSON.stringify({ diseaseType, severity }),
  });
};

// Voice Diagnosis API
export const processVoiceInput = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  try {
    const response = await fetch(`${API_BASE_URL}/voice/diagnose`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error('Voice processing error:', error);
    return {
      success: false,
      message: 'Failed to process voice input'
    };
  }
};

export default {
  analyzeDiseaseImage,
  getDiseaseRiskPrediction,
  getWeatherData,
  getCropTwinData,
  updateCropTwin,
  getDiseaseHeatmapData,
  submitFarmerReport,
  getTreatmentRecommendations,
  processVoiceInput
};