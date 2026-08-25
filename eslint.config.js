const js = require("@eslint/js");
const globals = require("globals");
const jest = require("eslint-plugin-jest");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: ["coverage/**"],
  },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
  },

  {
    files: ["tests/**/*.js"],
    ...jest.configs["flat/recommended"],
  },

  // Must stay last: turns off every rule Prettier already handles.
  prettier,
];
