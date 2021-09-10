/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Target } from "types";
import clsx from "clsx";
import withLocation from "wrap-with-location";

const useStyles = makeStyles((theme) => ({
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
  },
  censored: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 10,
    width: "calc(100% - 20px)",
    position: "relative",
    // borderColor: "orange",
    // borderWidth: 2,
    // borderStyle: "solid",
    boxShadow: "0 6px 6px -3px lightblue",
  },
  survey: {
    padding: theme.spacing(2),
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
  },
  bodyRoot: {
    width: "100%",
    backgroundColor: "#212629",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyNoMedia: {
    height: "60%",
  },
  bodyMedia: {
    height: "40%",
  },
  surveyInnerBoard: {
    width: "calc(100% - 20px)",
    height: "calc(100% - 20px)",
    backgroundColor: "#212629",
    boxSizing: "border-box",
    border: "5px solid lightblue",
    borderRadius: 30,
  },
  surveyQuestion: {
    color: "white",
  },
}));

const SurveySays = (props: {
  search: { lesson: string };
  hasMedia: boolean;
  targets: Target[];
}): JSX.Element => {
  const styles = useStyles();

  return (
    <>
      <div
        className={clsx({
          [styles.bodyRoot]: true,
          [styles.bodyNoMedia]: !props.hasMedia,
          [styles.bodyMedia]: props.hasMedia,
        })}
      >
        <div className={styles.surveyInnerBoard}>
          <div className={styles.survey}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  className={styles.surveyQuestion}
                  variant="h6"
                  style={{ width: "100%" }}
                >
                  Question for Some Expectation?
                </Typography>
              </Grid>
              {props.targets.map((target, idx) => {
                return (
                  <Grid container item spacing={2} key={idx}>
                    <Grid item xs={12}>
                      <div className={styles.censored}>
                        <Typography
                          className={styles.centerLock}
                          variant={!target.achieved ? "h6" : "caption"}
                          style={{ width: "100%" }}
                        >
                          {target.achieved ? target.text : idx + 1}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
};

export default withLocation(SurveySays);
