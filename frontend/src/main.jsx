// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ToastProvider } from "./context/ToastContext"; // ⭐ ZUERST importieren
import { AuthProvider } from "./context/AuthContext";   // ⭐ DANACH importieren
import { LoadingProvider } from "./context/LoadingContext"; // ⭐ NEU: LoadingProvider
import { UserProvider } from "./context/UserContext"; // 🆕 UserProvider
import App from "./App";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ToastProvider>      {/* ⭐ 1. ToastProvider AUSSEN */}
            <LoadingProvider> {/* ⭐ 2. LoadingProvider */}
                <UserProvider>   {/* 🆕 4. UserProvider */}
                    <AuthProvider>   {/* ⭐ 3. AuthProvider INNEN */}
                        <App />
                    </AuthProvider>
                </UserProvider>
            </LoadingProvider>
        </ToastProvider>
    </React.StrictMode>
);