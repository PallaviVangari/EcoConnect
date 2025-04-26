import { useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Config from "../config/config";
import { ApiClient } from "../Utilities/ApiClient.tsx"; // Use your clean apiClient

interface User {
    id: string;
    userName: string;
    password: string;
    email: string;
    role: string;
    followers: string[];
    following: string[];
}

const RegisterUser: React.FC = () => {
    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
    const hasRun = useRef(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            if (hasRun.current) return;
            hasRun.current = true;

            const createUser = async () => {
                try {
                    const token = await getAccessTokenSilently();

                    const userData: User = {
                        id: user.sub,
                        userName: user.nickname || user.name || "DefaultUser",
                        password: "", // Auth0 handles authentication
                        email: user.email || "default@email.com",
                        role: "USER",
                        followers: [],
                        following: []
                    };

                    console.log("Sending user data to backend:", userData);

                    const response = await ApiClient.post(
                        `/api/users/create`,
                        userData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
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

            createUser();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    return null; // No UI
};

export default RegisterUser;
