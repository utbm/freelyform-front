"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import { RegisterUserRequest } from "@/types/AuthenticationInterfaces";
import { registerUser } from "@/services/authentication";

// Define the RegisterInfo interface
interface RegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [registerInfo, setRegisterInfo] = React.useState<RegisterInfo>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({
      ...registerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registerUserRequest: RegisterUserRequest = {
      firstName: registerInfo.firstName,
      lastName: registerInfo.lastName,
      email: registerInfo.email,
      password: registerInfo.password,
    };

    try {
      await registerUser(registerUserRequest);
      toast.success("Registration successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  const isValidEmail = (email: string) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordMatch =
    registerInfo.password === registerInfo.confirmPassword;
  const isFormValid =
    registerInfo.firstName.trim() !== "" &&
    registerInfo.lastName.trim() !== "" &&
    isValidEmail(registerInfo.email) &&
    registerInfo.password !== "" &&
    isPasswordMatch;

  return (
    <Card className="min-w-96">
      <CardHeader className="flex flex-row justify-center">
        <p className="text-md text-2xl">Register</p>
      </CardHeader>
      <Divider />
      <CardBody className="w-full flex flex-col gap-3">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="First Name"
            name="firstName"
            placeholder="Enter your first name"
            size="sm"
            value={registerInfo.firstName}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Last Name"
            name="lastName"
            placeholder="Enter your last name"
            size="sm"
            value={registerInfo.lastName}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Email"
            name="email"
            placeholder="Enter your email"
            size="sm"
            type="email"
            value={registerInfo.email}
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
            value={registerInfo.password}
            onChange={handleChange}
          />
          <Input
            isRequired
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmVisibility}
              >
                {isConfirmVisible ? (
                  <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <FaEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage={
              !isPasswordMatch && registerInfo.confirmPassword
                ? "Passwords do not match"
                : undefined
            }
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            size="sm"
            type={isConfirmVisible ? "text" : "password"}
            validationState={isPasswordMatch ? "valid" : "invalid"}
            value={registerInfo.confirmPassword}
            onChange={handleChange}
          />
          <Button
            className="w-full"
            color="primary"
            isDisabled={!isFormValid}
            size="sm"
            type="submit"
          >
            Register
          </Button>
        </form>
        <div className="w-full flex flex-row justify-end">
          <Link className="!text-sm text-indigo-500" href="/login">
            Already have an account?
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
