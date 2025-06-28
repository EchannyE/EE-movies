import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseTrailer from "../Hook/useTrailer";
import useWatchList from "../Hook/useWatchList";
import UseLiked from "../Hook/UseLiked";

export default function MovieCard({ movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerKey = UseTrailer(movie.id);

  const { likedIds, toggleLike } = UseLiked();
  const { watchlist, toggleWatchlist } = useWatchList();

  const isLiked = likedIds?.includes(movie.id);
  const isWatchlisted = watchlist?.includes(movie.id);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.jpg";

  const navigate = useNavigate();

  // Function to handle like button click

  const handleLike = () => {
    const token = localStorage.getItem("token");
    // If no token, redirect to login
    const requireLogin = () => {
      navigate("/login", { state: { from: window.location.pathname } });
    }
    if (!token) return requireLogin();
    toggleLike(movie.id);
  };

  const handleWatchlist = () => {
    const token = localStorage.getItem("token");
    // If no token, redirect to login
    const requireLogin = () => {
      navigate("/login", { state: { from: window.location.pathname } });
    }
    if (!token) return requireLogin();
    toggleWatchlist(movie.id);
  };

  // Function to handle trailer button click

  const handleTrailer = () => {
    const token = localStorage.getItem("token");
    // If no token, redirect to login
    const requireLogin = () => {
  navigate("/login", { state: { from: window.location.pathname } });
};

    if (!token) return requireLogin();
    setShowTrailer(true);
  };

  return (
    <div className="relative bg-gray-900 text-white rounded overflow-hidden shadow-lg">
      <Link to={`/movies/${movie.id}`}>
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-[300px] object-cover"
        />
      </Link>

      <div className="p-3 space-y-2">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <p className="text-xs line-clamp-3">{movie.overview}</p>

        <div className="flex justify-between items-center mt-2 gap-2">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm px-3 py-1 rounded"
            onClick={handleTrailer}
            disabled={!trailerKey}
          >
            {trailerKey ? "Trailer" : "No Trailer"}
          </button>

          <button onClick={handleLike}>
            {isLiked ? "❤️" : "♡"}
          </button>

          <button onClick={handleWatchlist}>
            {isWatchlisted ? "✅" : "➕" }
           
          </button>
        </div>
      </div>

      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-[90%] md:w-[70%] aspect-video">
            <iframe
              className="w-full h-full rounded"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              loading="lazy"
              referrerPolicy="no-referrer"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
