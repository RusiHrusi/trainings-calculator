module.exports = {
    semi: true,
    tabWidth: 4,
    printWidth: 120,
    endOfLine: 'lf',
    singleQuote: true,
    jsxSingleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    bracketSameLine: false,
    arrowParens: 'always',
    plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-sql'],
    importOrder: [
        '<BUILT_IN_MODULES>',
        '^(node:)?(assert|buffer|child_process|cluster|console|crypto|dgram|dns|domain|events|fs|http|https|net|os|path|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|tty|url|util|v8|vm|zlib)$',
        '',
        '^(?!@pp-|\\.|\\/)(?!.*\\.(css|less|scss|sass)$)(.+)',
        '',
        '^@pp-(?!.*\\.(css|less|sass|scss)$).*$',
        '',
        '^\\.\\.?\\/(?!.*\\.(css|less|sass|scss)$).*$',
        '^(?!.*\\.(css|less|scss|sass)$).*$',
        '',
        '^(?!@pp-|\\.|\\/).*\\.(css|less|scss|sass)$',
        '^@pp-.*\\.(css|less|scss|sass)$',
        '^.*\\.(css|less|scss|sass)$',
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'class-properties', 'decorators-legacy'],
    importOrderTypeScriptVersion: '4.9.5',
    language: 'mariadb',
    useTabs: false,
    newlineBeforeSemicolon: false,
    expressionWidth: 160,
    indentStyle: 'standard',
    denseOperators: false,
    linesBetweenQueries: 2,
    logicalOperatorNewline: 'after',
    keywordCase: 'upper',
};
