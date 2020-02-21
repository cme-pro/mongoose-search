module.exports = {
  verbose: false,
  roots: ["<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/.history/", "<rootDir>/dist"],
  coverageDirectory: ".coverage",
  coverageReporters: ["text-summary"],
  collectCoverageFrom: ["src/*.ts", "!dist/**", "!**/node_modules/**"],
  coverageThreshold: {
    global: {
      statements: 20,
      branches: 20,
      functions: 20,
      lines: 20
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
