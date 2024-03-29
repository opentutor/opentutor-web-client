module.exports = {
  pathPrefix: `/tutor`,
  siteMetadata: {
    title: `Open Tutor Client`,
    description: ``,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: [
          "DIALOG_ENDPOINT",
          "GRAPHQL_ENDPOINT",
          "OPENTUTOR_CLIENT_VERSION",
          "CLASSIFIER_ENTRYPOINT",
        ],
      },
    },
    `gatsby-plugin-typescript`,
    {
      resolve: "gatsby-plugin-eslint",
      options: {
        test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
        exclude: /(node_modules|.cache|public|static)/,
        stages: ["develop"],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    {
      resolve: `@iostindex/gatsby-plugin-material-ui`,
    },
    `gatsby-plugin-styled-components`,
  ],
};
