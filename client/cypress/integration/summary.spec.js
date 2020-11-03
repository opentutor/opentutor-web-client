/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup } from "../support/functions";

describe("Expectation summary pop-up", () => {
  it("opens with View Summary button", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#view-summary-btn").trigger("mouseover").click();
    cy.get("#summary-popup");
  });

  [
    {
      lesson: "q1",
      fixture: "q1-1-p1.json",
      expectedExpectations: 3,
    },
    {
      lesson: "q2",
      fixture: "q2-1-p1.json",
      expectedExpectations: 1,
    },
  ].forEach((x) => {
    it(`shows an icon for each expectation for lesson with ${x.expectedExpectations}`, () => {
      cySetup(cy);
      cy.route("POST", `**/dialog/${x.lesson}`, `fixture:${x.fixture}`);
      cy.visit(`/?lesson=${x.lesson}&guest=guest`);
      cy.get("#view-summary-btn").trigger("mouseover").click();
      cy.get("#summary-popup");
      cy.get("#summary-targets")
        .children()
        .should("have.length", x.expectedExpectations);
    });
  });

  it("displays on tap any expectation-progress indicator", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.fixture("q2-1-p1.json").then((desiredServerResponse) => {
      cy.get(
        `#target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}`
      )
        .trigger("mouseover")
        .click();
      cy.get("#summary-popup");
      cy.get("#summary-targets").children().should("have.length", 1);
    });
  });

  it("displays at when lesson is completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").trigger("mouseover").click();
    cy.get("#summary-popup");
  });

  it("hides text for expectations that have not been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#view-summary-btn").trigger("mouseover").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-locked-0");
  });

  it("shows no progress for expectations that have not been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#view-summary-btn").trigger("mouseover").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-0");
  });

  it("shows text for expectations that have been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").trigger("mouseover").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#exp-0").contains(
      "Current flows in the same direction as the arrow."
    );
  });

  it("shows progress for expectations that have been completed", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("#outlined-multiline-static").type(
      "Current flows in the same direction as the arrow"
    );
    cy.get("#submit-button").trigger("mouseover").click();
    cy.get("#summary-popup");
    cy.get("#summary-targets").children().should("have.length", 1);
    cy.get("#summary-target-0-1");
  });
});
