import React, { useState } from "react";
import HeroBanner from "../Components/HeroBanner";
import MovieCard from "../Components/MovieCard";
import UseTmdb from "../Hook/UseTmdb";
import { UseGenre } from "../Hook/UseGenre";
import  UseLiked  from "../Hook/UseLiked";

export default function Home() {
  const [filters, setFilters] = useState({
    genre: "",
    minRating: 0,
    sortBy: "popularity.desc",
    page: 1,
  });

  // Hooks
  const genres = UseGenre();
  const { likedIds } = UseLiked();
  const { data: movies = [], loading: loadingMovies, hasMore } = UseTmdb("movies", [], filters);

  // Randomize featured movie
  const featuredMovie =
    movies.length > 0
      ? movies[Math.floor(Math.random() * movies.length)]
      : null;

  // Handlers
  const handleGenreChange = (e) => {
    setFilters((prev) => ({ ...prev, genre: e.target.value, page: 1 }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
  };

  const handleRatingChange = (e) => {
    setFilters((prev) => ({ ...prev, minRating: parseFloat(e.target.value), page: 1 }));
  };

  const loadMore = () => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  return (
    <div className="space-y-6">
      {featuredMovie && <HeroBanner movie={featuredMovie} />}

      <div className="p-4 flex gap-4 flex-wrap">
        <select onChange={handleGenreChange} className="p-2 rounded shadow border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-50">
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select onChange={handleSortChange} className="p-2 rounded shadow border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-50">
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated</option>
          <option value="release_date.desc">Newest</option>
        </select>

        <select onChange={handleRatingChange} className="p-2 rounded shadow border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-50">
          <option value={0}>All Ratings</option>
          <option value={5}>5+</option>
          <option value={7}>7+</option>
          <option value={8}>8+</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isLiked={likedIds.includes(movie.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="text-center p-4">
          <button
            onClick={loadMore}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
