/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";

import { useTheme } from "@material-ui/core/styles";

import withLocation from "wrap-with-location";

import { shouldDisplayPortrait } from "utils";
import { useMediaQuery } from "@material-ui/core";
import Desktop from "./views/Desktop";
import Mobile from "./views/Mobile";

function App(props: {
  search: { lesson: string; guest: string; actor: string; noheader: string };
}): JSX.Element {
  const { lesson, guest, actor, noheader } = props.search;
  const matchesMobile = useMediaQuery("(max-width : 600px)", {
    noSsr: true,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const mobile = (
    <Mobile lesson={lesson} guest={guest} actor={actor} noheader={noheader} />
  );

  const desktop = (
    <Desktop lesson={lesson} guest={guest} actor={actor} noheader={noheader} />
  );
  return (
    <div>
      {shouldDisplayPortrait() || isMobile || matchesMobile ? (
        <div>{mobile}</div>
      ) : (
        <div>{desktop}</div>
      )}
    </div>
  );
}

export default withLocation(App);
