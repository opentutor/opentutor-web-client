/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDialog, cyMockSession, cySetup } from "../support/functions";

describe("Input field", () => {
  it("disables send button when no input", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").should("not.be.disabled");
    cy.get("[data-cy=submit-button]").should("be.disabled");
  });

  it("hides send button, enables continue, and hides summary button when session finished", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cyMockSession(cy, "q1", "q1-1-p2.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").type("fake short answer.");
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=submit-button]").should("not.exist");
    cy.get("[data-cy=continue-button]").should("be.visible");
    cy.get("[data-cy=continue-button]").should("not.be.disabled");
    cy.get("[data-cy=outlined-multiline-static]").within(($el) => {
      cy.get("textarea").should("be.disabled");
    });
  });

  it("enables send button when input and session not finished", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]").type("hi");
    cy.get("[data-cy=outlined-multiline-static]").should("not.be.disabled");
    cy.get("[data-cy=submit-button]").should("not.be.disabled");
  });

  it("can send input with button", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "some fake answer";
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=submit-button]").should("be.visible");
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=chat-msg-2]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should("contain", 
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("can send input with enter", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "another fake answer";
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=outlined-multiline-static]").type("{enter}");
    cy.get("[data-cy=chat-msg-2]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should("contain", 
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("ensure can send same input twice in a row", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "answer we will repeat";
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=outlined-multiline-static]").type("{enter}");
    cy.get("[data-cy=chat-msg-2]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should("contain", "some server response.");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=outlined-multiline-static]").type("{enter}");
    cy.get("[data-cy=chat-msg-4]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-5]").should("contain", "some server response.");
  });
});
