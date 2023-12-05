module.exports = {
  webpack: {
    configure(webpackConfig) {
      if (webpackConfig.mode === "production") {
        // 抽离公共代码，只在生产环境、优化代码体积
        if (webpackConfig.optimization === null) {
          webpackConfig.optimization = {}
        }
        webpackConfig.optimization.splitChunks = {
          chunks: "all",
          cacheGroup: {
            antd: {
              name: "antd-chunk",
              test: /antd/,
              priority: 100,
            },
            reactDom: {
              name: "reactDom-chunk",
              test: /react-dom/,
              priority: 99,
            },
            vendors: {
              name: "vendors-chunk",
              test: /node_module/,
              priority: 98,
            },
          },
        }
      }
      return webpackConfig
    },
  },
  // 使用devServer代理访问mock服务
  devServer: {
    port: 8000, //端口 B端 前端
    proxy: {
      "/api": "http://localhost:3001", //Mock服务端口
    },
  },
}
