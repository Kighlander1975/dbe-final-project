// src/App.jsx
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./layouts/MainLayout";

// Components
import ProtectedRoute, { GameCreatorRoute } from "./components/ProtectedRoute";
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
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";

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
                { path: "/forbidden", element: <Forbidden /> },

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
                        <GameCreatorRoute>
                            <NewGame />
                        </GameCreatorRoute>
                    ),
                },
                { path: "/game-summary", element: <GameSummary /> },
                {
                    path: "/game/:id",
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

                // Error Pages
                { path: "/server-error", element: <ServerError /> },

                // 404 - muss als letztes kommen
                { path: "*", element: <NotFound /> },

                // Fallback
                { path: "*", element: <Navigate to="/" replace /> },
            ],
        },
    ], {
        future: {
            v7_startTransition: true,
        },
    });

    return <RouterProvider router={router} />;
}

export default App;
