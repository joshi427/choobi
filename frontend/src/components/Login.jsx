import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { loginUser } from "../api.js";  // Ensure this is imported

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const { login } = useContext(AuthContext);
    const navigate = useNavigate(); // Ensure navigation is included

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData); // Pass formData correctly
            console.log("Login successful, token received:", data.access_token);

            login(data.access_token);  // Store token in AuthContext
            navigate("/profile");  // Redirect to profile after login
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <h2 style={{ marginBottom: "20px" }}>Login</h2>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

// **Styles for the components**
const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f0f0f0",
};

const formContainerStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
};

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
};

const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
};

const buttonStyle = {
    padding: "12px",
    fontSize: "18px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "100%",
};

export default Login;
