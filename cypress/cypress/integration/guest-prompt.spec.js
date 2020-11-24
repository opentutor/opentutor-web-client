/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cySetup } from "../support/functions";
import { addCmi5LaunchParams } from "../support/cmi5";

describe("Guest prompt", () => {
  it("appears when no guest param", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("#guest-prompt");
  });

  it("does not appear when guest param", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("#guest-prompt").should("not.exist");
  });

  it("does not appear when cmi5 launch params present", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit(addCmi5LaunchParams("/?lesson=q1"));
    cy.get("#guest-prompt").should("not.exist");
  });

  it("sets guest name", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("#guest-prompt-input").type("username");
    cy.get("#guest-prompt-input-send").click();
    cy.location("search").should("contain", "lesson=q1");
    cy.location("search").should("contain", "guest=username");
  });

  it("no input defaults to 'guest'", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("#guest-prompt-input-send").click();
    cy.location("search").should("contain", "lesson=q1");
    cy.location("search").should("contain", "guest=guest");
  });
});
