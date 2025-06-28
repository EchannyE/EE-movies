import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import instance from "../Api/Axios"; // Ensure this path is correct

// Create the context
const WatchlistContext = createContext(null);

// Custom hook to use the watchlist context
// This is the hook you call inside your functional components (e.g., MovieCard, Watchlist)
export const useWatchlist = () => {
    const context = useContext(WatchlistContext);
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
};

// Watchlist Provider component
// This component wraps your application or parts of it to provide the watchlist state
export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get current user ID and token from localStorage
    // These values are read here to react to login/logout changes
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserId = currentUser?.id;
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token && !!currentUserId;

    // Function to fetch the watchlist from the backend
    // Memoized with useCallback to prevent unnecessary re-creation
    const fetchWatchlist = useCallback(async () => {
        if (!isAuthenticated) {
            setWatchlist([]); // Clear watchlist if not authenticated
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Path corrected: uses '/watchlist/user' as Axios baseURL already includes /api
            const res = await instance.get(`/watchlist/user/${currentUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Backend should return an array of movie objects. Map to _id or id as needed.
            // Assuming your backend returns movie objects with an 'id' or '_id' field
            const movieIds = (res.data || []).map(movie => movie.id || movie._id); // Handle both 'id' and '_id'
            setWatchlist(movieIds);
        } catch (err) {
            console.error("Failed to fetch watchlist from backend:", err);
            setError(err);
            setWatchlist([]); // Clear watchlist on error
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, currentUserId, token]); // Dependencies for useCallback

    // Effect to fetch watchlist when auth state changes or on component mount
    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]); // Dependency for useEffect is the memoized fetchWatchlist function

    // Function to add/remove a movie from the watchlist via backend
    // Memoized with useCallback
    const toggleWatchlist = useCallback(async (movieId) => {
        if (!isAuthenticated) {
            console.warn("User not authenticated. Cannot toggle watchlist.");
            // Ideally, MovieCard's handleWatchlist should redirect to login before this point
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const isCurrentlyWatchlisted = watchlist.includes(movieId);

            if (isCurrentlyWatchlisted) {
                // Remove from watchlist via DELETE request
                // Path corrected: uses '/watchlist'
                await instance.delete(`/watchlist/${movieId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                // Add to watchlist via POST request
                // Path corrected: uses '/watchlist'
                await instance.post(`/watchlist`, { movieId }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            // After successful API call, re-fetch the watchlist to ensure state is accurate
            // This is crucial for immediate synchronization across components
            await fetchWatchlist();

        } catch (err) {
            console.error("Failed to toggle watchlist on backend:", err);
            setError(err);
            // On error, re-fetch to revert local state to match backend's actual state
            fetchWatchlist();
        } finally {
            setLoading(false);
        }
    }, [watchlist, isAuthenticated, currentUserId, token, fetchWatchlist]); // Dependencies for useCallback


    // The value provided to the context consumers
    const contextValue = {
        watchlist,          // The array of movie IDs in the watchlist
        toggleWatchlist,    // Function to add/remove movies
        loading,            // Loading state of watchlist operations
        error,              // Error state of watchlist operations
        refetchWatchlist: fetchWatchlist, // Function to manually trigger a refresh
    };

    return (
        <WatchlistContext.Provider value={contextValue}>
            {children}
        </WatchlistContext.Provider>
    );
};
