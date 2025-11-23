// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext"; // ⭐ ZUERST importieren
import { AuthProvider } from "./context/AuthContext";   // ⭐ DANACH importieren
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <ToastProvider>      {/* ⭐ 1. ToastProvider AUSSEN */}
                <AuthProvider>   {/* ⭐ 2. AuthProvider INNEN */}
                    <App />
                </AuthProvider>
            </ToastProvider>
        </Router>
    </React.StrictMode>
);
