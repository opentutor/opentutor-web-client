import React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Provider } from "./src/context";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>
    <Provider>{element}</Provider>
  </MuiThemeProvider>
);
