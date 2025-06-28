import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        setMovie(res.data);
      } catch (err) {
        console.error('Failed to fetch movie:', err);
        setMovie(null);
      }
    };

    fetchMovie();
  }, [id]);

useEffect(() => {
  const fetchFavoriteStatus = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(res.data.isFavorite);
    } catch (err) {
      console.error("Failed to fetch favorite status:", err);
    }
  };

  fetchFavoriteStatus();
}, [id, isAuthenticated]);


const handleFavorite = async () => {
  if (!isAuthenticated) return navigate('/login');
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/favorites`, 
      { movieId: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIsFavorite(res.data.isFavorite); // backend should return updated state
  } catch (err) {
    console.error("Failed to toggle favorite:", err);
  }
};

const handleRating = async (value) => {
  if (!isAuthenticated) return navigate('/login');
  try {
    setRating(value); // optimistic UI
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ratings`, 
      { movieId: id, rating: value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Failed to save rating:", err);
  }
};


useEffect(() => {
  const fetchUserRating = async () => {
    if (!isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ratings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRating(res.data.rating);
    } catch (err) {
      console.error("Failed to fetch user rating:", err);
    }
  };

  fetchUserRating();
}, [id, isAuthenticated]);


  if (!movie) {
    return <p className="text-white text-center mt-10">Loading movie details...</p>;
  }

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  

  return (
    <div className=" mx-auto text-white  px-0 md:px-6 py-8 max-w-6xl ">
      <div className="flex flex-col md:flex-row gap-6 ">
        {/* Poster */}
        <div className="md:w-1/3 mb-6 md:mb-0 ">
          <img
            src={imageUrl}
            alt={movie.title}
            className="rounded-lg w-full shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <p className="mb-4 text-gray-300">{movie.overview}</p>

          <p className="mb-2">
            <span className="font-semibold text-yellow-400">Release Date:</span>{' '}
            {movie.release_date}
          </p>

          <p className="mb-2">
            <span className="font-semibold text-yellow-400">Rating:</span>{' '}
            {movie.vote_average} / 10
          </p>

          {movie.genres?.length > 0 && (
            <p className="mb-4">
              <span className="font-semibold text-yellow-400">Genres:</span>{' '}
              {movie.genres.map((g) => g.name).join(', ')}
            </p>
          )}

          {/* Favorite + Rating */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
            <button
              onClick={handleFavorite}
              className={`px-5 py-2 rounded font-semibold ${
                isFavorite ? 'bg-red-600' : 'bg-gray-700'
              } hover:opacity-80 transition`}
            >
              {isFavorite ? '★ Favourite' : '☆ Add to Favourites'}
            </button>

            <div className="flex items-center gap-2">
              <span>Rate:</span>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRating(val)}
                  className={`px-2 py-1 rounded text-sm ${
                    rating === val
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-700 text-white'
                  } hover:opacity-80`}
                >
                  {val}
                </button>
              ))}
              {rating && (
                <span className="ml-2 text-sm text-yellow-400">
                  Your rating: {rating}
                </span>
              )}
            </div>
          </div>

          {/* Homepage Link */}
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded text-black font-semibold transition"
            >
              Watch Now
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
