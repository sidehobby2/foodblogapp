import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ChefHat } from "lucide-react";
import api from "../utils/api"; // Changed from axios to api
import BlogCard from "../components/BlogCard";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/blogs"); // Changed to api
      const blogsData = response.data.data || response.data;
      setBlogs(blogsData);
      setFilteredBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      alert("Failed to load recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/blogs/${blogId}`); // Changed to api
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="ltr">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
              All Recipes
            </h1>
            <p className="text-gray-600">
              Discover and manage your delicious recipes
            </p>
          </div>
          <Link
            to="/create"
            className="bg-orange-600 text-white px-6 py-3 rounded-xl hover:bg-orange-700 transition duration-200 flex items-center space-x-2 mt-4 md:mt-0 font-medium"
          >
            <Plus size={20} />
            <span>New Recipe</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>

        {/* Empty State */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              {searchTerm ? (
                <Search className="text-gray-400" size={32} />
              ) : (
                <ChefHat className="text-gray-400" size={32} />
              )}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 font-serif">
              {searchTerm ? "No matching recipes found" : "No recipes yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or browse all recipes"
                : "Be the first to create and share a delicious recipe with our community!"}
            </p>
            {!searchTerm && (
              <Link
                to="/create"
                className="bg-orange-600 text-white px-8 py-3 rounded-xl hover:bg-orange-700 transition duration-200 inline-flex items-center space-x-2 font-medium"
              >
                <Plus size={20} />
                <span>Create Your First Recipe</span>
              </Link>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
