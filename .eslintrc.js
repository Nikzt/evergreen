module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },

  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: ["clean-timer"],
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript', 'plugin:jsx-a11y/recommended', 'plugin:prettier/recommended', 'plugin:storybook/recommended'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
};