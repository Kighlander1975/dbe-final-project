// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext"; // ⭐ ZUERST importieren
import { AuthProvider } from "./context/AuthContext";   // ⭐ DANACH importieren
import { LoadingProvider } from "./context/LoadingContext"; // ⭐ NEU: LoadingProvider
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router>
            <ToastProvider>      {/* ⭐ 1. ToastProvider AUSSEN */}
                <LoadingProvider> {/* ⭐ 2. LoadingProvider */}
                    <AuthProvider>   {/* ⭐ 3. AuthProvider INNEN */}
                        <App />
                    </AuthProvider>
                </LoadingProvider>
            </ToastProvider>
        </Router>
    </React.StrictMode>
);