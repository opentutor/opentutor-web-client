import React from "react";
import App from "../components/App";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import logo from "../assets/logo.png";

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
    marginTop: 15,
  },
  footer: {
    marginTop: 15,
    backgroundColor: "#808080",
    width: "90%",
    maxWidth: 800,
    height: 30,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
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
