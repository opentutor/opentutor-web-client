import React from 'react';
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const DIAMETER = 50;
const RADIUS = 25;
const STROKE_WIDTH = 10;
const CIRCUMFERENCE = 2 * 3.141592 * RADIUS;

<svg
  viewBox="0 0 50 50"
  width="100px"
  height="100px"
  className="circle-progress"
>
  <circle
    cx={DIAMETER / 2}
    cy={DIAMETER / 2}
    r={RADIUS}
    stroke="tomato"
    fill="transparent"
    strokeWidth={STROKE_WIDTH}
    style={{
      strokeDasharray: CIRCUMFERENCE
    }}
  />
</svg>

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    position: "relative",
    minWidth: 26,
    minHeight: 26,
    borderRadius: 50,
    transition: "all 0.3s ease",
    //boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.2)",
    outline: "none",
    cursor: "pointer",
    border: 0,
    backgroundColor: "#fff",
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }
}));

export default function TargetIcon(props: any) {
  const { achieved: double } = props;
  const styles = useStyles();

  return (
    <>
      <Button className={styles.button} >
        <TrackChangesIcon
          // id={`target-${index}`}
          // key={`target-${index}`}
          // className={target.achieved ? styles.targetComplete : styles.target}
        />
      </Button>
    </>
  );
}