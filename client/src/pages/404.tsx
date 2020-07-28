import "styles/layout.css";
import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import logo from "assets/logo.png";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1b6a9c",
    },
  },
});

const useStyles = makeStyles(() => ({
  logo: {
    width: 200,
    height: 75,
  },
  foreground: {
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: "calc(100% - 75px)",
    minHeight: 750,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
  },
  image: {
    width: "100%",
    height: "30%",
    aspectRatio: "2/1",
    objectFit: "cover",
    marginBottom: -5,
  },
  mainWindow: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "67%",
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0%)",
    marginBottom: 15,
  },
  errorHeaderInfo: {
    fontWeight: "bold",
    fontSize: "1000%",
  },
  errorSubtitleInfo: {
    fontWeight: "bold",
    fontSize: "180%",
  },
  buildInfo: {
    position: "fixed",
    bottom: 4,
    marginLeft: 8,
    color: "white",
    fontWeight: "bold",
    fontSize: "70%",
  },
  backButton: {
    marginTop: 25,
  },
}));

const NotFoundPage: React.FC = () => {
  const styles = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <img src={String(logo)} className={styles.logo}></img>
      <div className={styles.foreground}>
        <img
          src="https://images.theconversation.com/files/193721/original/file-20171108-6766-udash5.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=926&fit=clip"
          className={styles.image}
        ></img>
        <br />
        <div className={styles.mainWindow}>
          <Typography className={styles.errorHeaderInfo}>404</Typography>
          <Typography className={styles.errorSubtitleInfo}>
            {"We couldn't find the page you were looking for."}
          </Typography>
          <Button
            className={styles.backButton}
            color="primary"
            variant="contained"
            // onClick={history.back/* Eventually navigate(-1)*/}
          >
            Go Back
          </Button>
        </div>
        <Typography className={styles.buildInfo}>
          OpenTutor Client V1.0.0-alpha.12
        </Typography>
      </div>
    </MuiThemeProvider>
  );
};

export default NotFoundPage;
