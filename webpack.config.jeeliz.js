const port = process.env.mw_web_port || 3100;
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;

// if (TARGET === 'dev') {
//    module.exports = require('./path-to/webpack.config.dev.js');
// }
// if (TARGET === 'build') {
//    module.exports = require('./path-to/webpack.config.prod.js');
// }

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './public/dist'),
        publicPath: './',
    },
    module: {
        rules: [
            { // 1
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    }
                ],
            },
            { // 2
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
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/home.html',
            filename: 'index.html',
        })
    ], 
    devServer: {
        publicPath: "/",
        contentBase: "./dist",
        host: '0.0.0.0',
        port: port,
        open: true, // browser open?
        hot: true,

    },
};  