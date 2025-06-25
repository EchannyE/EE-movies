import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export default function UseTmdb(type, likedIds = [], filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "";
        const base = "https://api.themoviedb.org/3";

        if (type === "movies") {
          const params = new URLSearchParams({
            api_key: API_KEY,
            sort_by: filters.sortBy || "popularity.desc",
            with_genres: filters.genre || "",
            "vote_average.gte": filters.minRating || 0,
            page: filters.page || 1,
          });
          url = `${base}/discover/movie?${params}`;
        } else if (type === "tv") {
          url = `${base}/tv/popular?api_key=${API_KEY}`;
        } else if (type === "recommendations" && likedIds.length > 0) {
          url = `${base}/movie/${likedIds[0]}/recommendations?api_key=${API_KEY}`;
        }

        const res = await fetch(url);
        const json = await res.json();
        if (!res.ok || !json.results) throw new Error(json.status_message);

        setData((prev) =>
          filters.page && filters.page > 1 ? [...prev, ...json.results] : json.results
        );
        setHasMore(json.page < json.total_pages);
      } catch (err) {
        console.error("Error fetching data from TMDB:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, likedIds, filters]);

  return { data, loading, hasMore };
}
