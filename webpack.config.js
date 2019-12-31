const CopyPlugin = require('copy-webpack-plugin');
const path       = require('path');

module.exports = {
    // watch : true,
    devtool : false,
    mode : 'development',
    entry : {
        background : path.resolve(__dirname, 'src/ts/background.ts'),
        contentScript : path.resolve(__dirname, 'src/ts/contentScript.ts'),
        options : path.resolve(__dirname, 'src/ts/options.ts'),
    },

    module : {
        rules : [
            {
                test : /\.ts$/,
                use : 'ts-loader',
                exclude : /node_modules/,
            },
            {
                test : /\.css$/,
                exclude : /node_modules/,
                use : [
                    "style-loader",
                    {
                        loader : "css-loader",
                        options : {url : false},
                    }
                ]
            }
        ]
    },

    resolve : {
        extensions : [ '.ts', '.js' ],
    },

    output : {
        filename : '[name].bundle.js',
        path : path.resolve(__dirname, 'dist/js'),
    },

    plugins : [
        new CopyPlugin(
            [
                {from : '*.json', to : '../', force : true},
                {from : '*.html', to : '../', force : true},
                {from : 'icons', to : '../icons'}
            ],
            {context : path.resolve(__dirname, 'src')}),
    ]
};