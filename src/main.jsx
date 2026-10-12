import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Catatan: index.css bawaan Vite sengaja TIDAK di-import,
// karena aturan #root-nya membuat tata letak warung jadi lebar 0.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
