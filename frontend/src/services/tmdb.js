import axios from 'axios';

const API_KEY = 'a8f0c9314ef626f2fba393afcccae6ce';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMoviePoster = async (title, year) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: title,
        year: year,
      },
    });
    return response.data.results[0]?.poster_path;
  } catch (error) {
    console.error('Error fetching movie poster:', error);
    return null;
  }
};