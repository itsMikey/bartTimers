const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require("./webpack.common.js");
const merge = require('webpack-merge');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const environmentName = process.env.NODE_ENV || "local";
const commonData = commonConfig.plugins[0].options.options;


const frontendConfig = {
    context: path.resolve(__dirname, '../src'),

    entry: {
        'app': './frontend/app.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../dist/server/static'),
        filename: "./js/[name].js",
        sourceMapFilename: './js/[name].map',
        chunkFilename: './js/[id].chunk.js'
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "axios": "axios"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss']
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            // test-helpers: /\.xxx$/, // may apply this only for some modules
            options: {
                sassLoader: {
                    includePaths: [path.resolve('../src/frontend', "./scss")],
                    sourceMap: true
                }
            }
        }),

        new ExtractTextPlugin('css/main.css'),

        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor'].reverse()
        }),
        new StringReplacePlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!sass-loader"
                })
            },
            {
                test: /main.scss$/,
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /\/images/g,
                            replacement: function (match, p1, offset, string) {
                                return match.replace(/\/images/g, commonData.getCdn() + '/images');
                            }
                        }
                    ]
                })
            },
            { test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.ts$/,
                loader: StringReplacePlugin.replace({
                    replacements: [
                        {
                            pattern: /@BACKEND_API@/g,
                            replacement: function (match, p1, offset, string) {
                                return match.replace(/@BACKEND_API@/g, commonData.APP_CONFIG.app.site);
                            }
                        }
                    ]
                })
            }
        ]
    }
};

const devConfig = {
    devtool: 'inline-source-map'
};

module.exports = merge(frontendConfig, devConfig);

