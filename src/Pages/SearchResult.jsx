import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: {
            api_key: API_KEY,
            query,
          },
        });
        setMovies(res.data.results || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="p-4 text-white min-h-screen bg-gray-900">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: "<span className="text-yellow-400">{query}</span>"
      </h2>

      {loading ? (
        <p className="text-center text-lg text-gray-400">Loading...</p>
      ) : movies.length === 0 ? (
        <p className="text-center text-red-400">No results found for "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              likedIds={[]} // Optional: pass real likedIds if needed
              toggleLike={() => {}}
              onAddToWatchlist={() => {}}
              onRemoveFromWatchlist={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
