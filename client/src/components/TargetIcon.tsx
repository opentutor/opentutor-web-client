import "styles/animations.css";
import React from "react";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import GpsFixedIcon from "@material-ui/icons/GpsFixed";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
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
  inProgress: {
    color: theme.palette.primary.main,
  },
  complete: {
    color: "#3CB371",
  },
  pulse: {},
}));

export default function TargetIcon(props: {
  target: { achieved: number; status: any };
  index: number;
  showSummary: any;
}) {
  const styles = useStyles();

  console.log(`Goal Status: ${props.target.status}`);

  return (
    <Box
      id={`target-${props.index}-${Number(props.target.achieved).toFixed()}`}
      position="relative"
      display="inline-flex"
    >
      <CircularProgress
        className={[
          styles.circleProgress,
          props.target.achieved == 1 ? styles.complete : styles.inProgress,
        ].join(" ")}
        variant="static"
        value={props.target.achieved * 100}
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
            props.target.status == "active" ? "pulse" : "",
          ].join(" ")}
          onClick={props.showSummary}
        >
          {props.target.status != "active" ? (
            <GpsNotFixedIcon
              className={[
                props.target.achieved == 1
                  ? styles.complete
                  : styles.inProgress,
                styles.centerIcon,
              ].join(" ")}
            />
          ) : (
            <GpsFixedIcon
              className={[
                props.target.achieved == 1
                  ? styles.complete
                  : styles.inProgress,
                styles.centerIcon,
              ].join(" ")}
            />
          )}
        </Button>
      </Box>
    </Box>
  );
}
