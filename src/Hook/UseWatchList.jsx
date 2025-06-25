import { useEffect, useState, useCallback } from "react";
import instance from "../Api/Axios"; // Import your Axios instance

export default function UseWatchList() {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserId = currentUser?.id;
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token && !!currentUserId;

    // Function to fetch the watchlist from the backend
    const fetchWatchlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWatchlist([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // CORRECTED: Use lowercase 'watchlist' and no leading '/api' as baseURL handles it
            const res = await instance.get(`/watchList/user/${currentUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // The backend for getWatchlistByUserId should return an array of Movie objects
            // We map these movie objects to just their IDs for the `includes` check in MovieCard
            const movieIds = res.data.map(movie => movie._id || movie.id); // Use _id or id depending on your Mongoose setup
            setWatchlist(movieIds || []);
        } catch (err) {
            console.error("Failed to fetch watchlist from backend:", err);
            setError(err);
            setWatchlist([]); // Clear watchlist on error
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUserId, token]); // Dependencies for useCallback

    // Load watchlist on component mount or when auth state changes
    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]); // Dependency is the memoized fetchWatchlist function itself

    // Function to add/remove a movie from the watchlist via backend
    const toggleWatchlist = useCallback(async (movieId) => {
        if (!isAuthenticated) {
            console.warn("User not authenticated. Cannot toggle watchlist.");
            // Ideally, MovieCard's handleWatchlist should redirect earlier
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const isCurrentlyWatchlisted = watchlist.includes(movieId);

            if (isCurrentlyWatchlisted) {
                // Remove from watchlist
                // CORRECTED: Use lowercase 'watchlist' and no leading '/api' as baseURL handles it
                await instance.delete(`/watchList/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Add to watchlist
                // CORRECTED: Use lowercase 'watchlist' and no leading '/api' as baseURL handles it
                await instance.post(`/watchList`, { movieId }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            // After successful API call, re-fetch the watchlist to ensure state is accurate
            await fetchWatchlist(); // Crucial for live update

        } catch (err) {
            console.error("Failed to toggle watchlist on backend:", err);
            setError(err);
            // Revert local state if backend update fails or re-fetch to get correct state
            fetchWatchlist();
        } finally {
            setLoading(false);
        }
    }, [watchlist, isAuthenticated, currentUserId, token, fetchWatchlist]); // Dependencies for useCallback

    // Expose watchlist, toggle function, and loading/error states
    return { watchlist, toggleWatchlist, loading, error, refetchWatchlist: fetchWatchlist };
}
