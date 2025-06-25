import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [form, setForm] = useState({ name: "", username: "", bio: "", avatarUrl: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          name: res.data.name || "",
          username: res.data.username || "",
          bio: res.data.bio || "",
          avatarUrl: res.data.avatarUrl || "",
        });
      } catch (err) {
        console.error("Error loading user data", err);
      }
    };
    fetchProfile();
  }, [id, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let avatarUrl = form.avatarUrl;

      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("file", avatarFile);
        const uploadRes = await axios.post("http://localhost:5000/api/auth/upload-avatar", avatarData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        avatarUrl = uploadRes.data.avatarUrl;
      }

      await axios.put(
        `http://localhost:5000/api/auth/${id}`,
        { ...form, avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <label className="block mb-2 text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <label className="block mb-2 text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 border border-gray-600 text-white"
        />
        <label className="block mb-2 text-sm font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />
        {form.avatarUrl && (
          <img src={form.avatarUrl} alt="Avatar Preview" className="w-20 h-20 rounded-full mb-4" />
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
