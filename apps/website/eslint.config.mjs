import next from "@next/eslint-plugin-next";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";

export default [
  { ignores: ["**/node_modules/**", ".next/**", "dist/**"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser, ecmaVersion: "latest", sourceType: "module" },
    plugins: { "@typescript-eslint": ts, react, "@next/next": next },
    rules: {
      // Next guardrails
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-html-link-for-pages": "off",
      // React safety
      "react/no-danger": "error",
      "react/jsx-no-comment-textnodes": "error",
      // Typescript strictness
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn"
    },
    settings: { react: { version: "detect" } }
  }
];
