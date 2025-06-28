import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/${id}`, {
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
        toast.error("Failed to load profile data.");
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

    // ✅ Validation before sending request
    if (!form.name.trim() || !form.username.trim()) {
      toast.error("Name and Username cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = form.avatarUrl;

      if (avatarFile) {
        const avatarData = new FormData();
        avatarData.append("file", avatarFile);
        const uploadRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/upload-avatar`,
          avatarData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        avatarUrl = uploadRes.data.avatarUrl;
      }

      await axios.put(
        `http://localhost:8080/api/auth/me`,
        { ...form, avatarUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully!");
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-gray-900 h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-950 p-4 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

        <label className="block mb-2 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 outline-none"
          required
        />

        <label className="block mb-2 text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 outline-none text-white"
          required
        />

        <label className="block mb-2 text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 outline-none text-white"
        />

        <label className="block mb-2 text-sm font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
        />

        {form.avatarUrl && (
          <img src={form.avatarUrl} alt="Avatar Preview" className="w-20 h-15 rounded-full mb-4" />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
