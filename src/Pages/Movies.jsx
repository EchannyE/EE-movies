import React, { useEffect, useState } from 'react';
import MovieCard from '../Components/MovieCard';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [genreMap, setGenreMap] = useState({});
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        const mapping = {};
        data.genres.forEach((g) => {
          mapping[g.id] = g.name;
        });
        setGenreMap(mapping);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, [API_KEY]);

  const fetchMovies = async (pageNum = 1) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&page=${pageNum}`
      );
      const data = await res.json();
      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    const fetchInitialMovies = async () => {
      await fetchMovies(1); // initial load
    };
    fetchInitialMovies();
    // eslint-disable-next-line
  }, [API_KEY]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    fetchMovies(nextPage).then(() => {
      setPage(nextPage);
      setLoadingMore(false);
    });
  };

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genre
      ? (movie.genre_ids || []).includes(Number(genre))
      : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className=" mx-auto p-4 text-white bg-gray-950">
      <h1 className="text-2xl font-bold mb-4">Trending Movies</h1>

      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded border border-gray-300 text-black"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 rounded border border-gray-300 text-black"
        >
          <option value="">All Genres</option>
          {Object.entries(genreMap).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-gray-400 mt-4">No movies found.</div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded transition"
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      </div>
    </div>
  );
};

export default Movies;
