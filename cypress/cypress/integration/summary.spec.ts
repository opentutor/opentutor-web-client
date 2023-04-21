/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cyMockDefault,
  cyMockDialog,
  cyMockSession,
  cySetup,
  cyVisitWithTestingParam,
} from "../support/functions";

describe("Expectation summary pop-up", () => {
  it("opens with View Summary button", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=target-0-0]").trigger("mouseover").click();
    cy.get("[data-cy=summary-popup]");
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
      cyMockDefault(cy);
      cyMockDialog(cy, x.lesson, x.fixture);
      cyVisitWithTestingParam(cy, `/?lesson=${x.lesson}&guest=guest`);
      cy.get("[data-cy=target-0-0]").trigger("mouseover").click();
      cy.get("[data-cy=summary-popup]");
      cy.get("[data-cy=summary-targets]")
        .children()
        .should("have.length", x.expectedExpectations);
    });
  });

  it("displays on tap any expectation-progress indicator", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.fixture("q2-1-p1.json").then((desiredServerResponse) => {
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`
      )
        .trigger("mouseover")
        .click();
      cy.get("[data-cy=summary-popup]");
      cy.get("[data-cy=summary-targets]").children().should("have.length", 1);
    });
  });

  it("displays when lesson is completed", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").type("fake answer");
    cy.get("[data-cy=submit-button]", { timeout: 15000 })
      .should("not.be.disabled")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=summary-popup]", { timeout: 15000 });
  });

  it("hides text for expectations that have not been completed", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=target-0-0]").trigger("mouseover").click();
    cy.get("[data-cy=summary-popup]");
    cy.get("[data-cy=summary-targets]").children().should("have.length", 1);
    cy.get("[data-cy=exp-locked-0]");
  });

  it("shows no progress for expectations that have not been completed", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=target-0-0]").trigger("mouseover").click();
    cy.get("[data-cy=summary-popup]");
    cy.get("[data-cy=summary-targets]").children().should("have.length", 1);
    cy.get("[data-cy=summary-target-0-0]");
  });

  it("shows text for expectations that have been completed", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").type("fake answer");
    cy.get("[data-cy=submit-button]").should("be.visible");
    cy.get("[data-cy=submit-button]", { timeout: 15000 })
      .should("not.be.disabled")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=summary-popup]", { timeout: 15000 });
    cy.get("[data-cy=summary-targets]").children().should("have.length", 1);
    cy.get("[data-cy=exp-0]").should(
      "contain",
      "Current flows in the same direction as the arrow."
    );
  });

  it("shows progress for expectations that have been completed", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json");
    cyVisitWithTestingParam(cy, "/?lesson=q2&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").type("fake answer");
    cy.get("[data-cy=submit-button]").should("be.visible");
    cy.get("[data-cy=submit-button]", { timeout: 15000 })
      .should("not.be.disabled")
      .trigger("mouseover")
      .click();
    cy.get("[data-cy=summary-popup]", { timeout: 15000 });
    cy.get("[data-cy=summary-targets]").children().should("have.length", 1);
    cy.get("[data-cy=summary-target-0-1]");
  });
});
