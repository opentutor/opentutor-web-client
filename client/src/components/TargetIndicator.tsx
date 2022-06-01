/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import { Grid, Typography } from "@material-ui/core";
import TargetIcon from "components/TargetIcon";
import LockIcon from "@material-ui/icons/Lock";
import { Target } from "types";
import { targetIndicatorStyles } from "./styles/targetIndicator";

export function TargetIndicator(props: {
  targets: Target[];
  showSummary: () => void;
}): JSX.Element {
  const styles = targetIndicatorStyles();
  if (props.targets.length === 0) {
    return (
      <TrackChangesIcon id={`placeholder`} className={styles.placeholder} />
    );
  }
  return (
    <div
      data-cy="targets"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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

export function SummaryIndicator(props: { targets: Target[] }): JSX.Element {
  const styles = targetIndicatorStyles();
  return (
    <Grid container className={styles.targetGrid} data-cy="summary-targets">
      {props.targets.map((target, index) => {
        return (
          <Grid item key={`summary-target-${index}`} xs={12}>
            <div className={styles.targetItem}>
              <div
                data-cy={`summary-target-${index}-${Number(
                  target.score
                ).toFixed()}`}
              >
                <TargetIcon
                  target={target}
                  index={index}
                  showSummary={(): void => {
                    /* Empty Function as we don't want to pop another summary from the summary page */
                  }}
                />
              </div>
              {target.text ? (
                <Typography
                  data-cy={`exp-${index}`}
                  style={{
                    textAlign: "left",
                    marginRight: 20,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  variant="body1"
                >
                  {target.text}
                </Typography>
              ) : (
                <div className={styles.censored} style={{ marginRight: 20 }}>
                  <LockIcon data-cy={`exp-locked-${index}`} />
                </div>
              )}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default TargetIndicator;
