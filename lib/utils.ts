import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { InputType, ValidationRuleType } from "@/types/FormEnums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInputTypeDisplay(type: InputType) {
  switch (type) {
    case InputType.TEXT:
      return "Text";
    case InputType.NUMBER:
      return "Number";
    case InputType.DATE:
      return "Date";
    case InputType.MULTIPLE_CHOICE:
      return "Multiple Choice";
    case InputType.GEOLOCATION:
      return "Geolocation";
    default:
      return "Unknown";
  }
}

export function getInputTypeIcon(type: InputType) {
  switch (type) {
    case InputType.TEXT:
      return "A";
    case InputType.NUMBER:
      return "#";
    case InputType.DATE:
      return "📅";
    case InputType.MULTIPLE_CHOICE:
      return "🔘";
    case InputType.GEOLOCATION:
      return "🌍";
    default:
      return "?";
  }
}

export function getInputValidationRuleDisplay(type: ValidationRuleType) {
  switch (type) {
    case ValidationRuleType.IS_EMAIL:
      return "Is an email input?";
    case ValidationRuleType.IS_RADIO:
      return "Is a radio input?";
    case ValidationRuleType.IS_MULTIPLE_CHOICE:
      return "Is a multiple choice input?";
    case ValidationRuleType.REGEX_MATCH:
      return "Must match a regex";
    case ValidationRuleType.MAX_LENGTH:
      return "Maximum input length";
    case ValidationRuleType.MIN_LENGTH:
      return "Minimum input length";
    default:
      return "Unknown";
  }
}

// utils.ts or similar utility file

export function getAvailableValidationRules(
  inputType: InputType,
): ValidationRuleType[] {
  switch (inputType) {
    case InputType.TEXT:
      return [
        ValidationRuleType.IS_EMAIL,
        ValidationRuleType.REGEX_MATCH,
        ValidationRuleType.MAX_LENGTH,
        ValidationRuleType.MIN_LENGTH,
      ];
    case InputType.NUMBER:
      return [ValidationRuleType.MAX_LENGTH, ValidationRuleType.MIN_LENGTH];
    case InputType.DATE:
      return []; // No specific validation rules for date input
    case InputType.MULTIPLE_CHOICE:
      return [
        ValidationRuleType.IS_RADIO,
        ValidationRuleType.IS_MULTIPLE_CHOICE,
      ];
    case InputType.GEOLOCATION:
      return []; // No specific validation rules for geolocation
    default:
      return [];
  }
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

export function storeJwtToken(jwtToken: string) {
  const isValidJwt = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(
    jwtToken,
  );

  if (!isValidJwt) return false;

  if (typeof localStorage !== "undefined") {
    const expiresAt = Date.now() + 1800 * 1000; // Expires in 30 hour

    localStorage.setItem("session_expiration", String(expiresAt));
    localStorage.setItem("session", jwtToken);

    return true;
  }

  return false;
}

export function isExpiredJwtToken() {
  if (typeof localStorage !== "undefined") {
    const expiresAt = localStorage.getItem("session_expiration");

    if (!expiresAt) return true;

    const expired = Date.now() > parseInt(expiresAt, 10);

    if (expired) removeJwtToken();

    return expired;
  }

  return true;
}

export function getJwtToken() {
  if (isExpiredJwtToken()) {
    removeJwtToken();

    return null;
  }
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem("session");
  }

  return null;
}

export function removeJwtToken() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("session");
    localStorage.removeItem("session_expiration");
  }
}

export function getJwtTokenData() {
  const jwtToken = getJwtToken();

  if (!jwtToken) return null;

  const [, payload] = jwtToken.split(".");

  const decodedPayload = atob(payload);

  return JSON.parse(decodedPayload);
}
