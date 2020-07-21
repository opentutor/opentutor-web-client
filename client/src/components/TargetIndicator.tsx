import React from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

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
  },
  censored: {
    color: "black",
    background: "black",
  },
}));

export function TargetIndicator(props: { targets: any[] }) {
  const styles = useStyles();

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

export function SummaryIndicator(props: { targets: any[] }) {
  const styles = useStyles();

  return (
    <List id="summary-targets">
      {props.targets.map((target: any, index: number) => {
        return (
          <ListItem key={`summary-${index}`}>
            <ListItemIcon id={`target-${index}`} key={`target-${index}`}>
              <TrackChangesIcon
                className={
                  target.achieved ? styles.targetComplete : styles.target
                }
              />
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
