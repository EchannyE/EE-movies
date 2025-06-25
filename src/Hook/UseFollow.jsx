import { useState } from 'react';
import axios from 'axios';

const UseFollow = (userId, currentUserToken) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const follow = async () => {
    await axios.post(`/api/profile/${userId}/follow`, {}, {
      headers: { Authorization: `Bearer ${currentUserToken}` }
    });
    setIsFollowing(true);
  };

  const unfollow = async () => {
    await axios.delete(`/api/profile/${userId}/unfollow`, {
      headers: { Authorization: `Bearer ${currentUserToken}` }
    });
    setIsFollowing(false);
  };

  return { isFollowing, follow, unfollow };
};

export default UseFollow;
