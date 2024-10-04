"use client";

import { Button, Divider, Input } from "@nextui-org/react";
import { Link } from "@nextui-org/link";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@nextui-org/shared-icons";

// Define the RegisterInfo interface
interface RegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [registerInfo, setRegisterInfo] = React.useState<RegisterInfo>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({
      ...registerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Register Info:', registerInfo);
    // Redirect or update state as needed
  };

  const isValidEmail = (email: string) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isPasswordMatch = registerInfo.password === registerInfo.confirmPassword;
  const isFormValid =
    registerInfo.firstName.trim() !== '' &&
    registerInfo.lastName.trim() !== '' &&
    isValidEmail(registerInfo.email) &&
    registerInfo.password !== '' &&
    isPasswordMatch;

  return (
    <Card className="min-w-96">
      <CardHeader className="flex flex-row justify-center">
        <p className="text-md text-2xl">Register</p>
      </CardHeader>
      <Divider />
      <CardBody className="w-full flex flex-col gap-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="First Name"
            isRequired
            size="sm"
            placeholder="Enter your first name"
            name="firstName"
            value={registerInfo.firstName}
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            isRequired
            size="sm"
            placeholder="Enter your last name"
            name="lastName"
            value={registerInfo.lastName}
            onChange={handleChange}
          />
          <Input
            type="email"
            label="Email"
            isRequired
            size="sm"
            placeholder="Enter your email"
            name="email"
            value={registerInfo.email}
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
            value={registerInfo.password}
            onChange={handleChange}
          />
          <Input
            label="Confirm Password"
            isRequired
            size="sm"
            placeholder="Confirm your password"
            name="confirmPassword"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleConfirmVisibility}
                aria-label="toggle password visibility"
              >
                {isConfirmVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isConfirmVisible ? "text" : "password"}
            value={registerInfo.confirmPassword}
            onChange={handleChange}
            validationState={isPasswordMatch ? "valid" : "invalid"}
            errorMessage={!isPasswordMatch && registerInfo.confirmPassword ? "Passwords do not match" : undefined}
          />
          <Button
            type="submit"
            size="sm"
            color="primary"
            className="w-full"
            isDisabled={!isFormValid}
          >
            Register
          </Button>
        </form>
        <div className="w-full flex flex-row justify-end">
          <Link href="/login" className="!text-sm text-indigo-500">Already have an account?</Link>
        </div>
      </CardBody>
    </Card>
  );
}
