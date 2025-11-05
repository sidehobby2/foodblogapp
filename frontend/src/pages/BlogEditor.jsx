import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X, Eye, ChefHat } from "lucide-react";
import api from "../utils/api"; // Changed from axios to api
import RichTextEditor from "../components/RichTextEditor";
import { useAuth } from "../context/AuthContext";

const BlogEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [cookingTime, setCookingTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isEditing) {
      fetchBlogPost();
    }
  }, [id, isEditing, user, navigate]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/blogs/${id}`); // Changed to api
      const blog = response.data.data;

      // Check if user owns the blog
      if (blog.author._id !== user._id) {
        alert("You are not authorized to edit this recipe");
        navigate("/my-blogs");
        return;
      }

      setTitle(blog.title);
      setContent(blog.content);
      setSummary(blog.summary);
      setCategory(blog.category);
      setCookingTime(blog.cookingTime);
      setServings(blog.servings);
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to fetch recipe");
      navigate("/my-blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !summary.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const blogData = {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim(),
        category,
        cookingTime: parseInt(cookingTime),
        servings: parseInt(servings),
      };

      if (isEditing) {
        await api.put(`/api/blogs/${id}`, blogData); // Changed to api
      } else {
        await api.post("/api/blogs", blogData); // Changed to api
      }

      navigate("/my-blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save recipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    setPreviewData({
      title,
      summary,
      content,
      category,
      cookingTime,
      servings,
      createdAt: new Date().toISOString(),
      author: user,
    });
  };

  const closePreview = () => {
    setPreviewData(null);
  };

  if (!user) {
    return null;
  }

  if (isLoading && isEditing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="ltr">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-6 border-b">
            <div className="flex items-center space-x-3">
              <ChefHat className="text-orange-600" size={28} />
              <h1 className="text-3xl font-bold text-gray-900 font-serif">
                {isEditing ? "Edit Recipe" : "Write New Recipe"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                placeholder="Enter your recipe title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Write a brief description of your recipe..."
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snack">Snack</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Content *
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write your recipe with ingredients, instructions, and tips..."
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition duration-200 flex items-center space-x-2 disabled:opacity-50 font-medium"
                >
                  <Save size={18} />
                  <span>
                    {isLoading
                      ? "Saving..."
                      : isEditing
                      ? "Update Recipe"
                      : "Publish Recipe"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!title || !content}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition duration-200 flex items-center space-x-2 disabled:opacity-50 font-medium"
                >
                  <Eye size={18} />
                  <span>Preview</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate("/my-blogs")}
                className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition duration-200 flex items-center space-x-2 font-medium"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 font-serif">
                Preview
              </h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <article className="blog-content">
                <h1>{previewData.title}</h1>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                  <p className="text-gray-700 italic">{previewData.summary}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm text-gray-600">
                  <div>
                    <strong>Category:</strong> {previewData.category}
                  </div>
                  <div>
                    <strong>Cooking Time:</strong> {previewData.cookingTime}{" "}
                    minutes
                  </div>
                  <div>
                    <strong>Servings:</strong> {previewData.servings}
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: previewData.content }}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogEditor;
