import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, ArrowLeft, Edit3, Clock, ChefHat } from "lucide-react";
import api from "../utils/api"; // Changed from axios to api
import { useAuth } from "../context/AuthContext";

const BlogPost = () => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/blogs/${id}`); // Changed to api
      const blogData = response.data.data || response.data;
      setBlog(blogData);
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to load recipe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/api/blogs/${id}`); // Changed to api
      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete recipe");
    }
  };

  const getReadingTime = (content) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = content;
    const text = tmp.textContent || tmp.innerText || "";
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <ChefHat className="mx-auto text-gray-400 mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-800 mb-4 font-serif">
            Recipe Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blogs"
            className="text-orange-600 hover:text-orange-800 flex items-center space-x-2 justify-center font-medium"
          >
            <ArrowLeft size={18} />
            <span>Back to Recipes</span>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(blog.content);
  const isAuthor = user && blog.author._id === user._id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blogs"
          className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-800 mb-6 transition duration-200 font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Recipes</span>
        </Link>

        {/* Blog Content */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <ChefHat className="text-orange-600" size={32} />
              <span className="text-orange-600 font-medium">Recipe</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>
                  By {blog.author.profile?.displayName || blog.author.username}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
            <p className="text-lg text-gray-700 italic">{blog.summary}</p>
          </div>

          {/* Recipe Info */}
          <div className="grid md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {blog.cookingTime}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {blog.servings}
              </div>
              <div className="text-sm text-gray-600">Servings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {blog.category}
              </div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
          </div>

          {/* Content */}
          <div className="blog-content p-8">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Actions - Only show if user is the author */}
          {isAuthor && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <Link
                  to={`/edit/${blog._id}`}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-200 flex items-center space-x-2 font-medium"
                >
                  <Edit3 size={18} />
                  <span>Edit Recipe</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                >
                  Delete Recipe
                </button>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
