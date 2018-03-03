// const path = require('path'),
//     htmlPlugin = require('html-webpack-plugin'),
//     cleanPlugin = require('clean-webpack-plugin'),
//     dist = 'dist',
//     workboxPlugin = require('workbox-webpack-plugin');

// module.exports = {
//     entry: {
//         index: './src/sw-main.js'
//     },
//     output: {
//         filename: '[name].js',
//         path: path.resolve(__dirname, dist)
//     },
//     plugins: [
//         new cleanPlugin([dist]),
//         new htmlPlugin({
//             filename: 'index.html',
//             title: 'Get Started With Workbox For Webpack',
//         }),
//         new workboxPlugin({
//             globDirectory: dist,
//             globPatterns: ['**/*.{html,js}'],
//             swDest: path.join(dist, 'sw.js'),
//             swSrc: './src/sw.js',
//             clientsClaim: true,
//             skipWaiting: true,
//         })
//     ]
// };



const path = require('path'),
    htmlPlugin = require('html-webpack-plugin'),
    cleanPlugin = require('clean-webpack-plugin'),
    dist = 'dist',
    workboxPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: './src/sw-main.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, dist)
    },
    plugins: [
        new cleanPlugin([dist]),
        // new htmlPlugin({
        //     filename: 'index.html',
        //     title: 'Get Started With Workbox For Webpack'
        // }),
        new CopyWebpackPlugin([{
            from: './src/index.html',
            to: path.resolve(__dirname, dist)
        }]),
        new workboxPlugin({
            globDirectory: dist,
            globPatterns: ['**/*.{html,js}'],
            swDest: path.join(dist, 'sw.js'),
            swSrc: './src/sw.js',
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
};