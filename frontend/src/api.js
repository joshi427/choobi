import axios from "axios";

const API_URL = "http://localhost:8000";

// Function to log in a user
export const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        for (const key in credentials) {
            params.append(key, credentials[key]);
        }

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

// Function to register a user
export const registerUser = async (userData) => {
    try {
        await axios.post(`${API_URL}/auth/register`, userData);
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// Function to fetch the current user's profile
export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

// Function to fetch two random images
export const fetchRandomImages = async () => {
    try {
        const response = await axios.get(`${API_URL}/images/random-images/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching random images:", error);
        throw error;
    }
};

// Function to fetch an image by its ID
export const fetchImageById = async (imageId) => {
    try {
        const response = await axios.get(`${API_URL}/images/image/${imageId}`, {
            responseType: "arraybuffer",
        });

        return btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
            )
        );
    } catch (error) {
        console.error("Error fetching image by ID:", error);
        throw error;
    }
};

// Function to submit user choice
export const submitChoice = async (token, leftImageId, rightImageId, chosenImageId) => {
    try {
        const response = await axios.post(
            `${API_URL}/interactions/interaction/`,
            {
                left_image_id: leftImageId,
                right_image_id: rightImageId,
                chosen_image_id: chosenImageId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting choice:", error);
        throw error;
    }
};

// Function to fetch rankings for the logged-in user
export const fetchRankings = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/rankings/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching rankings:", error);
        throw error;
    }
};

export const fetchUserRankings = async (token) => {
    try {
        const response = await axios.get("http://localhost:8000/rankings/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching rankings:", error);
        throw error;
    }
};
