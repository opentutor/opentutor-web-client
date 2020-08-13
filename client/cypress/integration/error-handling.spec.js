import { cySetup } from "../support/functions";

describe("Error popup", () => {
  it("prompts 'bad request' on 400 response", () => {
    cySetup(cy);
    cy.route({
      method: "POST",
      url: "**/dialog/",
      status: 400,
      response: "fixture:e400.json",
    });
    cy.visit("/");
    cy.get("#error-popup").contains("Bad request");
  });

  it("prompts 'not found' on 404 response", () => {
    cySetup(cy);
    cy.route({
      method: "POST",
      url: "**/dialog/q12312",
      status: 404,
      response: "fixture:e404.json",
    });
    cy.visit("/?lesson=q12312");
    cy.get("#error-popup").contains("Lesson not found");
  });

  it("prompts 'nice try' on 403 response (cheating)", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");
    cy.route({
      method: "POST",
      url: "**/dialog/q1/session",
      status: 403,
      response: "fixture:e403.json",
    });
    cy.visit("/?lesson=q1");
    cy.get("#outlined-multiline-static").type("PLACEHOLDER");
    cy.get("#submit-button").click();
    cy.get("#error-popup").contains("Nice Try!");
  });

  it("prompts 'already ended' on 410 response", () => {
    cySetup(cy);
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");
    cy.route({
      method: "POST",
      url: "**/dialog/q2/session",
      status: 410,
      response: "fixture:e410.json",
    });
    cy.visit("/?lesson=q2");
    cy.get("#outlined-multiline-static").type("PLACEHOLDER");
    cy.get("#submit-button").click();
    cy.get("#error-popup").contains("Lesson session ended");
  });

  it("prompts 'server error' on any 5xx error response", () => {
    cySetup(cy);
    cy.route({
      method: "POST",
      url: "**/dialog/q2",
      status: 502,
      response: "fixture:e502.json",
    });
    cy.visit("/?lesson=q2");
    cy.get("#error-popup").contains("Server Error");
  });
});
