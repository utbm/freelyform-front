// components/private/forms/FormEditor.tsx
"use client";

import { Button, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { LoginUserRequest } from "@/types/AuthenticationInterfaces";
import { loginUser } from "@/services/authentication";

// Define the LoginInfo interface
interface LoginInfo {
  email: string;
  password: string;
}

/**
 * Login Form component
 * This component display the component to log in to the application
 */
export default function LoginForm() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [loginInfo, setLoginInfo] = React.useState<LoginInfo>({
    email: "",
    password: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginUserRequest: LoginUserRequest = {
      email: loginInfo.email,
      password: loginInfo.password,
    };

    try {
      await loginUser(loginUserRequest);
      toast.success("Login successful!");
      router.push("/prefabs");
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    }
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
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Email"
            name="email"
            placeholder="Enter your email"
            size="sm"
            type="email"
            value={loginInfo.email}
            onChange={handleChange}
          />
          <Input
            isRequired
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            size="sm"
            type={isVisible ? "text" : "password"}
            value={loginInfo.password}
            onChange={handleChange}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={!isValidEmail(loginInfo.email)}
            size="sm"
            type="submit"
          >
            Connect
          </Button>
        </form>
        <div className="w-full flex flex-row justify-end">
          <Link className="!text-sm text-indigo-500" href="/register">
            Don't have an account?
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
