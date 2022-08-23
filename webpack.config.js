//引入一个包
// https://www.webpackjs.com/configuration/
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
module.exports = (env, args) => {
  const envData = dotenv.config({
    path: path.resolve(`.env.${args.mode}`)
  }).parsed
  const defineEnv = {
    'process.env': {}
  }
  Object.entries(process.env).forEach(([key, val]) => {
    defineEnv['process.env'][key] = JSON.stringify(val)
  })
  return {
    // mode: 'production',
    //指定入口文件
    entry: {
      index: ['./src/index.ts']
    },
    //指定打包文件所在的目录
    output: {
      //指定打包文件的目录
      path: path.resolve('dist'),
      //打包后文件的文件
      filename: '[name].js',
      libraryTarget: 'commonjs'
    },
    externals: {
      sqlite3: 'sqlite3',
      lodash: 'lodash'
    },
    target: 'node',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve('src')
      }
    },
    // 指定webpack打包时要使用的模块
    module: {
      //指定要加载的规则
      rules: [
        {
          //test 指定的是规则生效的文件
          test: /\.ts$/,
          //要使用的loader
          use: {
            loader: 'babel-loader',
            options: {
              // 当前的@babel/preset-typescript实现只是去除了所有类型，并且 不会在输出代码中发出相关的元数据。
              presets: ['@babel/preset-env', '@babel/preset-typescript'],
              plugins: [
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true
                  }
                ],
                'babel-plugin-parameter-decorator',
                '@babel/plugin-transform-runtime' /* , '@babel/plugin-transform-regenerator' */
              ]
              // plugins: [
              //   // 支持design:paramtypes  https://github.com/leonardfactory/babel-plugin-transform-typescript-metadata#readme
              //   'babel-plugin-transform-typescript-metadata',
              //   ['@babel/plugin-proposal-decorators', { legacy: true }],
              //   ['@babel/plugin-proposal-class-properties', { loose: true }],
              //   'babel-plugin-parameter-decorator',
              //   '@babel/plugin-transform-runtime' /* , '@babel/plugin-transform-regenerator' */
              // ]
            }
          },

          //要排除的文件
          exclude: /node-modeules/
        },
        {
          //test 指定的是规则生效的文件
          test: /\.js$/,
          //要使用的loader
          use: ['babel-loader'],
          //要排除的文件
          exclude: /node-modeules/
        }
      ]
    },
    plugins: [/* new CleanWebpackPlugin(), */ new webpack.DefinePlugin(defineEnv)]
  }
}
