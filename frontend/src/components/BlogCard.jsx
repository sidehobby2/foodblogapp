import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Edit3 } from "lucide-react";

const BlogCard = ({ blog, onDelete }) => {
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxLength = 150) => {
    const text = stripHtml(content);
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getReadingTime = (content) => {
    const text = stripHtml(content);
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const extractFirstImage = (html) => {
    const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  const firstImage = extractFirstImage(blog.content);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300">
      {firstImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={firstImage}
            alt={blog.title}
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="p-6">
        <Link to={`/blog/${blog._id}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-orange-600 mb-3 transition duration-200 font-serif">
            {blog.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 leading-relaxed">
          {truncateContent(blog.content)}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{getReadingTime(blog.content)} min read</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/edit/${blog._id}`}
              className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 text-sm font-medium transition duration-200"
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => onDelete(blog._id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium transition duration-200"
            >
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
