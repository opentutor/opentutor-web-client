/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDialog, cyMockSession, cySetup } from "../support/functions";

describe("Expectation-progress Indicators", () => {
  it("shows no progress on all three targets at start of a lesson", () => {
    cySetup(cy);
    cy.fixture("q1-1-p1.json").then((desiredServerResponse) => {
      cyMockDialog(cy, "q1", "q1-1-p1.json");
      cy.visit("/?lesson=q1&guest=guest");
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`
      );
      cy.get(
        `[data-cy=target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}]`
      );
      cy.get(
        `[data-cy=target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}]`
      );
    });
  });

  it("shows some progress on two targets during a lesson", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-2-p2.json");
    cy.fixture("q1-2-p2.json").then((desiredServerResponse) => {
      cyMockSession(cy, "q1", "q1-2-p2.json");
      cy.visit("/?lesson=q1&guest=guest");
      cy.wait(4000);
      cy.get("[data-cy=chat-msg-2]").should(
        "have.text",
        "Why might you allow bad behavior in a group that you normally would not allow yourself to do?"
      );
      cy.get("[data-cy=outlined-multiline-static]").type("Peer pressure");
      cy.get("[data-cy=submit-button]").click();
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`
      );
      cy.get(
        `[data-cy=target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}]`
      );
      cy.get(
        `[data-cy=target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}]`
      );
    });
  });

  it("shows full progress for three targets on perfect response", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p2.json");
    cy.fixture("q1-1-p2.json").then((desiredServerResponse) => {
      cyMockSession(cy, "q1", "q1-1-p2.json");
      cy.visit("/?lesson=q1&guest=guest");
      cy.get("[data-cy=outlined-multiline-static]").type("short fake answer");
      cy.get("[data-cy=submit-button]", { timeout: 15000 })
        .should("not.be.disabled")
        .click();
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`,
        { timeout: 15000 }
      );
      cy.get(
        `[data-cy=target-1-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[1].score
        ).toFixed()}]`,
        { timeout: 15000 }
      );
      cy.get(
        `[data-cy=target-2-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[2].score
        ).toFixed()}]`,
        { timeout: 15000 }
      );
    });
  });

  it("shows no progress on all three targets at start of another lesson", () => {
    cySetup(cy);
    cy.fixture("q1-1-p2.json").then((desiredServerResponse) => {
      cyMockDialog(cy, "q2", "q1-1-p2.json");
      cy.visit("/?lesson=q2&guest=guest");
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`
      );
    });
  });

  it("shows some progress on two targets during another lesson", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-2-p2.json");
    cy.fixture("q2-2-p2.json").then((desiredServerResponse) => {
      cyMockSession(cy, "q2", "q2-2-p2.json");
      cy.visit("/?lesson=q2&guest=guest");
      cy.get("[data-cy=outlined-multiline-static]").type("Peer pressure");
      cy.get("[data-cy=submit-button]", { timeout: 15000 })
        .should("not.be.disabled")
        .click();
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`,
        { timeout: 15000 }
      );
    });
  });

  it("shows full progress for three targets on perfect response on another lesson", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-1-p2.json");
    cy.fixture("q2-1-p2.json").then((desiredServerResponse) => {
      cyMockSession(cy, "q2", "q2-1-p2.json");
      cy.visit("/?lesson=q2&guest=guest");
      cy.wait(4000);
      cy.get("[data-cy=chat-msg-1]").should(
        "have.text",
        "Let's try a different problem."
      );
      cy.get("[data-cy=outlined-multiline-static]").type("very short answer");
      cy.get("[data-cy=submit-button]", { timeout: 15000 })
        .should("not.be.disabled")
        .click();
      cy.get(
        `[data-cy=target-0-${Number(
          desiredServerResponse.sessionInfo.dialogState.expectationData[0].score
        ).toFixed()}]`,
        { timeout: 15000 }
      );
    });
  });
});
