/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
// import { cyMockDialog, cySetup } from "../support/functions";
import {
  addCmi5LaunchParams,
  cyMockCmi5Initialize,
  LAUNCH_DATA_DEFAULT,
} from "../support/cmi5";
import {
  cyMockDefault,
  cyMockDialog,
  cySetup,
  mockGQL,
} from "../support/functions";
Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Cmi5 integration", () => {
  it("does not show Guest Prompt when cmi5 launch params present", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit(addCmi5LaunchParams("/?lesson=q1"));
    cy.get("[data-cy=guest-prompt]").should("not.exist");
  });

  it("completes cmi5 initialization when launch params present", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cyMockCmi5Initialize(cy);
    cy.visit(addCmi5LaunchParams("/?lesson=q1"));
    cyMockDefault(cy, {
      gqlQueries: [
        mockGQL("FetchLessonInfo", {
          lessonInfo: {
            name: "lesson 1",
            media: {
              url: "https://www.youtube.com/watch?v=g4mHPeMGTJM",
              type: "video",
              props: [
                { name: "start", value: "71" },
                { name: "end", value: "72.5" },
              ],
            },
            learningFormat: "",
          },
        }),
      ],
    });
    cy.wait("@fetch")
      .its("response.body")
      .should("have.property", "auth-token", "fake-auth-token");
    // cy.wait("@getState")
    //   .its("response.body")
    //   .should("deep.equal", LAUNCH_DATA_DEFAULT);
    // cy.wait("@getProfile").its("response.body").should("deep.equal", {});
    cy.wait("@initialized")
      .its("response.body")
      .should("deep.equal", ["fake-initialized-statement-id"]);
  });
});
