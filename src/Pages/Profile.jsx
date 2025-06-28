import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import instance from "../Api/Axios";
import MovieCard from "../Components/MovieCard";
import useWatchList from "../Hook/useWatchList";

const Profile = () => {
    const { id: paramId } = useParams();
    const navigate = useNavigate();

    const [localToken, setLocalToken] = useState(localStorage.getItem("token"));
    const [localCurrentUser, setLocalCurrentUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("currentUser"));
        } catch {
            return null;
        }
    });

    const currentUserId = localCurrentUser?.id;
    const id = paramId || currentUserId;
    const isAuthenticated = !!localToken && !!currentUserId;

    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("watchlist");

    const [reviews, setReviews] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [movies, setMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const { watchlist, loading: watchlistLoading, error: watchlistError, refetchWatchlist } = useWatchList();

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setLocalToken(null);
        setLocalCurrentUser(null);
        setProfile(null);
        setFollowers([]);
        setReviews([]);
        setFollowing([]);
        setMovies([]);
        setRecommendations([]);
        refetchWatchlist();
        navigate("/");
    }, [navigate, refetchWatchlist]);

    useEffect(() => {
        if (!id || !isAuthenticated) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
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
                console.error(err);
                if (err.response && err.response.status === 401) handleLogout();
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, localToken, currentUserId, isAuthenticated, handleLogout]);

    const handleFollow = async () => {
        setLoading(true);
        try {
            await instance.post(`/auth/${id}/follow`, {}, { headers: { Authorization: `Bearer ${localToken}` } });
            setIsFollowing(true);
            const followersRes = await instance.get(`/auth/${id}/followers`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowers(followersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnfollow = async () => {
        setLoading(true);
        try {
            await instance.delete(`/auth/${id}/unfollow`, { headers: { Authorization: `Bearer ${localToken}` } });
            setIsFollowing(false);
            const followersRes = await instance.get(`/auth/${id}/followers`, { headers: { Authorization: `Bearer ${localToken}` } });
            setFollowers(followersRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const overallLoading = isLoading || watchlistLoading;

    if (overallLoading) {
        return <div className="p-4 text-center">Loading profile...</div>;
    }

    if (!profile) {
        return <div className="p-4 text-center text-gray-400">Profile not available or user not logged in.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Cover */}
            <div
                className="relative h-48 bg-cover bg-center rounded-b-2xl"
                style={{ backgroundImage: `url(${profile.coverUrl || "/cover.jpg"})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
            </div>

            {/* Profile Header */}
            <div className="relative -mt-16 flex justify-center px-4">
                <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-3xl">
                    <div className="flex items-center gap-4">
                        <img
                            src={profile.avatarUrl || "/avatar.jpg"}
                            alt={profile.name || "User"}
                            className="w-24 h-24 rounded-full border-4 border-gray-900"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">{profile.name || profile.username}</h2>
                            <p className="text-gray-400">@{profile.username}</p>
                            <p className="mt-1 text-sm text-gray-300">{profile.bio}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                        {id === currentUserId ? (
                            <>
                                <Link
                                    to={`/profile/edit/${currentUserId}`}
                                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                                >
                                    Edit Profile
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={isFollowing ? handleUnfollow : handleFollow}
                                disabled={loading}
                                className={`px-4 py-2 rounded ${isFollowing ? "bg-red-600" : "bg-blue-600"} hover:opacity-90 transition`}
                            >
                                {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 max-w-3xl mx-auto border-b border-gray-700">
                <ul className="flex justify-around">
                    {["watchlist", "reviews", "followers", "following", "uploaded", "recommended"].map(tab => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer px-4 py-2 ${activeTab === tab ? "border-b-2 border-blue-500 text-white font-semibold" : "text-gray-400 hover:text-white"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            {activeTab === "watchlist" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
                    {watchlist.length === 0 ? (
                        <p className="text-gray-400">No movies in your watchlist.</p>
                    ) : (
                        watchlist.map(movie => (
                            <MovieCard key={movie.id || movie._id} movie={movie} isAuthenticated={isAuthenticated} />
                        ))
                    )}
                </div>
            )}

            {activeTab === "uploaded" && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
                    {movies.length === 0 ? (
                        <p className="text-gray-400">No uploaded movies.</p>
                    ) : (
                        movies.map(movie => (
                            <MovieCard key={movie.id || movie._id} movie={movie} isAuthenticated={isAuthenticated} />
                        ))
                    )}
                </div>
            )}

            {activeTab === "recommended" && (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
        {recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations available.</p>
        ) : (
            recommendations.map(movie => (
                <MovieCard
                    key={movie._id || movie.id}
                    movie={movie}
                    isAuthenticated={isAuthenticated}
                />
            ))
        )}
    </div>
)}


            {activeTab === "reviews" && (
                <div className="p-4 max-w-3xl mx-auto">
                    {reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet.</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r._id} className="bg-gray-800 rounded p-4 mb-3">
                                <h4 className="text-lg font-bold">{r.movieTitle}</h4>
                                <p className="text-sm text-gray-300">{r.text}</p>
                                <span className="text-xs text-gray-400">⭐ {r.rating}</span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "followers" && (
                <div className="p-4 max-w-3xl mx-auto">
                    {followers.length === 0 ? (
                        <p className="text-gray-400">No followers yet.</p>
                    ) : (
                        followers.map(u => (
                            <div key={u._id} className="flex items-center gap-3 bg-gray-800 rounded p-3 mb-2">
                                <img src={u.avatarUrl || "/avatar.jpg"} alt="avatar" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-white font-semibold">{u.username}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "following" && (
                <div className="p-4 max-w-3xl mx-auto">
                    {following.length === 0 ? (
                        <p className="text-gray-400">Not following anyone yet.</p>
                    ) : (
                        following.map(u => (
                            <div key={u._id} className="flex items-center gap-3 bg-gray-800 rounded p-3 mb-2">
                                <img src={u.avatarUrl || "/avatar.jpg"} alt="avatar" className="w-10 h-10 rounded-full" />
                                <div>
                                    <p className="text-white font-semibold">{u.username}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
