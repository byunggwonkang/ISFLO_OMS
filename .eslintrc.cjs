module.exports = {
  root: true,
  extends: [
    "@nuxt/eslint-config",
    "prettier",
    "plugin:vue/vue3-recommended",
    "plugin:storybook/recommended"
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off"
  },
  plugins: [
    'prettier'
  ],
};
