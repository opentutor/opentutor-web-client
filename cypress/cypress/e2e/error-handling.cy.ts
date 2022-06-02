/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { cyMockDialog, cySetup, staticResponse } from "../support/functions";

describe("Error popup", () => {
  it("prompts 'bad request' on 400 response", () => {
    cySetup(cy);
    cy.intercept(
      {
        method: "POST",
        url: "**/dialog/**",
      },
      staticResponse({
        fixture: "e400.json",
        statusCode: 400,
      })
    );
    cy.visit("/?guest=guest");

    cy.get("[data-cy=error-popup]").should("contain", "Lesson not provided");
  });

  it("prompts 'not found' on 404 response", () => {
    cySetup(cy);
    cy.intercept(
      {
        method: "POST",
        url: "/dialog/**",
      },
      staticResponse({
        fixture: "e404.json",
        statusCode: 404,
      })
    );
    cy.visit("/?lesson=q12312&guest=guest");

    cy.get("[data-cy=error-popup]").should("contain", "Lesson not found");
  });

  it("prompts 'Could not continue lesson' on 403 response (cheating)", () => {
    cySetup(cy);
    cyMockDialog(cy, "q1", "q1-1-p1.json");
    cy.intercept(
      {
        method: "POST",
        url: "/dialog/q1/session",
      },
      staticResponse({
        statusCode: 403,
        fixture: "e403.json",
      })
    );
    cy.visit("/?lesson=q1&guest=guest");
    cy.viewport("macbook-13");

    cy.get("[data-cy=outlined-multiline-static]").type("PLACEHOLDER");
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=error-popup]").should(
      "contain",
      "Could not continue lesson"
    );
  });

  it("prompts 'already ended' on 410 response", () => {
    cySetup(cy);
    cyMockDialog(cy, "q2", "q2-1-p1.json");
    cy.intercept(
      {
        method: "POST",
        url: "**/dialog/q2/session",
      },
      staticResponse({
        statusCode: 410,
        fixture: "e410.json",
      })
    );
    cy.visit("/?lesson=q2&guest=guest");
    cy.wait(1000);
    cy.get("[data-cy=outlined-multiline-static]").type("PLACEHOLDER");
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=error-popup]").should("contain", "Lesson session ended");
  });

  it("prompts 'server error' on any 5xx error response", () => {
    cySetup(cy);
    cy.intercept(
      {
        method: "POST",
        url: "/dialog/q2",
      },
      staticResponse({
        statusCode: 502,
        fixture: "e502.json",
      })
    );
    cy.visit("/?lesson=q2&guest=guest");
    cy.get("[data-cy=error-popup]").should("contain", "Server Error");
  });
});
