import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ShivProvider } from "./context/ShivContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ShivProvider>
      <App />
    </ShivProvider>
  </React.StrictMode>
);
