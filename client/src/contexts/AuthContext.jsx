import {createContext, useEffect, useState} from 'react'

import { getAuth, signInApi } from '../api/userApi';

import PropTypes from 'prop-types';

import { useNavigate, useLocation } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect (
        () => {
            const checkAuthStatus = async () =>{
                setIsAuthLoading(true)
                try{
                    await getAuth()
                    setIsAuthenticated(true)
                }catch{
                    setIsAuthenticated(false)
                }finally{
                    setIsAuthLoading(false)
                }
            }
            checkAuthStatus();
        }, [location.pathname]
    )

    const authSignIn = async (username, password) => {
        try {
            const response = await signInApi(username, password);
            if (response.success) {
                navigate(`/profile/${username}`, {state: {from: location.pathname}})
            } else {
                alert(response.message || "Invalid username or password");
            }
        } catch (error) {
            alert("An unexpected error occurred. Please try again later.");
            console.error("Sign-in error:", error);
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, isAuthLoading, authSignIn}}>
            {children}
        </AuthContext.Provider>
    )
    
}

AuthProvider.propTypes= {
    children: PropTypes.node.isRequired,
}


export default AuthContext
