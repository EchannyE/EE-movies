// /Hook/UseGenre.js
import { useEffect, useState } from "react";
import axios from "axios";

export function UseGenre() {
  const [genres, setGenres] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        setGenres(res.data.genres || []);
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };

    fetchGenres();
  }, [API_KEY]);

  return genres;
}
