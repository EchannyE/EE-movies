import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UseTmdb from "../Hook/UseTmdb";

export default function HeroBanner() {
  const { data: movies = [] } = UseTmdb("movies");
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    if (movies.length > 0) {
      // Randomize or pick a specific movie
      const selected =
        movies[Math.floor(Math.random() * movies.length)];
      setFeatured(selected);
    }
  }, [movies]);

  if (!featured) return null;

  const bgImage = featured.backdrop_path
    ? `https://image.tmdb.org/t/p/original${featured.backdrop_path}`
    : "/fallback-hero.jpg"; // optional fallback image

  return (
    <div
      className="relative w-full h-[80vh] rounded-xl overflow-hidden bg-cover bg-center mb-8 flex items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 flex items-center">
        <div className="max-w-3xl px-6 text-white space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            {featured.title || featured.name}
          </h1>
          <p className="text-sm md:text-base line-clamp-3">
            {featured.overview}
          </p>
          <div className="flex gap-4 py-2 px-4">
            
            <Link
              to="/signup"
              className="bg-yellow-500 px-7 py-2 rounded-md hover:bg-yellow-700 transition"
            >
              Sign Up free
            </Link>
            <Link to="/movies" className="bg-transparent border border-yellow-300 text-yellow-300 px-7 py-2 rounded-md hover:bg-yellow-400 hover:text-black transition">
                Browser More
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
