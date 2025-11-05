import React from "react";
import { useAuth } from "../context/AuthContext";

const DebugInfo = () => {
  const { user, loading } = useAuth();

  if (import.meta.env.VITE_NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">Debug Info:</div>
      <div>API URL: {import.meta.env.VITE_API_URL || "Not set"}</div>
      <div>Environment: {import.meta.env.MODE}</div>
      <div>User: {user ? "Logged in" : "Not logged in"}</div>
      <div>Loading: {loading ? "Yes" : "No"}</div>
      <div>Build: {import.meta.env.VITE_NODE_ENV}</div>
    </div>
  );
};

export default DebugInfo;
