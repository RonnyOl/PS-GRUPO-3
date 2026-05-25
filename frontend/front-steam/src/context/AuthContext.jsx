"use client";

import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios.get('http://localhost:8080/v1/auth/user/me', { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setLoading(false);

            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}