/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDefault, cyMockDialog, cySetup } from "../support/functions";

describe("Guest prompt", () => {
  it("appears when no guest param", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("[data-cy=guest-prompt]");
    cy.wait("@FetchLessonInfo");
  });

  it("does not appear when guest param", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1&guest=guest");
    cy.get("[data-cy=guest-prompt]").should("not.exist");
    cy.wait("@FetchLessonInfo");
  });

  it("sets guest name", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.wait("@FetchLessonInfo");
    cy.wait("@FetchLessonInfo");
    cy.wait("@FetchLessonInfo");
    cy.get("[data-cy=guest-prompt-input]").should("be.visible");
    cy.get("[data-cy=guest-prompt-input]").type("username");
    cy.get("[data-cy=guest-prompt-input-send]").should("be.visible");
    cy.get("[data-cy=guest-prompt-input-send]").click();
    cy.location("search").should("contain", "lesson=q1");
    cy.location("search").should("contain", "guest=username");
  });

  it("no input defaults to 'guest'", () => {
    cyMockDefault(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.visit("/?lesson=q1");
    cy.get("[data-cy=guest-prompt-input-send]").should("be.visible");
    cy.get("[data-cy=guest-prompt-input-send]").click();
    cy.location("search").should("contain", "lesson=q1");
    cy.location("search").should("contain", "guest=guest");
  });
});
