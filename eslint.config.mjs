import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import typescriptParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'; // Import nécessaire pour le plugin


import path from 'path';

// Récupère le répertoire du fichier actuel
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default [
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      'no-console': 'warn',
      'prettier/prettier': ['error', { semi: false }],
      'no-debugger': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    ignores: ['coverage/', 'jest.config.js', 'eslint.config.mjs'],
  },
  eslintConfigPrettier,
];
