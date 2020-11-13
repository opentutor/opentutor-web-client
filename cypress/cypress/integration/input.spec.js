/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup } from "../support/functions";

describe("Input field", () => {
  it("disables send button when no input", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("be.disabled");
  });

  it("disables send button when session finished", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.route("POST", "**/dialog/q1/session", "fixture:q1-1-p2.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("#outlined-multiline-static").type(
      "Peer pressure can cause you to allow inappropriate behavior. If you correct someone's behavior, you may get them in trouble or it may be harder to work with them. Enforcing the rules can make you unpopular."
    );
    cy.get("#submit-button").click();
    cy.get("#submit-button").should("be.disabled");
    cy.get("#outlined-multiline-static").should("be.disabled");
  });

  it("enables send button when input and session not finished", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("#outlined-multiline-static").type("hi");
    cy.get("#outlined-multiline-static").should("not.be.disabled");
    cy.get("#submit-button").should("not.be.disabled");
  });

  it("can send input with button", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(userInput);
    cy.get("#submit-button").click();
    cy.get("#chat-msg-3").contains(userInput);
  });

  it("can send input with enter", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route("POST", "**/dialog/q2/session", "fixture:q2-1-p2.json");
    cy.visit("/?lesson=q2&guest=guest");
    const userInput = "Current flows in the same direction as the arrow";
    cy.get("#outlined-multiline-static").type(userInput);
    cy.get("#outlined-multiline-static").type("{enter}");
    cy.get("#chat-msg-3").contains(userInput);
  });
});
