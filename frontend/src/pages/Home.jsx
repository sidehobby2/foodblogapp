import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Search, Clock, Users } from "lucide-react";
import api from "../utils/api"; // Changed from axios to api

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await api.get("/api/blogs"); // Changed to api
      const blogs = response.data.data || response.data;
      setFeaturedBlogs(blogs.slice(0, 3)); // Show first 3 as featured
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxLength = 120) => {
    const text = stripHtml(content);
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <ChefHat className="text-orange-600" size={48} />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 font-serif">
              Celebrating Whole Foods!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover delicious, healthy recipes made with real ingredients.
              From breakfast to dessert, find your next favorite meal.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/blogs"
                className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>Explore Recipes</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/create"
                className="bg-white text-orange-600 border border-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition duration-200"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-serif">
            Featured Recipes
          </h2>

          {featuredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300"
                >
                  <div className="p-6">
                    <Link to={`/blog/${blog._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 mb-3 transition duration-200 font-serif">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {truncateContent(blog.content)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Read Recipe →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg mb-6">
                No recipes yet. Be the first to share!
              </p>
              <Link
                to="/create"
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition duration-200"
              >
                Create First Recipe
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 font-serif">
            Recipe Categories
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Breakfast", "Lunch", "Dinner", "Dessert"].map((category) => (
              <div
                key={category}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center hover:shadow-lg transition duration-300"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category}
                </h3>
                <p className="text-gray-600">
                  Delicious {category.toLowerCase()} recipes
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 font-serif">
            Ready to Share Your Recipe?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of food lovers and share your favorite recipes
            with the world.
          </p>
          <Link
            to="/create"
            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 inline-flex items-center space-x-2"
          >
            <span>Start Writing</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
