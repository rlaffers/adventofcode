import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
  }),
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 0,
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/arrow-parens': ['error', 'always'],
    },
  },
])
