module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "vue/no-unused-vars":'off',
    "vue/no-mutating-props":"off",
    "@typescript-eslint/no-var-requires": "off",
    "vue/no-unused-components":"off",
    "@typescript-eslint/explicit-module-boundary-types":"off",
    "@typescript-eslint/no-unused-vars":"off",
    "@typescript-eslint/no-empty-function":"off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
