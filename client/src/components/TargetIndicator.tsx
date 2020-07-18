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
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    color: "#FFF",
  },
}));

export default function TargetIndicator(props: { targets: any[] }) {
  const styles = useStyles();

  if (props.targets.length == 0) {
    return (
      <>
        <TrackChangesIcon
          id={`placeholder`}
          key={`placeholder`}
          className={styles.placeholder}
        />
      </>
    );
  }

  return (
    <div id="targets">
      {props.targets.map((target, index) => {
        return (
          <TrackChangesIcon
            id={`target-${index}`}
            key={`target-${index}`}
            className={target.achieved ? styles.targetComplete : styles.target}
          />
        );
      })}
    </div>
  );
}
