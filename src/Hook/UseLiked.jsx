// src/Hooks/UseLiked.js
import { useEffect, useState } from "react";

export default function UseLiked() {
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("likedMovies")) || [];
    setLikedIds(saved);
  }, []);

  const toggleLike = (movieId) => {
    setLikedIds((prev) => {
      let updated;
      if (prev.includes(movieId)) {
        updated = prev.filter((id) => id !== movieId);
      } else {
        updated = [...prev, movieId];
      }
      localStorage.setItem("likedMovies", JSON.stringify(updated));
      return updated;
    });
  };

  return { likedIds, toggleLike };
}
