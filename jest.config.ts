/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // **Add moduleNameMapper to resolve module aliases like '@/'
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "canvas-confetti": "<rootDir>/__mocks__/canvas-confetti.ts",
  },
  setupFiles: ["<rootDir>/tests/mocks/localStorage.mock.ts"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // **Optionally, you can specify file extensions
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
