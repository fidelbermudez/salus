import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Moved to a state

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(Boolean(token));  // Set initial logged in state
    }, []);

    const logout = () => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
        setIsLoggedIn(false); 
    };

    const value = {
        currentUser,
        setCurrentUser,
        isLoggedIn, 
        logout
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
