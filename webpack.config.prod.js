import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
//import enviroment from './environment.json';
const cmdParams = process.argv;//数组：1.node 2.文件路径 3.参数配置
const APIEndpoint = cmdParams[2];

export default {
    entry: {
        app: path.resolve(__dirname, 'src/app/app'),
        vendor: path.resolve(__dirname, 'src/vendor')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
                    use: 'css-loader',
                })
            },
            {
                test: /\.(jpg|png|gif|ico)$/,
                use: 'file-loader?name=images/[name].[ext]'
            },
            {
                test: /\.(svg|woff2|ttf|woff|eot)$/,
                use: 'file-loader?name=fonts/[name].[ext]'
            }

        ]
    },
    plugins: [
        //Minify js
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: { warnings: true }
        // }),
        //generate html
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            favicon: 'src/qloan-favicon.ico',
            hash: true
        }),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        //Minify css
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {discardComments: {removeAll: true}}
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
        }),
        new webpack.DefinePlugin({
            APIENDPOINT: JSON.stringify(APIEndpoint),
        })
    ]
};
