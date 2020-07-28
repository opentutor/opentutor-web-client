import "styles/layout.css";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import logo from "assets/logo.png";
import App from "components/App";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  logo: {
    width: 200,
    height: 75,
  },
}));

const IndexPage: React.FC = () => {
  const styles = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <img src={String(logo)} className={styles.logo}></img>
      <App />
    </MuiThemeProvider>
  );
};

export default IndexPage;
