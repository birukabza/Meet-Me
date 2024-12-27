import { createContext, useEffect, useState } from 'react';
import { getAuth, signInApi } from '../api/userApi';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [currentUsername, setCurrentUsername] = useState(null);  

    const location = useLocation();

    useEffect(() => {
        const checkAuthStatus = async () => {
            setIsAuthLoading(true);
            try {
                const response = await getAuth();
                setIsAuthenticated(true);
                setCurrentUsername(response.username)
            } catch {
                setIsAuthenticated(false);
                setCurrentUsername(null);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuthStatus();
    }, [location.pathname]);

    const authSignIn = async (username, password) => {
        try {
            const response = await signInApi(username, password);
            const userData = response.user;
            localStorage.setItem("user", JSON.stringify({
                "user_id": userData.user_id, 
                "username": userData.username,
                "first_name": userData.first_name,
                "last_name": userData.last_name,
                "bio": userData.bio,
                "avatar": userData.avatar,
            }))
            if (response.success) {
                setTimeout(() => {
                    window.location.href = `/profile/${username}`;
                }, 1000);
            } else {
                alert(response.message || 'Invalid username or password');
            }
        } catch (error) {
            alert('An unexpected error occurred. Please try again later.');
            console.error('Sign-in error:', error);
        }
    };
    

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, authSignIn, currentUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
