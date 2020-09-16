/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React, { useContext, useEffect, useState } from "react";
import { Context as CmiContext } from "react-cmi5-context";
import { v1 as uuidv1 } from "uuid";
import { makeStyles } from "@material-ui/core/styles";

import logo from "assets/logo.png";
import { addCmi, hasCmi, CMI5_ENDPOINT, CMI5_FETCH } from "cmiutils";
import App from "components/App";
import GuestPrompt from "components/GuestPrompt";
import withLocation from "wrap-with-location";

const useStyles = makeStyles(() => ({
  logo: {
    width: 200,
    height: 75,
  },
}));

const IndexPage = (props: { search: { guest: string } }): JSX.Element => {
  const styles = useStyles();
  const [guest, setGuest] = useState(props.search.guest);
  const cmi = useContext(CmiContext);
  const { start: cmi5Start } = cmi;

  useEffect(() => {
    cmi5Start();
  }, []);

  const hasSessionUser = (): boolean => {
    if (typeof window === "undefined") {
      return Boolean(guest);
    }
    return Boolean(hasCmi(window.location.search) || guest);
  };

  const absUrl = (url: string): string => {
    return url.startsWith("http")
      ? url
      : `${window.location.protocol}//${window.location.host}${
          url.startsWith("/") ? "" : "/"
        }${url}`;
  };

  const setQueryStringWithoutPageReload = (
    qs: string,
    qsValue: string
  ): void => {
    let url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
    if (window.location.search) {
      url += `&${qs}=${qsValue}`;
    } else {
      url += `?${qs}=${qsValue}`;
    }
    window.history.pushState({ path: url }, "", url);
  };

  const onNameEntered = (name: string): void => {
    if (!name) {
      name = "guest";
    }
    setGuest(name);
    setQueryStringWithoutPageReload("guest", name);

    const urlRoot = `${window.location.protocol}//${window.location.host}`;
    const userId = uuidv1();
    window.location.href = addCmi(window.location.href, {
      activityId: window.location.href,
      actor: {
        name: `${name}`,
        account: {
          name: `${userId}`,
          homePage: `${urlRoot}/guests`,
        },
      },
      endpoint: absUrl(CMI5_ENDPOINT),
      fetch: `${absUrl(CMI5_FETCH)}${
        CMI5_FETCH.includes("?") ? "" : "?"
      }&username=${encodeURIComponent(name)}&userid=${userId}`,
      registration: uuidv1(),
    });
  };

  return (
    <div>
      <img src={String(logo)} className={styles.logo}></img>
      <App />
      {hasSessionUser() ? undefined : <GuestPrompt submit={onNameEntered} />}
    </div>
  );
};

export default withLocation(IndexPage);
