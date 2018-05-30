import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    entry: {
        app: './src/app/app.js',
        vendor: './src/vendor.js'
    },
    devtool: 'inline-source-map', // 根据情况修改参数
    output: {
        path: path.resolve(__dirname, 'src'),
        publicPath: '/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(jpg|png|gif|svg|woff2|ttf|woff|eot|ico)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        disableHostCheck: true,
        compress: false,
        open: true,
        stats: 'errors-only',
        port: '8888'
    },
    plugins: [
        //generate html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/qloan-favicon.ico',
            inject: true
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            //APIENDPOINT: JSON.stringify("http://172.16.6.35:1111/opchannel"),
            //APIENDPOINT: JSON.stringify("http://172.29.20.27:8080/"),   //行长
             //APIENDPOINT: JSON.stringify("http://172.16.6.42:8080/"),   //测试地址
            APIENDPOINT: JSON.stringify("http://172.29.250.20:11073/"),   //测试地址
        })
    ]
};
