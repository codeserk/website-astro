module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'eslint-config-standard',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:mdx/recommended',
    'plugin:astro/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  settings: {
    'mdx/code-blocks': true,
  },
  rules: {
    'no-console': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    curly: ['error', 'all'],
    '@typescript-eslint/no-empty-function': 'off',
  },
  overrides: [
    // {
    //   files: ['*.astro'],
    //   parser: 'astro-eslint-parser',
    //   processor: 'astro/client-side-ts',
    //   parserOptions: {
    //     parser: '@typescript-eslint/parser',
    //     extraFileExtensions: ['.astro'],
    //   },
    // },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
    },
    {
      files: ['**/*.astro/*.js', '*.astro/*.js'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'prettier/prettier': 'off',
      },
    },
    {
      files: ['**/*.md/*.ts', '**/*.md.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-useless-constructor': 'off',
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
      },
    },
    {
      files: ['*.md', '*.mdx'],
      extends: ['plugin:mdx/recommended'],
    },
  ],
}
