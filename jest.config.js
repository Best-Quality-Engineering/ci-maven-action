/**
 * @type {import("jest").Config}
 */
const config = {
    preset: "ts-jest",
    testMatch: ["**/__tests__/**/*.+(spec|test).[jt]s?(x)"]
};

module.exports = config;
