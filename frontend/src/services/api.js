// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search/`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

export const submitRating = async (userId, movieId, rating) => {
  try {
    await axios.post(`${API_URL}/rate/`, {
      user_id: userId,
      movie_id: movieId,
      rating: rating
    });
  } catch (error) {
    console.error('Rating submission failed:', error);
  }
};

export const getRecommendations = async (movieId, page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/recommend/${movieId}/`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Recommendation error:', error);
    return { results: [], total_pages: 1 };
  }
};