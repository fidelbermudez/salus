import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    // Check if user is logged in
    const isLoggedIn = () => {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        return true;
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        isLoggedIn: isLoggedIn(),  // Changed from a method to a boolean value
        logout   // Provide logout method to components
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
