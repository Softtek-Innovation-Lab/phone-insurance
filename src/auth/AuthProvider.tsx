import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User } from '@/types';
import { DUMMY_USER } from '@/data/user';
import { AppDispatch, RootState } from '@/store';
import { getToken, logout as logoutAction } from '@/store/slices/authSlice';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();
    const authStatus = useSelector((state: RootState) => state.auth.status);

    // Derivar el estado del usuario directamente del store de Redux
    // Esto elimina el retraso del useEffect y soluciona el problema de redirección
    const user = authStatus === 'succeeded' ? DUMMY_USER : null;

    const login = async (email: string, password: string): Promise<boolean> => {
        if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
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

    // El `user` en el array de dependencias ahora se actualiza instantáneamente con el store
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
