// src/Hooks/UseTrailer.js
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseTrailer(movieId) {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
        );
        const trailer = res.data.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);
      } catch (err) {
        console.error("Failed to load trailer", err);
        setTrailerKey(null);
      }
    };

    if (movieId) fetchTrailer();
  }, [movieId]);

  return trailerKey;
}
