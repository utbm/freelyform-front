// types/AuthenticationInterfaces.ts

// Interface used to cast result of a register form to the Service
export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Interface used to cast result of a login form to the Service
export interface LoginUserRequest {
  email: string;
  password: string;
}

// Default interface to cast the user from the JWT
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sub: string;
}
