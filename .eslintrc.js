module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: 'standard',
  installedESLint: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', {'avoidEscape': true}],
    'object-curly-spacing': ['error', 'always'],
    'camelcase': 'off',
    'semi': ['error', 'never'],
    'comma-dangle': [2, 'always-multiline'],
    'no-return-assign': 'off',
  },
};
