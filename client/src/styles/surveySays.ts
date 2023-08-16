/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

export const surveySaysStylesDesktop = makeStyles()((theme: Theme) => ({
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
  },
  fixedSurveyCard: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 45,
    position: "relative",
    boxSizing: "border-box",
    transition: "box-shadow 0.5s ease-in",
  },
  expandableSurveyCard: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 30,
    position: "relative",
    boxSizing: "border-box",
    transition: "box-shadow 0.5s ease-in",
  },
  fixedSurveyCardText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  expandableSurveyCardText: {
    minHeight: 20,
  },
  default: {
    boxShadow: "1px 6px 6px -3px lightblue",
  },
  completeSatisfied: {
    boxShadow: "1px 6px 6px -3px lightgreen",
  },
  completeUnsatisfied: {
    boxShadow: "1px 6px 6px -3px darkgrey",
  },
  survey: {
    padding: theme.spacing(1),
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  bodyRoot: {
    width: "100%",
    backgroundColor: "#212629",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    boxSizing: "border-box",
  },
  bodyNoMedia: {
    // height: "60%",
  },
  bodyMedia: {
    // height: "40%",
  },
  surveyInnerBoard: {
    width: "100%",
    // height: "calc(100% - 20px)",
    backgroundColor: "#212629",
    boxSizing: "border-box",
    border: "5px solid lightblue",
    borderRadius: 30,
  },
  surveyQuestion: {
    color: "white",
  },
  bodyRootNoHeader: {
    width: "100%",
    backgroundColor: "#212629",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 8px",
    boxSizing: "border-box",
    height: "18%",
  },
}));

export const surveySaysStylesMobile = makeStyles()((theme: Theme) => ({
  fixedSurveyCardMobile: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 30,
    position: "relative",
    boxSizing: "border-box",
    transition: "box-shadow 0.5s ease-in",
  },
}));
