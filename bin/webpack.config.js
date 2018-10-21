const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const base = require('./entry.js');
const config = merge(base.baseConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name]/index.js'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        },
        modules: ['./doc', 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            }
    ]
    },
    plugins: [
        new ExtractTextPlugin('[name]/index.css'),
        new VueLoaderPlugin()
    ],
    devServer: {
        open: true,
        host: 'www.lwk.com',
        compress: true,
        port: 80
    },
    devtool: 'source-map',
});
base.templates.forEach((tem) => {
    config.plugins.push(new HtmlWebpackPlugin({
        filename: `${tem.name}/index.html`,
        template: tem.path,
        favicon: path.resolve(__dirname, '../favicon.ico'),
    }));
})
module.exports = config;