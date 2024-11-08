// tests/context/AuthContext.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Test component to consume the context
const TestComponent = () => {
  const { token, setToken } = useAuth();

  return (
    <div>
      <p data-testid="token-value">{token}</p>
      <button onClick={() => setToken('test-token')}>Set Token</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides default value of null for token', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const tokenValue = screen.getByTestId('token-value');
    expect(tokenValue.textContent).toBe('');
  });

  it('allows updating the token via setToken', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const tokenValue = screen.getByTestId('token-value');
    const button = screen.getByText('Set Token');

    // Initially, token should be null (empty string in textContent)
    expect(tokenValue.textContent).toBe('');

    // Click the button to set the token
    fireEvent.click(button);

    // Now, token should be updated
    expect(tokenValue.textContent).toBe('test-token');
  });
});
