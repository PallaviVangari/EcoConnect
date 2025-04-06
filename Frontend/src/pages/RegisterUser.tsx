import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

// Define a User type to match the backend model
interface User {
    id: string;  // Unique ID from Auth0 (sub)
    userName: string;
    password: string; // Auth0 does not require this here
    email: string;
    role: string;
    followers: string[];
    following: string[];
}

const RegisterUser: React.FC = () => {
    const { user, isAuthenticated } = useAuth0(); // Get user details from Auth0
    const hasRun = useRef(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (hasRun.current) return;
            hasRun.current = true;

            const createUser = async () => {
                try {
                    // Ensure user details are not undefined
                    const userData: User = {
                        id: user.sub, // Unique Auth0 user ID
                        userName: user.nickname || user.name || "DefaultUser", // Default to "DefaultUser" if undefined
                        password: "", // No password needed, as Auth0 handles authentication
                        email: user.email || "default@email.com", // Provide a default email if undefined
                        role: "USER", // Default role
                        followers: [], // Default empty followers set
                        following: [] // Default empty following set
                    };

                    console.log("Sending user data to backend:", userData);

                    // Make the POST request to register the user
                    const response = await axios.post(
                        "http://localhost:8050/api/users/create",
                        userData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    console.log("User registered successfully:", response.data);
                } catch (error: any) {
                    if (error.response && error.response.status === 409) {
                        console.warn("User already exists:", error.response.data);
                    } else {
                        console.error("Error registering user:", error);
                    }
                }
            };

            // Call the createUser function after checking that the user is authenticated
            createUser();
        }
    }, [isAuthenticated, user]); // Runs when user logs in

    return null; // This component does not render anything
};

export default RegisterUser;
