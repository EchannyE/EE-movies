// src/api/auth.js
import instance from './Axios'; // Import your Axios instance

// No need for API_URL here anymore, as it's in the Axios instance's baseURL

export const login = async (email, password) => {
  try {
    const response = await instance.post('/auth/login', { email, password });
    return response.data; // Axios automatically unwraps 'data'
  } catch (error) {
    // Axios errors are typically in error.response
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await instance.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async () => {
  try {
    await instance.post('/auth/logout'); // No body needed for POST logout typically
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await instance.get('/auth/current');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch current user');
  }
};

// Fetch a specific user's profile by ID
// This is useful for viewing other users' profiles
export const getSpecificUserProfile = async (userId) => {
  try {
    const response = await instance.get(`/auth/${userId}`); // Hits /api/auth/:id
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};


export const updateUserProfile = async (profileData) => {
  try {
    // Change path to match backend's /me
    const response = await instance.put('/auth/me', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};


export const deleteUser = async () => {
  try {
    await instance.delete('/auth/delete');
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Delete failed');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await instance.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};


export const deleteUserProfile = async () => {
  try {
    await instance.delete('/auth/profile');
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile deletion failed');
  }
};


export const addUserFavorite = async (movieId) => {
  try {
    const response = await instance.post('/auth/favorites', { movieId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Add favorite failed');
  }
};

export const removeUserFavorite = async (movieId) => {
  try {
    await instance.delete(`/auth/favorites/${movieId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Remove favorite failed');
  }
};

export const getUserWatchlist = async () => {
  try {
    const response = await instance.get('/auth/watchlist');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user watchlist');
  }
};

export const addUserWatchlist = async (movieId) => {
  try {
    const response = await instance.post('/auth/watchlist', { movieId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Add watchlist failed');
  }
};

export const removeUserWatchlist = async (movieId) => {
  try {
    await instance.delete(`/auth/watchlist/${movieId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Remove watchlist failed');
  }
};

export const getUserRatings = async () => {
  try {
    const response = await instance.get('/auth/ratings');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user ratings');
  }
};

export const addUserRating = async (movieId, rating) => {
  try {
    const response = await instance.post('/auth/ratings', { movieId, rating });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Add rating failed');
  }
};

export const updateUserRating = async (movieId, rating) => {
  try {
    const response = await instance.put(`/auth/ratings/${movieId}`, { rating });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update rating failed');
  }
};

export const removeUserRating = async (movieId) => {
  try {
    await instance.delete(`/auth/ratings/${movieId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Remove rating failed');
  }
};

export const getUserReviews = async () => {
  try {
    const response = await instance.get('/auth/reviews');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
  }
};

export const addUserReview = async (movieId, review) => {
  try {
    const response = await instance.post('/auth/reviews', { movieId, review });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Add review failed');
  }
};

export const updateUserReview = async (reviewId, review) => {
  try {
    const response = await instance.put(`/auth/reviews/${reviewId}`, { review });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Update review failed');
  }
};

export const removeUserReview = async (reviewId) => {
  try {
    await instance.delete(`/auth/reviews/${reviewId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Remove review failed');
  }
};


export const getFollowersOfUser = async (userId) => {
  try {
    const response = await instance.get(`/auth/${userId}/followers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch followers');
  }
};

export const getFollowingOfUser = async (userId) => {
  try {
    const response = await instance.get(`/auth/${userId}/following`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch following');
  }
};

export const followUserById = async (userIdToFollow) => {
  try {
    const response = await instance.post(`/auth/${userIdToFollow}/follow`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to follow user');
  }
};

export const unfollowUserById = async (userIdToUnfollow) => {
  try {
    const response = await instance.post(`/auth/${userIdToUnfollow}/unfollow`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unfollow user');
  }
};