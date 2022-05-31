/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { Typography } from "@material-ui/core";
import { Target } from "types";
import clsx from "clsx";
import Grid from "@mui/material/Grid";
import withLocation from "wrap-with-location";
import { Paper, styled } from "@mui/material";
import { isNoHeader, shouldDisplayPortrait } from "utils";
import {
  surveySaysStylesDesktop,
  surveySaysStylesMobile,
} from "./styles/surveySays";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#1B6A9C !important",
  ...theme.typography.body2,
  textAlign: "center",
  color: "#fff",
  borderRadius: 10,
}));

const SurveySays = (props: {
  search: { lesson: string };
  hasMedia: boolean;
  targets: Target[];
  isMobile: boolean;
}): JSX.Element => {
  const stylesDesktop = surveySaysStylesDesktop();
  const stylesMobile = surveySaysStylesMobile();
  const [expandedCard, setExpandedCard] = useState(-1);

  const surveySaysGrid = (
    <Grid
      container
      rowSpacing={shouldDisplayPortrait() ? 1 : 3}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
    >
      {props.targets.map((target, idx) => (
        <Grid item xs={12} lg={6} key={idx} columnSpacing={4} rowSpacing={3}>
          <Item>
            <div
              id={`card-${idx}`}
              className={clsx({
                [stylesDesktop.fixedSurveyCard]: idx !== expandedCard,
                [stylesMobile.fixedSurveyCardMobile]:
                  shouldDisplayPortrait() && idx !== expandedCard,
                [stylesDesktop.expandableSurveyCard]: idx === expandedCard,
                [stylesDesktop.completeSatisfied]:
                  target.status === "complete" && target.score === 1,
                [stylesDesktop.completeUnsatisfied]:
                  target.status === "complete" && target.score !== 1,
                [stylesDesktop.default]: target.status !== "complete",
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
                    [stylesDesktop.fixedSurveyCardText]: true,
                    [stylesDesktop.centerLock]: true,
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
          [stylesDesktop.bodyRoot]: true,
          [stylesDesktop.bodyRootNoHeader]: isNoHeader(),
          [stylesDesktop.bodyNoMedia]: !props.hasMedia,
          [stylesDesktop.bodyMedia]: props.hasMedia,
        })}
      >
        <div className={stylesDesktop.survey}>
          <Grid container>{surveySaysGrid}</Grid>
        </div>
      </div>
    </>
  );
};

export default withLocation(SurveySays);
