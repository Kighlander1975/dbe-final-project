// src/context/UnsavedChangesContext.jsx
import React, { createContext, useContext, useState } from 'react';

const UnsavedChangesContext = createContext();

export const useUnsavedChanges = () => {
    const context = useContext(UnsavedChangesContext);
    if (!context) {
        throw new Error('useUnsavedChanges must be used within UnsavedChangesProvider');
    }
    return context;
};

export const UnsavedChangesProvider = ({ children }) => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    return (
        <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges }}>
            {children}
        </UnsavedChangesContext.Provider>
    );
};