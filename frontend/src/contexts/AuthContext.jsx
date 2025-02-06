import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (err) {
            console.error("Error loading user from localStorage:", err);
            return null;
        }
    });

    useEffect(() => {
        if (user?.token) {
            fetchUserProfile(user.token)
                .then((profile) => {
                    setUser((prevUser) => ({
                        ...prevUser,
                        ...profile,
                    }));
                    localStorage.setItem("user", JSON.stringify({ ...user, ...profile }));
                })
                .catch(() => {
                    console.error("Failed to fetch user profile, logging out.");
                    logout();
                });
        }
    }, [user?.token]);

    const login = (token) => {
        console.log("Storing token:", token);
        const newUser = { token };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const logout = () => {
        console.warn("Logging out...");
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
