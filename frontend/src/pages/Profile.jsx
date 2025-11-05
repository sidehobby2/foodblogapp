import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Save, ChefHat } from "lucide-react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.profile?.displayName || "",
        bio: user.profile?.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="ltr">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 p-3 rounded-full">
                <User className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 font-serif">
                My Profile
              </h1>
            </div>
          </div>

          <div className="p-6">
            {message && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  message.includes("success")
                    ? "bg-green-50 border border-green-200 text-green-700"
                    : "bg-red-50 border border-red-200 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Username
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Email
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Member Since
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="How would you like to be called?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us about your cooking journey, favorite cuisines, or cooking philosophy..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition duration-200 flex items-center space-x-2 disabled:opacity-50 font-medium"
              >
                <Save size={18} />
                <span>{loading ? "Saving..." : "Update Profile"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
