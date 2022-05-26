import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
require("styles/components/Desktop.css");

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>{element}</MuiThemeProvider>
);
