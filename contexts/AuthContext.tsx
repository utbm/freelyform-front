// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the AuthContext
export type JwtToken = string;

interface AuthContextType {
  token: JwtToken | null;
  setToken: (token: JwtToken | null) => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => useContext(AuthContext);

// AuthProvider component to wrap the app and provide AuthContext
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<JwtToken | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
