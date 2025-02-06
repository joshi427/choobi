import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { fetchUserRankings } from "../api.js";

const Rankings = () => {
    const { user } = useContext(AuthContext);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRankings = async () => {
            try {
                const data = await fetchUserRankings(user.token);
                setRankings(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to load rankings.");
                setLoading(false);
            }
        };

        loadRankings();
    }, [user]);

    if (loading) {
        return <div style={loadingStyle}>Loading rankings...</div>;
    }

    if (error) {
        return <div style={errorStyle}>{error}</div>;
    }

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Your Image Rankings</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Image Title</th>
                        <th style={tableHeaderStyle}>ELO Score</th>
                    </tr>
                </thead>
                <tbody>
                    {rankings.map((rank, index) => (
                        <tr key={index}>
                            <td style={tableCellStyle}>{rank.title}</td>
                            <td style={tableCellStyle}>{rank.elo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// **Styling for a consistent layout**
const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
};

const titleStyle = {
    fontSize: "24px",
    marginBottom: "20px",
};

const tableStyle = {
    borderCollapse: "collapse",
    width: "60%",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
};

const tableHeaderStyle = {
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px",
    fontSize: "18px",
};

const tableCellStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "center",
    fontSize: "16px",
};

const loadingStyle = {
    fontSize: "18px",
    marginTop: "20px",
};

const errorStyle = {
    color: "red",
    fontSize: "18px",
    marginTop: "20px",
};

export default Rankings;
