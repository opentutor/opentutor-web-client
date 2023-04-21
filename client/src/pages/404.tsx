/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React from "react";
import { makeStyles } from "tss-react/mui";
import { Typography, Button } from "@mui/material";

const NotFoundPage: React.FC = () => {
  const { classes: styles } = useStyles();
  return (
    <div>
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
          OpenTutor {process.env.OPENTUTOR_CLIENT_VERSION}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles({ name: { NotFoundPage } })((theme) => ({
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
    backgroundColor: theme.palette.primary.main,
    textAlign: "left",
  },
  backButton: {
    marginTop: 25,
  },
}));

export default NotFoundPage;
