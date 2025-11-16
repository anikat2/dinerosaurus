import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));

root.render(
  // Remove StrictMode if you don't want double rendering
  <App />
);
