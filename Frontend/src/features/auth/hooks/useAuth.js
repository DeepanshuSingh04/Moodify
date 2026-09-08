import { login, register, logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const context = useContext(AuthContext);

    const { user, setUser, loading, setLoading } = context;

    async function handleRegister({ username, email, password }) {
        setLoading(true);

        try {
            const data = await register({ username, email, password });
            setUser(data.user);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true);

        try {
            const data = await login({ username, email, password });
            setUser(data.user);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    };
};