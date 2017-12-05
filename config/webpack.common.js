const webpack = require('webpack');
const yaml = require('js-yaml');
const fs = require('fs');
const merge = require('webpack-merge');
const path = require('path');
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");

const environmentName = process.env.NODE_ENV || "local";

const commonConfig = {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'babel-loader!awesome-typescript-loader',
                    exclude: [/\.(spec|e2e)\.ts$/, '/node_modules/'],
                    enforce: 'pre'
                }
            ]
        },
        plugins: [
            new LoaderOptionsPlugin({
                options: {
                    APP_CONFIG: merge(
                        yaml.safeLoad(fs.readFileSync(path.resolve(__dirname,'./env/common.yml')), 'utf-8'),
                        yaml.safeLoad(fs.readFileSync(path.resolve(__dirname,'./env/' + environmentName + '.yml')), 'utf-8')
                    )
                }
            })
        ]
    }
;


module.exports = commonConfig;