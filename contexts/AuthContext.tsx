// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * This defines the shape of the AuthContext, which includes the token and a function to set the token.
 */
// Define the type of the JWT token as a string
export type JwtToken = string;

/**
 * This interface defines the shape of the AuthContext.
 * - token: The JWT token, which can be a string or null.
 * - setToken: A function to update the token value. It accepts a JWT token or null.
 */
interface AuthContextType {
  token: JwtToken | null;
  setToken: (token: JwtToken | null) => void;
}

// Create the AuthContext with default values.
// - token: Initially set to null, meaning the user is not authenticated by default.
// - setToken: A placeholder function that does nothing. It will be replaced by the actual state updater when the context is used.
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

/**
 * Custom hook to access the AuthContext.
 * This hook provides the current token and the function to update the token.
 * It ensures that the context is used correctly throughout the app.
 *
 * @returns {AuthContextType} The current token and the setToken function from AuthContext.
 */
export const useAuth = (): AuthContextType => useContext(AuthContext);

/**
 * AuthProvider component.
 * This component wraps around the application (or specific parts of it) and provides the authentication context (AuthContext).
 * It uses the useState hook to manage the token value, which is shared via the context.
 *
 * @param {ReactNode} children - The components or elements that will have access to the AuthContext.
 * @returns {JSX.Element} The provider component that supplies the token and setToken to its children.
 */
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
