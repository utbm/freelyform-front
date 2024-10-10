export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
