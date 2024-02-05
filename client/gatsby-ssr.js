import "regenerator-runtime/runtime";

import React from "react";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{element}</ThemeProvider>
  </StyledEngineProvider>
);
