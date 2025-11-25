// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AdminRoute from "./components/AdminRoute";

// Pages - Öffentlich
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from './pages/ChangePassword'
import VerifyEmail from "./pages/VerifyEmail";

// Pages - Geschützt
import NewGame from "./pages/NewGame";
import GameSummary from './pages/GameSummary';

// Pages - Admin
import Dashboard from "./pages/admin/Dashboard";

// API Loading Handlers
import { useLoading } from "./context/LoadingContext";
import { setLoadingHandlers } from "./services/api";

function App() {
    // Verbinde den LoadingContext mit der API
    const { startLoading, stopLoading } = useLoading();

    useEffect(() => {
        // Setze die Loading-Handler für die API
        setLoadingHandlers({ startLoading, stopLoading });
    }, [startLoading, stopLoading]);

    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Öffentlich */}
                <Route path="/" element={<Home />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                {/* NUR für NICHT angemeldete User */}
                <Route
                    path="/login"
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        <GuestRoute>
                            <ForgotPassword />
                        </GuestRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <GuestRoute>
                            <ResetPassword />
                        </GuestRoute>
                    }
                />

                {/* NUR für angemeldete User */}
                <Route
                    path="/new-game"
                    element={
                        <ProtectedRoute>
                            <NewGame />
                        </ProtectedRoute>
                    }
                />

                <Route path="/game-summary" element={<GameSummary />} />

                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* ⭐ Admin-Bereich mit Unterseiten */}
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}

export default App;
