import React, { createContext, useContext, useState } from 'react';
import {useNavigate} from "react-router-dom"


// Create a new context
export const NavContext = createContext();

// Create a custom hook for using the context
export function useNavContext() {
    return useContext(NavContext);
}

// Create the context provider component
export function NavContextProvider({children}) {
    // useNavigate hook
    const navigate = useNavigate();
    // Track sign-in status: 
    // null or "" for signed out
    // email for signed in
    const [loginStatus, setLoginStatus] = useState("");


    // Function to handle return to home
    const goToHome = () => {
        navigate("/home");
    }
    // Function to handle navigating to user sign-in page
    const goToSignIn = () => {
        navigate("/login");
    };
    // Function to handle navigating to user sign-up page
    const goToSignUp = () => {
        navigate("/register");
    };
    // Function to handle navigating to photo upload page
    const goToUploadPics = () => {
        navigate("/upload");
    }
    // Function to handle navigating to photo upload page
    const goToCollection = () => {
        navigate("/collection");
    }
    
    // Function to handle user sign-in
    const signUserIn = (email) => {
        setLoginStatus(email);
        localStorage.setItem("user", email);
    };
    // Function to handle user sign-out
    const signUserOut = () => {
        setLoginStatus("");
        localStorage.setItem("user", "");
    };


    // object of all props
    const contextValue = {
        // states
        loginStatus, 
        // nav functions
        goToHome, goToSignIn, goToSignUp, goToUploadPics, goToCollection,
        // sign in/out functions
        signUserIn, signUserOut
    }

    return (
        <NavContext.Provider value={contextValue}>
            {children}
        </NavContext.Provider>
    );
}
