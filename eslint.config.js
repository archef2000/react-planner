const tseslint = require('typescript-eslint');
const eslintPluginImport = require('eslint-plugin-import');
const unusedImports = require('eslint-plugin-unused-imports');
const eslintPluginPrettier = require('eslint-plugin-prettier');

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
        plugins: {
            import: eslintPluginImport,
            'unused-imports': unusedImports,
            '@typescript-eslint': tseslint.plugin,
            prettier: eslintPluginPrettier
        },
        rules: {
            'prettier/prettier': ['error', {
                printWidth: 80,
                singleQuote: true,
                trailingComma: 'none',
                semi: true,
                tabWidth: 2,
                useTabs: false,
                bracketSpacing: true,
                arrowParens: 'always'
            }],
            'max-len': ['error', {
                code: 80,
                tabWidth: 2,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                ignoreComments: true
            }],
            'no-var': 'error',
            'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }],
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'none',
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    caughtErrors: 'none'
                }
            ],
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': 'off',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type'
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'external',
                            position: 'before'
                        }
                    ],
                    pathGroupsExcludedImportTypes: ['react']
                }
            ],
            'import/newline-after-import': ['error', { count: 1 }],
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: true
                }
            ]
        }
    }
];