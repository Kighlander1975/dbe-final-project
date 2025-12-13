// src/context/UserContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { userAPI } from '../services/api';

const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastLoaded, setLastLoaded] = useState(null);

    const clearCache = useCallback(() => {
        sessionStorage.removeItem('availableEmails');
        localStorage.removeItem('users_1_all'); // Auch localStorage leeren
        console.log("🗑️ User-Cache geleert");
    }, []);

    const loadUsers = useCallback(async (force = false) => {
        console.log("Loading users with force:", force);
        // Cache prüfen (sessionStorage)
        const cached = sessionStorage.getItem('availableEmails');
        const now = Date.now();

        if (!force && cached) {
            const { data, timestamp } = JSON.parse(cached);
            // Cache gültig für 5 Minuten (wiederhergestellt)
            if (now - timestamp < 5 * 60 * 1000) {
                console.log("📥 User-Liste aus Cache geladen");
                setUsers(data);
                setLastLoaded(timestamp);
                return data;
            }
        }

        // Neu laden
        try {
            setLoading(true);
            console.log("📥 User-Liste neu geladen");
            const response = await userAPI.getAll();
            const userData = response.data || response;
            const emailList = userData.map((user) => ({
                email: user.email,
                name: user.name,
                id: user.id,
            }));

            setUsers(emailList);
            setLastLoaded(now);
            // Cache aktualisieren
            sessionStorage.setItem('availableEmails', JSON.stringify({ data: emailList, timestamp: now }));
            return emailList;
        } catch (error) {
            console.error("❌ Fehler beim Laden der User:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        users,
        loading,
        lastLoaded,
        loadUsers,
        clearCache, // 🆕 Cache leeren Funktion
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};