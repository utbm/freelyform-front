// tests/components/ThemeSwitch.test.tsx

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { useIsSSR } from '@react-aria/ssr';
import { ThemeSwitch } from "@/components/theme-switch";

// Mock dependencies
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@react-aria/ssr', () => ({
  useIsSSR: jest.fn(),
}));

jest.mock('@/components/icons', () => ({
  SunFilledIcon: (props: any) => <svg data-testid="sun-icon" {...props} />,
  MoonFilledIcon: (props: any) => <svg data-testid="moon-icon" {...props} />,
}));

describe('ThemeSwitch', () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useIsSSR as jest.Mock).mockReturnValue(false);
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
  });

  it('renders correctly in light mode', () => {
    render(<ThemeSwitch />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('toggles theme from light to dark', () => {
    render(<ThemeSwitch />);
    const switchElement = screen.getByLabelText('Switch to dark mode');
    fireEvent.click(switchElement);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles theme from dark to light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeSwitch />);
    const switchElement = screen.getByLabelText('Switch to light mode');
    fireEvent.click(switchElement);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('handles SSR rendering', () => {
    (useIsSSR as jest.Mock).mockReturnValue(true);

    render(<ThemeSwitch />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
    // Since isSSR is true, we default to light theme icon
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });
});
