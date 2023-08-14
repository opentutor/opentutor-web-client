/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

export const targetIndicatorStyles = makeStyles()((theme: Theme) => ({
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 22,
    color: theme.palette.background.default,
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
    background: "#929fad",
    padding: 10,
    height: 10,
    width: "150%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  targetGrid: { width: "100%", padding: 10, boxSizing: "border-box" },
  targetItem: {
    width: "100%",
    display: "flex",
    padding: 5,
    boxSizing: "border-box",
    alignItems: "center",
  },
  inProgress: {
    color: "#DC143C",
  },
  complete: {
    color: "#3CB371",
  },
}));
