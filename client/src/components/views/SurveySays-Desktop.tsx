/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Target } from "types";
import clsx from "clsx";
import Grid from "@mui/material/Grid";
import withLocation from "wrap-with-location";
import { Paper, styled } from "@mui/material";
import { isNoHeader } from "utils";

const useStyles = makeStyles((theme) => ({
  centerLock: {
    position: "absolute",
    top: "50%",
    left: "calc(50% + 0px)",
    transform: "translate(-50%, -50%)",
  },
  fixedSurveyCard: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    padding: 10,
    height: 30,
    position: "relative",
    boxSizing: "border-box",
    transition: "box-shadow 0.5s ease-in",
  },
  expandableSurveyCard: {
    borderRadius: 10,
    background: theme.palette.primary.main,
    color: "white",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: 30,
    position: "relative",
    boxSizing: "border-box",
    transition: "box-shadow 0.5s ease-in",
  },
  fixedSurveyCardText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  expandableSurveyCardText: {
    minHeight: 20,
  },
  default: {
    boxShadow: "1px 6px 6px -3px lightblue",
  },
  completeSatisfied: {
    boxShadow: "1px 6px 6px -3px lightgreen",
  },
  completeUnsatisfied: {
    boxShadow: "1px 6px 6px -3px darkgrey",
  },
  survey: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  bodyRoot: {
    width: "100%",
    backgroundColor: "#212629",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 8px",
    boxSizing: "border-box",
  },
  bodyRootNoHeader: {
    width: "100%",
    backgroundColor: "#212629",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 8px",
    boxSizing: "border-box",
    height: "15%",
  },
  bodyNoMedia: {
    // height: "60%",
  },
  bodyMedia: {
    // height: "40%",
    // borderRadius: "0px 0px 10px 10px",
  },
  surveyInnerBoard: {
    width: "100%",
    // height: "calc(100% - 20px)",
    backgroundColor: "#212629",
    boxSizing: "border-box",
    borderRadius: 30,
  },
  surveyQuestion: {
    color: "white",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1B6A9C !important",
  ...theme.typography.body2,
  textAlign: "center",
  color: "#fff",
  borderRadius: 10,
}));

const SurveySaysDesktop = (props: {
  search: { lesson: string };
  hasMedia: boolean;
  targets: Target[];
  isMobile: boolean;
}): JSX.Element => {
  const styles = useStyles();
  const [expandedCard, setExpandedCard] = useState(-1);

  const surveySaysGrid = (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {props.targets.map((target, idx) => (
        <Grid item xs={6} key={idx}>
          <Item>
            <div
              id={`card-${idx}`}
              className={clsx({
                [styles.fixedSurveyCard]: idx !== expandedCard,
                [styles.expandableSurveyCard]: idx === expandedCard,
                [styles.completeSatisfied]:
                  target.status === "complete" && target.score === 1,
                [styles.completeUnsatisfied]:
                  target.status === "complete" && target.score !== 1,
                [styles.default]: target.status !== "complete",
              })}
              onClick={() => {
                if (idx === expandedCard) {
                  setExpandedCard(-1);
                } else {
                  setExpandedCard(idx);
                }
              }}
            >
              {idx === expandedCard && target.status === "complete" ? (
                <Typography
                  variant={target.status !== "complete" ? "h6" : "caption"}
                >
                  {target.status === "complete" ? target.text : idx + 1}
                </Typography>
              ) : (
                <Typography
                  className={clsx({
                    [styles.fixedSurveyCardText]: true,
                    [styles.centerLock]: true,
                  })}
                  variant={target.status !== "complete" ? "h6" : "caption"}
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {target.status === "complete" ? target.text : idx + 1}
                </Typography>
              )}
            </div>
          </Item>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <div
        className={clsx({
          [styles.bodyRoot]: true,
          [styles.bodyRootNoHeader]: isNoHeader(),
          [styles.bodyNoMedia]: !props.hasMedia,
          [styles.bodyMedia]: props.hasMedia,
        })}
      >
        <div className={styles.survey}>
          <Grid container>{surveySaysGrid}</Grid>
        </div>
      </div>
    </>
  );
};

export default withLocation(SurveySaysDesktop);
