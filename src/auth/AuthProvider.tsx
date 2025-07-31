import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { getToken, logout as logoutAction } from '@/store/slices/authSlice';

interface User {
    id: string;
    name: string; sAndTypes
    email: string;
    password?: string
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DUMMY_USER: User = {
    id: '1',
    name: 'user',
    email: 'user@softtek.com',
    password: 'password123'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // Sigue manejando el estado del usuario de la UI
    const dispatch = useDispatch<AppDispatch>();
    const authStatus = useSelector((state: RootState) => state.auth.status);

    useEffect(() => {
        // Sincronizar el estado del usuario de la UI con el estado de autenticación de la API
        if (authStatus === 'succeeded') {
            setUser(DUMMY_USER);
        } else {
            setUser(null);
        }
    }, [authStatus]);

    const login = async (email: string, password: string): Promise<boolean> => {
        if (email === DUMMY_USER.email && password === 'password123') {
            try {
                // Despachar la acción para obtener el token con las nuevas credenciales
                await dispatch(getToken({ username: "martin.gimenezartero@softtek.com", password: "Tinchogi500--" })).unwrap();
                return true;
            } catch (error) {
                console.error("API Login failed:", error);
                return false;
            }
        }
        return false;
    };

    const logout = () => {
        dispatch(logoutAction());
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
