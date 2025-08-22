export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  moduleFileExtensions: ["js", "mjs"],
  testMatch: ["**/backend/**/*.test.mjs"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
