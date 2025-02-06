import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext.jsx";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import UserProfile from "./components/UserProfile.jsx";
import ImageChoice from "./components/ImageChoice.jsx";
import Rankings from "./components/Rankings.jsx";

const Home = () => {
    const { user } = useContext(AuthContext);

    console.log("Checking authentication state:", user); // Debugging log

    if (user) {
        console.log("User is authenticated, redirecting to /image-choice");
        return <Navigate to="/image-choice" />;
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",  // Centers vertically
            alignItems: "center",       // Centers horizontally
            height: "100vh",            // Full viewport height
            width: "100vw",             // Full viewport width
            textAlign: "center",
            backgroundColor: "#f0f0f0", // Light background for contrast
        }}>
            <h1 style={{ marginBottom: "20px" }}>Welcome to Choobi</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                <button
                    style={{
                        padding: "15px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                    onClick={() => window.location.href = "/login"}
                >
                    Login
                </button>
                <button
                    style={{
                        padding: "15px 30px",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                    onClick={() => window.location.href = "/register"}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/image-choice" element={<ImageChoice />} />
                    <Route path="/rankings" element={<Rankings />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
