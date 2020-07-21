describe("Expectation indicators", () => {
  it("shows icons for each expectation for lesson q1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q1", "fixture:q1-p1.json");

    cy.get("#targets").children().should("have.length", 3);
    cy.get("#target-0");
    cy.get("#target-1");
    cy.get("#target-2");
  });

  it("shows icons for each expectation for lesson q2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs
    cy.route("POST", "**/dialog/q2", "fixture:q2-p1.json");

    cy.get("#targets").children().should("have.length", 1);
    cy.get("#target-0");
  });
});
