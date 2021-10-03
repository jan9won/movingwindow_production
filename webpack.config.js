const express =require('express');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        filename: 'bundle.[fullhash].js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    module: {
        rules: [
            { // 1. Scripts
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
									loader: 'babel-loader',
								}
            },
            { // 2. HTML
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        },
                    },
                ],
            },
            { // 3. styles
                test: /\.(css|scss|sass)$/,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            { // 4. url assets
                test: /\.(png|woff|woff2|eot|ttf|svg|gif)$/, 
                use: ['url-loader?limit=100000']
            },
        ],
    },
    resolve: {
        extensions: ['*','.js', '.jsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'home.html',
            filename: 'index.html',
        }),
				new BundleAnalyzerPlugin(),
				new CompressionPlugin()
    ], 
    devServer: {
        before: function (app, server, compiler) {
            app.get('/assets/*', function (req, res) {
                const loc = req.url.replace('\/assets\/','')
                console.log(loc);
                res.sendFile(path.resolve(
                    `./public/${loc}`
                ));
            });
        },
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'public/dist') ,
        host: '0.0.0.0',
        port: 3100,
        open: true, // browser open?
        hot: true,
        
    },
		 optimization: {
   			usedExports: true,
		 },
};  
