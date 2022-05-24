/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Target } from "types";
import clsx from "clsx";
import withLocation from "wrap-with-location";
import { surveySaysHeader } from "./styles/surveySays";

const SurveySays = (props: {
  search: { lesson: string };
  hasMedia: boolean;
  targets: Target[];
}): JSX.Element => {
  const styles = surveySaysHeader();
  const [expandedCard, setExpandedCard] = useState(-1);

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
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  className={styles.surveyQuestion}
                  variant="h6"
                  style={{ width: "100%" }}
                >
                  Key Takeaways
                </Typography>
              </Grid>
              {props.targets.map((target, idx) => {
                return (
                  <Grid item xs={12} key={idx} style={{ margin: 8 }}>
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
                          variant={
                            target.status !== "complete" ? "h6" : "caption"
                          }
                        >
                          {target.status === "complete" ? target.text : idx + 1}
                        </Typography>
                      ) : (
                        <Typography
                          className={clsx({
                            [styles.fixedSurveyCardText]: true,
                            [styles.centerLock]: true,
                          })}
                          variant={
                            target.status !== "complete" ? "h6" : "caption"
                          }
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
