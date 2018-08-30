const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  // エントリーポイントの設定
  entry: {
    app: path.join(__dirname, '/webpack/app.js'),
  },
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: '[name].bundle.js',
    // 出力先のパス
    path: path.join(__dirname, '../src/webroot/js/')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // node_modules配下のモジュールをバンドル対象とする
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true
        }
      }
    }
  },
  // ローダーの設定
  module: {
    rules: [
      {
        // ローダーの対象ファイル
        test: /\.js$/,
        // ローダーの対象から外すディレクトリ
        exclude: /node_modules/,
        // 利用するローダー
        use: [
          {
            loader: 'babel-loader',
            // ローダーのオプション
            options: {
              presets: [['env', { modules: false }]]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      velocity: 'velocity-animate'
    })
  ]
};
