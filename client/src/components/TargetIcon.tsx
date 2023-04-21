/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import "styles/animations.css";
import React from "react";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import Button from "@mui/material/Button";
import clsx from "clsx";
import { makeStyles } from "tss-react/mui";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Target } from "types";

const useStyles = makeStyles({ name: { TargetIcon } })((theme) => ({
  button: {
    position: "relative",
    minWidth: 26,
    minHeight: 26,
    maxWidth: 26,
    maxHeight: 26,
    borderRadius: 50,
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  circleProgress: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  default: {
    color: theme.palette.primary.main,
  },
  completeSatisfied: {
    color: "#3CB371",
  },
  completeUnsatisfied: {
    color: "grey",
  },
  pulse: {},
}));

export default function TargetIcon(props: {
  target: Target;
  index: number;
  showSummary: () => void;
}): JSX.Element {
  const { classes: styles } = useStyles();

  return (
    <Box
      data-cy={`target-${props.index}-${Number(props.target.score).toFixed()}`}
      position="relative"
      display="inline-flex"
      style={{ transform: "rotate(-90deg)" }}
    >
      <CircularProgress
        className={clsx({
          [styles.circleProgress]: true,
          [styles.completeSatisfied]:
            props.target.status === "complete" && props.target.score === 1,
          [styles.completeUnsatisfied]:
            props.target.status === "complete" && props.target.score !== 1,
          [styles.default]: props.target.status !== "complete",
        })}
        variant="determinate"
        value={props.target.score * 100}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          className={[
            styles.button,
            props.target.status === "active" ? "pulse" : "",
          ].join(" ")}
          onClick={props.showSummary}
        >
          {props.target.status !== "active" ? (
            <GpsNotFixedIcon
              className={clsx({
                [styles.circleProgress]: true,
                [styles.completeSatisfied]:
                  props.target.status === "complete" &&
                  props.target.score === 1,
                [styles.completeUnsatisfied]:
                  props.target.status === "complete" &&
                  props.target.score !== 1,
                [styles.default]: props.target.status !== "complete",
              })}
            />
          ) : (
            <GpsFixedIcon
              className={clsx({
                [styles.circleProgress]: true,
                [styles.default]: true,
              })}
            />
          )}
        </Button>
      </Box>
    </Box>
  );
}
