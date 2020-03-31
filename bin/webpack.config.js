const path = require('path');
const merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const entries = require('./entry.js');
const configs = [];
Object.keys(entries).forEach((key) => {
    const entry = {};
    entry[key] = entries[key];
    configs.push({
        mode: 'development',
        devtool: 'source-map',
        entry,
        resolve: {
            alias: {
                vue: 'vue/dist/vue.js',
                vuex: 'vuex/dist/vuex.esm.js'
            },
            modules: ['./doc', 'node_modules'],
        },
        output: {
            path: path.resolve(__dirname, '../dist'),
            publicPath: '/',
            filename: '[name]/index.js'
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
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader', 'less-loader'],
                        fallback: 'style-loader'
                    }),
                },
                {
                    test: /\.vue$/,
                    use: 'vue-loader',
                }
            ],
        },
        plugins: [
            new ExtractTextPlugin("[name]/index.css"),
            new HtmlWebpackPlugin({
                template: `./doc/${key}/index.html`,
                filename: `${key}/index.html`,
            }),
            new VueLoaderPlugin()
        ],
    });
});
module.exports = configs;