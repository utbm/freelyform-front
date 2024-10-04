"use client";

import { Button, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";

// Define the LoginInfo interface
interface LoginInfo {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState<LoginInfo>({
    email: '',
    password: '',
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Login Info:', loginInfo);
    // Redirect or update state as needed
  };

  const isValidEmail = (email: string) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Card className="min-w-96">
      <CardHeader className="flex flex-row justify-center">
        <p className="text-md text-2xl">Login</p>
      </CardHeader>
      <Divider />
      <CardBody className="w-full flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            label="Email"
            isRequired
            size="sm"
            placeholder="Enter your email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            isRequired
            size="sm"
            placeholder="Enter your password"
            name="password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            value={loginInfo.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            size="sm"
            color="primary"
            className="w-full"
            isDisabled={!isValidEmail(loginInfo.email)}
          >
            Connect
          </Button>
        </form>
        <div className="w-full flex flex-row justify-end">
          <Link href="/register" className="!text-sm text-indigo-500">Don't have an account?</Link>
        </div>
      </CardBody>
    </Card>
  );
}
