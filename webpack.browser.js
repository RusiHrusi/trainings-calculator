const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                '@babel/preset-react' // Add this preset
                            ],
                            cacheDirectory: true,
                        },
                    },
                ],
                exclude: /node_modules|out/,
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "path": require.resolve("path-browserify"),
            "fs": false
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Ensures the output directory is cleaned before each build
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
    ],
    devtool: 'cheap-module-source-map',
    cache: {
        type: 'filesystem',
    },
};