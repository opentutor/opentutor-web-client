import React from "react";
import App from '../components/App';
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#1b6a9c",
        },
    },
});

const useStyles = makeStyles((theme) => ({
    logo: {
        backgroundColor: theme.palette.background.default,
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
    }
}));

const IndexPage: React.FC = () => {
    document.body.style.backgroundColor = theme.palette.primary.main;
    const logoSrc = require('../assets/logo.png')
    const styles = useStyles();
    return (
        <MuiThemeProvider theme={theme}>
            <img src={String(logoSrc)} className={styles.logo}></img>
            <App/>
            {/* <div className={styles.footer}>
                <p>
                    OpenTutor Client Version 0.0.1
                </p>
            </div> */}
        </MuiThemeProvider>
    );
};

export default IndexPage;
