var path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

 
module.exports = {
    entry: {
        index: "./js/index.jsx",
        edit: './js/edit.jsx',
        add: './js/add.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './wwwroot'),
        publicPath: '/wwwroot',
    },
    mode: 'development',
    module: {
        rules: [ 
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        }
                    },
                ],
            },
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,  // исключаем из обработки папку node_modules
                loader: "babel-loader",   // определяем загрузчик
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"]    // используемые плагины
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|png)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './content/',
                            publicPath: './content',
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
}