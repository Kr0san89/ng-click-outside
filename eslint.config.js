// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // This is a directive library, not an app: its public selectors (`clickOutside`,
      // `clickOutsideExclude`, ...) intentionally carry no "app" prefix, so the prefix
      // check is disabled rather than enforced.
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: [],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Test host components and the demo app deliberately opt out of OnPush so plain
      // property mutations in templates are picked up without manual markForCheck calls.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }
);
