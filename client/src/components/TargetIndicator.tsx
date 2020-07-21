import React, { useState } from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { makeStyles } from "@material-ui/core/styles";
import TargetIcon from "../components/TargetIcon";

const useStyles = makeStyles((theme) => ({
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 22,
    color: "#FFF",
  },
}));

export default function TargetIndicator(props: {
  targets: { achieved: number }[];
}) {
  const styles = useStyles();

  console.log(props.targets);

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
          <TargetIcon
            id={`target-${index}`}
            key={`target-${index}`}
            //className={target.achieved ? styles.targetComplete : styles.target}
            target={target}
          />
        );
      })}
    </div>
  );
}
