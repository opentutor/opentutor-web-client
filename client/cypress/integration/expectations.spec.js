import { visitOnMobile } from "../support/functions";

describe("Expectation indicators", () => {
  it("shows icons for each expectation for lesson q1", () => {
    visitOnMobile(cy, "/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-1-p1.json");

    cy.get("#targets").children().should("have.length", 3);
  });

  it("shows icons for each expectation for lesson q2", () => {
    visitOnMobile(cy, "/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-1-p1.json");

    cy.get("#targets").children().should("have.length", 1);
  });
});
