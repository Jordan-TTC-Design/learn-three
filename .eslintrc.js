module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['@nuxtjs', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: [],
  rules: {
    'no-undef': 'off',
    'no-console': 'off',
    'comma-dangle': 'off',
    semi: 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'any',
          component: 'any'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'space-before-function-paren': ['error', 'never']
  }
};
