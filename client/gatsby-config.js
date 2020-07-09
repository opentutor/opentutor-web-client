module.exports = {
  pathPrefix: `/grading`,
  siteMetadata: {
    title: `Open Tutor Grading`,
    description: ``,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
      },
    },
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        whitelist: ["GRADING_GRAPHQL_ENDPOINT"],
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
  ],
};
