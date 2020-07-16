import React, { useState } from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  target: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    color: "#DC143C",
  },
  targetComplete: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    color: "#3CB371",
  },
}));

export default function TargetIndicator(props: { count: number }) {
  const targets = [
    { achieved: false },
    { achieved: false },
    { achieved: true },
    { achieved: false },
    { achieved: false },
  ];
  const styles = useStyles();
  return (
    <>
      {targets.map((target, index) => {
        return (
          <TrackChangesIcon
            key={index}
            className={target.achieved ? styles.targetComplete : styles.target}
          />
        );
      })}
    </>
  );
}
