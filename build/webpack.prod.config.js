const webpackMerge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.config");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = webpackMerge(baseWebpackConfig, {
  // 指定构建环境
  mode: "production",
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      inject: true, // true：默认值，script标签位于html文件的 body 底部
      hash: true, // 在打包的资源插入html会加上hash
      //  html 文件进行压缩
      minify: {
        removeComments: true, //去注释
        collapseWhitespace: true, //压缩空格
        removeAttributeQuotes: true, //去除属性引号
      },
    }),
  ],
});
