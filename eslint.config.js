// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*", "metro.config.js", "babel.config.js"],
  },
  {
    rules: {
      // Only essential rules - no formatting enforcement
      "no-console": "off",
      "import/no-unresolved": "off",
    },
  },
];
