//  tests/components/AuthGuard.test.tsx

import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { isLoggedUser } from '@/services/authentication';
import { getJwtToken } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from "@/components/AuthGuard";

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/authentication', () => ({
  isLoggedUser: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  getJwtToken: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('AuthGuard', () => {
  const setTokenMock = jest.fn();
  const replaceMock = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useAuth to return setToken function
    (useAuth as jest.Mock).mockReturnValue({
      setToken: setTokenMock,
    });

    // Mock useRouter to return replace function
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });
  });

  it('renders children when user is authenticated', async () => {
    // Mock authentication functions
    (isLoggedUser as jest.Mock).mockReturnValue(true);
    (getJwtToken as jest.Mock).mockReturnValue('validToken');

    const ChildComponent = () => <div>Protected Content</div>;

    render(
      <AuthGuard>
        <ChildComponent />
      </AuthGuard>
    );

    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith('validToken');
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects to login when user is not authenticated and shouldRedirect is true', async () => {
    (isLoggedUser as jest.Mock).mockReturnValue(false);
    (getJwtToken as jest.Mock).mockReturnValue(null);

    const ChildComponent = () => <div>Protected Content</div>;

    render(
      <AuthGuard shouldRedirect={true}>
        <ChildComponent />
        </AuthGuard>
    );

    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith(null);
      expect(replaceMock).toHaveBeenCalledWith('/login');
    });

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('does not redirect and renders children when user is not authenticated and shouldRedirect is false', async () => {
    (isLoggedUser as jest.Mock).mockReturnValue(false);
    (getJwtToken as jest.Mock).mockReturnValue(null);

    const ChildComponent = () => <div>Protected Content</div>;

    render(
      <AuthGuard shouldRedirect={false}>
        <ChildComponent />
        </AuthGuard>
    );

    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith(null);
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('shows loading spinner while redirecting', async () => {
    (isLoggedUser as jest.Mock).mockReturnValue(false);
    (getJwtToken as jest.Mock).mockReturnValue(null);

    render(
      <AuthGuard shouldRedirect={true}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/login');
    });
  });

});
