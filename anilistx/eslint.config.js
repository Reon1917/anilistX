import js from "@eslint/js";
import ts from "typescript-eslint";

export default [
  js.configs.recommended,
  ...ts.configs.recommended, // Not using type-checked for now to simplify
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: ts.parser, // Explicitly set parser
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // It's important to ignore build outputs and node_modules
    ignores: ["node_modules/", ".next/", "dist/", "*.config.js", "*.config.ts"],
  }
];
