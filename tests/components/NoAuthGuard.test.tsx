//  tests/components/NoAuthGuard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { isLoggedUser } from '@/services/authentication';
import NoAuthGuard from '@/components/NoAuthGuard';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/authentication', () => ({
  isLoggedUser: jest.fn(),
}));

describe('NoAuthGuard', () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useRouter to return replace function
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
    });
  });

  it('renders children when user is not authenticated', () => {
    (isLoggedUser as jest.Mock).mockReturnValue(false);

    render(
      <NoAuthGuard>
        <div>Public Content</div>
      </NoAuthGuard>
    );

    expect(screen.getByText('Public Content')).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('redirects to /prefabs when user is authenticated', () => {
    (isLoggedUser as jest.Mock).mockReturnValue(true);

    render(
      <NoAuthGuard>
        <div>Public Content</div>
      </NoAuthGuard>
    );

    expect(replaceMock).toHaveBeenCalledWith('/prefabs');
    expect(screen.queryByText('Public Content')).not.toBeInTheDocument();
  });
});
