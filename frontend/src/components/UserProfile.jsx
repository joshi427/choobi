import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "#f0f0f0",
            }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "#f0f0f0",
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                width: "350px",
                textAlign: "center",
            }}>
                <h2 style={{ marginBottom: "20px" }}>User Profile</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email || "No email provided"}</p>

                {/* Navigation Buttons */}
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button
                        onClick={() => navigate("/image-choice")}
                        style={navButtonStyle}
                    >
                        Rate Images
                    </button>
                    <button
                        onClick={() => navigate("/rankings")}
                        style={navButtonStyle}
                    >
                        View Rankings
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        style={navButtonStyle}
                    >
                        Return to Profile
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    style={{
                        marginTop: "20px",
                        padding: "12px",
                        fontSize: "18px",
                        cursor: "pointer",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        width: "100%",
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

// Shared button styling
const navButtonStyle = {
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "100%",
};

export default UserProfile;
