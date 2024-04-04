module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  settings: {},
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "error", // Disallows non-null assertions using the ! postfix operator
    "@typescript-eslint/no-explicit-any": "error", // Disallows usage of the any type
  },
};
