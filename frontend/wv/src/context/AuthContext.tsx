import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    userType: "user" | "shop" | "admin" | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    setAuthenticated: (authenticated: boolean, type?: "user" | "shop" | "admin" | null) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userType, setUserType] = useState<"user" | "shop" | "admin" | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        console.log('🔍 AuthContext: Checking authentication...');
        try {
            const token = await AsyncStorage.getItem('authToken');
            const type = await AsyncStorage.getItem('userType') as "user" | "shop" | "admin" | null;

            const hasToken = !!token;
            console.log('🔍 AuthContext: checkAuth result:', { hasToken, type, token: token ? 'EXISTS' : 'MISSING' });

            setIsAuthenticated(hasToken);
            setUserType(type);
        } catch (error) {
            console.error('AuthContext: Error checking auth:', error);
            setIsAuthenticated(false);
            setUserType(null);
        } finally {
            setIsLoading(false);
        }
    };

    const setAuthenticated = async (authenticated: boolean, type: "user" | "shop" | "admin" | null = null) => {
        console.log('🔄 AuthContext: Setting auth:', authenticated, 'Type:', type);
        setIsAuthenticated(authenticated);
        setUserType(type);
        try {
            if (authenticated && type) {
                await AsyncStorage.setItem('userType', type);
            } else {
                await AsyncStorage.removeItem('userType');
            }
        } catch (error) {
            console.error('AuthContext: Error saving userType:', error);
        }
    };

    const logout = async () => {
        try {
            console.log('🚪 AuthContext: Logging out...');
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userType');
            setAuthenticated(false, null);
        } catch (error) {
            console.error('AuthContext: Logout error:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userType, isLoading, checkAuth, setAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
