// src/App.jsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

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
import Game from './pages/Game';

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

    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                // Öffentlich
                { path: "/", element: <Home /> },
                { path: "/verify-email", element: <VerifyEmail /> },

                // NUR für NICHT angemeldete User
                {
                    path: "/login",
                    element: (
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    ),
                },
                {
                    path: "/register",
                    element: (
                        <GuestRoute>
                            <Register />
                        </GuestRoute>
                    ),
                },
                {
                    path: "/forgot-password",
                    element: (
                        <GuestRoute>
                            <ForgotPassword />
                        </GuestRoute>
                    ),
                },
                {
                    path: "/reset-password",
                    element: (
                        <GuestRoute>
                            <ResetPassword />
                        </GuestRoute>
                    ),
                },

                // NUR für angemeldete User
                {
                    path: "/new-game",
                    element: (
                        <ProtectedRoute>
                            <NewGame />
                        </ProtectedRoute>
                    ),
                },
                { path: "/game-summary", element: <GameSummary /> },
                {
                    path: "/game",
                    element: (
                        <ProtectedRoute>
                            <Game />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/change-password",
                    element: (
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    ),
                },

                // Admin-Bereich
                {
                    path: "/admin/*",
                    element: (
                        <AdminRoute>
                            <Dashboard />
                        </AdminRoute>
                    ),
                },

                // Fallback
                { path: "*", element: <Navigate to="/" replace /> },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
