import React, { useState } from "react";
import MovieCard from "../Components/MovieCard";
import UseLiked from "../Hook/UseLiked";
import useWatchList from "../Hook/useWatchList"; // Corrected: Import the renamed hook
import toast from "react-hot-toast";
import instance from "../Api/Axios"; // Assuming you need Axios for clear all functionality

export default function Watchlist() {
    const { likedIds, toggleLike } = UseLiked();
    // Consume watchlist state and functions from the UseWatchList hook
    // Ensure you destructure the values you need, DO NOT try to render the whole object
    const { watchlist, loading: watchlistLoading, error: watchlistError, toggleWatchlist, refetchWatchlist } = useWatchList(); // Corrected: Use the renamed hook

    const [showClearConfirmation, setShowClearConfirmation] = useState(false); // State for confirmation modal

    // Function to handle removing a movie from watchlist
    // This now directly calls the toggleWatchlist from the hook
    const handleRemoveFromWatchlist = async (movieId) => {
        try {
            await toggleWatchlist(movieId); // Use the hook's toggle function to remove
            toast.success("Removed from watchlist!");
        } catch (err) {
            toast.error("Failed to remove movie from watchlist.");
            console.error("Failed to remove movie:", err);
        }
    };

    // Function to clear the entire watchlist
    const handleClearWatchlist = async () => {
        // Show confirmation modal
        setShowClearConfirmation(true);
    };

    const confirmClearWatchlist = async () => {
        setShowClearConfirmation(false); // Hide confirmation modal

        try {
            // NOTE: You need a backend endpoint for this.
            // Example: DELETE /api/watchlist/all (or /api/watchlist/clear)
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in to clear your watchlist.");
                return;
            }

            // Assuming a backend endpoint to clear all watchlist items for the user
            const res = await instance.delete("/watchlist/all", { // Adjusted path based on Axios baseURL
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                // If backend successfully cleared, trigger refetch in the hook
                refetchWatchlist();
                toast.success("Watchlist cleared successfully!");
            } else {
                toast.error(res?.data?.message || "Failed to clear watchlist.");

            }
        } catch (err) {
            toast.error("Failed to clear watchlist.");
            console.error("Failed to clear watchlist", err);
        }
    };

    const cancelClearConfirmation = () => {
        setShowClearConfirmation(false); // Hide confirmation modal
    };


    // Determine overall loading state
    const isLoading = watchlistLoading; // Renamed for clarity

    return (
        <div className="p-4 space-y-6 bg-gray-950 min-h-screen text-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
                {!isLoading && watchlist.length > 0 && (
                    <button
                        onClick={handleClearWatchlist}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {isLoading ? (
                <p className="text-gray-300">Loading your watchlist...</p>
            ) : watchlistError ? (
                <p className="text-red-500">Error loading watchlist: {watchlistError.message}</p>
            ) : watchlist.length === 0 ? (
                <p className="text-gray-300">Your watchlist is empty.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {watchlist.map((movie) => (
                        <MovieCard
                            key={movie.id || movie._id} // Use movie.id or movie._id for key
                            movie={movie}
                            isAuthenticated={!!localStorage.getItem("token")} // Pass isAuthenticated prop
                            // No need to pass likedIds/toggleLike/onRemoveFromWatchlist if MovieCard uses its own hooks
                        />
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            {showClearConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white max-w-sm mx-auto text-center">
                        <h3 className="text-xl font-bold mb-4">Confirm Clear Watchlist</h3>
                        <p className="mb-6">Are you sure you want to remove all movies from your watchlist? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmClearWatchlist}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md transition duration-200"
                            >
                                Yes, Clear
                            </button>
                            <button
                                onClick={cancelClearConfirmation}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
