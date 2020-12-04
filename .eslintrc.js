module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  root: true,
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['prettier'],
  settings: {
    // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
    'import/resolver': {
      node: {},
    },
  },
  rules: {
    'no-restricted-syntax': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'prefer-const': 'off',
    'no-await-in-loop': 'off',
    'max-len': [
      'error',
      100,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'import/extensions': [
      'error',
      {
        js: 'never',
        jsx: 'never',
        json: 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    semi: ['error', 'never'],
    'react/no-typos': 'error',
    'import/no-extraneous-dependencies': 'off',
  },
}
