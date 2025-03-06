/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import {
  cyMockDefault,
  cyMockDialog,
  cyMockSession,
} from "../support/functions";

describe("Input field", () => {
  it("disables send button when no input", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("[data-cy=outlined-multiline-static]", { timeout: 15000 }).should(
      "not.be.disabled"
    );
    cy.get("[data-cy=submit-button]").should("be.disabled");
  });

  it("hides send button, enables continue, and hides summary button when session finished", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cyMockSession(cy, "q1", "q1-1-p2.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.wait(4000);
    cy.get("[data-cy=chat-msg-1]").should(
      "have.text",
      "What are the challenges to demonstrating integrity in a group?"
    );
    cy.get("[data-cy=outlined-multiline-static]").type("fake short answer.");
    cy.get("[data-cy=submit-button]").should("not.be.disabled").click();
    cy.get("[data-cy=submit-button]").should("not.exist");
    cy.get("[data-cy=continue-button]").should("be.visible");
    cy.get("[data-cy=continue-button]").should("not.be.disabled");
    cy.get("[data-cy=outlined-multiline-static]").should("not.exist");
  });

  it("enables send button when input and session not finished", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.wait(4000);
    cy.get("[data-cy=outlined-multiline-static]").type("hi");
    cy.get("[data-cy=outlined-multiline-static]").should("not.be.disabled");
    cy.get("[data-cy=submit-button]").should("not.be.disabled");
  });

  it("can send input with button", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "some fake answer";
    cy.wait(4000);
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=submit-button]").should("be.visible");
    cy.get("[data-cy=submit-button]", { timeout: 15000 })
      .should("not.be.disabled")
      .click();
    cy.get("[data-cy=chat-msg-2]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should(
      "contain",
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("can send input with enter", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "another fake answer";
    cy.wait(4000);
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.wait(5000);
    cy.get("[data-cy=submit-button]").should("not.be.disabled");
    cy.get("[data-cy=outlined-multiline-static]").type("{enter}");
    cy.get("[data-cy=chat-msg-2]").should("contain", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should(
      "contain",
      "Summing up, this diode is forward biased. Positive current flows in the same direction of the arrow, from anode to cathode."
    );
  });

  it("ensure can send same input twice in a row", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "answer we will repeat";
    cy.wait(4000);
    cy.get("[data-cy=outlined-multiline-static]").should("be.visible");
    cy.get("[data-cy=outlined-multiline-static]").type(userInput);
    cy.get("[data-cy=submit-button]").should("not.be.disabled");
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

describe("Limit text input", () => {
  it("show truncation warning when input too long", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2.json").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("[data-cy=text-truncation-warning]").should("not.exist");
    const userInput = "a".repeat(301);
    cy.get("[data-cy=outlined-multiline-static]").type(userInput, {
      delay: 0,
    });
    cy.get("[data-cy=outlined-multiline-static]").should(
      "contain.text",
      userInput
    );
    cy.get("[data-cy=text-truncation-warning]").should("exist");
  });

  it("tooltip popup if submitted with truncation warning", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "a".repeat(301);
    cy.get("[data-cy=outlined-multiline-static]").type(userInput, {
      delay: 0,
    });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=text-truncation-popup]").should("exist");
    cy.get("[data-cy=text-truncation-popup]").should(
      "contain.text",
      "Your message will be truncated to 300 characters."
    );
    cy.get("[data-cy=text-truncation-popup]").should(
      "contain.text",
      "Are you sure you want to submit this message?"
    );
  });

  it("clicking no on popup does not send message", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "a".repeat(301);
    cy.get("[data-cy=outlined-multiline-static]").type(userInput, {
      delay: 0,
    });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=text-truncation-popup]").should("exist");
    cy.get("[data-cy=text-truncation-popup]").within(() => {
      cy.get("[data-cy=text-truncation-popup-no]").click();
    });
    cy.get("[data-cy=text-truncation-popup]").should("not.exist");
    cy.get("[data-cy=outlined-multiline-static]").should(
      "contain.text",
      userInput
    );
    cy.get("[data-cy=thread]").should("not.contain.text", userInput);
  });

  it("clicking yes on popup sends message", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "a".repeat(301);
    cy.get("[data-cy=outlined-multiline-static]").type(userInput, {
      delay: 0,
    });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=text-truncation-popup]").should("exist");
    cy.get("[data-cy=text-truncation-popup]").within(() => {
      cy.get("[data-cy=text-truncation-popup-yes]").click();
    });
    cy.get("[data-cy=text-truncation-popup]").should("not.exist");
    cy.get("[data-cy=chat-msg-2]").should("contain.text", userInput);
    cy.wait("@session");
    cy.get("[data-cy=chat-msg-3]").should(
      "contain.text",
      "some server response."
    );
  });

  it("actually truncates message", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cyMockSession(cy, "q2", "q2-1-p2-no-completion").as("session");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "a".repeat(305);
    cy.get("[data-cy=outlined-multiline-static]").type(userInput, {
      delay: 0,
    });
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=text-truncation-popup]").should("exist");
    cy.get("[data-cy=text-truncation-popup]").within(() => {
      cy.get("[data-cy=text-truncation-popup-yes]").click();
    });
    cy.wait("@session").then((data) => {
      const payload = data.request.body;
      console.log(payload);
      expect(payload.message).to.equal(userInput.slice(0, 300));
    });
  });
});
