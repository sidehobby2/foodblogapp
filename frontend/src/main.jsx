import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

console.log(" Starting FoodBlog Application...");
console.log("Environment:", import.meta.env.MODE);
console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("Node Env:", import.meta.env.VITE_NODE_ENV);

// Error handling for initial render
try {
  const root = createRoot(document.getElementById("root"));

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );

  console.log(" App rendered successfully");
} catch (error) {
  console.error(" Failed to render app:", error);

  // Show error message in the DOM
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #dc2626;">Application Error</h1>
        <p>Failed to load the application. Please refresh the page.</p>
        <p style="color: #6b7280; font-size: 14px;">Error: ${error.message}</p>
        <button onclick="window.location.reload()" style="background: #ea580c; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 10px;">
          Refresh Page
        </button>
      </div>
    `;
  }
}
