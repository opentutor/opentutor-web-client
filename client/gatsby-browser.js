import React from "react";
import { createTheme, StylesProvider } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <StylesProvider injectFirst>
    <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
  </StylesProvider>
);
