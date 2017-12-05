const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const commonConfig = require("./webpack.common.js");
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path');

const APP_CONFIG = commonConfig.plugins[0].options.options.APP_CONFIG;

const backendConfig = {
    context: path.resolve(__dirname, '../src'),
    entry: {
        'app': './server/app'
    },
    output: {
        path: path.resolve(__dirname, '../dist/server/'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', 'html']
    },
    plugins: [
        new DefinePlugin({
            'process.env.APP_CONFIG': JSON.stringify(APP_CONFIG)
        }),
        new CopyWebpackPlugin([
            {from: '../config/eb/bin/www', to: './bin/[name]', flatten: true},
            {from: '../src/server/views', to: './views/[name].[ext]'}
        ])
    ],
    externals: [nodeExternals()],
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    }
};

module.exports = merge(commonConfig, backendConfig);
