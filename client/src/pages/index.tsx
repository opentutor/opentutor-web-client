/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React, { useEffect, useState } from "react";
import Cmi5 from "@xapi/cmi5";
import App from "components/App";
import GuestPrompt from "components/GuestPrompt";

const IndexPage = (): JSX.Element => {
  const [guest, setGuest] = useState<string>();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get("guest");
    setGuest(guest || undefined);
    if (Cmi5.isCmiAvailable) {
      Cmi5.instance.initialize();
    }
  }, []);

  const hasSessionUser = (): boolean => {
    if (typeof window === "undefined") {
      return Boolean(guest);
    }
    return Boolean(Cmi5.isCmiAvailable || guest);
  };

  const setQueryString = (qs: string, qsValue: string): string => {
    let url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
    if (window.location.search) {
      url += `&${qs}=${qsValue}`;
    } else {
      url += `?${qs}=${qsValue}`;
    }
    window.history.pushState({ path: url }, "", url);
    return url;
  };

  const onNameEntered = (name: string): void => {
    if (!name) {
      name = "guest";
    }
    setGuest(name);
    window.location.href = setQueryString("guest", name);
  };

  return (
    <div>
      <App />
      {hasSessionUser() ? undefined : <GuestPrompt submit={onNameEntered} />}
    </div>
  );
};

export default IndexPage;
