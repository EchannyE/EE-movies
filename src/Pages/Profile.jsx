import React, { useEffect, useState, useCallback } from "react";
import instance from "../Api/Axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import MovieCard from "../Components/MovieCard";
import UseLiked from "../Hook/UseLiked";
import UseWatchList from "../Hook/UseWatchList"; // Import the UseWatchList hook directly




const Profile = () => {
    const { id: paramId } = useParams();

    // Manage local storage items as React states for reactivity
    const [localToken, setLocalToken] = useState(localStorage.getItem("token"));
    const [localCurrentUser, setLocalCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("currentUser"));
        } catch (e) {
            console.error("Failed to parse currentUser from localStorage", e);
            return null;
        }
    });

    const currentUserId = localCurrentUser?.id;
    const id = paramId || currentUserId; // The ID of the profile being viewed
    const isAuthenticated = !!localToken && !!currentUserId;

    

    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false); // For follow/unfollow buttons
    const [isLoading, setIsLoading] = useState(true); // For initial profile data load
    const [activeTab, setActiveTab] = useState("watchlist");

    // NEW: Get watchlist state directly from UseWatchList hook
    // This watchlist will automatically update when toggleWatchlist is called from anywhere
    const { watchlist, loading: watchlistLoading, error: watchlistError, refetchWatchlist } = UseWatchList();

    const [reviews, setReviews] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [movies, setMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const { likedIds } = UseLiked();

    // Use useCallback for handleLogout to prevent unnecessary re-creation
    // MOVED: handleLogout definition moved before main useEffect
    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        // Update local states immediately to trigger re-renders and clean up profile display
        setLocalToken(null);
        setLocalCurrentUser(null);
        setProfile(null);
        setFollowers([]);
        setReviews([]);
        setFollowing([]);
        setMovies([]);
        setRecommendations([]);
        refetchWatchlist(); // Trigger a re-fetch/clear in the UseWatchList hook
        navigate("/");
    }, [navigate, refetchWatchlist]);


    // Effect to synchronize local states with localStorage changes (e.g., from login/logout pages)
    // This is crucial for Profile.jsx to react to auth changes from other pages/components.
    useEffect(() => {
        const syncAuthFromLocalStorage = () => {
            const newToken = localStorage.getItem("token");
            const newCurrentUser = JSON.parse(localStorage.getItem("currentUser"));

            // Only update state if values actually changed to prevent unnecessary re-renders
            if (newToken !== localToken) {
                setLocalToken(newToken);
            }
            if (JSON.stringify(newCurrentUser) !== JSON.stringify(localCurrentUser)) {
                setLocalCurrentUser(newCurrentUser);
            }
        };

        // Listen for storage events (useful for changes in other tabs or external scripts)
        window.addEventListener('storage', syncAuthFromLocalStorage);

        // Cleanup listener
        return () => {
            window.removeEventListener('storage', syncAuthFromLocalStorage);
        };
    }, [localToken, localCurrentUser]);


    // Main data fetching effect for the profile page
    // This effect now depends on 'id', 'localToken', 'currentUserId', and 'isAuthenticated'
    // This ensures it re-runs when the viewed profile changes OR when auth status changes.
    useEffect(() => {
        // If no ID or not authenticated, reset data and stop loading
        if (!id || !isAuthenticated) {
            setIsLoading(false);
            setProfile(null);
            setFollowers([]);
            setReviews([]);
            setFollowing([]);
            setMovies([]);
            setRecommendations([]);
            return;
        }

        const fetchAllData = async () => {
            setIsLoading(true); // Set loading true at the start of fetch
            try {
                const [
                    userRes,
                    followersRes,
                    reviewsRes,
                    followingRes,
                    moviesRes,
                    recsRes
                ] = await Promise.all([
                    instance.get(`/auth/${id}`, { headers: { Authorization: `Bearer ${localToken}` } }),
                    instance.get(`/auth/${id}/followers`, { headers: { Authorization: `Bearer ${localToken}` } }),
                    instance.get(`/auth/${id}/reviews`, { headers: { Authorization: `Bearer ${localToken}` } }),
                    instance.get(`/auth/${id}/following`, { headers: { Authorization: `Bearer ${localToken}` } }),
                    instance.get(`/movies/${id}/uploaded-movies`, { headers: { Authorization: `Bearer ${localToken}` } }),
                    instance.get(`/movies/${id}/recommendations`, { headers: { Authorization: `Bearer ${localToken}` } })
                ]);

                setProfile(userRes.data);
                setFollowers(followersRes.data);
                setIsFollowing(followersRes.data.some(f => f._id === currentUserId));
                setReviews(reviewsRes.data);
                setFollowing(followingRes.data);
                setMovies(moviesRes.data);
                setRecommendations(recsRes.data);

            } catch (err) {
                console.error("Error loading profile data:", err);
                // If 401 Unauthorized, automatically log out
                if (err.response && err.response.status === 401) {
                    // Call the logout function to clear state and redirect
                    // Ensure handleLogout is defined before this useEffect
                    handleLogout();
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [id, localToken, currentUserId, isAuthenticated, navigate, handleLogout]);

    // useCallback for functions that don't need to be recreated on every render
    const handleFollow = useCallback(async () => {
        setLoading(true);
        try {
            await instance.post(
                `/auth/${id}/follow`,
                {},
                { headers: { Authorization: `Bearer ${localToken}` } }
            );
            setIsFollowing(true);
            // Re-fetch followers/following lists after a follow/unfollow action for immediate UI update
            const followersRes = await instance.get(`/auth/${id}/followers`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowers(followersRes.data);
            const followingRes = await instance.get(`/auth/${id}/following`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowing(followingRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, localToken, currentUserId]);

    const handleUnfollow = useCallback(async () => {
        setLoading(true);
        try {
            await instance.delete(
                `/auth/${id}/unfollow`,
                { headers: { Authorization: `Bearer ${localToken}` } }
            );
            setIsFollowing(false);
            // Re-fetch followers/following lists after a follow/unfollow action
            const followersRes = await instance.get(`/auth/${id}/followers`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowers(followersRes.data);
            const followingRes = await instance.get(`/auth/${id}/following`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowing(followingRes.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, localToken, currentUserId]);




    // Combine all loading states for overall component loading indicator
    const overallLoading = isLoading || watchlistLoading;

    if (overallLoading) {
        return <div className="p-4 text-center">Loading profile data...</div>;
    }

    // Handle initial data fetch errors for watchlist
    if (watchlistError) {
        return <div className="p-4 text-center text-red-500">Error loading watchlist: {watchlistError.message}</div>;
    }

    // Render a fallback if profile data isn't available after loading (e.g., after logout, or user not found)
    if (!profile && !overallLoading) {
        return <div className="p-4 text-center text-gray-400">Profile data not available or user not logged in.</div>;
    }


    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Cover & Header */}
            <div
                className="relative h-48 bg-cover bg-center rounded-b-2xl"
                style={{ backgroundImage: `url(${profile?.coverUrl || "/cover.jpg"})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
            </div>
            <div className="relative -mt-16 flex justify-center px-4">
                <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-3xl">
                    <div className="flex items-center gap-4">
                        <img
                            src={profile?.avatarUrl || "/avatar.jpg"}
                            alt={profile?.name || "User avatar"}
                            className="w-24 h-24 rounded-full border-4 border-gray-900"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">
                                {profile?.name || localCurrentUser?.username} 
                            </h2>
                            <p className="text-gray-400">@{profile?.username}</p>
                            <p className="mt-2 text-sm text-gray-300">{profile?.bio}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-4">
                        {id === currentUserId ? (
                            <>
                                <Link
                                    to={`/profile/edit/${currentUserId}`}
                                    title="Edit your profile"
                                    className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition duration-200"
                                >
                                    Edit Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700 transition duration-200"
                                    aria-label="Log out of your account"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                                className={`px-4 py-2 rounded ${isFollowing ? 'bg-red-600' : 'bg-blue-600'} text-white`}
                                disabled={loading}
                                aria-label={isFollowing ? "Unfollow user" : "Follow user"}
                            >
                                {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 border-b border-gray-700 max-w-3xl mx-auto" role="tablist">
                <ul className="flex justify-around">
                    {['watchlist','reviews','followers','following','uploaded','recommended'].map(tab => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            role="tab"
                            aria-selected={activeTab===tab}
                            tabIndex={0}
                            className={`py-2 px-4 cursor-pointer ${activeTab===tab? 'font-semibold border-b-2 border-blue-500 text-white':'text-gray-400 hover:text-white'}`}
                        >{tab.charAt(0).toUpperCase()+tab.slice(1)}</li>
                    ))}
                </ul>
            </div>

            {/* Tab Contents */}
            {activeTab==='watchlist' && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
                    {watchlistLoading && <p className="text-gray-400">Loading watchlist...</p>}
                    {watchlistError && <p className="text-red-500">Failed to load watchlist.</p>}
                    {!watchlistLoading && !watchlistError && watchlist.length === 0 ? (
                        <p className="text-gray-400">No movies in watchlist.</p>
                    ) : (
                        // Map over the watchlist (which should now contain full movie objects as per UseWatchList's population)
                        watchlist.map(movie => (
                            <MovieCard key={movie.id || movie._id} movie={movie} isAuthenticated={isAuthenticated} />
                        ))
                    )}
                </div>
            )}
            {activeTab==='reviews'&&(
                <div className="p-4 max-w-3xl mx-auto">
                    {reviews.map(r=>(
                        <div key={r.id || r._id} className="bg-gray-800 rounded-lg p-4 mb-3 shadow">
                            <h4 className="text-lg font-bold text-white">{r.movieTitle}</h4>
                            <p className="text-sm text-gray-300 mt-1">{r.text}</p>
                            <span className="text-xs text-gray-400">⭐ {r.rating}</span>
                        </div>
                    ))}
                </div>
            )}
            {activeTab==='followers'&&(
                <div className="p-4 max-w-3xl mx-auto">
                    {followers.map(u=>(
                        <div key={u._id} className="bg-gray-800 rounded-lg p-3 mb-2 shadow flex items-center gap-3">
                            <img src={u.avatarUrl||'/avatar.jpg'} alt="avatar" className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="text-white font-semibold">{u.username}</p>
                                <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab==='following'&&(
                <div className="p-4 max-w-3xl mx-auto">
                    {following.map(u=>(
                        <div key={u._id} className="bg-gray-800 rounded-lg p-3 mb-2 shadow flex items-center gap-3">
                            <img src={u.avatarUrl||'/avatar.jpg'} alt="avatar" className="w-10 h-10 rounded-full"/>
                            <div>
                                <p className="text-white font-semibold">{u.username}</p>
                                <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab==='uploaded'&&(
                <div className="mt-10 max-w-6xl mx-auto px-4">
                    <h3 className="text-xl font-bold mb-4">Uploaded Movies</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {movies.length===0?
                            <p className="text-gray-400">No uploaded movies.</p>:
                            movies.map(m=> <MovieCard key={m.id || m._id} movie={m} isAuthenticated={isAuthenticated}/>)
                        }
                    </div>
                </div>
            )}
            {activeTab==='recommended'&&(
                <div className="mt-10 max-w-6xl mx-auto px-4">
                    <h3 className="text-xl font-bold mb-4">Movie Recommendations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                         {recommendations.length===0?
                            <p className="text-gray-400">No recommendations available.</p>:
                            recommendations.map(movie => (
                                <MovieCard
                                    key={movie.id || movie._id}
                                    movie={movie}
                                    isAuthenticated={isAuthenticated}
                                />
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
