const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin'); //installed via npm

module.exports = {
    mode:"development",
    entry: {"app.bundle":'./src/app.js'},
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    /*plugins: [
        new htmlWebpackPlugin({
            title:'自定义title',
            filename : 'goudan/idx.html',
            template : './src/Tem.html'
            /*
            minify: {
                collapseWhitespace: false
            }

        }),
    ],*/
    plugins:[
        new ExtractTextPlugin('style.css'),
        new htmlWebpackPlugin({
            title:'自定义title',
            filename : 'goudan/idx.html',
            template : './src/Tem.html'
        }),
        new CleanWebpackPlugin(["dist"]),
        //if you want to pass in options, you can do so:
        //new ExtractTextPlugin({
        //  filename: 'style.css'
        //})
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};