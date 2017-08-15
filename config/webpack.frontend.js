// const webpack = require('webpack');
// const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const commonConfig = require("./webpack.common.js");
// const prodConfig = require("./webpack.prod.js");
// const merge = require('webpack-merge');
// const StringReplacePlugin = require('string-replace-webpack-plugin');
// const environmentName = process.env.NODE_ENV || "local";
// const commonData = commonConfig.plugins[0].options.options;
//
// const frontendConfig = {
//     context: path.resolve(__dirname, '../src'),
//
//     entry: {
//         'app': './frontend/app'
//     },
//     output: {
//         path: path.resolve(__dirname, '../dist/server/static'),
//         filename: "./js/[name].js",
//         sourceMapFilename: './js/[name].map',
//         chunkFilename: './js/[id].chunk.js'
//     },
//     externals: {
//         "vue": "Vue",
//         "axios": "axios",
//         "vue-router": "VueRouter",
//         "vuex": "Vuex"
//     },
//     resolve: {
//         extensions: ['.ts', '.js', '.scss']
//     },
//
//     plugins: [
//         new webpack.LoaderOptionsPlugin({
//             // test: /\.xxx$/, // may apply this only for some modules
//             options: {
//                 sassLoader: {
//                     includePaths: [path.resolve('../src/frontend', "./scss")],
//                     sourceMap: true
//                 }
//             }
//         }),
//
//         new ExtractTextPlugin('css/main.css'),
//
//         new webpack.optimize.CommonsChunkPlugin({
//             name: ['vendor'].reverse()
//         }),
//         new StringReplacePlugin()
//     ],
//     module: {
//         rules: [
//             {
//                 test: /\.scss$/,
//                 use: ExtractTextPlugin.extract({
//                     fallback: "style-loader",
//                     use: "css-loader!sass-loader"
//                 })
//             },
//             {
//                 test: /main.scss$/,
//                 loader: StringReplacePlugin.replace({
//                     replacements: [
//                         {
//                             pattern: /\/images/g,
//                             replacement: function (match, p1, offset, string) {
//                                 return match.replace(/\/images/g, commonData.getCdn() + '/images');
//                             }
//                         }
//                     ]
//                 })
//             },
//             {
//                 test: /\.ts$/,
//                 loader: StringReplacePlugin.replace({
//                     replacements: [
//                         {
//                             pattern: /@APP_CDN@/g,
//                             replacement: function (match, p1, offset, string) {
//                                 return match.replace(/@APP_CDN@/g, commonData.getCdn());
//                             }
//                         }
//                     ]
//                 })
//             }
//         ]
//     },
//     target: 'web'
// };
//
// const devConfig = {
//     devtool: 'inline-source-map'
// };
//
// if (environmentName === "prod") {
//     module.exports = merge(commonConfig, frontendConfig);
// } else {
//     module.exports = merge(commonConfig, frontendConfig, devConfig);
// }
