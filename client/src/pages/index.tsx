/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/layout.css";
import React from "react";
import App from "components/App";
import GuestPrompt from "components/GuestPrompt";
import withLocation from "wrap-with-location";

const IndexPage = (props: { search: { guest: string } }): JSX.Element => {
  const [guest, setGuest] = React.useState(props.search.guest);

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
    <div>
      <App />
      {guest ? undefined : <GuestPrompt submit={onNameEntered} />}
    </div>
  );
};

export default withLocation(IndexPage);
