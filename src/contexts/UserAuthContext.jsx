import { createContext, useContext, useState, useEffect } from "react";

// Store the JWT token
const UserAuthContext = createContext("");

// Manage the token state
export function UserAuthContextProvider({ children }) {
    // Get token from localStorage on first render or set it to an empty string
    const [token, setToken] = useState(() => {
        return localStorage.getItem("authToken") || "";
    });

    // Store token in localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("authToken", token);
        }
    }, [token]);

    // Function to log out and clear the token
    const logout = () => {
        setToken("");
        localStorage.removeItem("authToken");
    };

    return (
        <UserAuthContext.Provider value={{ token, setToken, logout }}>
            {children}
        </UserAuthContext.Provider>
    );
}

// Custom hook to use the token, setToken, and logout
export function useUserAuthContext() {
    return useContext(UserAuthContext);
}
