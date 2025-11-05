import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PenSquare, Home, BookOpen, ChefHat, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm" dir="ltr">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
              <ChefHat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                FoodBlog
              </h1>
              <p className="text-sm text-gray-600">Celebrating whole foods!</p>
            </div>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                isActive("/")
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-700 hover:text-orange-600"
              }`}
            >
              <Home size={20} />
              <span className="font-medium">Home</span>
            </Link>
            <Link
              to="/blogs"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                isActive("/blogs")
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-700 hover:text-orange-600"
              }`}
            >
              <BookOpen size={20} />
              <span className="font-medium">All Recipes</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-blogs"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                    isActive("/my-blogs")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <BookOpen size={20} />
                  <span className="font-medium">My Recipes</span>
                </Link>
                <Link
                  to="/create"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${
                    isActive("/create")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <PenSquare size={20} />
                  <span className="font-medium">Write Recipe</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition duration-200"
                  >
                    <User size={20} />
                    <span className="font-medium">
                      {user.profile?.displayName || user.username}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-200"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
