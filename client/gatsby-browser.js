import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Provider as CmiProvider } from "react-cmi5-context";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>
    <CmiProvider>{element}</CmiProvider>
  </MuiThemeProvider>
);
