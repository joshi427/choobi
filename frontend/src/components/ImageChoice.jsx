import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { fetchRandomImages, fetchImageById, submitChoice } from "../api.js";

const ImageChoice = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                const response = await fetchRandomImages();

                // Fetch actual image data
                const leftImageData = await fetchImageById(response.left_image.id);
                const rightImageData = await fetchImageById(response.right_image.id);

                setImages({
                    left_image: { ...response.left_image, image_data: leftImageData },
                    right_image: { ...response.right_image, image_data: rightImageData },
                });

                setLoading(false);
            } catch (err) {
                setError("Failed to load images. Try again.");
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    const handleChoice = async (chosenId) => {
        if (!images) return;
        try {
            await submitChoice(user.token, images.left_image.id, images.right_image.id, chosenId);
            setLoading(true);

            // Fetch new images
            const newResponse = await fetchRandomImages();
            const leftImageData = await fetchImageById(newResponse.left_image.id);
            const rightImageData = await fetchImageById(newResponse.right_image.id);

            setImages({
                left_image: { ...newResponse.left_image, image_data: leftImageData },
                right_image: { ...newResponse.right_image, image_data: rightImageData },
            });

            setLoading(false);
        } catch (err) {
            setError("Error submitting choice. Try again.");
        }
    };

    if (loading) {
        return <div style={loadingStyle}>Loading images...</div>;
    }

    if (error) {
        return <div style={errorStyle}>{error}</div>;
    }

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Which do you prefer?</h2>

            {/* Image Display Section */}
            <div style={imageContainerStyle}>
                <div style={imageWrapperStyle}>
                    <img
                        src={`data:image/png;base64,${images.left_image.image_data}`}
                        alt={images.left_image.title}
                        style={imageStyle}
                    />
                    <button onClick={() => handleChoice(images.left_image.id)} style={choiceButtonStyle}>Choose Left</button>
                </div>

                <div style={imageWrapperStyle}>
                    <img
                        src={`data:image/png;base64,${images.right_image.image_data}`}
                        alt={images.right_image.title}
                        style={imageStyle}
                    />
                    <button onClick={() => handleChoice(images.right_image.id)} style={choiceButtonStyle}>Choose Right</button>
                </div>
            </div>

            {/* Skip & Navigation Buttons */}
            <div style={navButtonContainerStyle}>
                <button onClick={() => handleChoice(null)} style={skipButtonStyle}>Skip</button>
                <button onClick={() => navigate("/profile")} style={profileButtonStyle}>Return to Profile</button>
            </div>
        </div>
    );
};

// **Styles for the components**
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

const imageContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "60px",
    marginBottom: "20px",
};

const imageWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const imageStyle = {
    width: "300px",
    height: "300px",
    objectFit: "contain", // Ensure proper display without distortion
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    padding: "10px",
};

const choiceButtonStyle = {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "100%",
};

const navButtonContainerStyle = {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
};

const skipButtonStyle = {
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "150px",
};

const profileButtonStyle = {
    padding: "12px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    width: "150px",
};

// **Fix: Add `loadingStyle` and `errorStyle`**
const loadingStyle = {
    textAlign: "center",
    fontSize: "20px",
    marginTop: "50px",
};

const errorStyle = {
    textAlign: "center",
    color: "red",
    fontSize: "18px",
};

export default ImageChoice;
