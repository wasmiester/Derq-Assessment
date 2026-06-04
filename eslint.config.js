import js from '@eslint/js'

export default [
  {
    ignores: ['node_modules/**', 'frontend/**', 'dist/**'],
  },
  {
    files: ['backend/**/*.js', '*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
]
