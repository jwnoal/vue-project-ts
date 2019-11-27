const path = require("path");
const glob = require("glob-all");
const CompressionPlugin = require("compression-webpack-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const SkeletonWebpackPlugin = require("vue-skeleton-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const isProduction = process.env.NODE_ENV === "production";
const isProductionBuild = process.env.VUE_APP_CURRENTMODE === "prod";

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  // 基本路径
  publicPath: "./",
  // 输出文件目录
  outputDir: isProductionBuild ? "dist" : "pre",
  // 生产环境sourceMap
  productionSourceMap: false,
  //此插件需要css分离
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    requireModuleExtension: false
  },
  // webpack配置
  configureWebpack: config => {
    // 骨架屏
    config.plugins.push(
      new SkeletonWebpackPlugin({
        webpackConfig: {
          entry: {
            app: path.join(__dirname, "./src/skeleton.js")
          }
        },
        minimize: true,
        quiet: true,
        router: {
          mode: "hash",
          routes: [
            {
              path: "/wallet", //和router.js中的路径一样就行
              skeletonId: "skeleton1" //之前的id
            }
          ]
        }
      })
    );
    if (isProduction) {
      // 利用splitChunks单独打包第三方模块
      config.optimization = {
        splitChunks: {
          cacheGroups: {}
        }
      };
      // 打包分析工具
      config.plugins.push(new BundleAnalyzerPlugin());
      // 打包生产.gz包
      config.plugins.push(
        new CompressionPlugin({
          algorithm: "gzip",
          test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
          threshold: 10240,
          minRatio: 0.8
        })
      );
      // 删除多余css
      config.plugins.push(
        new PurgecssPlugin({
          paths: glob.sync([resolve("./**/*.vue")]),
          extractors: [
            {
              extractor: class Extractor {
                static extract(content) {
                  const validSection = content.replace(
                    /<style([\s\S]*?)<\/style>+/gim,
                    ""
                  );
                  return (
                    validSection.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
                  );
                }
              },
              extensions: ["html", "vue"]
            }
          ],
          whitelist: ["html", "body"],
          whitelistPatterns: [
            /el-.*/,
            /-(leave|enter|appear)(|-(to|from|active))$/,
            /^(?!cursor-move).+-move$/,
            /^router-link(|-exact)-active$/
          ],
          whitelistPatternsChildren: [/^token/, /^pre/, /^code/]
        })
      );
    }
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    if (isProduction) {
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          bypassOnDebug: true
        })
        .end();
    }
  },

  // 第三方插件配置
  pluginOptions: {}
};
