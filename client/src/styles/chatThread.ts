/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

function calcBoardHeight(expectationCount: number) {
  // 46px per target, 31px for question, 16*2px padding, 5*2 border, 10*2px padding
  return expectationCount * 46 + 31 + 32 + 10 + 20;
}

export interface ChatThreadStylesProps {
  expectationCount: number;
}

export const chatThreadStylesDesktop = makeStyles<{
  expectationCount: number;
}>()((theme: Theme, { expectationCount }) => ({
  bodySurveySaysNoMedia: {
    height: `calc(100% - 95px - ${calcBoardHeight(expectationCount)}px)`,
  },
  bodySurveySaysMedia: {
    height: `calc(100% - 120px)`,
    width: "100%",
  },
  root: {
    width: "auto",
    paddingTop: 0,
    paddingBottom: 0,
  },
  bodyRoot: {
    flexGrow: 1,
    paddingTop: 10,
    width: "90%",
    maxWidth: "96%",
    marginLeft: "50%",
    paddingBottom: 10,
    transform: "translateX(-50%)",
    boxSizing: "border-box",
  },
  bodyDefaultNoMedia: {
    height: "calc(100% - 60px - 95px)",
  },
  bodyDefaultMedia: {
    height: "calc(100% - 60px - 45px)",
  },
  chatThreadList: {
    width: "100%",
  },
  avatar: {
    color: "#fff",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  icon: {
    position: "absolute",
    right: -20,
  },
  gray: {},
  red: {
    background: "#DC143C",
  },
  green: {
    background: "#3CB371",
  },
  yellow: {
    background: "yellow",
  },
}));

export const chatThreadStylesMobile = makeStyles<{
  expectationCount: number;
}>()((theme: Theme, { expectationCount }) => ({
  bodySurveySaysNoMedia: {
    height: `calc(100% - 95px - ${calcBoardHeight(expectationCount)}px)`,
  },
  bodySurveySaysMediaMobile: {
    height: `calc(68%  - ${calcBoardHeight(expectationCount)}px)`,
  },
  noHeader_BodySurveySaysMediaMobile: {
    height: `calc(75%  - ${calcBoardHeight(expectationCount)}px)`,
  },
  root: {
    width: "auto",
    paddingTop: 0,
    paddingBottom: 0,
  },
  bodyRoot: {
    paddingTop: 10,
    width: "90%",
    maxWidth: 400,
    marginLeft: "50%",
    paddingBottom: 10,
    transform: "translateX(-50%)",
    boxSizing: "border-box",
  },
  bodyDefaultNoMedia: {
    height: "calc(100% - 60px - 95px)",
  },
  bodyDefaultMediaMobile: {
    height: "calc(65% - 60px - 115px)",
  },

  avatar: {
    color: "#fff",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  icon: {
    position: "absolute",
    right: -40,
  },
  gray: {},
  red: {
    background: "#DC143C",
  },
  green: {
    background: "#3CB371",
  },
  yellow: {
    background: "yellow",
  },
}));
