// pages/Login.js
"use client";

import React from 'react';
import { Input, Button, Spacer, Link } from '@nextui-org/react';

export default function Login() {

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login form submitted', e);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          fullWidth
        />
        <Spacer y={1} />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          fullWidth
        />
        <Spacer y={1} />
        <Button type="submit" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Spacer y={1} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/auth/password-reset">
          Forgot Password?
        </Link>
        <Link href="/auth/register">
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}
