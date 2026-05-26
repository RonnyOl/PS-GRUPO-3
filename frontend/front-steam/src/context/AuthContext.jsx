"use client";

import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        // 3. Condición: Si el usuario está en /login o /register, NO llamamos al backend
        if (pathname === "/login" || pathname === "/registerdev") {
            setLoading(false);
            return;
        }

        axios.get('http://localhost:8080/v1/auth/user/me', { withCredentials: true })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                // Manejo silencioso: si falla, asumimos que no está logueado (user = null)
                setUser(null);
                setLoading(false);
            });

    }, [pathname]); // 👈 4. Agregamos 'pathname' como dependencia para que evalúe cada vez que cambia de ruta

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