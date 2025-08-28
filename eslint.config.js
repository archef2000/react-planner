const tseslint = require('typescript-eslint');

module.exports = [
    { ignores: ['lib/**', 'es/**', 'demo/dist/**', 'dist/**', 'node_modules/**'] },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true }
            }
        },
        rules: {
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }]
        }
    }
];