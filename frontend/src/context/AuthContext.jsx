import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // {role: 'admin' | 'teacher' | 'student', token: '...'}

    // Load user from localStorage on first render
    useEffect(() => {
        const raw = localStorage.getItem('ustadi_user');
        if (raw) {
            setUser(JSON.parse(raw));
        }
    }, []);

    // persist whenever user changes

    useEffect(() => {
        if (user) localStorage.setItem('ustadi_user', JSON.stringify(user))
            else localStorage.removeItem('ustadi_user')
    }, [user])

    const login = ({token, role }) => {
        setrUser({ token, role})
    }
    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
    }
export function useAuth() {
    return useContext(AuthContext);
}