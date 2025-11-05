import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BlogEditor from "./pages/BlogEditor";
import BlogPost from "./pages/BlogPost";
import BlogList from "./pages/BlogList";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyBlogs from "./pages/MyBlogs";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white" dir="ltr">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/my-blogs" element={<MyBlogs />} />
              <Route path="/create" element={<BlogEditor />} />
              <Route path="/edit/:id" element={<BlogEditor />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
