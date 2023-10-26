import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // Loading state

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('authToken');

        if (tokenFromStorage) {
            const fetchCurrentUser = async () => {
                try {
                    const response = await fetch('http://localhost:8081/api/users/me', {
                        headers: {
                            'Authorization': 'Bearer ' + tokenFromStorage,
                        },
                    });

                    if (response.status === 200) {
                        const userData = await response.json();
                        setCurrentUser(userData);
                    } else {
                        const data = await response.json();
                        console.log(data.message);
                        throw new Error(data.message || 'Invalid token');
                    }
                } catch (error) {
                    setCurrentUser(null);
                    localStorage.removeItem('authToken');
                    console.error('Failed to fetch user:', error);
                } finally {
                    setIsLoading(false);  // Done loading
                }
            };

            fetchCurrentUser();
        } else {
            setIsLoading(false);  // No token, so done loading
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('name', userData.name);
        setCurrentUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        setCurrentUser(null);
        setIsLoggedIn(false); 
    };

    const value = {
        currentUser,
        setCurrentUser,
        isLoggedIn: !!currentUser,  // Boolean value based on currentUser
        login,
        logout,
        isLoading  // For components to check if they should display a loader or not
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
