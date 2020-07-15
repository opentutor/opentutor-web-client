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
  const styles = useStyles();
  return (
    <>
      <TrackChangesIcon
        className={props.count >= 1 ? styles.targetComplete : styles.target}
      />
      <TrackChangesIcon
        className={props.count >= 2 ? styles.targetComplete : styles.target}
      />
      <TrackChangesIcon
        className={props.count >= 3 ? styles.targetComplete : styles.target}
      />
    </>
  );
}
