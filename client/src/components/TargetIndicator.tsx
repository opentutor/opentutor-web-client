import React from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import TargetIcon from "../components/TargetIcon";
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme) => ({
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 22,
    color: "#FFF",
  },
  centerIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  censored: {
    color: "black",
    background: "black",
    cornerRadius: 10,
  },
  inProgress: {
    color: "#DC143C",
  },
  complete: {
    color: "#3CB371",
  },
}));

export function TargetIndicator(props: { targets: { achieved: number }[] }) {
  const styles = useStyles();

  console.log(props.targets);

  if (props.targets.length == 0) {
    return (
      <TrackChangesIcon
        id={`placeholder`}
        key={`placeholder`}
        className={styles.placeholder}
      />
    );
  }

  return (
    <div id="targets">
      {props.targets.map((target, index) => {
        return (
          <TargetIcon
            key={`target-${index}`}
            target={target}
            index={index}
          />
        );
      })}
    </div>
  );
}

export function SummaryIndicator(props: { targets: any[] }) {
  const styles = useStyles();

  return (
    <List id="summary-targets">
      {props.targets.map((target: any, index: number) => {
        return (
          <ListItem key={`summary-${index}`}>
            <ListItemIcon id={`target-${index}-${Number(target.achieved).toFixed()}`} key={`target-${index}`}>
              <TargetIcon key={`summary-target-${index}`} target={target} index={index+props.targets.length} />
            </ListItemIcon>
            <ListItemText
              id={`exp-${index}`}
              key={`exp-${index}`}
              className={target.text ? undefined : styles.censored}
            >
              {target.text ? target.text : "_"}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}

export default TargetIndicator;
