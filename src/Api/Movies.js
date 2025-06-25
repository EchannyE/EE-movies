import axios from 'axios';

const API_KEY = 'process.env.VITE_TMDB_API_KEY';

export const fetchTrendingMovies = async () => {
  const response = await axios.get(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
  );
  return response.data.results;
};