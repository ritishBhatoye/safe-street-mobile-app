module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Formatting, missing semicolons, etc
        "refactor", // Code refactoring
        "perf", // Performance improvements
        "test", // Adding tests
        "chore", // Maintenance
        "revert", // Revert changes
        "build", // Build system changes
        "ci", // CI/CD changes
      ],
    ],
  },
};
