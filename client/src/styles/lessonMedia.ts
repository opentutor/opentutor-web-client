/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

export const lessonMediaStylesDesktop = makeStyles()((theme: Theme) => ({
  scroll: {
    backgroundColor: theme.palette.primary.dark,
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    whiteSpace: "nowrap",
  },
  image: {
    position: "relative",
    top: 0,
    left: 0,
    minWidth: 400,
  },
  innerZoomOverlay: {
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    right: 0,
    height: 50,
    width: 50,
    color: "white",
  },
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
  },
  released: {
    marginTop: "-30",
    transform: "translate(0%, -60%)",
    padding: 10,
    height: 10,
    width: "140%",
  },
  censored: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 10,
    width: "calc(100% - 20px)",
    position: "relative",
    borderColor: "orange",
    borderWidth: 2,
    borderStyle: "solid",
  },
  survey: {
    padding: theme.spacing(2),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  },
  mediaRoot: {},
  mediaDefault: {
    height: "98%",
    width: "98%",
  },
  mediaSurveySays: {
    height: "98%",
    width: "98%",
  },
}));

export const lessonMediaStylesMobile = makeStyles()((theme: Theme) => ({
  scroll: {
    backgroundColor: theme.palette.primary.dark,
    position: "relative",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    whiteSpace: "nowrap",
  },
  image: {
    position: "relative",
    top: 0,
    left: 0,
    minWidth: 400,
  },
  innerZoomOverlay: {
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    right: 0,
    height: 50,
    width: 50,
    color: "white",
  },
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
  },
  released: {
    marginTop: "-30",
    transform: "translate(0%, -60%)",
    padding: 10,
    height: 10,
    width: "140%",
  },
  censored: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 10,
    width: "calc(100% - 20px)",
    position: "relative",
    borderColor: "orange",
    borderWidth: 2,
    borderStyle: "solid",
  },
  survey: {
    padding: theme.spacing(2),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  },
  mediaRoot: {},
  mediaDefaultMobile: {
    height: "35%",
  },
  mediaSurveySaysMobile: {
    height: "30%",
    width: "100%",
  },
}));
