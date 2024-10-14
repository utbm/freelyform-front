// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the AuthContext
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => useContext(AuthContext);

// AuthProvider component to wrap the app and provide AuthContext
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
