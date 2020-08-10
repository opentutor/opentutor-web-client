import React from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import TargetIcon from "components/TargetIcon";
import LockIcon from "@material-ui/icons/Lock";

const useStyles = makeStyles((theme) => ({
  placeholder: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 22,
    color: theme.palette.background.default,
  },
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(65% + 38px)",
    transform: "translate(-50%, -50%)",
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
    width: "140%",
  },
  inProgress: {
    color: "#DC143C",
  },
  complete: {
    color: "#3CB371",
  },
}));

export function TargetIndicator(props: {
  targets: {
    achieved: boolean;
    score: number;
    text: string;
    status: string;
  }[];
  showSummary: () => void;
}) {
  const styles = useStyles();

  if (props.targets.length === 0) {
    return (
      <TrackChangesIcon id={`placeholder`} className={styles.placeholder} />
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
            showSummary={props.showSummary}
          />
        );
      })}
    </div>
  );
}

export function SummaryIndicator(props: {
  targets: {
    achieved: boolean;
    score: number;
    text: string;
    status: string;
  }[];
}) {
  const styles = useStyles();

  return (
    <List id="summary-targets">
      {props.targets.map(
        (
          target: {
            achieved: boolean;
            score: number;
            text: string;
            status: string;
          },
          index: number
        ) => {
          return (
            <ListItem key={`summary-target-${index}`}>
              <ListItemIcon
                id={`summary-target-${index}-${Number(target.score).toFixed()}`}
              >
                <TargetIcon
                  target={target}
                  index={index}
                  showSummary={() => {}}
                />
              </ListItemIcon>
              <ListItemText id={`exp-${index}`} key={`exp-${index}`}>
                <div
                  className={target.text ? styles.released : styles.censored}
                >
                  {target.text ? (
                    target.text
                  ) : (
                    <LockIcon
                      className={styles.centerLock}
                      id={`exp-locked-${index}`}
                    />
                  )}
                </div>
              </ListItemText>
            </ListItem>
          );
        }
      )}
    </List>
  );
}

export default TargetIndicator;
