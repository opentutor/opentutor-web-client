const path = require("path");

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      fallback: {
        stream: require.resolve('stream-browserify'),
        util: require.resolve("util"),
      }
    },
  });
};
