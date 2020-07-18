describe("Expectation summary pop-up", () => {
  it("appears at end of conversation", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs

    cy.fixture("q2-p2.json").then((desiredServerResponse) => {
      cy.route("POST", "**/dialog/q2/session", desiredServerResponse);
      const reply = "Current flows in the same direction as the arrow";
      cy.get("#outlined-multiline-static").type(reply);
      cy.get("#submit-button").click();
      cy.get("#summary-popup");
    });
  });

  it("opens with View Summary button", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
  });

  it("shows icons for each expectation for lesson q1", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q1"); // change URL to match your dev URLs

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#targets").children().should('have.length', 3);
    cy.get("#target-0");
    cy.get("#target-1");
    cy.get("#target-2");
  });

  it("shows icons for each expectation for lesson q2", () => {
    cy.server();
    cy.viewport(660, 1000);
    cy.visit("/?lesson=q2"); // change URL to match your dev URLs

    cy.get("#view-summary-btn").click();
    cy.get("#summary-popup");
    cy.get("#targets").children().should('have.length', 1);
    cy.get("#target-0");
  });

  it("hides text for expectations that have not been completed", () => {
    
  });
});
