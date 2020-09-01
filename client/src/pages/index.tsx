/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React, { useState } from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import logo from "assets/logo.png";
import App from "components/App";
import GuestPrompt from "components/GuestPrompt";
import withLocation from "wrap-with-location";

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
}));

const IndexPage = (props: {
  search: { lesson: string; guest: string };
}): JSX.Element => {
  const styles = useStyles();
  const [guest, setGuest] = useState(props.search.guest);

  const onNameEntered = (val: string): void => {
    const name = val ? val : "guest";
    setGuest(name);
    let url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
    if (window.location.search) {
      url += `&guest=${name}`;
    } else {
      url += `?guest=${name}`;
    }
    window.location.href = url;
  };

  return (
    <MuiThemeProvider theme={theme}>
      <img src={String(logo)} className={styles.logo}></img>
      <App />
      {guest ? undefined : <GuestPrompt submit={onNameEntered} />}
    </MuiThemeProvider>
  );
};

export default withLocation(IndexPage);
