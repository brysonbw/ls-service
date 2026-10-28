import eslint from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

const securityRulesAsErrors = Object.fromEntries(
  Object.entries(pluginSecurity.configs.recommended.rules).map(([rule]) => [
    rule,
    "error",
  ]),
);

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintPluginPrettierRecommended,
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {},
    rules: {
      ...securityRulesAsErrors,
      "prettier/prettier": "error",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/prefer-for-of": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.config.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
