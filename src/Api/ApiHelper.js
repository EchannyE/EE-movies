import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const getTrendingMovies = async () => {
  const res = await axios.get(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  return res.data.results;
};
export const searchMovies = async (query) => {
  const res = await axios.get(`${BASE_URL}/search/movie`, {
    params: { query, api_key: API_KEY },
  });
  return res.data.results;
};
export const getMovieDetails = async (movieId) => {
  const res = await axios.get(`${BASE_URL}/movie/${movieId}`, {
    params: { api_key: API_KEY },
  });
    return res.data;
}


