/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    plugins: ["react", "react-hooks", "@typescript-eslint", "prettier"],
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "next/core-web-vitals"
    ],
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/react-in-jsx-scope": "off",
    },
  };
  