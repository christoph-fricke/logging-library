// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["**/src/**"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
