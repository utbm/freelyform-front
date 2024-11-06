// tests/services/AuthenticationService.test.ts

import {
  registerUser,
  loginUser,
  logoutUser,
  isLoggedUser,
  getLoggedUser,
} from "@/services/authentication";

import client from '@/services/client';
import {
  getJwtToken,
  getJwtTokenData,
  isExpiredJwtToken,
  removeJwtToken,
  storeJwtToken,
} from '@/lib/utils';

import {
  LoginUserRequest,
  RegisterUserRequest,
  User,
} from '@/types/AuthenticationInterfaces';

// Mock external modules
jest.mock('@/services/client');
jest.mock('@/lib/utils');

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const registerData: RegisterUserRequest = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: { message: 'User registered successfully' },
      });

      const response = await registerUser(registerData);
      expect(client.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(response.data).toEqual({ message: 'User registered successfully' });
    });

    it('should handle errors during registration', async () => {
      const registerData: RegisterUserRequest = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
      };

      (client.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: 'Email already exists',
          },
        },
      });

      await expect(registerUser(registerData)).rejects.toThrow(
        'An error occurred while registering the user: Email already exists'
      );
    });
  });

  describe('loginUser', () => {
    it('should log in a user successfully and store JWT token', async () => {
      const loginData: LoginUserRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mock.jwt.token';

      (client.post as jest.Mock).mockResolvedValue({
        data: { token: mockToken },
      });

      await loginUser(loginData);

      expect(client.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(storeJwtToken).toHaveBeenCalledWith(mockToken);
    });

    it('should handle errors during login', async () => {
      const loginData: LoginUserRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (client.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      });

      await expect(loginUser(loginData)).rejects.toThrow(
        'An error occurred while logging in the user: Invalid credentials'
      );
    });

    it('should throw an error if no token is received', async () => {
      const loginData: LoginUserRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: {},
      });

      await expect(loginUser(loginData)).rejects.toThrow(
        'An error occurred while logging in the user: Invalid token received from the server'
      );
    });
  });

  describe('logoutUser', () => {
    it('should remove JWT token on logout', async () => {
      await logoutUser();
      expect(removeJwtToken).toHaveBeenCalled();
    });
  });

  describe('isLoggedUser', () => {
    it('should return true if user is logged in and token is valid', () => {
      (isExpiredJwtToken as jest.Mock).mockReturnValue(false);
      (getJwtToken as jest.Mock).mockReturnValue('valid.jwt.token');

      expect(isLoggedUser()).toBe(true);
    });

    it('should return false if token is expired', () => {
      (isExpiredJwtToken as jest.Mock).mockReturnValue(true);
      (getJwtToken as jest.Mock).mockReturnValue('expired.jwt.token');

      expect(isLoggedUser()).toBe(false);
    });

    it('should return false if no token is present', () => {
      (isExpiredJwtToken as jest.Mock).mockReturnValue(false);
      (getJwtToken as jest.Mock).mockReturnValue(null);

      expect(isLoggedUser()).toBe(false);
    });
  });

  describe('getLoggedUser', () => {
    it('should return user data from JWT token', async () => {
      const mockUserData: User = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'USER',
        sub: '12345',
        // Include other user properties as needed
      };

      (getJwtTokenData as jest.Mock).mockReturnValue(mockUserData);

      const user = await getLoggedUser();
      expect(user).toEqual(mockUserData);
    });

    it('should throw an error if unable to get user data', async () => {
      (getJwtTokenData as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(getLoggedUser()).rejects.toThrow(
        'An error occurred on the application while getting the logged user'
      );
    });
  });
});
