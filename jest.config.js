const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // El enunciado pide coverage minimo del 60% del backend especificamente.
  // Con la separacion en src/backend, esto ahora es literal: solo se mide
  // ese folder (la UI en src/frontend queda fuera del calculo a proposito).
  collectCoverageFrom: ["src/backend/**/*.ts"],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
